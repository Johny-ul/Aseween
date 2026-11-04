const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./baza_de_date.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inscrieri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nume TEXT NOT NULL,
      email TEXT NOT NULL,
      evenimente TEXT NOT NULL,
      data_creare DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Eroare la crearea tabelului:', err.message);
    } else {
      console.log('Tabela "inscrieri" a fost creată cu succes în baza_de_date.db.');
    }
  });
});

db.close();