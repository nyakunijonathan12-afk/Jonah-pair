
const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

let sock;
let latestQR = null;

async function startBot(phone) {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ qr }) => {
    if (qr) latestQR = qr;
  });

  if (!state.creds.registered && phone) {
    const code = await sock.requestPairingCode(phone);
    return { code };
  }

  return {};
}

function getQR() {
  return latestQR;
}

module.exports = { startBot, getQR };
