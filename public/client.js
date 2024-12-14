// Mendapatkan elemen DOM untuk chat box, input pesan, dan tombol kirim
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');

// Membuka koneksi WebSocket ke server pada port 3000
const socket = new WebSocket(`ws://${window.location.hostname}:3000`);

// Fungsi untuk menambahkan pesan ke dalam chat box
function appendMessage(message, type) {
    const div = document.createElement('div'); // Membuat elemen div baru untuk pesan
    div.classList.add('message', type); // Menambahkan kelas untuk styling (left/right/system)
    div.textContent = message; // Mengatur teks pesan
    chatBox.appendChild(div); // Menambahkan pesan ke dalam chat box
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll otomatis ke pesan terakhir
}

// Event: Ketika pesan diterima dari server
socket.onmessage = (event) => {
    const message = event.data; // Data pesan yang diterima
    if (message instanceof Blob) {
        // Jika pesan berupa Blob, gunakan FileReader untuk membacanya
        const reader = new FileReader();
        reader.onload = function () {
            appendMessage(reader.result, 'left'); // Tampilkan pesan di sisi kiri
        };
        reader.readAsText(message); // Membaca Blob sebagai teks
    } else {
        appendMessage(message, 'left'); // Tampilkan pesan langsung jika bukan Blob
    }
};

// Event: Ketika tombol kirim ditekan
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim(); // Mengambil teks pesan dari input
    if (message) {
        appendMessage(`Saya: ${message}`, 'right'); // Tampilkan pesan di sisi kanan
        socket.send(message); // Kirim pesan ke server melalui WebSocket
        chatInput.value = ''; // Kosongkan input setelah pesan dikirim
    }
});

// Event: Ketika tombol Enter ditekan di input
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click(); // Simulasikan klik tombol kirim
    }
});

// Event: Ketika koneksi WebSocket berhasil terbuka
socket.onopen = () => {
    appendMessage('Koneksi berhasil.', 'system'); // Informasi sistem tentang koneksi
};

// Event: Ketika koneksi WebSocket ditutup
socket.onclose = () => {
    appendMessage('Koneksi terputus. Coba reload.', 'system'); // Informasi sistem tentang koneksi terputus
};

// Event: Ketika terjadi kesalahan pada WebSocket
socket.onerror = (error) => {
    console.error('WebSocket Error:', error); // Tampilkan error di konsol
};