
async function getCode() {
  const phone = document.getElementById("phone").value;
  const res = await fetch("/pair/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  document.getElementById("result").innerHTML =
    "<h3>PAIRING CODE</h3><b>" + data.code + "</b>";
}

async function getQR() {
  const res = await fetch("/pair/qr");
  const data = await res.json();
  document.getElementById("result").innerHTML =
    "<img src='" + data.qr + "' />";
}
