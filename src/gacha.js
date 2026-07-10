import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sqlite3pkg from "sqlite3";

const sqlite3 = sqlite3pkg.verbose();
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "../database/gacha.db");

let _db = null;

function run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row ?? null);
        });
    });
}

function all(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows ?? []);
        });
    });
}

async function getDb() {
    if (_db) return _db;
    if (!existsSync(dirname(DB_PATH))) mkdirSync(dirname(DB_PATH), { recursive: true });

    _db = await new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) reject(err);
            else resolve(db);
        });
    });

    await run(_db, "PRAGMA journal_mode = WAL");
    await run(_db, "PRAGMA foreign_keys = ON");

    await run(_db, `
        CREATE TABLE IF NOT EXISTS characters (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            series    TEXT    NOT NULL,
            gender    TEXT    NOT NULL DEFAULT 'Femenino',
            booru_tag TEXT    NOT NULL UNIQUE,
            value     INTEGER NOT NULL DEFAULT 5000
        )
    `);
    await run(_db, `
        CREATE TABLE IF NOT EXISTS user_characters (
            user_jid  TEXT    NOT NULL,
            char_id   INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
            obtained_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
            PRIMARY KEY (user_jid, char_id)
        )
    `);
    await run(_db, "CREATE INDEX IF NOT EXISTS idx_uc_user ON user_characters(user_jid)");
    await run(_db, "CREATE INDEX IF NOT EXISTS idx_char_series ON characters(series)");

    return _db;
}

export const gacha = {
    async init() {
        await getDb();
    },

    async addCharacter({ name, series, gender, booru_tag, value }) {
        const db = await getDb();
        const existing = await get(db, "SELECT id FROM characters WHERE booru_tag = ?", [booru_tag]);
        if (existing) throw new Error("DUPLICATE_CHARACTER");
        await run(db,
            "INSERT INTO characters (name, series, gender, booru_tag, value) VALUES (?, ?, ?, ?, ?)",
            [name, series, gender ?? "Femenino", booru_tag, value ?? 5000]
        );
    },

    async getRandomCharacter() {
        const db = await getDb();
        return get(db, "SELECT * FROM characters ORDER BY RANDOM() LIMIT 1");
    },

    async getCharacterByTag(booru_tag) {
        const db = await getDb();
        return get(db, "SELECT * FROM characters WHERE booru_tag = ?", [booru_tag]);
    },

    async searchCharacter(query) {
        const db = await getDb();
        return get(db,
            "SELECT * FROM characters WHERE LOWER(name) LIKE LOWER(?) OR id = ? LIMIT 1",
            [`%${query}%`, parseInt(query) || 0]
        );
    },

    async getUserCharacters(userJid) {
        const db = await getDb();
        return all(db, `
            SELECT c.*, uc.obtained_at
            FROM characters c
            JOIN user_characters uc ON c.id = uc.char_id
            WHERE uc.user_jid = ?
            ORDER BY uc.obtained_at DESC
        `, [userJid]);
    },

    async userOwnsCharacter(userJid, charId) {
        const db = await getDb();
        const row = await get(db,
            "SELECT 1 FROM user_characters WHERE user_jid = ? AND char_id = ?",
            [userJid, charId]
        );
        return !!row;
    },

    async giveCharacter(userJid, charId) {
        const db = await getDb();
        const existing = await get(db,
            "SELECT 1 FROM user_characters WHERE user_jid = ? AND char_id = ?",
            [userJid, charId]
        );
        if (existing) throw new Error("CHARACTER_ALREADY_OWNED");
        await run(db,
            "INSERT INTO user_characters (user_jid, char_id) VALUES (?, ?)",
            [userJid, charId]
        );
    },

    async removeCharacter(userJid, charId) {
        const db = await getDb();
        await run(db,
            "DELETE FROM user_characters WHERE user_jid = ? AND char_id = ?",
            [userJid, charId]
        );
    },

    async getTotalCharacters() {
        const db = await getDb();
        const row = await get(db, "SELECT COUNT(*) as total FROM characters");
        return row?.total ?? 0;
    },

    async getSeriesList() {
        const db = await getDb();
        return all(db,
            "SELECT series, COUNT(*) as count FROM characters GROUP BY series ORDER BY count DESC"
        );
    },
};
