let linkuri = document.querySelectorAll(".linkuri a");

linkuri.forEach(function(link) {

    link.addEventListener("click", function() {

        linkuri.forEach(function(element) {
            element.classList.remove("activ");
        });

        link.classList.add("activ");

    });

});

let butonSus = document.getElementById("buton-sus");

function verificaScroll() {

    if (window.scrollY > 300) {
        butonSus.classList.add("vizibil");
    } else {
        butonSus.classList.remove("vizibil");
    }

}

window.addEventListener("scroll", verificaScroll);

verificaScroll();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const mesajElement = document.getElementById('mesaj');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nume = document.getElementById('nume').value;
      const email = document.getElementById('email').value;

      const checkboxes = document.querySelectorAll('input[name="evenimente"]:checked');
      const evenimente = Array.from(checkboxes).map(cb => cb.value);

      try {
        const response = await fetch('http://localhost:3000/adauga', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nume, email, evenimente })
        });

        const result = await response.json();

        if (result.status === 'succes') {
          mesajElement.innerText = '✅ ' + result.mesaj;
          mesajElement.style.color = '#00ff88';
          form.reset();
        } else {
          mesajElement.innerText = '❌ Eroare: ' + result.mesaj;
          mesajElement.style.color = '#ff4444';
        }
      } catch (error) {
        mesajElement.innerText = '❌ Nu s-a putut conecta la server. Verifică dacă server.js rulează!';
        mesajElement.style.color = '#ff4444';
      }
    });
  }
});