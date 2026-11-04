const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectare la baza de date SQLite
const db = new sqlite3.Database('./baza_de_date.db', (err) => {
  if (err) {
    console.error('Eroare conectare DB:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');
  }
});

// Ruta POST: Salvează înscrierea din formular cu verificare de duplicat
app.post('/adauga', (req, res) => {
  console.log('--- DATE PRIMITE DE LA FORMULAR ---:', req.body);

  const { nume, email, evenimente } = req.body;

  // 1. Validare câmpuri goale
  if (!nume || !email || !evenimente) {
    return res.status(400).json({ mesaj: 'Toate câmpurile sunt obligatorii!' });
  }

  // 2. Normalizare email (fără spații libere și doar cu litere mici)
  const emailCurat = email.trim().toLowerCase();

  // 3. Validare format email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailCurat)) {
    return res.status(400).json({ mesaj: 'Adresa de email este invalidă!' });
  }

  // 4. Verificare duplicat în baza de date (insensibil la litere mari/mici)
  db.get(`SELECT id FROM inscrieri WHERE LOWER(email) = ?`, [emailCurat], (err, row) => {
    if (err) {
      console.error('Eroare la căutare email:', err.message);
      return res.status(500).json({ mesaj: 'Eroare la procesarea cererii.' });
    }

    if (row) {
      return res.status(400).json({ mesaj: 'Această adresă de email este deja înregistrată!' });
    }

    // 5. Inserare utilizator nou
    const query = `INSERT INTO inscrieri (nume, email, evenimente) VALUES (?, ?, ?)`;
    db.run(query, [nume.trim(), emailCurat, evenimente], function (err) {
      if (err) {
        console.error('Eroare la salvare:', err.message);
        return res.status(500).json({ mesaj: 'Eroare la salvarea în baza de date.' });
      }

      console.log(`Utilizator salvat cu succes (ID: ${this.lastID}). Evenimente: ${evenimente}`);
      res.status(200).json({ mesaj: 'Înscrierea a fost salvată cu succes!' });
    });
  });
});

// Ruta GET pentru verificare date în format JSON
app.get('/utilizatori', (req, res) => {
  db.all(`SELECT * FROM inscrieri`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ eroare: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
});