
document.getElementById('registration-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nume = document.getElementById('nume').value.trim();
  const email = document.getElementById('email').value.trim();

  // Preluăm toate casetele bifate care au atributul name="evenimente"
  const caseteBifate = document.querySelectorAll('input[name="evenimente"]:checked');
  const evenimenteBifate = Array.from(caseteBifate).map(cb => cb.value);

  // Validare 1: Nume completat
  if (!nume) {
    alert('Te rugăm să introduci numele complet.');
    return;
  }

  // Validare 2: Format email valid
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert('Te rugăm să introduci o adresă de email validă.');
    return;
  }

  // Validare 3: Cel puțin un eveniment selectat
  if (evenimenteBifate.length === 0) {
    alert('Te rugăm să selectezi cel puțin un eveniment!');
    return;
  }

  // Feedback vizual pe buton pe durata cererii
  const btnSubmit = e.target.querySelector('button[type="submit"]');
  const textOriginalBtn = btnSubmit ? btnSubmit.innerText : 'TRIMITE ÎNSCRIEREA';

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Se trimite...';
  }

  const dateFormular = {
    nume: nume,
    email: email,
    evenimente: evenimenteBifate.join(', ')
  };

  try {
    const response = await fetch('http://localhost:3000/adauga', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dateFormular)
    });

    const rezultat = await response.json();

    if (response.ok) {
      alert('Înregistrare reușită!');
      document.getElementById('registration-form').reset();
    } else {
      alert('Eroare: ' + rezultat.mesaj);
    }
  } catch (error) {
    console.error('Eroare de rețea:', error);
    alert('Nu s-a putut conecta la server. Verifică dacă server.js rulează!');
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerText = textOriginalBtn;
    }
  }
});