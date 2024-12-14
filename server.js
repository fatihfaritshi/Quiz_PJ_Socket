const express = require('express'); // Mengimpor framework Express
const WebSocket = require('ws'); // Mengimpor modul WebSocket
const http = require('http'); // Mengimpor modul HTTP

const app = express(); // Membuat instance aplikasi Express
const server = http.createServer(app); // Membuat server HTTP
const wss = new WebSocket.Server({ server }); // Membuat WebSocket server menggunakan server HTTP

// Mengatur folder 'public' sebagai folder statis untuk file HTML, CSS, dan JavaScript klien
app.use(express.static('public'));

const clients = new Set(); // Menggunakan Set untuk menyimpan koneksi WebSocket aktif

// Event handler untuk koneksi baru
wss.on('connection', (ws) => {
    clients.add(ws); // Menambahkan koneksi klien ke dalam Set
    console.log('Klien terhubung.');

    // Event handler untuk pesan yang diterima dari klien
    ws.on('message', (message) => {
        console.log('Pesan diterima:', message);

        // Mengirim pesan ke semua klien lain yang terhubung
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); // Mengirim pesan jika klien dalam keadaan terbuka
            }
        });
    });

    // Event handler untuk koneksi klien yang terputus
    ws.on('close', () => {
        console.log('Klien terputus.');
        clients.delete(ws); // Menghapus klien dari Set
    });

    // Event handler untuk menangani kesalahan
    ws.on('error', (error) => console.error('Error:', error));
});

// Menentukan port untuk server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});