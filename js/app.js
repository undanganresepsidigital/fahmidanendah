import { W } from "./config.js";
import { add, watch, fmt, ready } from "./firebase.js";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const to = new URLSearchParams(location.search).get("to");
if (to) { $("#to").textContent = to; $("#rn").value = to; $("#wn").value = to; } else $("#toWrap").hidden = true;

$("#names").textContent = W.title;
$("#dt").textContent = W.events[W.events.length - 1].date;
$("#couple").innerHTML = [W.bride, W.groom].map(p => `<div class="card"><h3>${esc(p.full)}</h3><p>${esc(p.desc)}</p><a class="btn" target="_blank" rel="noopener" href="https://instagram.com/${esc(p.ig)}">@${esc(p.ig)}</a></div>`).join("");
$("#events").innerHTML = W.events.map(e => `<div class="card"><h3>${esc(e.name)}</h3><p class="t">${esc(e.date)}</p><p class="t">${esc(e.time)}</p><p><b>${esc(e.place)}</b><br>${esc(e.addr)}</p><a class="btn fill" target="_blank" rel="noopener" href="${esc(e.map)}">GOOGLE MAPS</a></div>`).join("");
$("#story").innerHTML = W.story.map(s => `<div><small>${esc(s.year)}</small><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("");
$("#gifts").innerHTML = W.gifts.map((g, i) => `<div class="card acc"><h3>${esc(g.bank)}</h3><div class="no" id="n${i}">${esc(g.no)}</div><p>a.n. ${esc(g.name)}</p><button class="btn" data-copy="n${i}">SALIN NOMOR REKENING</button></div>`).join("");

const audio = $("#audio"); audio.src = W.music;
const music = $("#music");
const setMusic = on => { if (on) audio.play().then(() => music.classList.add("on")).catch(() => {}); else { audio.pause(); music.classList.remove("on"); } };
music.onclick = () => setMusic(audio.paused);
$("#sealBtn").onclick = () => {
  $("#env").classList.add("opened");
  setTimeout(() => { $("#open").classList.add("gone"); document.body.classList.remove("locked"); music.classList.add("show"); setMusic(true); }, 900);
};

const target = new Date(W.date);
const tick = () => { let d = Math.max(0, target - Date.now()) / 1000;
  $("#count").innerHTML = [["Hari", 86400], ["Jam", 3600], ["Menit", 60], ["Detik", 1]].map(([l, s]) => { const n = Math.floor(d / s); d -= n * s; return `<div><b>${String(n).padStart(2, "0")}</b><small>${l}</small></div>`; }).join(""); };
tick(); setInterval(tick, 1000);

for (let i = 0; i < 14; i++) { const p = document.createElement("i"); p.className = "petal"; p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 14}s`; $("#hero").appendChild(p); }
addEventListener("scroll", () => { if (scrollY < innerHeight) $("#hero .wrap").style.transform = `translateY(${scrollY * .25}px)`; }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

const tints = [["#c9b48a", "#8c7a55"], ["#b9b3a3", "#6d6a5c"], ["#d8c7a5", "#a38a58"], ["#a9a48f", "#5f5b4c"], ["#e0d3b6", "#b39a68"], ["#9d9884", "#4f4b3e"]];
const bgOf = i => `linear-gradient(160deg,${tints[i % 6][0]},${tints[i % 6][1]})`;
W.photos.forEach((src, i) => { const b = document.createElement("button"); b.className = "ph"; b.style.background = bgOf(i); b.setAttribute("aria-label", "Buka foto " + (i + 1));
  b.innerHTML = `<img src="${esc(src)}" alt="Foto ${i + 1}" loading="lazy" onerror="this.remove()">`; b.onclick = () => show(i); $("#grid").appendChild(b); });
let cur = 0;
function show(i) { cur = (i + W.photos.length) % W.photos.length; $("#lb").classList.add("on"); const e = $("#lbi"); e.style.background = bgOf(cur); e.innerHTML = `<img src="${esc(W.photos[cur])}" alt="" onerror="this.remove()">`; }
$("#lb .x").onclick = () => $("#lb").classList.remove("on");
$("#lb .p").onclick = () => show(cur - 1); $("#lb .n").onclick = () => show(cur + 1);
$("#lb").onclick = e => { if (e.target.id === "lb") $("#lb").classList.remove("on"); };
addEventListener("keydown", e => { if (!$("#lb").classList.contains("on")) return; if (e.key === "Escape") $("#lb").classList.remove("on"); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });

$("#rsvp").onsubmit = async e => { e.preventDefault(); const btn = e.submitter; btn.disabled = true;
  try { await add("rsvp", { name: $("#rn").value.trim(), attend: document.querySelector("[name=a]:checked").value, count: +$("#rc").value }); $("#rm").textContent = "Terima kasih, konfirmasi Anda sudah tercatat."; }
  catch (err) { $("#rm").textContent = "Gagal mengirim. Periksa koneksi lalu coba lagi."; }
  btn.disabled = false; };
$("#wish").onsubmit = async e => { e.preventDefault(); const btn = e.submitter; btn.disabled = true;
  try { await add("wishes", { name: $("#wn").value.trim(), text: $("#wt").value.trim() }); $("#wt").value = ""; } catch (err) { alert("Gagal mengirim ucapan. Coba lagi."); }
  btn.disabled = false; };
watch("wishes", r => $("#wl").innerHTML = r.length ? r.map(x => `<article><b>${esc(x.name)}</b><small>${fmt(x.createdAt)}</small><p>${esc(x.text)}</p></article>`).join("") : `<p class="empty">Belum ada ucapan. Jadilah yang pertama.</p>`);
watch("rsvp", r => { const h = r.filter(x => x.attend === "Hadir");
  $("#gl").innerHTML = h.length ? h.map(x => `<article><b>${esc(x.name)}</b><small>${x.count} orang</small></article>`).join("") : `<p class="empty">Belum ada tamu yang konfirmasi.</p>`; });
if (!ready) console.info("Firebase belum diisi: mode demo (localStorage).");

document.querySelectorAll("[data-copy]").forEach(b => b.onclick = async () => { const el = $("#" + b.dataset.copy);
  try { await navigator.clipboard.writeText(el.textContent); } catch (e) { const r = document.createRange(); r.selectNode(el); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand("copy"); }
  $("#cm").textContent = "Nomor rekening " + el.textContent + " tersalin."; });
