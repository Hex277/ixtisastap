const groupMatch = window.location.pathname.match(/(\d)ciqrup\.html$/),
    groupNumber = groupMatch ? groupMatch[1] : "1";
let globalData = [];
const groupNames = {
    1: "1-ci Qrup",
    2: "2-ci Qrup",
    3: "3-c\xfc Qrup",
    4: "4-c\xfc Qrup",
    5: "5-ci Qrup"
};

document.addEventListener("DOMContentLoaded", () => {
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "az";
    document.getElementById("language-selector").value = selectedLanguage;
    changeLanguage(selectedLanguage);

    loadSpecializations(); // JSON-dan məlumatları yüklə və render et
});
function renderData(data, lang = "az") {
    const container = document.querySelector("body");
    const language = localStorage.getItem("selectedLanguage") || lang;

    // Əvvəlki elementləri təmizləyək
    const existing = document.getElementById("specialization-list");
    if (existing) existing.remove();

    const listWrapper = document.createElement("div");
    listWrapper.id = "specialization-list";

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
            renderData(globalData, lang);
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

function loadAllData() {
    const groupNumbers = [1, 2, 3, 4]; // Load all groups
    const promises = groupNumbers.map(groupNumber => fetch(`qrup${groupNumber}.json`).then(response => {
        if (!response.ok) throw Error(`Failed to fetch qrup${groupNumber}.json: ${response.statusText}`);
        return response.json();
    }));

    Promise.all(promises)
        .then(dataArray => {
            const combinedData = dataArray.flat(); // Combine data from all groups
            renderData(combinedData, localStorage.getItem("selectedLanguage") || "en");
        })
        .catch(e => {
            console.error("Error loading data:", e);
        });
}


loadAllData();
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
const cardContainer = document.getElementById("card-container"),
    isMobile = () => window.innerWidth <= 768;


function renderView() {
    isMobile() ? (cardContainer.style.display = "block", setupCardView()) : (cardContainer.style.display = "block", setupCardView())
}
window.addEventListener("resize", () => {
    let e = isMobile();
    e !== currentIsMobile && (currentIsMobile = e, renderView())
});

function handleSearch() {
    const query = document.getElementById("search").value.trim().toLowerCase();
    const lang = localStorage.getItem("selectedLanguage") || "az";

    if (!query) {
        renderData(globalData, lang); // Show all if input is empty
        return;
    }

    const filteredData = globalData.filter(item => {
        if (lang === "en") {
            return item.k_en.toLowerCase().includes(query);
        } else {
            return item.key.toLowerCase().includes(query);
        }
    });

    renderData(filteredData, lang);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "az";
    document.getElementById("language-selector").value = selectedLanguage;

    changeLanguage(selectedLanguage);
    loadSpecializations();

    // Only on button click for mobile and desktop
    searchBtn.addEventListener("click", handleSearch);

    // Only live search on desktop
    const isMobile = () => window.innerWidth <= 768;
    if (!isMobile()) {
        searchInput.addEventListener("input", handleSearch);
    }

    // Allow Enter key on both mobile and desktop
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });
});

