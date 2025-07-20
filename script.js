const groupMatch = window.location.pathname.match(/(\d)ciqrup\.html$/),
    groupNumber = groupMatch ? groupMatch[1] : "1",
    jsonFile = `qrup${groupNumber}.json`;
let globalData = [];
const groupNames = {
    1: "1-ci Qrup",
    2: "2-ci Qrup",
    3: "3-c\xfc Qrup",
    4: "4-c\xfc Qrup",
    5: "5-ci Qrup"
};

function loadData() {
    fetch(jsonFile).then(e => {
        if (!e.ok) throw Error(`Failed to fetch ${jsonFile}: ${e.statusText}`);
        return e.json()
    }).then(e => {
        globalData = e, initPage()
    }).catch(e => {
        console.error("Error loading data:", e)
    })
}

function initPage() {
    let e = localStorage.getItem("selectedLanguage") || "az",
        a = document.getElementById("group-title");
    a && (a.textContent = groupNames[groupNumber] || "Qrup");
    let t = document.querySelectorAll("#menu-bar ul li a");

    function i() {
        let a = getCurrentFilters(),
            t = filterData(globalData, a);
        renderData(t, e), setupEventListeners()
    }
    t.forEach(e => {
        e.classList.remove("active"), e.getAttribute("href") === `${groupNumber}ciqrup.html` && e.classList.add("active")
    }), renderData(globalData, e), setupEventListeners(), window.addEventListener("resize", i), window.addEventListener("orientationchange", i)
}

function setupEventListeners() {
    let e = document.getElementById("search"),
        a = document.getElementById("tehsilSelect"),
        t = document.getElementById("dilSelect"),
        i = document.getElementById("altSelect"),
        l = document.getElementById("locationSelect"),
        n = document.getElementById("searchBtn"),
        r = document.getElementById("minScore"),
        s = document.getElementById("maxScore");
    e.removeEventListener("input", applyFilters), a.removeEventListener("change", applyFilters), t.removeEventListener("change", applyFilters), i.removeEventListener("change", applyFilters), l.removeEventListener("change", applyFilters), r.removeEventListener("input", applyFilters), s.removeEventListener("input", applyFilters), n && n.removeEventListener("click", applyFilters), window.innerWidth > 768 ? (e.addEventListener("input", applyFilters), r.addEventListener("input", applyFilters), s.addEventListener("input", applyFilters)) : n && n.addEventListener("click", applyFilters), a.addEventListener("change", applyFilters), t.addEventListener("change", applyFilters), i.addEventListener("change", applyFilters), l.addEventListener("change", applyFilters)
}

function renderData(data, lang) {
    let tableContainer = document.getElementById("table-container"),
        cardContainer = document.getElementById("card-container"),
        l = translations[lang] || {},
        isMobileView = window.innerWidth <= 768;
    tableContainer.innerHTML = "";
    cardContainer.innerHTML = "";
    if (isMobileView) {
        let html = "";
        data.forEach(group => {
            group.universitetler.forEach(univ => {
                html += `<div class="uni-basliq">${lang === "en" && univ.universitet_en ? univ.universitet_en : univ.universitet}</div>`;
                univ.ixtisaslar.forEach(ixtisas => {
                    let tehsilFormasi = lang === "en" && ixtisas.tehsil_formasi_en
                        ? ixtisas.tehsil_formasi_en
                        : ixtisas.tehsil_formasi;
                    html += `
                    <div class="card">
                      <div class="field" id="ixtisasad"><strong>${l.ixtisas || "Ixtisas"}:</strong> ${lang === "en" && ixtisas.ad_en ? ixtisas.ad_en : ixtisas.ad}</div>
                      <div class="field"><strong>${l.dil || "Dil"}:</strong> ${lang === "en" && ixtisas.dil_en ? ixtisas.dil_en : ixtisas.dil}</div>
                      <div class="field"><strong>${l.balOdenissiz || "Bal (Ödənişsiz)"}:</strong> ${ixtisas.bal_pulsuz ?? "—"}</div>
                      <div class="extra-info" style="display: none;">
                        <div class="field"><strong>${l.balOdenisli || "Bal (Ödənişli)"}:</strong> ${ixtisas.bal_pullu ?? "—"}</div>
                        <div class="field"><strong>${l.tehsilFormasi || "Təhsil forması"}:</strong> ${tehsilFormasi}</div>
                        <div class="field"><strong>${l.altQrup || "Alt qrup"}:</strong> ${ixtisas.alt_qrup}</div>
                      </div>
                      <a href="#" class="toggle-more" onclick="toggleMore(this); return false;" data-state="collapsed">${l.dahaCox || "Daha çox"}</a>
                    </div>`;
                });
            });
        });
        cardContainer.innerHTML = html;
        tableContainer.style.display = "none";
        cardContainer.style.display = "block";
    } else {
        let html = "";
        data.forEach(group => {
            group.universitetler.forEach(univ => {
                html += `<div class="uni-basliq">${lang === "en" && univ.universitet_en ? univ.universitet_en : univ.universitet}</div>`;
                html += `
                <table>
                    <thead>
                        <tr>
                            <th>${l.ixtisas || "Ixtisas"}</th>
                            <th>${l.tehsilFormasi || "Təhsil forması"}</th>
                            <th>${l.dil || "Dil"}</th>
                            <th>${l.altQrup || "Alt qrup"}</th>
                            <th>${l.balOdenissiz || "Bal (Ödənişsiz)"}</th>
                            <th>${l.balOdenisli || "Bal (Ödənişli)"}</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
                univ.ixtisaslar.forEach((ixtisas, idx) => {
                    let tehsilFormasi = lang === "en" && ixtisas.tehsil_formasi_en
                        ? ixtisas.tehsil_formasi_en
                        : ixtisas.tehsil_formasi;
                    html += `
                    <tr class="${idx % 2 === 0 ? "even-row" : ""}">
                        <td>${lang === "en" && ixtisas.ad_en ? ixtisas.ad_en : ixtisas.ad}</td>
                        <td>${tehsilFormasi}</td>
                        <td>${lang == "en" && ixtisas.dil_en ? ixtisas.dil_en : ixtisas.dil}</td>
                        <td>${ixtisas.alt_qrup}</td>
                        <td>${ixtisas.bal_pulsuz ?? "—"}</td>
                        <td>${ixtisas.bal_pullu ?? "—"}</td>
                    </tr>`;
                });
                html += "</tbody></table>";
            });
        });
        tableContainer.innerHTML = html;
        cardContainer.style.display = "none";
        tableContainer.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', () => {
const menuToggle = document.getElementById("menu-toggle");
const menuContent = document.getElementById("menu-bar");

const maxWidth = menuContent.offsetWidth || 150;

menuToggle.addEventListener("click", () => {
    if (menuContent.classList.contains("hidden")) {
        menuContent.classList.remove("hidden");
        menuContent.style.left = "0px";
    } else {
        menuContent.classList.add("hidden");
        menuContent.style.left = `-${maxWidth}px`;
    }
});
});

const menuToggle = document.getElementById("menu-toggle"),
      menuContent = document.getElementById("menu-bar");


document.addEventListener('DOMContentLoaded', () => {
const menuToggle = document.getElementById("menu-toggle");
const menuContent = document.getElementById("menu-bar");

if (!menuToggle || !menuContent) return;

let maxWidth = 250;
if (!menuContent.classList.contains("hidden")) {
    maxWidth = menuContent.offsetWidth;
} else {
    menuContent.classList.remove("hidden");
    maxWidth = menuContent.offsetWidth || 250;
    menuContent.classList.add("hidden");
}

const swipeThreshold = window.innerWidth * 0.40;

let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;

menuToggle.addEventListener("click", () => {
    menuContent.style.transition = "left 0.8s cubic-bezier(.25,.8,.25,1)";

    if (menuContent.classList.contains("hidden")) {
        menuContent.classList.remove("hidden");
        menuContent.style.left = "0px";
    } else {
        menuContent.style.left = `-${maxWidth}px`;
        setTimeout(() => menuContent.classList.add("hidden"), 300);
    }
});

document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isDragging = true;
    menuContent.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {});

document.addEventListener("touchend", (e) => {
    isDragging = false;
    const touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(e.changedTouches[0].screenY - touchStartY);
    const horizontalDistance = Math.abs(swipeDistance);

    menuContent.style.transition = "left 0.8s cubic-bezier(.25,.8,.25,1)";

    if (horizontalDistance > verticalDistance) {
        if (menuContent.classList.contains("hidden") && swipeDistance > swipeThreshold) {
            // Yalnız uzun sürüşdürmə ilə aç
            menuContent.classList.remove("hidden");
            menuContent.style.left = "0px";
        } else if (!menuContent.classList.contains("hidden") && swipeDistance < -swipeThreshold) {
            menuContent.style.left = `-${maxWidth}px`;
            setTimeout(() => menuContent.classList.add("hidden"), 300);
        } else {
            if (menuContent.classList.contains("hidden")) {
                menuContent.style.left = `-${maxWidth}px`;
                setTimeout(() => menuContent.classList.add("hidden"), 300);
            } else {
                menuContent.style.left = "0px";
            }
        }
    }
});
});
    
function applyFilters() {
    let e = getCurrentFilters(),
        a = filterData(globalData, e),
        t = 0;
    a.forEach(e => {
        e.universitetler.forEach(e => {
            t += e.ixtisaslar.length
        })
    });
    let i = document.getElementById("resultCount"),
        l = document.getElementById("resultNumber"),
        n = JSON.stringify(e) !== JSON.stringify({
            searchValue: "",
            tehsilValue: "",
            dilValue: "",
            altValue: "",
            locationValue: "",
            minScore: 0,
            maxScore: 700
        });
    n ? (l.textContent = t, i.style.display = "inline") : i.style.display = "none";

    let r = localStorage.getItem("selectedLanguage") || "az";
    renderData(a, r);
    setupEventListeners();
    changeLanguage(r);  
}

function getCurrentFilters() {
    return {
        searchValue: document.getElementById("search").value.trim().toLowerCase(),
        tehsilValue: document.getElementById("tehsilSelect").value,
        dilValue: document.getElementById("dilSelect").value,
        altValue: document.getElementById("altSelect").value,
        locationValue: document.getElementById("locationSelect").value,
        minScore: parseInt(document.getElementById("minScore").value) || 0,
        maxScore: parseInt(document.getElementById("maxScore").value) || 700
    }
}
function filterData(data, {
    searchValue,
    tehsilValue,
    dilValue,
    altValue,
    locationValue,
    minScore,
    maxScore
}) {
    if (!data) return [];

    const selectedLang = localStorage.getItem("selectedLanguage") || "az";

    return data.map(group => {
        let filteredUniversities = group.universitetler.map(univ => {
            if (locationValue && !univ.yer.toLowerCase().includes(locationValue.toLowerCase())) return null;

            let filteredIxtisaslar = univ.ixtisaslar.filter(ixtisas => {
                // Filtrlər
                if ((tehsilValue && ixtisas.tehsil_formasi !== tehsilValue) ||
                    (dilValue && ixtisas.dil !== dilValue) ||
                    (altValue && ixtisas.alt_qrup !== altValue)) return false;

                // Bal filtiri
                let bal_pulsuz = ixtisas.bal_pulsuz !== null && ixtisas.bal_pulsuz !== undefined ? parseInt(ixtisas.bal_pulsuz) : null;
                let bal_pullu = ixtisas.bal_pullu !== null && ixtisas.bal_pullu !== undefined ? parseInt(ixtisas.bal_pullu) : null;

                let balUygun = true;
                if (minScore !== null || maxScore !== null) {
                    balUygun = false;
                
                    if (bal_pulsuz !== null) {
                        if ((minScore === null || bal_pulsuz >= minScore) && (maxScore === null || bal_pulsuz <= maxScore)) {
                            balUygun = true;
                        }
                    }
                } 
                
                let searchText = searchValue.toLowerCase();
                let adAz = ixtisas.ad.toLowerCase();
                let adEn = ixtisas.ad_en ? ixtisas.ad_en.toLowerCase() : "";

                let axtarisUygun = !searchText || (selectedLang === "en" ? adEn.includes(searchText) : adAz.includes(searchText));

                return balUygun && axtarisUygun;
            });

            if (filteredIxtisaslar.length === 0) return null;

            return { ...univ, ixtisaslar: filteredIxtisaslar };
        }).filter(Boolean);

        if (filteredUniversities.length === 0) return null;

        return { ...group, universitetler: filteredUniversities };
    }).filter(Boolean);
}


menuToggle.addEventListener("click", () => {
    menuContent.classList.toggle("hidden")
}), document.addEventListener("click", function(e) {
    let a = menuToggle.contains(e.target) || menuContent.contains(e.target);
    a || menuContent.classList.add("hidden")
}), document.addEventListener("DOMContentLoaded", () => {
    let e = document.querySelector(".filter-bar"),
        a = document.getElementById("filterToggleBtn"),
        t = a.querySelector("span"),
        i = a.querySelector("img");
    window.innerWidth <= 768 && (e.style.display = "none"), a.addEventListener("click", () => {
        let a = "block" === e.style.display;
        a ? (e.style.display = "none", t.textContent = "Filter", i.style.display = "inline") : (e.style.display = "block", t.textContent = "Close", i.style.display = "none")
    })
});
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-dark-mode");
    const toggleIcon = document.getElementById("icon");

    // Dark mode statusunu yoxla və uyğun class + icon təyin et
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleIcon.src = "sun.webp";
    } else {
        document.body.classList.remove("dark-mode");
        toggleIcon.src = "moon.webp";
    }

    // Dark mode düyməsinə klik edildikdə
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleIcon.src = "sun.webp";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleIcon.src = "moon.webp";
        }
    });

    // Məlumatları yüklə
    loadData();
});
// "Daha çox / Daha az" funksiyası
function toggleMore(btn) {
  const content = btn.previousElementSibling;
  const lang = localStorage.getItem("selectedLanguage") || "az";
  const isCollapsed = btn.getAttribute("data-state") === "collapsed";

  if (isCollapsed) {
      content.style.display = "block";
      btn.textContent = translations[lang].dahaAz || "Daha az";
      btn.setAttribute("data-state", "expanded");
  } else {
      content.style.display = "none";
      btn.textContent = translations[lang].dahaCox || "Daha çox";
      btn.setAttribute("data-state", "collapsed");
  }
}


function changeLanguage(e) {
    let a = document.querySelectorAll("[data-i18n]");
    a.forEach(a => {
        let t = a.getAttribute("data-i18n");
        translations[e][t] && (a.innerText = translations[e][t])
    });
    let t = document.querySelector("[data-i18n-placeholder]");
    if (t) {
        let i = t.getAttribute("data-i18n-placeholder");
        translations[e][i] && t.setAttribute("placeholder", translations[e][i])
    }
}
document.getElementById("language-selector").addEventListener("change", function() {
    let e = this.value;
    localStorage.setItem("selectedLanguage", e), location.reload()
}), window.addEventListener("DOMContentLoaded", () => {
    let e = localStorage.getItem("selectedLanguage") || "az";
    document.getElementById("language-selector").value = e, changeLanguage(e), renderData(filteredData || originalData)
});
const tableContainer = document.getElementById("table-container"),
    cardContainer = document.getElementById("card-container"),
    isMobile = () => window.innerWidth <= 768;

function setupTableView() {
    let e = document.createElement("table"),
        a = document.createElement("thead");
    e.appendChild(a);
    let t = document.createElement("tbody");
    e.appendChild(t), tableContainer.appendChild(e);
    let i = Math.ceil(tableContainer.clientHeight / rowHeight) + 5;

    function l(e) {
        let a = document.createElement("tr");
        return a.style.height = rowHeight + "px", a
    }

    function n(e) {
        t.innerHTML = "";
        let a = document.createDocumentFragment();
        for (let n = e; n < e + i && n < totalRows; n++) a.appendChild(l(n));
        t.appendChild(a)
    }
    n(0), tableContainer.addEventListener("scroll", function e() {
        let a = tableContainer.scrollTop,
            t = Math.floor(a / rowHeight);
        n(t)
    })
}

function setupCardView() {
    cardContainer.innerHTML = "";
    for (let e = 0; e < totalRows; e++) {
        let a = document.createElement("div");
        a.className = "card-item", cardContainer.appendChild(a)
    }
} 

function renderView() {
    isMobile() ? (tableContainer.style.display = "none", cardContainer.style.display = "block", setupCardView()) : (cardContainer.style.display = "none", tableContainer.style.display = "block", setupTableView())
}
let currentIsMobile = isMobile();
window.addEventListener("resize", () => {
    let e = isMobile();
    e !== currentIsMobile && (currentIsMobile = e, renderView())
});
function scrollToQrup(qrupId, clickedBtn) {
    // Bütün qrup bloklarını gizlət
    document.querySelectorAll(".qrup-blok").forEach(block => {
      block.classList.remove("active");
    });
  
    // Aktiv qrupu göstər
    const target = document.getElementById(qrupId);
    if (target) {
      target.classList.add("active");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    // Bütün butonlardan 'active' class-ını sil
    document.querySelectorAll(".qrup-btn").forEach(btn => {
      btn.classList.remove("active");
    });
  
    // Kliklənən butona 'active' class əlavə et
    if (clickedBtn) {
      clickedBtn.classList.add("active");
    }
  }
  
  
  window.addEventListener("DOMContentLoaded", () => {
    const firstBtn = document.querySelector(".qrup-btn");
    scrollToQrup("qrup1", firstBtn);
  });
  
  function hesablaQrup1() {
    const isMobile = window.innerWidth <= 768;
    let toplam = 0;
  
    if (isMobile) {
      const cards = document.querySelectorAll("#qrup1 .mobile-card");
      cards.forEach((card, index) => {
        let dogru = parseFloat(card.querySelector(".dogru")?.value) || 0;
        let yanlis = parseFloat(card.querySelector(".yanlis")?.value) || 0;
        let acikKod = parseFloat(card.querySelector(".acik-kod")?.value) || 0;
        let acikYazili = parseFloat(card.querySelector(".acik-yazili")?.value) || 0;
  
        // Limit yoxlamaları (eyni qaydalar)
        if (dogru + yanlis > 22) {
          if (dogru > yanlis) {
            dogru = 22 - yanlis;
            card.querySelector(".dogru").value = dogru;
          } else {
            yanlis = 22 - dogru;
            card.querySelector(".yanlis").value = yanlis;
          }
        }
  
        if (acikKod > 5) {
          acikKod = 5;
          card.querySelector(".acik-kod").value = 5;
        }
  
        if (acikYazili > 3) {
          acikYazili = 3;
          card.querySelector(".acik-yazili").value = 3;
        }
  
        if (acikKod + acikYazili > 8) {
          if (acikKod > acikYazili) {
            acikKod = 8 - acikYazili;
            card.querySelector(".acik-kod").value = acikKod;
          } else {
            acikYazili = 8 - acikKod;
            card.querySelector(".acik-yazili").value = acikYazili;
          }
        }
  
        // Bal hesablaması
        let netice = 0;
        if (index === 0 || index === 1) {
          netice = (dogru * 4.5) - (yanlis * 1.05) + (acikKod * 4.5) + (acikYazili * 9.15);
        } else if (index === 2) {
          netice = (dogru * 3.0) - (yanlis * 0.7) + (acikKod * 3.0) + (acikYazili * 6.1);
        }
  
        netice = Math.max(0, netice);
        netice = Math.round(netice * 10) / 10;
        toplam += netice;
  
        const result = card.querySelector(".netice");
        if (result) result.textContent = netice.toFixed(1) + " bal";
      });
    } else {
      const rows = document.querySelectorAll("#qrup1 .qiymetlendirme tbody tr");
      rows.forEach((row, index) => {
        let dogru = parseFloat(row.querySelector(".dogru")?.value) || 0;
        let yanlis = parseFloat(row.querySelector(".yanlis")?.value) || 0;
        let acikKod = parseFloat(row.querySelector(".acik-kod")?.value) || 0;
        let acikYazili = parseFloat(row.querySelector(".acik-yazili")?.value) || 0;
  
        // Eyni limitlər
        if (dogru + yanlis > 22) {
          if (dogru > yanlis) {
            dogru = 22 - yanlis;
            row.querySelector(".dogru").value = dogru;
          } else {
            yanlis = 22 - dogru;
            row.querySelector(".yanlis").value = yanlis;
          }
        }
  
        if (acikKod > 5) {
          acikKod = 5;
          row.querySelector(".acik-kod").value = 5;
        }
  
        if (acikYazili > 3) {
          acikYazili = 3;
          row.querySelector(".acik-yazili").value = 3;
        }
  
        if (acikKod + acikYazili > 8) {
          if (acikKod > acikYazili) {
            acikKod = 8 - acikYazili;
            row.querySelector(".acik-kod").value = acikKod;
          } else {
            acikYazili = 8 - acikKod;
            row.querySelector(".acik-yazili").value = acikYazili;
          }
        }
  
        let netice = 0;
        if (index === 0 || index === 1) {
          netice = (dogru * 4.5) - (yanlis * 1.05) + (acikKod * 4.5) + (acikYazili * 9.15);
        } else if (index === 2) {
          netice = (dogru * 3.0) - (yanlis * 0.7) + (acikKod * 3.0) + (acikYazili * 6.1);
        }
  
        netice = Math.max(0, netice);
        netice = Math.round(netice * 10) / 10;
        toplam += netice;
  
        const resultCell = row.querySelector("td:last-child p");
        if (resultCell) resultCell.textContent = netice.toFixed(1) + " bal";
      });
    }
  
    // Ümumi nəticəni göstər
    const toplamNetice = document.getElementById("umumi-netice");
    if (toplamNetice) {
      toplamNetice.textContent = toplam.toFixed(1) + " bal";
    }
  }
  
  
  const qrupFennleri = {
    qrup1: ["Riyaziyyat", "Fizika", "Kimya / Informatika"],
    qrup2: ["Riyaziyyat", "Coğrafiya", "Tarix"],
    qrup3: ["Azərbaycan dili", "Tarix", "Ədəbiyyat / Coğrafiya"],
    qrup4: ["Riyaziyyat", "Biologiya", "Kimya"],
    qrup5: ["Azərbaycan dili", "Riyaziyyat", "Xarici dil"]
  };
  
  function qrupuYenile(qrupId) {
    if (qrupId === "qrup5") return;
  
    // Bütün qrup bloklarını gizlət
    document.querySelectorAll(".qrup-blok").forEach(block => {
      block.style.display = "none";
    });
  
    // Aktiv qrup blokunu göstər
    const activeDiv = document.getElementById("qrup1");
    if (activeDiv) {
      activeDiv.style.display = "block";
    }
  
    // Buton aktivlik
    document.querySelectorAll(".qrup-btn").forEach(btn => {
      btn.classList.remove("active");
    });
    const btnById = [...document.querySelectorAll(".qrup-btn")].find(btn => btn.getAttribute('data-qrup-id') === qrupId);
    if (btnById) btnById.classList.add("active");
  
    // Başlıq
    const basliq = document.getElementById("qrup-basliq");
    if (!basliq) return;
    basliq.textContent = btnById ? btnById.textContent + " üzrə balların hesablanması" : "";
  
    // Cədvəl və ya kart konteyneri
    const tbody = document.getElementById("qiymetlendirme-body");
    if (!tbody) return;
    tbody.innerHTML = "";
  
    const fennler = qrupFennleri[qrupId] || [];
  
    const isMobile = window.innerWidth <= 768;
  
    fennler.forEach((fennAdı, index) => {
      if (isMobile) {
        // 📱 Mobil görünüş (kart stilində)
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.innerHTML = `
          <div class="mobile-card">
            <strong>${fennAdı}</strong><br><br>

            <div class="form-row">
              <label>Qapalı - Doğru sayı:</label>
              <input min="0" max="30" class="dogru" placeholder="0" oninput="hesablaQrup1()">
            </div>

            <div class="form-row">
              <label>Qapalı - Yanlış sayı:</label>
              <input min="0" max="30" class="yanlis" placeholder="0" oninput="hesablaQrup1()">
            </div>

            <div class="form-row">
              <label>Açıq - Kodlaşdırılan:</label>
              <input min="0" max="5" class="acik-kod" placeholder="0" oninput="hesablaQrup1()">
            </div>

            <div class="form-row">
              <label>Açıq - Yazılı (Ətraflı):</label>
              <input min="0" max="9" class="acik-yazili" placeholder="0" oninput="hesablaQrup1()">
            </div>

            <p class="netice">0 Bal</p>
          </div>
        `;

        row.appendChild(cell);
        tbody.appendChild(row);
      } else {
        // 💻 Desktop görünüş (cədvəl)
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${fennAdı}</td>
          <td><input min="0" max="30" class="dogru" placeholder="0" oninput="hesablaQrup1()"/></td>
          <td><input min="0" max="30" class="yanlis" placeholder="0" oninput="hesablaQrup1()"/></td>
          <td><input min="0" max="5" class="acik-kod" placeholder="0" oninput="hesablaQrup1()"/></td>
          <td><input min="0" max="9" class="acik-yazili" placeholder="0" oninput="hesablaQrup1()"/></td>
          <td><p class="netice">0 Bal</p></td>
        `;
        tbody.appendChild(row);
      }
    });
  
    // Ümumi nəticə
    const umumiRow = document.createElement("tr");
    umumiRow.className = "umumi-netice-row";
    umumiRow.innerHTML = `
      <td colspan="${isMobile ? 1 : 5}" style="text-align: right;"><strong>Ümumi nəticə:</strong></td>
      <td><p id="umumi-netice">0 bal</p></td>
    `;
    tbody.appendChild(umumiRow);
  }
  
  
  function qrupuYenileBuraxilis() {
    // Bütün qrup bloklarını gizlət
    document.querySelectorAll(".qrup-blok").forEach(block => {
      block.style.display = "none";
    });
  
    // Buraxılış blokunu göstər
    const buraxilisDiv = document.getElementById("buraxilis");
    if (buraxilisDiv) {
      buraxilisDiv.style.display = "block";
    }
  
    // Bütün butonlardan 'active' class-ını sil
    document.querySelectorAll(".qrup-btn").forEach(btn => {
      btn.classList.remove("active");
    });
  
    // Aktiv butona class əlavə et
    const clickedBtn = [...document.querySelectorAll(".qrup-btn")]
      .find(btn => btn.getAttribute("data-qrup-id") === "qrup5");
    if (clickedBtn) clickedBtn.classList.add("active");
  
    // Cədvəli doldur
    const tbody = document.getElementById("buraxilis-body");
    tbody.innerHTML = "";
  
    const isMobile = window.innerWidth <= 768;
  
    const fennler = [
      { ad: "Azərbaycan dili", hasKod: false, kodBal: 0, yaziliBal: 5, qapaliBal: 2.5 },
      { ad: "Riyaziyyat", hasKod: true, kodBal: 3.1, yaziliBal: 6.3, qapaliBal: 3.1 },
      { ad: "Xarici dil", hasKod: false, kodBal: 0, yaziliBal: 5.4, qapaliBal: 2.7 }
    ];
  
    fennler.forEach((fenn, index) => {
      if (isMobile) {
        // 📱 Mobil görünüş (kart)
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.innerHTML = `
          <div class="mobile-card">
            <strong>${fenn.ad}</strong><br><br>

            <div class="form-row">
              <label>Qapalı - Doğru sayı:</label>
              <input min="0" max="30" class="qapali" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()">
            </div>

            ${fenn.hasKod ? `
            <div class="form-row">
              <label>Açıq - Kodlaşdırılan:</label>
              <input min="0" max="5" class="kod" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()">
            </div>
            ` : ''}

            <div class="form-row">
              <label>Açıq - Yazılı (Ətraflı):</label>
              <input min="0" max="5" class="yazili" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()">
            </div>

            <p class="netice-hucresi">0 bal</p>
          </div>
        `;

        row.appendChild(cell);
        tbody.appendChild(row);
      } else {
        // 💻 Desktop görünüş (cədvəl)
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${fenn.ad}</td>
          <td><input min="0" max="30" class="qapali" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()"/></td>
          ${fenn.hasKod ? `<td><input min="0" max="5" class="kod" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()"/></td>` : `<td>-</td>`}
          <td><input min="0" max="5" class="yazili" placeholder="0" data-index="${index}" oninput="hesablaBuraxilis()"/></td>
          <td><p class="netice-hucresi">0 bal</p></td>
        `;
        tbody.appendChild(row);
      }
    });
  
    // Ümumi nəticə satırı
    const umumiRow = document.createElement("tr");
    umumiRow.className = "umumi-netice-row";
    umumiRow.innerHTML = `
      <td colspan="${isMobile ? 1 : 4}" style="text-align: right;"><strong>Ümumi nəticə:</strong></td>
      <td><p id="umumi-netice-buraxilis">0 bal</p></td>
    `;
    tbody.appendChild(umumiRow);
  }
  
  function hesablaBuraxilis() {
    const isMobile = window.innerWidth <= 768;
    let toplam = 0;
  
    if (isMobile) {
      const cards = document.querySelectorAll("#buraxilis .mobile-card");
      cards.forEach((card, index) => {
        const fennAdı = card.querySelector("strong")?.textContent?.trim();
        const qapaliInput = card.querySelector(".qapali");
        const yaziliInput = card.querySelector(".yazili");
        const kodInput = card.querySelector(".kod");
  
        let qapali = parseFloat(qapaliInput?.value) || 0;
        let yazili = parseFloat(yaziliInput?.value) || 0;
        let kod = parseFloat(kodInput?.value) || 0;
  
        let bal = 0;
  
        if (fennAdı === "Azərbaycan dili") {
          bal = qapali * 2.5 + yazili * 5;
        } else if (fennAdı === "Riyaziyyat") {
          bal = qapali * 3.1 + kod * 3.1 + yazili * 6.3;
        } else if (fennAdı === "Xarici dil") {
          bal = qapali * 2.7 + yazili * 5.4;
        }
  
        bal = Math.round(bal * 10) / 10;
        toplam += bal;
  
        const resultP = card.querySelector(".netice-hucresi");
        if (resultP) resultP.textContent = bal.toFixed(1) + " bal";
      });
    } else {
      const rows = document.querySelectorAll("#buraxilis-body tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return;
  
        const fənnAdı = cells[0].textContent.trim();
        const qapaliInput = row.querySelector(".qapali");
        const yaziliInput = row.querySelector(".yazili");
        const kodInput = row.querySelector(".kod");
  
        let qapali = parseFloat(qapaliInput?.value) || 0;
        let yazili = parseFloat(yaziliInput?.value) || 0;
        let kod = parseFloat(kodInput?.value) || 0;
  
        let bal = 0;
  
        if (fənnAdı === "Azərbaycan dili") {
          bal = qapali * 2.5 + yazili * 5;
        } else if (fənnAdı === "Riyaziyyat") {
          bal = qapali * 3.1 + kod * 3.1 + yazili * 6.3;
        } else if (fənnAdı === "Xarici dil") {
          bal = qapali * 2.7 + yazili * 5.4;
        }
  
        bal = Math.round(bal * 10) / 10;
        toplam += bal;
  
        const resultCell = row.querySelector(".netice-hucresi");
        if (resultCell) resultCell.textContent = bal.toFixed(1) + " bal";
      });
    }
  
    const neticeP = document.getElementById("umumi-netice-buraxilis");
    if (neticeP) neticeP.textContent = toplam.toFixed(1) + " bal";
  }
  
  function qrupSec(qrupId, clickedBtn) {
    // Bütün blokları gizlət
    document.querySelectorAll(".qrup-blok").forEach(block => {
      block.style.display = "none";
    });
  
    // Bütün butonlardan aktiv class-ı sil
    document.querySelectorAll(".qrup-btn").forEach(btn => {
      btn.classList.remove("active");
    });
  
    // Aktiv qrupu göstər
    const target = document.getElementById(qrupId);
    if (target) {
      target.style.display = "block";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    // Aktiv butonu vurğula
    if (clickedBtn) {
      clickedBtn.classList.add("active");
    }
  
    // Əgər buraxılışdırsa fərqli funksiyanı çağır
    if (qrupId === "qrup5") {
      qrupuYenileBuraxilis(qrupId);
    } else {
      qrupuYenile(qrupId);
    }
  }
  window.addEventListener("DOMContentLoaded", () => {
    const firstBtn = document.querySelectorAll(".qrup-btn")[0];
    qrupSec('qrup1', firstBtn);
  });
  
// Specializations ------------------------------------------------------------------------------------------------------------------

function renderDataSpec(data, lang = "az") {
  const container = document.getElementById("specializations-body"); // dəyişdi
  if (!container) return;

  const language = localStorage.getItem("selectedLanguage") || lang;

  container.innerHTML = "";

  const listWrapper = document.createElement("div");
  listWrapper.className = "specialization-list";

  data.forEach(item => {
    const title = document.createElement("div");
    title.className = "specialization-title";
    title.style.cursor = "pointer";
    title.style.marginTop = "15px";
    title.style.fontWeight = "bold";

    const description = document.createElement("div");
    description.className = "specialization-description";
    description.style.display = "none";
    description.style.marginBottom = "10px";

    if (language === "az") {
      title.textContent = item.key;
      description.textContent = item.az;
    } else {
      title.textContent = item.k_en;
      description.textContent = item.en;
    }

    title.addEventListener("click", () => {
      const isVisible = description.style.display === "block";
      description.style.display = isVisible ? "none" : "block";
    });

    listWrapper.appendChild(title);
    listWrapper.appendChild(description);
  });

  container.appendChild(listWrapper);
}

function loadSpecializations() {
  fetch("qruplar_info.json")
      .then(response => {
          if (!response.ok) {
              throw new Error("JSON faylı yüklənə bilmədi");
          }
          return response.json();
      })
      .then(data => {
          globalData = data;
          const lang = localStorage.getItem("selectedLanguage") || "az";
          renderDataSpec(globalData, lang);
      })
      .catch(error => {
          console.error("Xəta baş verdi:", error);
      });
}

document.addEventListener("DOMContentLoaded", () => {
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "az";
  document.getElementById("language-selector").value = selectedLanguage;
  changeLanguage(selectedLanguage);
  loadSpecializations();
});


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "az";
  document.getElementById("language-selector").value = selectedLanguage;

  changeLanguage(selectedLanguage);
  loadSpecializations();

  searchBtn.addEventListener("click", handleSearch);
  const isMobile = () => window.innerWidth <= 768;
  if (!isMobile()) {
      searchInput.addEventListener("input", handleSearch);
  }

  searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          handleSearch();
      }
  });
});
function loadAllData() {
  const groupNumbers = [1, 2, 3, 4]; // Load all groups
  const promises = groupNumbers.map(groupNumber => fetch(`qrup${groupNumber}.json`).then(response => {
      if (!response.ok) throw Error(`Failed to fetch qrup${groupNumber}.json: ${response.statusText}`);
      return response.json();
  }));

  Promise.all(promises)
      .then(dataArray => {
          const combinedData = dataArray.flat(); // Combine data from all groups
          renderDataSpec(combinedData, localStorage.getItem("selectedLanguage") || "az");
      })
      .catch(e => {
          console.error("Error loading data:", e);
      });
}


loadAllData();
function handleSearch() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const lang = localStorage.getItem("selectedLanguage") || "az";

  if (!query) {
      renderDataSpec(globalData, lang); // Show all if input is empty
      return;
  }

  const filteredData = globalData.filter(item => {
      if (lang === "en") {
          return item.k_en.toLowerCase().includes(query);
      } else {
          return item.key.toLowerCase().includes(query);
      }
  });

  renderDataSpec(filteredData, lang);
}

