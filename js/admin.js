import { watch, remove, login, logout, onUser, fmt, ready } from "./firebase.js";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let rsvp = [], wishes = [];
if (!ready) $("#demo").hidden = false;

onUser(u => { $("#login").hidden = !!u; $("#panel").hidden = !u; if (u) start(); });
$("#lf").onsubmit = async e => { e.preventDefault(); try { await login($("#em").value, $("#pw").value); } catch (err) {
  const code = err && err.code;
  const messages = {
    "auth/invalid-credential": "Email atau kata sandi salah, atau akun tidak ada di project Firebase ini.",
    "auth/user-not-found": "Akun tidak ditemukan di project Firebase ini.",
    "auth/wrong-password": "Kata sandi salah.",
    "auth/operation-not-allowed": "Login Email/Password belum diaktifkan di Firebase Authentication.",
    "auth/unauthorized-domain": "Domain undanganresepsidigital.github.io belum diizinkan di Firebase Authentication.",
    "auth/network-request-failed": "Tidak dapat terhubung ke Firebase. Periksa koneksi internet."
  };
  $("#le").textContent = messages[code] || `Login gagal (${code || "unknown"}). Periksa akun dan konfigurasi Firebase.`;
} };
$("#out").onclick = () => logout();

let started = false;
function start() { if (started) return; started = true;
  watch("rsvp", r => { rsvp = r; draw(); }); watch("wishes", r => { wishes = r; draw(); }); }

function draw() {
  const hadir = rsvp.filter(x => x.attend === "Hadir");
  $("#s1").textContent = hadir.reduce((a, x) => a + (x.count || 0), 0);
  $("#s2").textContent = hadir.length;
  $("#s3").textContent = rsvp.length - hadir.length;
  $("#s4").textContent = wishes.length;
  $("#tr").innerHTML = rsvp.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.attend)}</td><td>${x.count}</td><td>${fmt(x.createdAt)}</td><td><button data-c="rsvp" data-id="${x.id}">Hapus</button></td></tr>`).join("") || `<tr><td colspan="5">Belum ada data.</td></tr>`;
  $("#tw").innerHTML = wishes.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.text)}</td><td>${fmt(x.createdAt)}</td><td><button data-c="wishes" data-id="${x.id}">Hapus</button></td></tr>`).join("") || `<tr><td colspan="4">Belum ada data.</td></tr>`;
}
document.addEventListener("click", async e => { const b = e.target.closest("[data-id]"); if (b && confirm("Hapus data ini?")) await remove(b.dataset.c, b.dataset.id); });

$("#csv").onclick = () => { const rows = [["Nama", "Status", "Jumlah", "Waktu"], ...rsvp.map(x => [x.name, x.attend, x.count, fmt(x.createdAt)])];
  const t = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + t], { type: "text/csv" })); a.download = "rsvp.csv"; a.click(); };

const link = () => location.href.replace(/admin\.html.*$/, "") + "?to=" + encodeURIComponent($("#gn").value.trim());
$("#gn").oninput = () => $("#gu").textContent = $("#gn").value.trim() ? link() : "";
$("#gc").onclick = async () => { if (!$("#gn").value.trim()) return; await navigator.clipboard.writeText(link()); $("#gc").textContent = "Tersalin"; setTimeout(() => $("#gc").textContent = "Salin link", 1500); };
$("#gw").onclick = () => { const n = $("#gn").value.trim(); if (!n) return;
  open("https://wa.me/?text=" + encodeURIComponent(`Kepada Yth. ${n},\n\nDengan hormat, kami mengundang Anda ke pernikahan Endah & Fahmi.\nBuka undangan: ${link()}\n\nTerima kasih.`), "_blank"); };
