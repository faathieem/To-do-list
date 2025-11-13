// ===================================================
// 1. Variabel Global dan Setup Awal
// ===================================================
let balance = 0;
let transactions = [];
let dailyExpense = 0; // Untuk menghitung Burn Rate hari ini

// Target Tabungan (Dapat diatur di fitur Setting, untuk saat ini fixed)
const GOAL_TARGET = 1500000; 
const DAILY_SAVING_RATE = 5000; // Contoh: Asumsi target menabung Rp 5.000 per hari
const goalName = "Beli Sepatu Baru";

// Mengambil elemen HTML
const currentBalanceEl = document.getElementById('current-balance');
const goalTargetEl = document.getElementById('goal-target');
const goalNameEl = document.getElementById('goal-name');
const goalProgressEl = document.getElementById('goal-progress');
const progressTextEl = document.getElementById('progress-text');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addBtn = document.getElementById('add-btn');
const transactionListEl = document.getElementById('transaction-list');
const burnRateOutputEl = document.getElementById('burn-rate-output');

// Inisialisasi Tampilan Tujuan
goalNameEl.textContent = goalName;
goalTargetEl.textContent = formatRupiah(GOAL_TARGET);


// ===================================================
// 2. Fungsi Pembantu
// ===================================================
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function updateBalance() {
    currentBalanceEl.textContent = formatRupiah(balance);
}

function updateGoalProgress() {
    // Hitung persentase progress
    const percentage = Math.min(100, (balance / GOAL_TARGET) * 100);
    goalProgressEl.style.width = percentage.toFixed(2) + '%';
    progressTextEl.textContent = Progress: ${percentage.toFixed(2)}%;

    if (percentage >= 100) {
        progressTextEl.textContent += " 🎉 GOAL TERCAPAI!";
    }
}

// ===================================================
// 3. Logika Burn Rate (Unik Si Kancil)
// ===================================================

function updateBurnRate() {
    let message = "";
    
    // Bandingkan Pengeluaran Harian dengan Target Tabungan Ideal
    if (dailyExpense === 0) {
        message = "Belum ada pengeluaran hari ini. Kancil Hebat!";
        burnRateOutputEl.style.color = '#28a745';
    } else if (dailyExpense <= DAILY_SAVING_RATE) {
        message = Pengeluaranmu (${formatRupiah(dailyExpense)}) masih di bawah target hemat harian (${formatRupiah(DAILY_SAVING_RATE)}). Lanjutkan!;
        burnRateOutputEl.style.color = '#ffc107';
    } else {
        const excess = dailyExpense - DAILY_SAVING_RATE;
        message = ⚠️ TERLALU BOROS! Pengeluaranmu melebihi target hemat harian sebesar ${formatRupiah(excess)}. Coba hemat besok!;
        burnRateOutputEl.style.color = '#dc3545';
    }

    burnRateOutputEl.textContent = message;
}

// ===================================================
// 4. Menambah Transaksi
// ===================================================

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Pilot, masukkan deskripsi dan jumlah yang valid!");
        return;
    }

    const transactionAmount = type === 'expense' ? -amount : amount;

    // 1. Update Saldo
    balance += transactionAmount;

    // 2. Catat untuk Log
    const newTransaction = {
        description,
        amount: amount,
        type,
        date: new Date().toLocaleDateString('id-ID')
    };
    transactions.push(newTransaction);

    // 3. Update Daily Expense (Hanya jika pengeluaran)
    if (type === 'expense') {
        // Logika sederhana: asumsikan semua transaksi dicatat pada hari ini
        dailyExpense += amount; 
    }

    // 4. Reset Input
    descriptionInput.value = '';
    amountInput.value = '';

    // 5. Update Tampilan
    renderTransactions();
    updateBalance();
    updateGoalProgress();
    updateBurnRate(); // Paling penting!
}

// ===================================================
// 5. Render Log Transaksi
// ===================================================

function renderTransactions() {
    transactionListEl.innerHTML = ''; // Kosongkan
    
    // Tampilkan 5 transaksi terbaru
    const recentTransactions = transactions.slice(-5).reverse(); 

    recentTransactions.forEach(t => {
        const listItem = document.createElement('li');
        const sign = t.type === 'expense' ? '-' : '+';
        const amountClass = t.type; // expense atau income

        listItem.innerHTML = `
            <span>${t.date} | ${t.description}</span>
            <span class="${amountClass}">${sign} Rp ${formatRupiah(t.amount)}</span>
        `;
        transactionListEl.appendChild(listItem);
    });
}

// ===================================================
// 6. Event Listener
// ===================================================

addBtn.addEventListener('click', addTransaction);

// Inisialisasi pertama kali
updateBalance();
updateGoalProgress();
updateBurnRate();
