
let saniye = 0;
let dinamikLimit = 10;
const bugun = new Date().toLocaleDateString();


const mesaj = document.createElement("div");
mesaj.id = "shortvideo-farkindalik-mesaji";
mesaj.innerText = "KONTROLÜ KAYBETTİN!";
document.body.appendChild(mesaj);

const bilgiPaneli = document.createElement("div");
bilgiPaneli.id = "shortvideo-bilgi-paneli";
document.body.appendChild(bilgiPaneli);

function saniyeyiFormatla(sn) {
    const dk = Math.floor(sn / 60);
    const kalanSn = sn % 60;
    return `${dk}:${kalanSn < 10 ? '0' : ''}${kalanSn}`;
}


function verileriYukle() {
    chrome.storage.local.get(['kayitliSaniye', 'kullaniciLimiti', 'sonKayitTarihi'], (result) => {
        if (result.sonKayitTarihi !== bugun) {
            saniye = 0;
            chrome.storage.local.set({ 'kayitliSaniye': 0, 'sonKayitTarihi': bugun });
        } else {
            if (result.kayitliSaniye) saniye = result.kayitliSaniye;
        }

        if (result.kullaniciLimiti) {
            dinamikLimit = parseInt(result.kullaniciLimiti);
        }
    });
}

verileriYukle();


function takipEt() {
    
    const isReels = window.location.href.includes("instagram.com/reels");
    const isShorts = window.location.href.includes("youtube.com/shorts");
    const isTiktok = window.location.href.includes("tiktok.com");

    
    if (isReels || isShorts || isTiktok) {
        saniye++;
        bilgiPaneli.style.display = "block";
        
        let kalan = dinamikLimit - saniye;
        if (kalan > 0) {
            bilgiPaneli.innerText = "Kalan Süre: " + saniyeyiFormatla(kalan);
            bilgiPaneli.style.color = "#00ff00";
        } else {
            bilgiPaneli.innerText = "LİMİT DOLDU!";
            bilgiPaneli.style.color = "red";
        }

        chrome.storage.local.set({ 
            'kayitliSaniye': saniye,
            'sonKayitTarihi': bugun 
        });

        if (saniye >= dinamikLimit) {
            mesaj.style.display = "block";
            document.querySelectorAll("video").forEach(v => {
                if (!v.paused) v.playbackRate = 0.4; 
            });
        }
    } else {
        
        mesaj.style.display = "none";
        bilgiPaneli.style.display = "none";
    }
}

window.addEventListener('yt-navigate-finish', verileriYukle);
setInterval(takipEt, 1000);

chrome.storage.onChanged.addListener((changes) => {
    if (changes.kullaniciLimiti) {
        dinamikLimit = parseInt(changes.kullaniciLimiti.newValue);
    }
});