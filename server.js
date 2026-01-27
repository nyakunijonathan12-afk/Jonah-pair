
const express = require("express");
const QRCode = require("qrcode");
const { startBot, getQR } = require("./pair");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/pair/code", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  try {
    const data = await startBot(phone);
    res.json({ code: data.code });
  } catch (e) {
    res.status(500).json({ error: "Pairing failed" });
  }
});

app.get("/pair/qr", async (req, res) => {
  const qr = getQR();
  if (!qr) return res.status(404).json({ error: "QR not ready" });

  const img = await QRCode.toDataURL(qr);
  res.json({ qr: img });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
