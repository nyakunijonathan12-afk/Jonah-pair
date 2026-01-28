import express from "express";
import cors from "cors";
import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

const app = express();
app.use(cors());
app.use(express.json());

let sock;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);
  console.log("WhatsApp bot started");
}

startBot();

app.post("/pair", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Phone number required" });
  }

  try {
    const code = await sock.requestPairingCode(number);
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate pairing code" });
  }
});

app.get("/", (req, res) => {
  res.send("WhatsApp Pairing Backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
