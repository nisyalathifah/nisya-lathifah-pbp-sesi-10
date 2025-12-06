const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kampus"
});

db.connect((err) => {
    if (err) {
        console.log("Database error:", err);
    } else {
        console.log("Database connected to kampus");
    }
});

module.exports = db;
