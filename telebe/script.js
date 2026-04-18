// ---------------------- GLOBAL SCRIPTS ----------------------
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Mövcud Menyu Kodunuz
    const telebeMenu = document.getElementById('telebe-menu');
    if (telebeMenu && telebeMenu.previousElementSibling) {
        telebeMenu.classList.add('open');
        telebeMenu.previousElementSibling.querySelector('.arrow').textContent = 'v';
    }

    // ==========================================
    // 2. QLOBAL PREMİUM YOXLANIŞI (Gecikməsiz & Ağıllı Yenilənmə)
    // ==========================================
    
    // UI-ı dəyişən və ya geri qaytaran (Sıfırlayan) funksiya
    function setPremiumUI(isActive) {
        const premiumHref = document.getElementById('premium-href');
        const profileImg = document.querySelector('.profile-bg img');

        if (isActive) {
            // Premium aktivdir
            document.body.classList.add('premium-aktiv');
            if (premiumHref) premiumHref.style.display = 'none';
            if (profileImg) profileImg.src = '../images/premium-profile.webp';
        } else {
            // Premium DEYİL (və ya vaxtı bitib) - Hər şeyi standart vəziyyətə qaytarırıq
            document.body.classList.remove('premium-aktiv');
            if (premiumHref) premiumHref.style.display = ''; // CSS-dəki original display dəyərinə qayıdır
            if (profileImg) profileImg.src = '../images/profile.webp';
        }
    }

    if (window.supabase) {
        const supabaseUrl = 'https://xoebhhdirsvjorjlrfzi.supabase.co';
        const supabaseKey = 'sb_publishable_FpT1VBCd5NKEnrYQbmx9Gw_MqWxVMvN';

        // Supabase Tək İnstance Yoxlanışı
        if (!window.globalSupabaseClient) {
            window.globalSupabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        }
        const supabaseGlobal = window.globalSupabaseClient;

        // --- ADDIM 1: SIFIR GECİKMƏ İLƏ LOCALSTORAGE YOXLANIŞI ---
        let userId = null;
        try {
            // Supabase-in öz qlobal tokenindən (gecikmə olmadan) User ID-ni çəkirik
            const sbSession = localStorage.getItem('sb-xoebhhdirsvjorjlrfzi-auth-token');
            if (sbSession) {
                userId = JSON.parse(sbSession).user.id;
            }
        } catch (e) {}

        const indi = new Date().getTime();

        if (userId) {
            // Hər istifadəçinin ÖZÜNƏ məxsus premium yaddaşını yoxlayırıq
            const cachedBitis = localStorage.getItem('premiumBitis_' + userId);
            
            if (cachedBitis && indi < parseInt(cachedBitis)) {
                setPremiumUI(true); // Gözləmədən anında Premium rəngləri ver
            } else {
                setPremiumUI(false); // Keş yoxdursa və ya bitibsə standart UI göstər
            }
        }

        // --- ADDIM 2: ARXA FONDA DƏQİQ BAZA YOXLANIŞI ---
        supabaseGlobal.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                const currentUserId = session.user.id;
                const { data: abuneData } = await supabaseGlobal
                    .from('abunelikler')
                    .select('bitis_tarixi')
                    .eq('user_id', currentUserId)
                    .maybeSingle();

                if (abuneData) {
                    const bitis = new Date(abuneData.bitis_tarixi).getTime();
                    const rightNow = new Date().getTime();

                    if (rightNow < bitis) {
                        // Baza təsdiqlədi: Hələ də premiumdur. Yaddaşı yeniləyirik.
                        localStorage.setItem('premiumBitis_' + currentUserId, bitis);
                        setPremiumUI(true);
                    } else {
                        // Baza dedi ki: Vaxtı BİTİB! Yaddaşı sil və UI-ı geri al.
                        localStorage.removeItem('premiumBitis_' + currentUserId);
                        setPremiumUI(false);
                    }
                } else {
                    // Cədvəldə bu istifadəçiyə aid heç nə yoxdur (Pulsuzdur). Yaddaşı sil və UI-ı geri al.
                    localStorage.removeItem('premiumBitis_' + currentUserId);
                    setPremiumUI(false);
                }
            }
        });
    } else {
        console.warn("Diqqət: Bu səhifədə Supabase yüklənməyib.");
    }
});
function showMessage(message, type = "alert", customConfirm = "Təsdiqlə", customCancel = "Ləğv et") {
    return new Promise((resolve) => {
        const overlay = document.getElementById("messageOverlay");
        const messageText = document.getElementById("messageText");
        const okBtn = document.getElementById("okBtn");
        const confirmBtn = document.getElementById("confirmBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        if (!overlay) return resolve(false);

        // Mesajı qutuya yazırıq və ekranı açırıq
        messageText.innerHTML = message;
        overlay.style.display = "flex"; 

        // Əgər növ "confirm" (Sual) idisə:
        if (type === "confirm") {
            okBtn.style.display = "none";
            confirmBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";

            // YENİLİK: Düymə yazıları kənardan gələn adlarla dəyişdirilir
            confirmBtn.textContent = customConfirm;
            cancelBtn.textContent = customCancel;

            // "İndi al" və ya əsas təsdiq düyməsinə basıldıqda
            confirmBtn.onclick = () => {
                overlay.style.display = "none";
                resolve(true); 
            };

            // "Sonra" və ya ləğv düyməsinə basıldıqda
            cancelBtn.onclick = () => {
                overlay.style.display = "none";
                resolve(false); 
            };
        } 
        // Əgər növ "alert" (Sadəcə bildiriş) idisə:
        else {
            okBtn.style.display = "inline-block";
            confirmBtn.style.display = "none";
            cancelBtn.style.display = "none";

            // Tək düyməli mesajlar üçün mətni dəyişə bilərik
            okBtn.textContent = customConfirm !== "Təsdiqlə" ? customConfirm : "OK";

            okBtn.onclick = () => {
                overlay.style.display = "none";
                resolve(true);
            };
        }
    });
}
function openActionModal(contentHTML) {
    const overlay = document.getElementById("actionOverlay");
    const modalContent = document.getElementById("actionModalContent");
    
    if (overlay && modalContent) {
        modalContent.innerHTML = contentHTML;
        overlay.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}
function closeActionModal() {
    const overlay = document.getElementById("actionOverlay");
    const modalContent = document.getElementById("actionModalContent");
    
    if (overlay) {
        // Modalı gizlədirik
        overlay.style.display = "none";
        // Səhifənin sürüşməsini (scroll) geri qaytarırıq
        document.body.style.overflow = ""; 
    }
    
    if (modalContent) {
        // Növbəti dəfə açılanda köhnə elementlər görünməsin deyə içini təmizləyirik
        modalContent.innerHTML = ""; 
    }
}

// ---------------------- FENNLER MENU ----------------------
if (window.location.pathname.endsWith("fennler-menu.html")) {
    const container = document.getElementById("subjects-bg");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    let allSubjects = []; // Bütün fənnləri burada saxlayacağıq
    
    // JSON-dan fənnləri çəkirik
    fetch("subjects.json")
        .then(response => response.json())
        .then(subjects => {
            allSubjects = subjects; // Məlumatı qlobal dəyişənə yükləyirik
            renderSubjects(allSubjects); // İlk açılışda hamısını göstər
        })
        .catch(error => console.log("JSON FAILED", error));

    // Ekrana yazdırma funksiyası
    function renderSubjects(data) {
        if (data.length === 0) {
            container.innerHTML = `<p style="width:100%; text-align:center; color:#666;">Heç bir nəticə tapılmadı.</p>`;
            return;
        }
        
        container.innerHTML = data.map(subject => `
            <div class="subject-card" onclick="startQuiz('${subject.id}')">
                <div class="card-icon">${subject.icon}</div>
                <div class="card-title">${subject.title}</div>
                <div class="card-meta">${subject.count} sual • Hər gün yenilənir</div>
                <div class="card-arrow">→</div>
            </div>
        `).join("");
    }

    // Axtarış funksiyası (Real vaxt rejimi)
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredSubjects = allSubjects.filter(subject => 
            subject.title.toLowerCase().includes(searchTerm)
        );

        renderSubjects(filteredSubjects);
    });

    // "Axtar" düyməsi üçün də (əlavə olaraq)
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredSubjects = allSubjects.filter(subject => 
            subject.title.toLowerCase().includes(searchTerm)
        );
        renderSubjects(filteredSubjects);
    });

    window.startQuiz = function(subjectId) {
        window.location.href = `quiz.html?subject=${subjectId}`;
    };
}
// ---------------------- STATISTICS PAGE ----------------------
if (window.location.pathname.endsWith("statistics.html")) {
    
    let myChart = null;

    // Kliyenti hər dəfə təhlükəsiz şəkildə götürmək üçün köməkçi funksiya
    const getSupabase = () => window.globalSupabaseClient || window.supabaseClient;

    async function loadUserDashboard(userId) {
        const client = getSupabase();
        if (!client) return;

        const { data, error } = await client
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error || !data) return;

        document.getElementById('totalQuizzes').innerText = data.quizzes_completed || 0;
        document.getElementById('eloValue').innerText = data.elo_rating || 1000;
        document.getElementById('userStreak').innerText = `${data.current_streak || 0} Gün`;

        const total = data.total_answered_questions || 0;
        const correct = data.total_correct_answers || 0;
        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
        document.getElementById('accuracyRate').innerText = `${percent}%`;

        const minutes = Math.floor((data.total_time_spent || 0) / 60);
        const seconds = (data.total_time_spent || 0) % 60;
        document.getElementById('avgTime').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    async function loadActivityChart(userId) {
        const client = getSupabase();
        if (!client) return;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await client
            .from('quiz_history')
            .select('quiz_date, quiz_count')
            .eq('user_id', userId)
            .gte('quiz_date', sevenDaysAgo.toISOString().split('T')[0])
            .order('quiz_date', { ascending: true });

        if (error || !data) return;

        const labels = data.map(item => item.quiz_date);
        const counts = data.map(item => item.quiz_count);
        renderChart(labels, counts); 
    }

    async function loadLeaderboard(currentUserId) {
        const client = getSupabase();
        if (!client) return;

        const { data, error } = await client
            .from('user_stats')
            .select('*')
            .order('elo_rating', { ascending: false })
            .limit(10);

        if (error || !data) return;

        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;
        tbody.innerHTML = ''; 

        data.forEach((row, index) => {
            const accuracy = row.total_answered_questions > 0 
                ? Math.round((row.total_correct_answers / row.total_answered_questions) * 100) 
                : 0;

            const isMe = row.user_id === currentUserId;

            tbody.innerHTML += `
                <tr class="${isMe ? 'current-user' : ''}" style="${isMe ? 'background: rgba(30, 144, 255, 0.1);' : ''}">
                    <td>${index + 1}</td>
                    <td>${isMe ? 'Sən (Siz)' : 'İstifadəçi #' + row.user_id.slice(0,5)}</td> 
                    <td>${row.elo_rating || 1000}</td>
                    <td>${accuracy}%</td>
                </tr>
            `;
        });
    }

    function renderChart(labels, counts) {
        const canvas = document.getElementById('weeklyActivityChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quiz Sayı',
                    data: counts,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#fff' } },
                    x: { ticks: { color: '#fff' } }
                }
            }
        });
    }

    // ƏSAS İŞƏSALMA
    document.addEventListener("DOMContentLoaded", async () => {
        // Bir az gözləyirik ki, qlobal kliyent tam yaransın
        setTimeout(async () => {
            const client = getSupabase();
            if (!client) {
                console.error("Supabase tapılmadı!");
                return;
            }

            const { data: { user } } = await client.auth.getUser();
            if (!user) {
                window.location.href = "login.html";
                return;
            }   

            const currentUserId = user.id;
            loadUserDashboard(currentUserId);
            loadActivityChart(currentUserId);
            loadLeaderboard(currentUserId);
        }, 100); // 100ms gözləmə "undefined" xətalarını həll edir
    });
}
// ---------------------- QUIZ PAGE ----------------------
if (window.location.pathname.endsWith("quiz.html")) {
    const supabaseUrl = 'https://xoebhhdirsvjorjlrfzi.supabase.co';
    const supabaseKey = 'sb_publishable_FpT1VBCd5NKEnrYQbmx9Gw_MqWxVMvN';
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    document.addEventListener("DOMContentLoaded", async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const subjectId = urlParams.get('subject');
        const currentSubjectId = urlParams.get('subject') || 'default'; 
        if (!subjectId) {
            console.error("No subject provided!");
            return;
        }

        // ==========================================
        // 1. AUTH VƏ GÜNDƏLİK LİMİT YOXLANIŞI
        // ==========================================

        // Sürətli olması üçün istifadəçi ID-sini birbaşa token-dən çəkirik
        const sbSessionStr = localStorage.getItem('sb-xoebhhdirsvjorjlrfzi-auth-token');
        if (!sbSessionStr) {
            const authHTML = `
                <div style="text-align: center;">
                    <h3 style="color: #1e90ff;">Giriş lazımdır</h3>
                    <p>Sual işləmək üçün zəhmət olmasa hesabınıza daxil olun.</p>
                </div>
            `;
            
            showMessage(authHTML, "alert", "Daxil ol").then(() => {
                window.location.href = "login.html";
            });
            
            return;
        }

        const userId = JSON.parse(sbSessionStr).user.id;

        // Premium yoxlanışı
        const cachedBitis = localStorage.getItem('premiumBitis_' + userId);
        const isPremium = cachedBitis && new Date().getTime() < parseInt(cachedBitis);

        // Limit vəziyyətini yoxlayırıq (Lakin hələ artırmırıq!)
        if (!isPremium) {
            const today = new Date().toISOString().split('T')[0];
            
            let { data: stats } = await supabaseClient
                .from('user_stats')
                .select('daily_limit_count, last_quiz_date')
                .eq('user_id', userId)
                .maybeSingle();

            // Əgər həmin gün limit dolubsa, içəri buraxma
            if (stats && stats.last_quiz_date === today && stats.daily_limit_count >= 3) {
                const limitHTML = `
                    <div style="text-align: center;">
                        <img src="../images/freeplanreminder.webp" alt="Limit" style="width: 200px; margin-bottom: 15px;">
                        <h3 style="margin-bottom: 10px; color: #1e90ff;">Gündəlik limit doldu!</h3>
                        <p style="font-size: 15px; opacity: 0.9;">
                            Pulsuz hesabla gündə yalnız <b>3 fənn</b> (30 sual) işləyə bilərsiniz.
                        </p>
                    </div>
                `;
                
                const userChoice = await showMessage(limitHTML, "confirm", "İndi al", "Sonra"); 
                window.location.href = userChoice ? "premium.html" : "fennler-menu.html";
                return; 
            }
        }
        // ==========================================
        // 2. QUIZ MƏNTİQİ (Sizin köhnə kodunuz)
        // ==========================================
        // LocalStorage-dan cari fənnin səhvlərini gətirən köməkçi funksiya
        function getWrongQuestions(subjectId) {
            let wrongData = JSON.parse(localStorage.getItem("wrong_questions")) || {};
            return wrongData[subjectId] || [];
        }

        // Səhv cavab verəndə ID-ni əlavə edən funksiya
        function addWrongQuestion(subjectId, questionId) {
            let wrongData = JSON.parse(localStorage.getItem("wrong_questions")) || {};
            
            // Əgər bu fənn üçün hələ array yoxdursa, yarat
            if (!wrongData[subjectId]) {
                wrongData[subjectId] = [];
            }
            
            // Əgər bu ID artıq siyahıda yoxdursa, əlavə et
            if (!wrongData[subjectId].includes(questionId)) {
                wrongData[subjectId].push(questionId);
                localStorage.setItem("wrong_questions", JSON.stringify(wrongData));
            }
        }

        // Düzgün cavab verəndə ID-ni siyahıdan silən funksiya
        function removeWrongQuestion(subjectId, questionId) {
            let wrongData = JSON.parse(localStorage.getItem("wrong_questions")) || {};
            
            if (wrongData[subjectId]) {
                // ID-ni tap və array-dən çıxar
                wrongData[subjectId] = wrongData[subjectId].filter(id => id !== questionId);
                localStorage.setItem("wrong_questions", JSON.stringify(wrongData));
            }
        }
        // Başlıq üçün fetch
        fetch("subjects.json")
            .then(res => res.json())
            .then(subjects => {
                const subject = subjects.find(s => s.id === subjectId);
                if (subject) {
                    document.querySelector(".fenn-id h1").textContent = subject.title;
                }
            })
            .catch(err => console.error("Subject fetch error:", err));

        // Suallar üçün fetch
        fetch(`suallar/${subjectId}.json`)
            .then(res => res.json())
            .then(data => {
                const allQuestions = data.questions;
                // BURADA SUAL SAYINI 10 EDİRİK!
                const questions = shuffleArray(allQuestions).slice(0, 10); 
                
                let currentIndex = 0;
                let score = 0;
                let timerInterval;
                let secondsElapsed = 0;
                let userAnswers = {}; 

                const questionEl = document.getElementById("question-text");
                const optionsContainer = document.getElementById("options-container");
                const counterEl = document.getElementById("question-counter");
                const progressEl = document.getElementById("progress-fill");
                const prevBtn = document.getElementById("evvelki-btn");
                const nextBtn = document.getElementById("novbeti-btn");

                if (prevBtn) prevBtn.onclick = () => navigate(-1);
                if (nextBtn) nextBtn.onclick = () => navigate(1);

                function formatTime(seconds) {
                    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const s = (seconds % 60).toString().padStart(2, '0');
                    return `${m}:${s}`;
                }

                function startTimer() {
                    if (timerInterval) clearInterval(timerInterval);
                    secondsElapsed = 0;
                    const timerEl = document.getElementById("quiz-timer");
                    if(timerEl) timerEl.textContent = "00:00";

                    timerInterval = setInterval(() => {
                        secondsElapsed++;
                        if(timerEl) timerEl.textContent = formatTime(secondsElapsed);
                    }, 1000);
                }
                function renderQuestion(index) {
                    const q = questions[index];
                    if (!q) return; // Təhlükəsizlik üçün
                    
                    if(questionEl) questionEl.textContent = q.question;
                    if(counterEl) counterEl.textContent = `${index + 1} / ${questions.length}`;

                    if(progressEl) {
                        const progressPercent = ((index) / questions.length) * 100;
                        progressEl.style.width = `${progressPercent}%`;
                    }

                    if(optionsContainer) {
                        optionsContainer.innerHTML = Object.entries(q.options).map(([key, text]) =>
                            `<button class="option-btn" data-key="${key}">${key}) ${text}</button>`
                        ).join("");
                    }
                    
                    const optionBtns = document.querySelectorAll(".option-btn");

                    if (userAnswers[index]) {
                        const savedAnswer = userAnswers[index]; 
                        const correctAnswer = q.correct_answer; 
                        
                        optionsContainer.classList.add("disabled");
                        
                        optionBtns.forEach(btn => {
                            const key = btn.dataset.key;
                            if (key === savedAnswer) {
                                btn.classList.add(key === correctAnswer ? "correct" : "wrong");
                            }
                            if (key === correctAnswer) {
                                btn.classList.add("correct");
                            }
                            // DƏYİŞİKLİK: btn.disabled = true; BURADAN SİLİNDİ
                        });
                        if(nextBtn) nextBtn.disabled = false;
                    } else {
                        optionsContainer.classList.remove("disabled");
                        if(nextBtn) nextBtn.disabled = true;

                        optionBtns.forEach(btn => {
                            btn.onclick = () => handleOptionClick(btn, q, index);
                        });
                    }

                    if (prevBtn) prevBtn.disabled = (index === 0);
                    if (nextBtn) {
                        nextBtn.textContent = (index === questions.length - 1) ? "Nəticə" : "Növbəti";
                    }
                }
                let limitSubtracted = false; // Faylın yuxarı hissəsinə əlavə et

                async function handleOptionClick(btn, questionData, index) {
                    if (!limitSubtracted && !isPremium) {
                        limitSubtracted = true;
                        await supabaseClient.rpc('increment_daily_limit', { u_id: userId });
                    }

                    const selected = btn.dataset.key;
                    userAnswers[index] = selected;
                    
                    const questionId = questionData.id; 
                    const correctAnswer = questionData.correct_answer;

                    // YENİLİK: Butonları tək-tək bağlamırıq, bütöv qutunu dondururuq
                    optionsContainer.classList.add("disabled");

                    if (selected === correctAnswer) {
                        btn.classList.add("correct");
                        if (nextBtn) nextBtn.disabled = false;
                        score++;
                        removeWrongQuestion(currentSubjectId, questionId);
                    } else {
                        btn.classList.add("wrong");
                        if (nextBtn) nextBtn.disabled = false;
                        addWrongQuestion(currentSubjectId, questionId);
                        
                        setTimeout(() => {
                            const correctBtn = optionsContainer.querySelector(`[data-key="${correctAnswer}"]`);
                            if (correctBtn) correctBtn.classList.add("correct");
                        }, 500);
                    }

                    
                    function checkAnswer(selectedOptionButton, selectedAnswerKey) {
                        // selectedAnswerKey məsələn "A", "B", "C" və s. olacaq
                        const correctAnswerKey = currentQuestion.correct_answer; 
                        const questionId = currentQuestion.id;

                        // Bütün variant düymələrini seçirik (CSS class-ınıza uyğun dəyişin)
                        const allOptions = document.querySelectorAll(".option-btn"); 

                        // İstifadəçi bir dəfə cavab verdikdən sonra digər düymələri deaktiv edirik ki, 2-ci dəfə basa bilməsin
                        allOptions.forEach(btn => btn.disabled = true);

                        if (selectedAnswerKey === correctAnswerKey) {
                            // DOĞRU CAVAB
                            selectedOptionButton.style.backgroundColor = "#4CAF50"; // Yaşıl rəng
                            selectedOptionButton.style.color = "white";
                            
                            // Sualı düzgün tapdığı üçün "Səhvlər" siyahısından silirik (əgər orda var idisə)
                            removeWrongQuestion(currentSubjectId, questionId);
                            
                            // Xalı artırmaq kodunuzu bura yaza bilərsiniz
                            // score++;

                        } else {
                            // SƏHV CAVAB
                            selectedOptionButton.style.backgroundColor = "#F44336"; // Qırmızı rəng
                            selectedOptionButton.style.color = "white";

                            // Doğru cavabı tapıb yaşıl edirik ki, istifadəçi görsün
                            // (Bunun üçün düymələrinizə data-key="A", data-key="B" kimi atributlar verməyiniz məsləhətdir)
                            allOptions.forEach(btn => {
                                if (btn.getAttribute("data-key") === correctAnswerKey) {
                                    btn.style.backgroundColor = "#4CAF50";
                                    btn.style.color = "white";
                                }
                            });

                            // Səhv etdiyi üçün ID-ni LocalStorage-a əlavə edirik
                            addWrongQuestion(currentSubjectId, questionId);
                        }

                    }
                    const container = document.getElementById("options-container");
                    container.classList.add("disabled");
                    nextBtn.disabled = false;
                }

                function navigate(direction) {
                    const newIndex = currentIndex + direction;
                        
                    if (newIndex >= 0 && newIndex < questions.length) {
                        currentIndex = newIndex;
                        renderQuestion(currentIndex);
                    } else if (newIndex >= questions.length) {
                        showResult();
                    }
                }
                async function updatePlayerStats(uId, currentScore, currentSeconds, totalQuestions, correctAnswers) {
                    try {
                        const client = window.globalSupabaseClient || window.supabaseClient;

                        // --- 1. İSTİFADƏÇİ ADINI AUTH-DAN ALIRIQ ---
                        const { data: { user } } = await client.auth.getUser();
                        // Qeydiyyat metodundan asılı olaraq ad müxtəlif yerlərdə ola bilər, hamısını yoxlayırıq
                        const fullName = user?.user_metadata?.full_name || 
                                        user?.user_metadata?.display_name || 
                                        user?.user_metadata?.name || 
                                        "Adsız İstifadəçi";

                        // --- 2. SAAT QURŞAĞI ÜÇÜN DƏQİQ TARİX HESABLAMA ---
                        const now = new Date();
                        const offset = now.getTimezoneOffset();
                        const adjustedDate = new Date(now.getTime() - (offset * 60 * 1000));
                        const todayStr = adjustedDate.toISOString().split('T')[0];

                        const yesterdayDate = new Date(adjustedDate);
                        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

                        // --- 3. USER_STATS (Ümumi Statistika və Leaderboard) ---
                        let { data: stats, error: fetchErr } = await client
                            .from('user_stats')
                            .select('*')
                            .eq('user_id', uId)
                            .maybeSingle();

                        if (fetchErr) throw fetchErr;

                        if (!stats) {
                            // İlk dəfə test işləyən istifadəçi (INSERT)
                            const { error: insErr } = await client.from('user_stats').insert([{
                                user_id: uId,
                                display_name: fullName, // AD BURADA ƏLAVƏ OLUNUR
                                quizzes_completed: 1,
                                total_time_spent: currentSeconds,
                                total_answered_questions: totalQuestions,
                                total_correct_answers: correctAnswers,
                                total_score: currentScore, 
                                elo_rating: 1000 + (correctAnswers * 5),
                                current_streak: 1,
                                last_quiz_date: todayStr,
                                daily_limit_count: 1
                            }]);
                            if (insErr) throw insErr;
                        } else {
                            // Mövcud istifadəçi (UPDATE)
                            let newStreak = Number(stats.current_streak) || 0;
                            const lastDate = stats.last_quiz_date;
                            
                            if (lastDate === todayStr) {
                                newStreak = Number(stats.current_streak) || 1;
                            } else if (lastDate === yesterdayStr) {
                                newStreak = (Number(stats.current_streak) || 0) + 1;
                            } else {
                                newStreak = 1;
                            }

                            const newElo = (Number(stats.elo_rating) || 1000) + (correctAnswers >= 5 ? 10 : -5);

                            const { error: updErr } = await client.from('user_stats').update({
                                display_name: fullName, // AD HƏR TESTDƏN SONRA YENİLƏNİR (Əgər dəyişibsə)
                                quizzes_completed: (Number(stats.quizzes_completed) || 0) + 1,
                                total_time_spent: (Number(stats.total_time_spent) || 0) + currentSeconds,
                                total_answered_questions: (Number(stats.total_answered_questions) || 0) + totalQuestions,
                                total_correct_answers: (Number(stats.total_correct_answers) || 0) + correctAnswers,
                                total_score: (Number(stats.total_score) || 0) + currentScore, 
                                elo_rating: newElo < 100 ? 100 : newElo,
                                current_streak: newStreak,
                                last_quiz_date: todayStr,
                                daily_limit_count: (lastDate === todayStr) ? (Number(stats.daily_limit_count || 0) + 1) : 1,
                                updated_at: new Date().toISOString()
                            }).eq('user_id', uId);
                            
                            if (updErr) throw updErr;
                        }

                        // --- 4. QUIZ_HISTORY (Aktivlik Qrafiki üçün) ---
                        let { data: history } = await client
                            .from('quiz_history')
                            .select('*')
                            .eq('user_id', uId)
                            .eq('quiz_date', todayStr)
                            .maybeSingle();

                        if (!history) {
                            await client.from('quiz_history').insert([{
                                user_id: uId, 
                                quiz_date: todayStr, 
                                quiz_count: 1
                            }]);
                        } else {
                            await client.from('quiz_history')
                                .update({ quiz_count: (Number(history.quiz_count) || 0) + 1 })
                                .eq('id', history.id);
                        }

                        console.log(`Statistikalar yeniləndi! İstifadəçi: ${fullName}, Streak: ${todayStr}`);

                    } catch (err) {
                        console.error("Supabase yeniləmə xətası:", err.message);
                    }
                }
                function showResult() {
                    clearInterval(timerInterval);
                    const finalTime = formatTime(secondsElapsed);
                    
                    // Nəticələri bazaya göndəririk
                    if (userId) {
                        updatePlayerStats(userId, score, secondsElapsed, questions.length, score);
                    }
                    
                    const topPart = document.querySelector(".top-part");
                    const sualWord = document.querySelector(".sual-word");
                    const quizButtons = document.querySelector(".quiz-buttons-bg");
                    const sualTextBg = document.querySelector(".sual-text-bg");
                    const exitBg = document.querySelector(".exit-bg a");

                    if(topPart) topPart.style.display = "none";
                    if(sualWord) sualWord.style.display = "none";
                    if(quizButtons) quizButtons.style.display = "none";
                    if(sualTextBg) sualTextBg.style.display = "none";
                    if(exitBg) exitBg.style.display = "none";

                    const headerTitle = document.querySelector(".fenn-id h1");
                    let subjectTitle = "";
                    if (headerTitle) {
                        subjectTitle = headerTitle.textContent;
                        headerTitle.style.display = "none";
                    }

                    const percentage = Math.round((score / questions.length) * 100);
                    const wrongAnswers = questions.length - score;

                    optionsContainer.innerHTML = `
                        <div class="result-container">
                            <div class="circle-progress-container">
                                <div class="circle-progress" style="--degrees: ${percentage * 3.6}deg;">
                                    <span class="progress-value">${percentage}%</span>
                                </div>
                            </div>

                            <h1 class="result-title">Yekun nəticə: ${score}/${questions.length}</h1>
                            <p class="result-subject">${subjectTitle}</p>

                            <div class="stats-card">
                                <div class="stat-row">
                                    <span class="stat-label"><span class="dot-blue">●</span> Düzgün cavablar</span>
                                    <span class="stat-count">${score}</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label"><span class="dot-red">●</span> Səhv cavablar</span>
                                    <span class="stat-count">${wrongAnswers}</span>
                                </div>
                                
                                <div class="stat-row">
                                    <span class="stat-label"><span class="dot-grey">●</span> Sərf olunan vaxt</span>
                                    <span class="stat-count">${finalTime}</span>
                                </div>

                                <div class="stat-row last-row">
                                    <span class="stat-label"><span class="dot-green">●</span> Keçmə faizi</span>
                                    <span class="stat-count green-text">${percentage}%</span>
                                </div>
                            </div>

                            <div class="result-actions">
                                <a href="fennler-menu.html" class="link-blue">Əsas səhifə</a>
                                <button class="btn-blue" onclick="window.location.reload()">Yenidən sına</button>
                            </div>
                        </div>
                    `;

                    optionsContainer.classList.remove("disabled");
                }

                // ==========================================
                // SUALI REPORT ETMƏK (ŞİKAYƏT) FUNKSİYASI
                // ==========================================
                window.openReportFrame = function() {
                    const currentQuestionText = document.getElementById("question-text").innerText;

                    const reportHTML = `
                        <h2>Sualı Şikayət Et</h2>
                        <div>
                            <span class="report-label">Problemli sual:</span>
                            <div class="reported-question-box">${currentQuestionText}</div>
                        </div>
                        <div>
                            <span class="report-label">Problemin təsviri:</span>
                            <textarea id="reportReasonText" class="report-textarea" placeholder="Sualda hansı səhvi və ya problemi gördüyünüzü ətraflı yazın..."></textarea>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-cancel" onclick="closeActionModal()">Ləğv et</button>
                            <button class="btn-continue" onclick="submitReport()">Göndər</button>
                        </div>
                    `;
                    openActionModal(reportHTML); 
                };

                window.submitReport = function() {
                    const reason = document.getElementById("reportReasonText").value.trim();
                    if (!reason) {
                        showMessage("Zəhmət olmasa problemin nə olduğunu qeyd edin!");
                        return;
                    }
                    closeActionModal(); 
                    showMessage("Şikayətiniz uğurla göndərildi. Təşəkkür edirik!"); 
                };

                // Quiz-i başlat
                renderQuestion(currentIndex);
                startTimer();
            })
            .catch(err => console.error("Fetch error:", err));
    });

    function shuffleArray(array) {
        return array
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
    }
}
// ---------------------- PROFILE PAGE ----------------------
if (window.location.pathname.includes("profile.html")) {
    const supabaseUrl = 'https://xoebhhdirsvjorjlrfzi.supabase.co';
    const supabaseKey = 'sb_publishable_FpT1VBCd5NKEnrYQbmx9Gw_MqWxVMvN';
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    document.addEventListener("DOMContentLoaded", async () => {
        // 1. İstifadəçi məlumatlarını Supabase-dən çəkirik
        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (error || !user) {
            // Əgər istifadəçi giriş etməyibsə, login səhifəsinə atırıq
            window.location.href = "login.html";
            return;
        }
        
        // 2. HTML-dəki inputları tapırıq və dəyərləri içinə yazırıq
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const createdAtText = document.getElementById('createdat');

        if (usernameInput) usernameInput.value = user.user_metadata?.full_name || "";
        if (emailInput) emailInput.value = user.email || "";
        if (passwordInput) passwordInput.value = "********"; // Şifrə gizli qalmalıdır
        if (createdAtText && user.created_at) {
            const createdDate = new Date(user.created_at);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            createdAtText.textContent = createdDate.toLocaleDateString('az-AZ', options);
        }
        // ==========================================
        // 3. ABUNƏLİK YOXLANIŞI VƏ EKRANA YAZDIRILMASI
        // ==========================================
        const abunelikBg = document.querySelector('.abunelik-bg');
        const premiumBg = document.querySelector('.premium-abunelik-bg');
        const premiumText = document.querySelector('#premium-text p');
        const bitmeTarixi = document.getElementById('bitme-tarixi');

        const { data: abuneData, error: abuneError } = await supabaseClient
            .from('abunelikler')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(); // Həmin istifadəçinin sətirini tapırıq

        if (abuneData) {
            const indi = new Date();
            const bitis = new Date(abuneData.bitis_tarixi);
            // Əgər vaxtı hələ bitməyibsə
            if (indi < bitis) {
                
                if(abunelikBg) abunelikBg.style.display = 'none';
                if(premiumBg) premiumBg.style.display = 'flex'; // və ya sizin css necə tələb edirsə
                
                // Planın adını və bitiş tarixini yaz
                if(premiumText) premiumText.textContent = abuneData.plan_adi;
                
                // Tarixi qəşəng və anlaşılan formata salırıq (məs: 20 Mart 2026)
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                if(bitmeTarixi) bitmeTarixi.textContent = bitis.toLocaleDateString('az-AZ', options);
            } else {
                abunelikBg.style.display = "flex"
            }
        }
        // ==========================================
        // DƏYİŞDİRMƏ MODALI (E-poçt və Şifrə üçün)
        // ==========================================
        // 1. Modalı açan funksiya
        window.openChangeFrame = function(type) {
            if (type === 'password') {
                // Şifrə üçün əvvəlcə e-poçtu təsdiqləməyə yönləndiririk
                openPasswordResetStep1();
            } else {
                // E-poçt dəyişmə köhnə qaydada qalır (link ilə)
                const modalHTML = `
                    <h2>E-poçtu yenilə</h2>
                    <p style="font-size: 14px; opacity: 0.8; margin-bottom: 15px;">Yeni e-poçt ünvanınızı daxil edin. Təsdiq linki göndəriləcək.</p>
                    <div class="input-group">
                        <label>Yeni e-poçt</label>
                        <input type="email" id="newActionValue" placeholder="yeni@mail.com">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-cancel" onclick="closeActionModal()">Ləğv et</button>
                        <button class="btn-continue" id="modalSubmitBtn" onclick="submitChange('email')">Təsdiqlə</button>
                    </div>
                `;
                openActionModal(modalHTML);
            }
        };

        // 2. Şifrə dəyişmənin 1-ci mərhələsi: OTP göndərmək
        async function openPasswordResetStep1() {
            const { data: { user } } = await supabaseClient.auth.getUser();
            const email = user.email;

            const modalHTML = `
                <h2>Şifrəni yenilə</h2>
                <p style="font-size: 14px; opacity: 0.8; margin-bottom: 15px;">
                    Şifrəni dəyişmək üçün <b>${email}</b> ünvanına təsdiq kodu göndərilməlidir.
                </p>
                <div class="action-buttons">
                    <button class="btn-cancel" onclick="closeActionModal()">Ləğv et</button>
                    <button class="btn-continue" id="sendOtpBtn" onclick="sendProfileOtp('${email}')">Kod Göndər</button>
                </div>
            `;
            openActionModal(modalHTML);
        }

        // 3. OTP göndər və 2-ci mərhələyə keç
        window.sendProfileOtp = async function(email) {
            const btn = document.getElementById("sendOtpBtn");
            btn.textContent = "Göndərilir...";
            btn.disabled = true;

            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

            if (error) {
                await showMessage("Xəta: " + error.message);
                btn.disabled = false;
                btn.textContent = "Kod Göndər";
            } else {
                showProfileOtpEntry(email);
            }
        };

        // 4. OTP və Yeni Şifrə daxil etmə modalı
        function showProfileOtpEntry(email) {
            const modalContent = document.getElementById("actionModalContent");
            modalContent.innerHTML = `
                <h2>Təsdiqləmə</h2>
                <p style="font-size: 14px; opacity: 0.8; margin-bottom: 15px;">E-poçtunuza gələn kodu və yeni şifrəni daxil edin.</p>
                <div class="input-group">
                    <label>OTP Kod</label>
                    <input type="text" id="otpCodeInput" placeholder="12345678" maxlength="8">
                </div>
                <div class="input-group">
                    <label>Yeni Şifrə</label>
                    <input type="password" id="newProfilePassword" placeholder="Ən azı 8 simvol">
                </div>
                <div class="action-buttons">
                    <button class="btn-cancel" onclick="closeActionModal()">Ləğv et</button>
                    <button class="btn-continue" id="finalSubmitBtn" onclick="verifyAndFinish('${email}')">Yenilə</button>
                </div>
            `;
        }

        // 5. Kodu yoxla və bitir
        window.verifyAndFinish = async function(email) {
            const token = document.getElementById("otpCodeInput").value.trim();
            const password = document.getElementById("newProfilePassword").value.trim();
            const btn = document.getElementById("finalSubmitBtn");

            if (token.length < 8 || password.length < 6) {
                await showMessage("Kod və şifrə tam doldurulmalıdır!");
                return;
            }

            btn.textContent = "Gözləyin...";
            btn.disabled = true;

            // Kodu yoxlayırıq
            const { error: verifyError } = await supabaseClient.auth.verifyOtp({
                email,
                token,
                type: 'recovery'
            });

            if (verifyError) {
                await showMessage("Kod yanlışdır!");
                btn.disabled = false;
                btn.textContent = "Yenilə";
            } else {
                // Şifrəni yeniləyirik
                const { error: updateError } = await supabaseClient.auth.updateUser({ password });
                
                closeActionModal();
                if (updateError) {
                    await showMessage("Xəta: " + updateError.message);
                } else {
                    await showMessage("Şifrəniz uğurla yeniləndi!");
                }
            }
        };
        // ==========================================
        // DƏYİŞİKLİKLƏRİ SAXLA (Yalnız Ad üçün)
        // ==========================================
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const newName = usernameInput.value.trim();
                
                if (!newName) {
                    await showMessage("İstifadəçi adı boş ola bilməz!");
                    return;
                }

                const originalText = saveBtn.textContent;
                saveBtn.textContent = "Saxlanılır...";
                saveBtn.disabled = true;

                // Adı metadata kimi yeniləyirik
                const { data, error } = await supabaseClient.auth.updateUser({
                    data: { full_name: newName }
                });

                saveBtn.textContent = originalText;
                saveBtn.disabled = false;

                if (error) {
                    await showMessage("Xəta: " + error.message);
                } else {
                    await showMessage("Profil məlumatlarınız uğurla yadda saxlanıldı!", "showMessage", "Tamam");
                }
            });
        }

        // ==========================================
        // HESABDAN ÇIX (Logout)
        // ==========================================
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                // Sizin yaratdığınız "confirm" tipli showMessage ilə soruşuruq
                const isConfirmed = await showMessage("Hesabdan çıxmaq istədiyinizə əminsiniz?", "confirm");
                
                if (isConfirmed) {
                    await supabaseClient.auth.signOut();
                    window.location.href = "login.html";
                }
            });
        }

        // ==========================================
        // HESABI SİL (Supabase Cədvəlinə Yazmaq - Spam qorumalı)
        // ==========================================
        const deleteBtn = document.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const isConfirmed = await showMessage("Hesabınızı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz!", "confirm");
                
                if (isConfirmed) {
                    deleteBtn.textContent = "Yoxlanılır...";
                    deleteBtn.disabled = true;

                    const userEmail = user.email; 

                    // 1. Əvvəlcə yoxlayırıq: Bu e-poçt artıq cədvəldə varmı?
                    const { data: existingData, error: checkError } = await supabaseClient
                        .from('hesab_silme_telebleri')
                        .select('email')
                        .eq('email', userEmail); // Cədvəldəki 'email' sütunu istifadəçinin e-poçtuna bərabər olanları tap

                    if (checkError) {
                        await showMessage("Sorğu yoxlanılarkən xəta baş verdi: " + checkError.message);
                        deleteBtn.textContent = "Hesabı sil";
                        deleteBtn.disabled = false;
                        return;
                    }

                    // 2. Əgər data içində nəticə varsa, deməli artıq müraciət edib
                    if (existingData && existingData.length > 0) {
                        await showMessage("Sizin hesab silmə istəyiniz artıq qeydə alınıb və hazırda icra olunur.", "showMessage", "Tamam");
                        deleteBtn.textContent = "Hesabı sil";
                        deleteBtn.disabled = false;
                        return; // funksiyanı buradaca dayandırırıq ki, yenidən bazaya yazmasın
                    }

                    // 3. Əgər əvvəllər müraciət etməyibsə, cədvələ yeni sorğu kimi əlavə edirik
                    deleteBtn.textContent = "Göndərilir...";
                    
                    const { error: insertError } = await supabaseClient
                        .from('hesab_silme_telebleri')
                        .insert([
                            { email: userEmail }
                        ]);

                    if (insertError) {
                        await showMessage("Sorğu göndərilərkən xəta baş verdi: " + insertError.message);
                        deleteBtn.textContent = "Hesabı sil";
                        deleteBtn.disabled = false;
                        return;
                    }

                    // Uğurla yazıldıqdan sonra istifadəçiyə yekun mesajı veririk
                    await showMessage("Hesab silmə tələbiniz qeydə alındı. 1 həftə içərisində hesabınız tamamilə silinəcək.", "showMessage", "Tamam");
                    
                    // Sistemdən çıxış edib login-ə atırıq
                    await supabaseClient.auth.signOut();
                    window.location.href = "login.html";
                }
            });
        }

    });
}
// ---------------------- PREMIUM PAGE ----------------------
if (window.location.pathname.includes("premium.html")) {
    const supabaseUrl = 'https://xoebhhdirsvjorjlrfzi.supabase.co';
    const supabaseKey = 'sb_publishable_FpT1VBCd5NKEnrYQbmx9Gw_MqWxVMvN'; 
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

    // --- 1. SƏHİFƏ AÇILANDA ABUNƏLİYİ YOXLA VƏ DÜYMƏLƏRİ KİLİDLƏ ---
    // DOMContentLoaded əvəzinə xüsusi asinxron funksiya yaradıb dərhal çağırırıq
    async function checkActivePlan() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
            const { data: abuneData } = await supabaseClient
                .from('abunelikler')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (abuneData) {
                const indi = new Date();
                const bitis = new Date(abuneData.bitis_tarixi);
                
                if (indi < bitis) {
                    // Bütün premium düymələrini tapırıq
                    const btns = document.querySelectorAll('.btn-plan-active');
                    
                    btns.forEach(btn => {
                        // Əgər bu düymə istifadəçinin aldığı plandırsa:
                        if (btn.getAttribute('onclick').includes(abuneData.plan_adi)) {
                            btn.textContent = "Aktivdir";
                            btn.disabled = true;
                            btn.style.backgroundColor = "#4CAF50"; // Yaşıl rəng
                            btn.style.cursor = "default";
                        } 
                        // Digər planlardırsa:
                        else {
                            btn.textContent = "Mövcud planınız var";
                            btn.disabled = true;
                            btn.style.opacity = "0.5";
                            btn.style.cursor = "not-allowed";
                        }
                    });
                }
            }
        }
    }
    
    // Funksiyanı dərhal işə salırıq
    checkActivePlan();


    // --- 2. YENİ PLAN ALMAQ (DÜYMƏYƏ BASANDA) ---
    // --- 2. YENİ PLAN ALMAQ (DÜYMƏYƏ BASANDA) ---

    /* =======================================================
       KÖHNƏ KOD (Ödəniş sistemi tam hazır olanda şərhi siləcəyik)
       =======================================================
    window.activatePlan = async function(planAdi) {
        console.log(planAdi + " düyməsinə basıldı!"); 

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            alert("Premium almaq üçün əvvəlcə hesabınıza daxil olmalısınız!");
            window.location.href = "login.html"; 
            return;
        }

        let gunSayi = 0;
        if (planAdi === '3 Günlük') gunSayi = 3;
        else if (planAdi === '7 Günlük') gunSayi = 7;
        else if (planAdi === '30 Günlük') gunSayi = 30;

        const bitisTarixi = new Date();
        bitisTarixi.setDate(bitisTarixi.getDate() + gunSayi);
        const formatlanmisTarix = bitisTarixi.toISOString();

        const { data, error } = await supabaseClient
            .from('abunelikler')
            .upsert({
                user_id: user.id,
                email: user.email,
                plan_adi: planAdi,
                bitis_tarixi: formatlanmisTarix
            }, { 
                onConflict: 'user_id' 
            });

        if (error) {
            alert("Xəta baş verdi: " + error.message);
            console.error("Supabase xətası:", error);
        } else {
            await supabaseClient.auth.updateUser({
                data: { is_premium: true }
            });
            const successMessageHTML = `
                <div style="text-align: center;">
                    <img src="../images/premium-dicaprio.png" alt="Premium" style="width: 80px; margin-bottom: 15px;">
                    <p style="margin: 0; font-size: 16px;">Təbriklər! <b>${planAdi}</b> Premium abunəliyiniz uğurla aktivləşdirildi.</p>
                </div>
            `;
            
            await showMessage(successMessageHTML, "alert", "Tamam"); 
            window.location.reload();
        }
    };
    ======================================================= */


    // =======================================================
    // YENİ MÜVƏQQƏTİ KOD (Tezliklə Mesajı)
    // =======================================================
    window.activatePlan = async function(planAdi) {
        // İstifadəçiyə göstəriləcək şəkilli "Hazırlanır" mesajı
        const tezlikleHTML = `
            <div style="text-align: center;">
                <img src="../images/cattyping.gif" alt="Hazırlanır" style="width: 200px; margin-bottom: 15px; opacity: 0.8;">
                
                <h3 style="margin-bottom: 10px; color: #1e90ff;">Tezliklə!</h3>
                <p style="font-size: 15px; opacity: 0.9; line-height: 1.5;">
                    <b>${planAdi}</b> paketini almaq funksiyası hazırda yenilənmə mərhələsindədir. <br><br> Çox yaxında real ödəniş sistemi ilə istifadənizə veriləcək. Bizi izləməyə davam edin!
                </p>
            </div>
        `;
        
        // Yeni qurduğumuz showMessage funksiyası ilə ekrana çıxarırıq (tək "Bağla" düyməsi ilə)
        await showMessage(tezlikleHTML, "alert", "Bağla"); 
    };
}