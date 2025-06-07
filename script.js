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
    let e = localStorage.getItem("selectedLanguage") || "en",
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

function renderData(e, a) {
    let t = document.getElementById("table-container"),
        i = document.getElementById("card-container"),
        l = translations[a] || {},
        n = window.innerWidth <= 768;
    if (t.innerHTML = "", i.innerHTML = "", n) {
        let r = "";
        e.forEach(e => {
            e.universitetler.forEach(e => {
                r += `<div class="uni-basliq">${e.universitet}</div>`, e.ixtisaslar.forEach(e => {
                    r += `
            <div class="card">
              <div class="field" id="ixtisasad"><strong>${l.ixtisas||"Ixtisas"}:</strong> ${e.ad}</div>
              <div class="field"><strong>${l.dil||"Dil"}:</strong> ${e.dil}</div>
              <div class="field"><strong>${l.balOdenissiz||"Bal (\xd6dənişsiz)"}:</strong> ${e.bal_pulsuz??"—"}</div>
              <div class="extra-info" style="display: none;">
                <div class="field"><strong>${l.balOdenisli||"Bal (\xd6dənişli)"}:</strong> ${e.bal_pullu??"—"}</div>
                <div class="field"><strong>${l.tehsilFormasi||"Təhsil forması"}:</strong> ${e.tehsil_formasi}</div>
                <div class="field"><strong>${l.altQrup||"Alt qrup"}:</strong> ${e.alt_qrup}</div>
              </div>
              <a href="#" class="toggle-more" onclick="toggleMore(this); return false;">${l.dahaCox||"Daha \xe7ox"}</a>
            </div>`
                })
            })
        }), i.innerHTML = r, t.style.display = "none", i.style.display = "block"
    } else {
        let s = "";
        e.forEach(e => {
            e.universitetler.forEach(e => {
                s += `<div class="uni-basliq">${e.universitet}</div>`, s += `
          <table>
            <thead>
              <tr>
                <th>${l.ixtisas||"Ixtisas"}</th>
                <th>${l.tehsilFormasi||"Təhsil forması"}</th>
                <th>${l.dil||"Dil"}</th>
                <th>${l.altQrup||"Alt qrup"}</th>
                <th>${l.balOdenissiz||"Bal (\xd6dənişsiz)"}</th>
                <th>${l.balOdenisli||"Bal (\xd6dənişli)"}</th>
              </tr>
            </thead>
            <tbody>`, e.ixtisaslar.forEach((e, a) => {
                    s += `
            <tr class="${a%2==0?"even-row":""}">
              <td>${e.ad}</td>
              <td>${e.tehsil_formasi}</td>
              <td>${e.dil}</td>
              <td>${e.alt_qrup}</td>
              <td>${e.bal_pulsuz??"—"}</td>
              <td>${e.bal_pullu??"—"}</td>
            </tr>`
                }), s += "</tbody></table>"
            })
        }), t.innerHTML = s, i.style.display = "none", t.style.display = "block"
    }
}
document.addEventListener('DOMContentLoaded', () => {
const menuToggle = document.getElementById("menu-toggle");
const menuContent = document.getElementById("menu-bar");

console.log("menuToggle:", menuToggle);  
console.log("menuContent:", menuContent); 

const maxWidth = menuContent.offsetWidth || 150;

// Düymə klik event
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

// touchmove çıxarıldı və ya boş buraxıldı (artıq burada menyu tərpənmir)
document.addEventListener("touchmove", (e) => {
    // heç bir hərəkət etmə
});

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
            search: "",
            uni: "",
            qrup: "",
            type: ""
        });
    n ? (l.textContent = t, i.style.display = "inline") : i.style.display = "none";
    let r = localStorage.getItem("selectedLanguage") || "en";
    renderData(a, r), setupEventListeners(), changeLanguage(r)
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
function filterData(e, {
    searchValue: a,
    tehsilValue: t,
    dilValue: i,
    altValue: l,
    locationValue: n,
    minScore: r,
    maxScore: s
}) {
    if (!e) return [];

    let o = e.map(e => {
        let o = e.universitetler.map(e => {
            // Yer filtri
            let o = !n || e.yer.toLowerCase().includes(n.toLowerCase());
            if (!o) return null;

            let d = e.ixtisaslar.filter(e => {
                // Digər filtrlər
                if ((t && e.tehsil_formasi !== t) ||
                    (i && e.dil !== i) ||
                    (l && e.alt_qrup !== l)) return false;

                // Bal filtiri
                let bal_pulsuz = e.bal_pulsuz !== null && e.bal_pulsuz !== undefined ? parseInt(e.bal_pulsuz) : null;
                let bal_pullu = e.bal_pullu !== null && e.bal_pullu !== undefined ? parseInt(e.bal_pullu) : null;

                let balUygun = true;
                if (r !== null || s !== null) {
                    balUygun = false;

                    if (bal_pulsuz !== null) {
                        if ((r === null || bal_pulsuz >= r) && (s === null || bal_pulsuz <= s)) {
                            balUygun = true;
                        }
                    }

                    if (!balUygun && bal_pullu !== null) {
                        if ((r === null || bal_pullu >= r) && (s === null || bal_pullu <= s)) {
                            balUygun = true;
                        }
                    }
                }

                // Axtarış sözü
                let axtarisUygun = !a || e.ad.toLowerCase().includes(a.toLowerCase());

                return balUygun && axtarisUygun;
            });

            return d.length === 0 ? null : { ...e, ixtisaslar: d };
        }).filter(Boolean);

        return o.length === 0 ? null : { ...e, universitetler: o };
    }).filter(e => e !== null);

    return o;
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
const toggleBtn = document.getElementById("toggle-dark-mode"),
    toggleIcon = document.getElementById("icon");

function toggleMore(e) {
    let a = e.previousElementSibling;
    "none" === a.style.display ? (a.style.display = "block", e.textContent = "az" === localStorage.getItem("selectedLanguage") ? "Daha az" : "Less") : (a.style.display = "none", e.textContent = "az" === localStorage.getItem("selectedLanguage") ? "Daha \xe7ox" : "More")
}
"enabled" === localStorage.getItem("darkMode") ? (document.body.classList.add("dark-mode"), toggleIcon.src = "moon.png") : (document.body.classList.remove("dark-mode"), toggleIcon.src = "sun.png"), toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode"), document.body.classList.contains("dark-mode") ? (localStorage.setItem("darkMode", "enabled"), toggleIcon.src = "sun.png") : (localStorage.setItem("darkMode", "disabled"), toggleIcon.src = "moon.png")
}), document.addEventListener("DOMContentLoaded", () => {
    loadData()
});


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
    let e = localStorage.getItem("selectedLanguage") || "en";
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
