const db = require("../models/db");

// GET ALL + FILTER + SORT + PAGE
exports.getAll = (req, res, query) => {
    let search = query?.search ? `%${query.search}%` : "%%";
    let sort = query?.sort || "nidn";
    let order = query?.order?.toUpperCase() || "ASC";
    let limit = parseInt(query?.limit) || 10;
    let page = parseInt(query?.page) || 1;
    let offset = (page - 1) * limit;

    const sql = `
        SELECT * FROM dosen 
        WHERE nama_dosen LIKE ?
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
    `;

    db.query(sql, [search, limit, offset], (err, result) => {
        if (err) return res.end(JSON.stringify({ error: err }));
        res.end(JSON.stringify(result));
    });
};

// GET BY ID
exports.getById = (req, res, nidn) => {
    db.query("SELECT * FROM dosen WHERE nidn = ?", [nidn], (err, result) => {
        if (err) return res.end(JSON.stringify({ error: err }));
        res.end(JSON.stringify(result[0] || {}));
    });
};

// CREATE (MariaDB FIX)
exports.create = (req, res, body) => {
    const sql = `
        INSERT INTO dosen (nidn, nama_dosen, gender, prodi, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        body.nidn,
        body.nama_dosen,
        body.gender,
        body.prodi,
        body.email
    ];

    db.query(sql, values, (err) => {
        if (err) return res.end(JSON.stringify({ error: err }));
        res.end(JSON.stringify({
            message: "Dosen berhasil ditambahkan",
            data: body
        }));
    });
};

// UPDATE (MariaDB FIX)
exports.update = (req, res, nidn, body) => {
    const sql = `
        UPDATE dosen
        SET nama_dosen=?, gender=?, prodi=?, email=?
        WHERE nidn=?
    `;

    const values = [
        body.nama_dosen,
        body.gender,
        body.prodi,
        body.email,
        nidn
    ];

    db.query(sql, values, (err) => {
        if (err) return res.end(JSON.stringify({ error: err }));
        res.end(JSON.stringify({
            message: "Data dosen berhasil diupdate",
            nidn,
            new_data: body
        }));
    });
};

// DELETE
exports.delete = (req, res, nidn) => {
    db.query("DELETE FROM dosen WHERE nidn = ?", [nidn], (err) => {
        if (err) return res.end(JSON.stringify({ error: err }));
        res.end(JSON.stringify({
            message: "Data dosen berhasil dihapus",
            nidn
        }));
    });
};
