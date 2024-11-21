const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua pegawai
router.get('/', (req, res) => {
    db.query('SELECT * FROM pegawai_kebun', (err, results) => {
        if (err) return res.status(500).send('anjayError');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan pegawai berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM pegawai_kebun WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('anjayError');
        if (results.length === 0) return res.status(404).send('Pegawai tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan pegawai baru
router.post('/', (req, res) => {
    const { nama, posisikerja } = req.body;
    if (!nama || !posisikerja) {
        return res.status(400).send('Nama dan posisi kerja tidak boleh kosong');
    }

    db.query(
        'INSERT INTO pegawai_kebun (nama, posisikerja) VALUES (?, ?)',
        [nama, posisikerja],
        (err, results) => {
            if (err) return res.status(500).send('anjay');
            res.status(201).json({ id: results.insertId, nama, posisikerja });
        }
    );
});

// Endpoint untuk memperbarui data pegawai
router.put('/:id', (req, res) => {
    const { nama, posisikerja } = req.body;

    db.query(
        'UPDATE pegawai_kebun SET nama = ?, posisikerja = ? WHERE id = ?',
        [nama, posisikerja, req.params.id],
        (err, results) => {
            if (err) return res.status(500).send('anjay');
            if (results.affectedRows === 0) return res.status(404).send('Pegawai tidak ditemukan');
            res.json({ id: req.params.id, nama, posisikerja });
        }
    );
});

// Endpoint untuk menghapus data pegawai
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM pegawai_kebun WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('anjay');
        if (results.affectedRows === 0) return res.status(404).send('Pegawai tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
