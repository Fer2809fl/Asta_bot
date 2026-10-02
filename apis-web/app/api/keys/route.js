import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { currentUser } from "../../../lib/auth";
import { ENDPOINTS, FREE_DAILY_LIMIT, FREE_MAX_KEYS } from "../../../lib/endpoints";
import { countKeys, createKey, listKeys, usageForKeys } from "../../../lib/store";

function makeKey() { return `asta_${crypto.randomBytes(18).toString("hex")}`; }

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Inicia sesión." }, { status: 401 });
  const keys = await listKeys(user.id);
  const day = new Date().toISOString().slice(0, 10);
  const usage = await usageForKeys(keys.map((k) => k.id), day);
  const limit = user.role === "admin" ? -1 : FREE_DAILY_LIMIT;
  const maxKeys = user.role === "admin" ? -1 : FREE_MAX_KEYS;
  return NextResponse.json({ ok: true, user, plan: { role: user.role, daily: limit, maxKeys }, endpoints: [], keys: keys.map((k) => ({ id:k.id, name:k.name, key_value:k.key_value, created_at:k.created_at, last_used_at:k.last_used_at, usage: ENDPOINTS.map((e)=>({id:e.id,used:Number(usage.find((u)=>u.key_id===k.id&&u.endpoint===e.id)?.count||0)})) })) });
}

export async function POST(request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Inicia sesión." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "Key principal").trim().slice(0, 40) || "Key principal";
  const owned = await countKeys(user.id);
  if (user.role !== "admin" && owned >= FREE_MAX_KEYS) return NextResponse.json({ ok: false, error: "El plan free permite 1 key. Borra o regenera la actual." }, { status: 400 });
  const row = { id: crypto.randomUUID(), user_id: user.id, name, key_value: makeKey(), created_at: new Date().toISOString(), last_used_at: null };
  await createKey(row);
  return NextResponse.json({ ok: true, key: row });
}
