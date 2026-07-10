import { gacha } from "../../src/gacha.js";

const randomValue = () => Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
const delay = ms => new Promise(r => setTimeout(r, ms));

function parseKonachanUrl(input) {
    try {
        const url = new URL(input);
        if (!url.hostname.includes("konachan")) return null;
        const rawTags = url.searchParams.get("tags");
        if (!rawTags) return null;
        const tags = rawTags.trim().split(/\s+/).filter(Boolean);
        return { seriesTag: tags[0], extraTags: tags.slice(1) };
    } catch {
        return null;
    }
}

function tagToSeriesName(tag) {
    return tag.replace(/[_:]/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
}

function tagToName(tag) {
    return tag.replace(/_\(.*?\)$/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
}

async function fetchAllPosts(seriesTag, extraTags = [], pages = 5) {
    const baseTags = [seriesTag, ...extraTags].join(" ");
    const allPosts = [];
    const BANNED = /(loli|shota|child|toddler|infant)/;

    for (let page = 1; page <= pages; page++) {
        const url = `https://konachan.net/post.json?tags=${encodeURIComponent(baseTags)}&limit=100&page=${page}`;
        try {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(10_000),
                headers: { "User-Agent": "konachan-scraper/1.0" }
            });
            if (!res.ok) break;
            const posts = await res.json();
            if (!Array.isArray(posts) || posts.length === 0) break;

            const filtered = posts.filter(p => {
                const tags = (p.tags || "").toLowerCase();
                return !BANNED.test(tags) && p.rating !== "e";
            });

            allPosts.push(...filtered);
            if (posts.length < 100) break;
            await delay(800);
        } catch {
            break;
        }
    }
    return allPosts;
}

function collectTagFrequencies(posts, seriesTag) {
    const SKIP = new Set([
        seriesTag, "highres", "absurdres", "jpeg_artifacts", "scan", "dakimakura",
        "1girl", "2girls", "3girls", "4girls", "multiple_girls", "solo",
        "1boy", "2boys", "multiple_boys",
        "swimsuits", "thighhighs", "bikini", "wet", "pantsu", "nipples",
        "dress", "see_through", "animal_ears", "ass", "skirt_lift", "open_shirt",
        "bra", "tail", "breasts", "cleavage", "panties", "navel", "blush",
        "long_hair", "short_hair", "blonde_hair", "twintails", "brown_hair",
        "black_hair", "white_hair", "red_hair", "blue_hair", "green_hair",
        "no_bra", "megane", "horns", "loli", "stockings", "pantyhose",
        "weapon", "cosplay", "bunny_ears", "feet", "lingerie", "bunny_girl",
        "leotard", "sword", "armor", "torn_clothes", "seifuku", "wings",
        "shirt_lift", "wedding_dress", "gym_uniform", "maid", "towel",
        "naked_apron", "yukata", "uniform", "pajama", "underboob", "shimapan",
        "vector_trace", "wallpaper", "transparent_png", "monochrome",
        "crossover", "tagme", "fixme", "crease", "onsen", "yuri",
        "nude", "naked", "topless", "uncensored", "censored",
        "pussy", "penis", "cum", "sex", "fellatio", "paizuri", "masturbation",
        "fingering", "anus", "bottomless", "pussy_juice", "pubic_hair",
        "areolae", "erect_nipples", "panty_pull", "breast_grab", "breast_hold",
    ]);

    const freq = {};
    for (const post of posts) {
        const tagStr = typeof post.tags === "string" ? post.tags : "";
        for (const t of tagStr.split(/\s+/).filter(Boolean)) {
            if (SKIP.has(t)) continue;
            freq[t] = (freq[t] || 0) + 1;
        }
    }
    return freq;
}

async function filterCharacterTags(tagNames, seriesTag) {
    const characters = [];
    const CONCURRENCY = 2;

    for (let i = 0; i < tagNames.length; i += CONCURRENCY) {
        const batch = tagNames.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async (tag) => {
            try {
                const tagRes = await fetch(
                    `https://konachan.net/tag.json?name=${encodeURIComponent(tag)}`,
                    { signal: AbortSignal.timeout(8_000), headers: { "User-Agent": "konachan-scraper/1.0" } }
                );
                if (!tagRes.ok) return;
                const tagData = await tagRes.json();
                const info = Array.isArray(tagData) ? tagData.find(t => t.name === tag) : null;
                if (!info || info.type !== 4) return;

                const checkRes = await fetch(
                    `https://konachan.net/post.json?tags=${encodeURIComponent(tag)}&limit=100`,
                    { signal: AbortSignal.timeout(8_000), headers: { "User-Agent": "konachan-scraper/1.0" } }
                );
                if (!checkRes.ok) return;
                const checkPosts = await checkRes.json();
                if (!Array.isArray(checkPosts) || checkPosts.length === 0) return;

                const valid = checkPosts.filter(p => (p.sample_url || p.file_url) && !p.tags?.includes("corrupt_file"));
                if (valid.length === 0) return;

                const seriesMatch = valid.filter(p => p.tags?.includes(seriesTag)).length;
                if (seriesMatch / valid.length >= 0.6) characters.push(tag);
            } catch {}
        }));
        await delay(1200);
    }
    return characters;
}

function getGenderFromPosts(charTag, posts) {
    if (charTag.includes("_(male)")) return "Masculino";
    if (charTag.includes("_(female)")) return "Femenino";

    const FEMALE = new Set(["1girl", "2girls", "multiple_girls", "female"]);
    const MALE   = new Set(["1boy", "2boys", "multiple_boys", "male", "shouta"]);

    let maleScore = 0, femaleScore = 0;
    for (const post of posts) {
        if (!post.tags?.includes(charTag)) continue;
        const tags = post.tags.split(/\s+/);
        const isSolo   = tags.includes("solo");
        const hasMale   = tags.some(t => MALE.has(t));
        const hasFemale = tags.some(t => FEMALE.has(t));
        const weight = isSolo ? 10 : 1;
        if (hasMale && !hasFemale) maleScore += weight;
        else if (hasFemale && !hasMale) femaleScore += weight;
    }
    return maleScore > femaleScore ? "Masculino" : "Femenino";
}

async function fetchRandomSeriesTags(cantidad = 5) {
    const MAX_PAGE = 15;
    const MIN_COUNT = 30;
    const pool = new Map();

    const pageSet = new Set();
    while (pageSet.size < 3) pageSet.add(Math.floor(Math.random() * MAX_PAGE) + 1);

    for (const page of pageSet) {
        try {
            const res = await fetch(
                `https://konachan.net/tag.json?type=3&order=count&limit=100&page=${page}`,
                { signal: AbortSignal.timeout(8_000), headers: { "User-Agent": "konachan-scraper/1.0" } }
            );
            if (!res.ok) continue;
            const tags = await res.json();
            if (!Array.isArray(tags)) continue;
            for (const t of tags) {
                if (t.count >= MIN_COUNT) pool.set(t.name, true);
            }
        } catch {}
        await delay(400);
    }

    if (pool.size === 0) {
        try {
            const res = await fetch(
                "https://konachan.net/tag.json?type=3&order=count&limit=100&page=1",
                { signal: AbortSignal.timeout(8_000), headers: { "User-Agent": "konachan-scraper/1.0" } }
            );
            const tags = await res.json();
            for (const t of tags) {
                if (t.count >= MIN_COUNT) pool.set(t.name, true);
            }
        } catch {}
    }

    return [...pool.keys()].sort(() => Math.random() - 0.5).slice(0, cantidad);
}

async function runGeneration(sock, remoteJid, seriesTag, extraTags = [], pages = 5) {
    const seriesName = tagToSeriesName(seriesTag);

    await sock.sendMessage(remoteJid, {
        text: `🔍 Analizando *"${seriesName}"*... (~${pages * 100} posts)`
    });

    const posts = await fetchAllPosts(seriesTag, extraTags, pages);
    if (posts.length === 0) {
        await sock.sendMessage(remoteJid, {
            text: `⚠️ *"${seriesName}"* — Sin posts disponibles, se omite.`
        });
        return { seriesName, agregados: [], saltados: [], posts: 0, skipped: true };
    }

    const tagFreq = collectTagFrequencies(posts, seriesTag);
    const tagNames = Object.entries(tagFreq).filter(([, c]) => c >= 2).map(([n]) => n);
    const charTagNames = await filterCharacterTags(tagNames, seriesTag);

    const agregados = [];
    const saltados  = [];

    for (const charTag of charTagNames) {
        const dbName = tagToName(charTag);
        const gender = getGenderFromPosts(charTag, posts);
        try {
            const value = randomValue();
            await gacha.addCharacter({ name: dbName, series: seriesName, gender, booru_tag: charTag, value });
            agregados.push(`${dbName} (${gender}) — ${value.toLocaleString()} ¥`);
        } catch (e) {
            saltados.push(`${dbName} (${e.message === "DUPLICATE_CHARACTER" ? "Ya existe" : "Error"})`);
        }
    }

    return { seriesName, agregados, saltados, posts: posts.length, skipped: false };
}

export default [
    {
        command: ["genchar", "generar", "gendebug", "genrandom"],
        ownerOnly: true,
        async execute({ sock, msg, remoteJid, args, command, reply }) {
            if (command === "genrandom") {
                await reply("🎲 Buscando 5 animes al azar en konachan.net...\n_Esto tardará varios minutos._");

                let seriesTags = [];
                try { seriesTags = await fetchRandomSeriesTags(5); } catch {}

                if (seriesTags.length === 0) {
                    return reply("❌ No se pudo conectar con konachan.net.");
                }

                const resultados = [];
                for (let i = 0; i < seriesTags.length; i++) {
                    const tag = seriesTags[i];
                    await sock.sendMessage(remoteJid, {
                        text: `📦 [${i + 1}/${seriesTags.length}] Procesando: *${tagToSeriesName(tag)}*`
                    });
                    try {
                        resultados.push(await runGeneration(sock, remoteJid, tag, [], 10));
                    } catch (e) {
                        resultados.push({ seriesName: tagToSeriesName(tag), agregados: [], saltados: [], posts: 0, skipped: true, error: e.message });
                    }
                    if (i < seriesTags.length - 1) await delay(2000);
                }

                const totalAg = resultados.reduce((s, r) => s + r.agregados.length, 0);
                const totalSk = resultados.reduce((s, r) => s + r.saltados.length, 0);

                return sock.sendMessage(remoteJid, {
                    text: [
                        "🏁 *GENRANDOM COMPLETADO*",
                        "",
                        ...resultados.map(r =>
                            r.skipped
                                ? `❌ *${r.seriesName}* — omitida${r.error ? ` (${r.error})` : ""}`
                                : `✅ *${r.seriesName}* — ${r.agregados.length} nuevos, ${r.saltados.length} saltados (${r.posts} posts)`
                        ),
                        "",
                        `👥 Total agregados: *${totalAg}*`,
                        `⏭️ Total saltados: *${totalSk}*`
                    ].join("\n")
                }, { quoted: msg });
            }

            const input = args.join(" ").trim();
            if (!input) {
                return reply("Uso: .genchar <URL_KONACHAN>\nEjemplo: .genchar https://konachan.com/post?tags=sword_art_online");
            }

            const parsed = parseKonachanUrl(input);
            if (!parsed) return reply("❌ URL inválida. Debe ser de konachan.com o konachan.net");

            const { seriesTag, extraTags } = parsed;

            try {
                if (command === "gendebug") {
                    await reply(`Analizando "${tagToSeriesName(seriesTag)}"... (debug mode)`);
                    const posts = await fetchAllPosts(seriesTag, extraTags, 5);
                    if (posts.length === 0) throw new Error("No se encontraron posts.");
                    const tagFreq = collectTagFrequencies(posts, seriesTag);
                    const tagNames = Object.entries(tagFreq).filter(([, c]) => c >= 2).map(([n]) => n);
                    const chars = await filterCharacterTags(tagNames, seriesTag);
                    return reply(`🔍 DEBUG\nEncontrados: ${chars.length}\n\nTop 10:\n${chars.slice(0, 10).join("\n")}`);
                }

                const { seriesName, agregados, saltados } = await runGeneration(sock, remoteJid, seriesTag, extraTags, 5);

                const lista = agregados.length
                    ? `\n\n*Agregados:*\n${agregados.slice(0, 15).join("\n")}${agregados.length > 15 ? `\n...y ${agregados.length - 15} más` : ""}`
                    : "";

                await sock.sendMessage(remoteJid, {
                    text: `✅ *COMPLETADO*\nSerie: ${seriesName}\nAgregados: ${agregados.length}\nSaltados: ${saltados.length}${lista}`
                }, { quoted: msg });

            } catch (e) {
                await reply(`❌ Error: ${e.message}`);
            }
        }
    }
];
