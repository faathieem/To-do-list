const deskripsi = document.getElementById('deskripsi');
const jumlah = document.getElementById('jumlah');
const jenis = document.getElementById('jenis');
const tambahBtn = document.getElementById('tambah');
const daftarTransaksi = document.getElementById('daftarTransaksi');
const saldoEl = document.getElementById('saldo');
const totalMasukEl = document.getElementById('totalMasuk');
const totalKeluarEl = document.getElementById('totalKeluar');
const motivasiEl = document.getElementById('motivasi');
const toggleThemeBtn = document.getElementById('toggle-theme');

let transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];

const motivasi = [
  "💪 Jangan boros, masa depanmu butuh kamu yang hemat!",
  "🌱 Sedikit demi sedikit, lama-lama jadi bukit.",
  "🏆 Remaja cerdas itu tahu cara mengatur uang!",
  "💸 Nabung dulu, jajan nanti!",
  "🔥 Jangan biarkan uangmu kabur tanpa arah!"
];
motivasiEl.textContent = motivasi[Math.floor(Math.random() * motivasi.length)];

function updateUI() {
  daftarTransaksi.innerHTML = '';
  let totalMasuk = 0;
  let totalKeluar = 0;

  transaksi.forEach((t, index) => {
    const li = document.createElement('li');
    li.classList.add(t.jenis);
    li.innerHTML = `${t.deskripsi} - Rp ${t.jumlah.toLocaleString()} 
      <button onclick="hapus(${index})">❌</button>`;
    daftarTransaksi.appendChild(li);

    if (t.jenis === 'pemasukan') totalMasuk += t.jumlah;
    else totalKeluar += t.jumlah;
  });

  const saldo = totalMasuk - totalKeluar;
  saldoEl.textContent = Rp ${saldo.toLocaleString()};
  totalMasukEl.textContent = Rp ${totalMasuk.toLocaleString()};
  totalKeluarEl.textContent = Rp ${totalKeluar.toLocaleString()};
  localStorage.setItem('transaksi', JSON.stringify(transaksi));
}

tambahBtn.addEventListener('click', () => {
  if (!deskripsi.value || !jumlah.value) return alert('Isi semua data!');
  transaksi.push({
    deskripsi: deskripsi.value,
    jumlah: parseInt(jumlah.value),
    jenis: jenis.value
  });
  deskripsi.value = '';
  jumlah.value = '';
  updateUI();
});

function hapus(index) {
  transaksi.splice(index, 1);
  updateUI();
}

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

updateUI();
