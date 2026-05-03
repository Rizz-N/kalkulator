// ==================== VARIABEL GLOBAL ====================

// Mendeklarasikan variabel untuk menyimpan total hasil kalkulasi
// runningTotal akan menampung angka hasil operasi matematika sebelumnya
let runningTotal = 0;

// Buffer adalah string yang menampung angka yang sedang diketik user
// Nilai awal "0" menampilkan angka 0 di layar saat pertama kali load
let buffer = "0";

// previousOperator menyimpan operator matematika terakhir yang dipilih user
// null berarti belum ada operator yang dipilih
let previousOperator = null;

// screen adalah variabel yang menyimpan referensi ke elemen HTML dengan class "calc-screen"
// querySelector() adalah method DOM untuk mengambil elemen pertama yang cocok dengan selector CSS
const screen = document.querySelector(".calc-screen");

// ==================== FUNGSI UTAMA ====================

// Fungsi ini dipanggil setiap kali tombol ditekan
// Parameter 'value' berisi teks dari tombol yang ditekan (angka atau simbol)
function buttonClick(value) {
  // isNaN() adalah fungsi untuk mengecek apakah value BUKAN angka
  // Jika value bukan angka (seperti +, -, c, =), maka panggil handleSymbol()
  if (isNaN(value)) {
    handleSymbol(value);
  }
  // Jika value adalah angka, maka panggil handleNumber()
  else {
    handleNumber(value);
  }

  // Setelah proses selesai, tampilkan isi buffer ke layar
  // innerText adalah property DOM untuk mengubah/mengambil teks di dalam elemen HTML
  screen.innerText = buffer;
}

// ==================== FUNGSI HANDLER SIMBOL ====================

// Fungsi untuk menangani semua tombol yang bukan angka (simbol operasi)
function handleSymbol(symbol) {
  // switch case digunakan untuk memproses berbagai kemungkinan nilai symbol
  switch (symbol) {
    // CASE "c" - Tombol Clear (membersihkan semua)
    case "c":
      buffer = "0"; // Reset buffer ke "0"
      runningTotal = 0; // Reset total kalkulasi ke 0
      previousOperator = null; // Reset operator sebelumnya
      break; // break untuk keluar dari switch

    // CASE "=" - Tombol sama dengan (menampilkan hasil)
    case "=":
      // Cek apakah ada operator yang tersimpan
      // Jika tidak ada, tidak perlu melakukan apa-apa
      if (previousOperator === null) {
        return; // return menghentikan eksekusi fungsi
      }
      // Panggil flushOperation untuk menghitung hasil
      // parseFloat() mengubah string buffer menjadi angka desimal (float)
      flushOperation(parseFloat(buffer));
      previousOperator = null; // Reset operator setelah selesai
      // toString() mengubah angka menjadi string agar bisa ditampilkan di buffer
      buffer = runningTotal.toString();
      runningTotal = 0; // Reset runningTotal untuk kalkulasi berikutnya
      break;

    // CASE "←" - Tombol backspace/delete (menghapus satu karakter)
    case "←":
      // length adalah property string untuk mengetahui jumlah karakter
      // Jika panjang buffer hanya 1 karakter
      if (buffer.length === 1) {
        buffer = "0"; // Set ke "0" jika hanya tersisa 1 digit
      }
      // Jika panjang lebih dari 1 karakter
      else {
        // slice() memotong string dari index 0 sampai (panjang-1)
        // Ini menghapus karakter terakhir
        buffer = buffer.slice(0, buffer.length - 1);
      }
      break;

    // CASE untuk operator matematika (+, -, ×, ÷)
    case "+":
    case "-":
    case "×":
    case "÷":
      handleMath(symbol); // Panggil fungsi handleMath untuk proses operator
      break;
  }
}

// ==================== FUNGSI HANDLER MATEMATIKA ====================

// Fungsi untuk menangani logika operator matematika
function handleMath(symbol) {
  // Jika buffer masih "0" (belum ada angka yang dimasukkan)
  // maka abaikan (tidak perlu proses matematika)
  if (buffer === "0") {
    return;
  }

  // Konversi buffer (string) menjadi angka menggunakan parseFloat()
  // const berarti variabel ini tidak bisa diubah nilainya setelah deklarasi
  const intBuffer = parseFloat(buffer);

  // Jika runningTotal masih 0 (belum ada operasi sebelumnya)
  if (runningTotal === 0) {
    runningTotal = intBuffer; // Set runningTotal dengan angka saat ini
  }
  // Jika sudah ada operasi sebelumnya
  else {
    flushOperation(intBuffer); // Lakukan operasi dengan angka sebelumnya
  }

  previousOperator = symbol; // Simpan operator untuk operasi berikutnya
  buffer = "0"; // Reset buffer untuk input angka baru
}

// ==================== FUNGSI EKSEKUSI OPERASI ====================

// Fungsi untuk menjalankan operasi matematika yang sebenarnya
// Parameter intBuffer adalah angka yang akan dioperasikan dengan runningTotal
function flushOperation(intBuffer) {
  // Cek operator yang tersimpan, lalu lakukan operasi yang sesuai

  // Jika operator adalah "+" (penjumlahan)
  if (previousOperator === "+") {
    runningTotal += intBuffer; // runningTotal = runningTotal + intBuffer
  }
  // Jika operator adalah "-" (pengurangan)
  else if (previousOperator === "-") {
    runningTotal -= intBuffer; // runningTotal = runningTotal - intBuffer
  }
  // Jika operator adalah "×" (perkalian)
  else if (previousOperator === "×") {
    runningTotal *= intBuffer; // runningTotal = runningTotal × intBuffer
  }
  // Jika operator adalah "÷" (pembagian)
  else if (previousOperator === "÷") {
    // Cek apakah pembagi bukan 0 (menghindari division by zero error)
    if (intBuffer !== 0) {
      runningTotal /= intBuffer; // runningTotal = runningTotal ÷ intBuffer
    }
    // Jika pembagi adalah 0
    else {
      buffer = "Error"; // Tampilkan pesan error
      runningTotal = 0; // Reset total
      previousOperator = null; // Reset operator
    }
  }
}

// ==================== FUNGSI HANDLER ANGKA ====================

// Fungsi untuk menangani input angka
// Parameter numberString adalah angka yang ditekan user (dalam bentuk string)
function handleNumber(numberString) {
  // Jika buffer masih "0" (kondisi awal atau setelah operator)
  if (buffer === "0") {
    buffer = numberString; // Ganti "0" dengan angka yang ditekan
  }
  // Jika buffer sudah berisi angka
  else {
    buffer += numberString; // Tambahkan angka baru ke belakang (konkatenasi string)
  }
}

// ==================== INISIALISASI EVENT LISTENER ====================

// Fungsi init() untuk mengatur event listener saat halaman dimuat
function init() {
  // querySelectorAll() mengambil SEMUA elemen dengan class "calc-button"
  // Ini mengembalikan NodeList (seperti array) berisi semua tombol kalkulator
  const buttons = document.querySelectorAll(".calc-button");

  // forEach() adalah method untuk melakukan iterasi/looping pada setiap tombol
  // Parameter 'button' adalah setiap elemen tombol dalam iterasi
  buttons.forEach((button) => {
    // addEventListener() untuk mendaftarkan event 'click' pada tombol
    // Saat tombol diklik, fungsi callback akan dijalankan
    button.addEventListener("click", function (e) {
      // e adalah event object yang berisi informasi tentang event yang terjadi
      // e.target adalah elemen yang menerima event (tombol yang diklik)
      // innerText mengambil teks yang ada di dalam tombol
      let value = e.target.innerText;

      // Konversi simbol HTML ke operator yang diinginkan
      // Karakter "−" (minus/unicode) dari HTML diubah menjadi "-" (minus biasa)
      if (value === "−") value = "-";
      if (value === "+") value = "+";
      if (value === "×") value = "×";
      if (value === "÷") value = "÷";
      if (value === "=") value = "=";

      // Panggil fungsi utama buttonClick dengan nilai yang sudah dikonversi
      buttonClick(value);
    });
  });
}

// Memanggil fungsi init() untuk menjalankan inisialisasi
// Tanpa pemanggilan ini, event listener tidak akan terpasang
init();
