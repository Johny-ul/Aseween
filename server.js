const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Conectare la baza de date
const db = new sqlite3.Database('./baza_de_date.db', (err) => {
  if (err) {
    console.error('Eroare conectare DB:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');
  }
});

// Ruta POST: Salvează înscrierea din formular
app.post('/adauga', (req, res) => {
  const { nume, email, evenimente } = req.body;

  if (!nume || !email) {
    return res.status(400).json({ status: 'eroare', mesaj: 'Numele și emailul sunt obligatorii!' });
  }

  // Transformăm lista de evenimente bifate într-un string separat prin virgulă
  const evenimenteStr = Array.isArray(evenimente) && evenimente.length > 0 
    ? evenimente.join(', ') 
    : 'Niciun eveniment selectat';

  const sql = `INSERT INTO inscrieri (nume, email, evenimente) VALUES (?, ?, ?)`;

  db.run(sql, [nume, email, evenimenteStr], function (err) {
    if (err) {
      return res.status(500).json({ status: 'eroare', mesaj: err.message });
    }
    res.json({
      status: 'succes',
      mesaj: 'Înscrierea a fost înregistrată cu succes!',
      id: this.lastID
    });
  });
});

// Ruta GET: Vezi toate înscrierile
app.get('/utilizatori', (req, res) => {
  db.all(`SELECT * FROM inscrieri ORDER BY data_creare DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ status: 'eroare', mesaj: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});