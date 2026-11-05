const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database('./baza_de_date.db', (err) => {
  if (err) {
    console.error('Eroare conectare DB:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');
  }
});


db.run(`CREATE TABLE IF NOT EXISTS inscrieri (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nume TEXT NOT NULL,
  email TEXT NOT NULL,
  evenimente TEXT NOT NULL
)`);


app.post('/adauga', (req, res) => {
  console.log('Primit:', req.body);

  const { nume, email } = req.body;
  let { evenimente } = req.body;

  
  if (Array.isArray(evenimente)) {
    evenimente = evenimente.join(', ');
  } else if (typeof evenimente === 'string') {
    evenimente = evenimente.trim();
  } else {
    evenimente = '';
  }

  if (!nume || !email) {
    return res.status(400).json({ mesaj: 'Nume și email obligatorii.' });
  }
  if (!evenimente) {
    return res.status(400).json({ mesaj: 'Selectează cel puțin un eveniment.' });
  }

  const emailCurat = String(email).trim().toLowerCase();

  
  db.get(`SELECT id FROM inscrieri WHERE LOWER(email) = ?`, [emailCurat], (err, row) => {
    if (err) {
      console.error('Eroare la căutare email:', err.message);
      return res.status(500).json({ mesaj: 'Eroare la procesarea cererii.' });
    }

    if (row) {
      return res.status(400).json({ mesaj: 'Această adresă de email este deja înregistrată!' });
    }

   
    const query = `INSERT INTO inscrieri (nume, email, evenimente) VALUES (?, ?, ?)`;
    db.run(query, [String(nume).trim(), emailCurat, evenimente], function (err) {
      if (err) {
        console.error('Eroare la salvare:', err.message);
        return res.status(500).json({ mesaj: 'Eroare la salvarea în baza de date.' });
      }

      console.log(`Utilizator salvat (ID: ${this.lastID}). Evenimente: ${evenimente}`);
      res.status(200).json({ mesaj: 'Înscrierea a fost salvată cu succes!' });
    });
  });
});


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