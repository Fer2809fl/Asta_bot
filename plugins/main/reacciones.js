const REACTIONS_URL = "https://cdn.ryuzei.xyz/files/reactions.json";

let _cache = null;

async function getReactions() {
  if (_cache) return _cache;
  const res = await fetch(REACTIONS_URL);
  _cache = await res.json();
  return _cache;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCommand({ key, emoji, texto, textoTarget }) {
  return {
    command: [key],
    category: "reacciones",
    description: `Reacción: ${key}`,
    async execute({ sock, msg, remoteJid, senderRaw, getTarget, args, reply }) {
      let data;
      try {
        data = await getReactions();
      } catch {
        return reply("❌ No se pudo cargar las reacciones.");
      }

      const list = data[key];
      if (!list || list.length === 0) return reply("❌ Sin videos disponibles.");

      const video = randomFrom(list);
      const sender = senderRaw.split("@")[0];

      const { jid: targetJid } = getTarget(msg, args);
      const target = targetJid ? targetJid.split("@")[0] : null;

      const caption = target
        ? textoTarget.replace("{s}", sender).replace("{t}", target)
        : texto.replace("{s}", sender);

      await sock.sendMessage(remoteJid, {
        video: { url: video.url },
        caption,
        gifPlayback: true,
      }, { quoted: msg });
    },
  };
}

const CMDS = [
  { key: "cry",      emoji: "😢", texto: "*{s}* está llorando",                   textoTarget: "*{s}* llora por *{t}*" },
  { key: "happy",    emoji: "😊", texto: "*{s}* está feliz",                       textoTarget: "*{s}* está feliz por *{t}*" },
  { key: "sad",      emoji: "😔", texto: "*{s}* está triste",                      textoTarget: "*{s}* está triste por *{t}*" },
  { key: "wave",     emoji: "👋", texto: "*{s}* saluda",                           textoTarget: "*{s}* le saluda a *{t}*" },
  { key: "hug",      emoji: "🤗", texto: "*{s}* necesita un abrazo",               textoTarget: "*{s}* le da un abrazo a *{t}*" },
  { key: "kiss",     emoji: "💋", texto: "*{s}* manda un beso",                    textoTarget: "*{s}* le da un beso a *{t}*" },
  { key: "angry",    emoji: "😡", texto: "*{s}* está enojado",                     textoTarget: "*{s}* está enojado con *{t}*" },
  { key: "blush",    emoji: "😳", texto: "*{s}* se sonroja",                       textoTarget: "*{s}* se sonroja por *{t}*" },
  { key: "pat",      emoji: "🫠", texto: "*{s}* quiere una palmadita",             textoTarget: "*{s}* le da una palmadita a *{t}*" },
  { key: "kill",     emoji: "💀", texto: "*{s}* quiere matar a alguien",           textoTarget: "*{s}* quiere matar a *{t}*" },
  { key: "coffee",   emoji: "☕", texto: "*{s}* se toma un café",                  textoTarget: "*{s}* le invita un café a *{t}*" },
  { key: "bored",    emoji: "😴", texto: "*{s}* está aburrido",                    textoTarget: "*{s}* se aburre con *{t}*" },
  { key: "scared",   emoji: "😱", texto: "*{s}* tiene miedo",                      textoTarget: "*{s}* le tiene miedo a *{t}*" },
  { key: "shy",      emoji: "🥺", texto: "*{s}* es tímido",                        textoTarget: "*{s}* se pone tímido con *{t}*" },
  { key: "bath",     emoji: "🛁", texto: "*{s}* se va a bañar",                    textoTarget: "*{s}* le da un baño a *{t}*" },
  { key: "slap",     emoji: "👋", texto: "*{s}* se quiere cachetear a alguien",    textoTarget: "*{s}* le da una cachetada a *{t}*" },
  { key: "drunk",    emoji: "🍺", texto: "*{s}* está borracho",                    textoTarget: "*{s}* está borracho con *{t}*" },
  { key: "eat",      emoji: "🍜", texto: "*{s}* está comiendo",                    textoTarget: "*{s}* le invita comida a *{t}*" },
  { key: "facepalm", emoji: "🤦", texto: "*{s}* hace facepalm",                   textoTarget: "*{s}* hace facepalm por *{t}*" },
  { key: "love",     emoji: "❤️", texto: "*{s}* está enamorado",                  textoTarget: "*{s}* ama a *{t}*" },
  { key: "spit",     emoji: "🤮", texto: "*{s}* escupe",                           textoTarget: "*{s}* le escupe a *{t}*" },
  { key: "sleep",    emoji: "💤", texto: "*{s}* se va a dormir",                   textoTarget: "*{s}* duerme con *{t}*" },
  { key: "walk",     emoji: "🚶", texto: "*{s}* se va caminando",                  textoTarget: "*{s}* camina con *{t}*" },
  { key: "bite",     emoji: "😬", texto: "*{s}* muerde",                           textoTarget: "*{s}* le muerde a *{t}*" },
  { key: "run",      emoji: "🏃", texto: "*{s}* corre",                            textoTarget: "*{s}* corre con *{t}*" },
  { key: "punch",    emoji: "👊", texto: "*{s}* quiere golpear a alguien",         textoTarget: "*{s}* le da un golpe a *{t}*" },
  { key: "smoke",    emoji: "🚬", texto: "*{s}* fuma",                             textoTarget: "*{s}* fuma con *{t}*" },
];

export default CMDS.map(buildCommand);
