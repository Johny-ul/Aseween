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