const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Koneksi database

// Endpoint untuk mendapatkan semua data
router.get('/', (req, res) => {
    db.query('SELECT * FROM pegawai_kebun', (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data' });
        res.json(results);
    });
});

// Endpoint untuk menambahkan data baru
router.post('/', (req, res) => {
    const { nama, posisikerja } = req.body;
    if (!nama || !posisikerja) {
        return res.status(400).json({ message: 'Nama dan posisi kerja tidak boleh kosong' });
    }

    db.query(
        'INSERT INTO pegawai_kebun (nama, posisikerja) VALUES (?, ?)',
        [nama, posisikerja],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Gagal menambahkan data' });
            res.status(201).json({ id: results.insertId, nama, posisikerja });
        }
    );
});

// Endpoint untuk memperbarui data
router.put('/:id', (req, res) => {
    const { nama, posisikerja } = req.body;

    db.query(
        'UPDATE pegawai_kebun SET nama = ?, posisikerja = ? WHERE id = ?',
        [nama, posisikerja, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Gagal memperbarui data' });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
            res.status(200).json({ message: `Data dengan ID ${req.params.id} telah diperbarui` });
        }
    );
});

// Endpoint untuk menghapus data
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM pegawai_kebun WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus data' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.status(200).json({ message: `Data dengan ID ${req.params.id} telah dihapus` });
    });
});

module.exports = router;
