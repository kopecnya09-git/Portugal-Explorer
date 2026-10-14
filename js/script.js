// Portugal Explorer - script.js (vanilla JS)
// Funkce: 1) Favorites (srdíčko + localStorage)  2) Image Lightbox (modal)

document.addEventListener("DOMContentLoaded", function () {
    var cards = document.querySelectorAll(".place-card");
    if (cards.length === 0) return; // na stránkách bez karet míst nic nedělá

    // ---------- Styly pro srdíčko a lightbox ----------
    var style = document.createElement("style");
    style.textContent =
        ".fav-btn{position:absolute;top:12px;left:12px;width:40px;height:40px;border:none;border-radius:50%;" +
        "background:#fff;color:#dc3545;font-size:1.2rem;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;" +
        "transition:transform .2s ease;z-index:3}" +
        ".fav-btn:hover{transform:scale(1.15)}" +
        ".place-img{cursor:zoom-in}" +
        ".lightbox{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;" +
        "justify-content:center;flex-direction:column;z-index:2000;padding:20px}" +
        ".lightbox.open{display:flex}" +
        ".lightbox img{max-width:90%;max-height:80vh;border-radius:12px}" +
        ".lightbox p{color:#fff;margin:12px 0 0;font-size:1.1rem}" +
        ".lightbox-close{position:absolute;top:15px;right:25px;background:none;border:none;color:#fff;font-size:2.5rem;cursor:pointer}";
    document.head.appendChild(style);

    // ---------- FAVORITES (localStorage) ----------
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem("favorites")) || [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(list) {
        localStorage.setItem("favorites", JSON.stringify(list));
    }

    var favorites = getFavorites();

    cards.forEach(function (card) {
        var title = card.querySelector(".card-title").textContent.trim();
        var wrapper = card.querySelector(".position-relative");

        var btn = document.createElement("button");
        btn.className = "fav-btn";
        btn.setAttribute("aria-label", "Save " + title + " to favorites");
        btn.innerHTML = '<i class="bi bi-heart"></i>';
        wrapper.appendChild(btn);

        function updateIcon() {
            var isFav = favorites.indexOf(title) !== -1;
            btn.innerHTML = isFav ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
        }
        updateIcon();

        btn.addEventListener("click", function () {
            var index = favorites.indexOf(title);
            if (index === -1) {
                favorites.push(title); // uložit
            } else {
                favorites.splice(index, 1); // odebrat
            }
            saveFavorites(favorites);
            updateIcon();
        });
    });

    // ---------- IMAGE LIGHTBOX / MODAL ----------
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<img src="" alt="">' +
        "<p></p>";
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector("p");

    function closeLightbox() {
        lightbox.classList.remove("open");
    }

    document.querySelectorAll(".place-img").forEach(function (img) {
        img.addEventListener("click", function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = img.alt;
            lightbox.classList.add("open");
        });
    });

    // zavření: klik na pozadí nebo křížek, nebo klávesa Escape
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeLightbox();
    });
});