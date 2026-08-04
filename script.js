// ===== script.js - نسخه نهایی با همه توابع و بارگذاری از فایل‌های داده =====
document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // ۱. چرخش شعارها
    // =============================================
    const sloganItems = document.querySelectorAll('.slogan-bar .slogan-item');
    if (sloganItems.length > 0) {
        let sloganIndex = 0;
        setInterval(() => {
            sloganItems.forEach((el, i) => {
                el.classList.toggle('show', i === sloganIndex);
            });
            sloganIndex = (sloganIndex + 1) % sloganItems.length;
        }, 5000);
    }

    // =============================================
    // ۲. اسلایدشو مانیفست
    // =============================================
    let slideIndex = 0;
    const slides = document.querySelectorAll('#manifest-slideshow > div');
    const dots = document.querySelectorAll('.dot');
    let autoSlideInterval;

    function showSlide(index) {
        if (index >= slides.length) slideIndex = 0;
        else if (index < 0) slideIndex = slides.length - 1;
        else slideIndex = index;
        const offset = -slideIndex * 100;
        const container = document.getElementById('manifest-slideshow');
        if (container) {
            container.style.transform = `translateX(${offset}%)`;
        }
        dots.forEach((dot, i) => {
            dot.style.background = i === slideIndex ? '#d4a373' : '#ccc';
        });
    }

    window.changeSlide = function(direction) {
        clearInterval(autoSlideInterval);
        showSlide(slideIndex + direction);
        startAutoSlide();
    };

    window.currentSlide = function(index) {
        clearInterval(autoSlideInterval);
        showSlide(index);
        startAutoSlide();
    };

    function startAutoSlide() {
        if (slides.length > 0) {
            autoSlideInterval = setInterval(() => {
                showSlide(slideIndex + 1);
            }, 20000); // ۲۰ ثانیه برای هر اسلاید
        }
    }

    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    // =============================================
    // ۳. تلویزیون اخبار - داده‌ها و توابع
    // =============================================
    let newsData = [];
    let currentNewsIndex = 0;

    // بارگذاری اخبار از فایل data/news.json
    fetch('data/news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('خطا در بارگذاری news.json');
            }
            return response.json();
        })
        .then(data => {
            newsData = data.news || [];
            if (newsData.length > 0) {
                populateNewsList(newsData);
                loadNews(newsData[0]);
            }
        })
        .catch(error => {
            console.warn('⚠️ خطا در بارگذاری اخبار:', error);
            // داده‌های پیش‌فرض برای تست
            newsData = [
                {
                    id: 'n1',
                    title: 'افتتاحیه دوره تربیت مشاوران مسئولیت اجتماعی',
                    date: '۲۹ تیر ۱۴۰۵',
                    summary: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» برگزار شد.',
                    text: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» صبح سه‌شنبه ۲۳ تیر ماه ۱۴۰۵ با حضور مدیران ارشد پژوهشگاه میراث فرهنگی و گردشگری و انجمن ترویج فرهنگ مسئولیت اجتماعی در محل پژوهشگاه برگزار شد...',
                    image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg'
                }
            ];
            populateNewsList(newsData);
            loadNews(newsData[0]);
        });

    // نمایش لیست اخبار
    function populateNewsList(newsArray) {
        const listContainer = document.getElementById('news-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        newsArray.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 10px 12px; background: rgba(255,255,255,0.6); border-radius: 10px; cursor: pointer; transition: 0.2s; border-right: 3px solid #f1c40f; margin-bottom: 6px;';
            div.innerHTML = `<strong>${item.title}</strong><br><span style="font-size: 0.8rem; color: #3a5e77;">${item.date}</span>`;
            div.onclick = function() {
                loadNews(item);
                // هایلایت
                document.querySelectorAll('#news-list div').forEach(el => {
                    el.style.background = 'rgba(255,255,255,0.6)';
                });
                this.style.background = 'rgba(241, 196, 15, 0.15)';
                currentNewsIndex = index;
            };
            listContainer.appendChild(div);
        });
    }

    // بارگذاری یک خبر در پخش‌کننده
    function loadNews(news) {
        if (!news) return;
        document.getElementById('news-player-image').src = news.image || '';
        document.getElementById('news-player-title').textContent = news.title || '';
        document.getElementById('news-player-date').textContent = news.date || '';
        document.getElementById('news-player-text').textContent = news.text || news.summary || '';
    }

    // توابع دکمه‌ها
    window.playNews = function() {
        const text = document.getElementById('news-player-text');
        if (text.style.maxHeight === '100px' || text.style.maxHeight === '') {
            text.style.maxHeight = '400px';
            text.style.overflowY = 'auto';
        } else {
            text.style.maxHeight = '100px';
        }
    };

    window.pauseNews = function() {
        const text = document.getElementById('news-player-text');
        text.style.maxHeight = '100px';
        text.style.overflowY = 'auto';
    };

    window.prevNews = function() {
        if (newsData.length === 0) return;
        currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length;
        loadNews(newsData[currentNewsIndex]);
        // هایلایت آیتم لیست
        document.querySelectorAll('#news-list div').forEach((el, i) => {
            el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)';
        });
    };

    window.nextNews = function() {
        if (newsData.length === 0) return;
        currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
        loadNews(newsData[currentNewsIndex]);
        document.querySelectorAll('#news-list div').forEach((el, i) => {
            el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)';
        });
    };

    window.showFullNews = function() {
        const title = document.getElementById('news-player-title').textContent;
        const date = document.getElementById('news-player-date').textContent;
        const text = document.getElementById('news-player-text').textContent;
        alert(`📰 ${title}\n📅 ${date}\n\n${text}`);
    };

    window.openComment = function() {
        const comment = prompt('لطفاً نظر خود را بنویسید:');
        if (comment) {
            // ذخیره در localStorage برای ادمین
            const comments = JSON.parse(localStorage.getItem('news_comments') || '[]');
            comments.push({
                newsTitle: document.getElementById('news-player-title').textContent,
                comment: comment,
                date: new Date().toISOString()
            });
            localStorage.setItem('news_comments', JSON.stringify(comments));
            alert('✅ نظر شما ثبت شد و برای ادمین ارسال گردید.');
        }
    };

    window.openInteraction = function() {
        const message = prompt('لطفاً پیام خود را برای ادمین بنویسید:');
        if (message) {
            const interactions = JSON.parse(localStorage.getItem('news_interactions') || '[]');
            interactions.push({
                newsTitle: document.getElementById('news-player-title').textContent,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('news_interactions', JSON.stringify(interactions));
            alert('✅ پیام شما به ادمین ارسال شد. پاسخگویی متعاقباً انجام می‌شود.');
        }
    };

    // =============================================
    // ۴. بارگذاری همیاری‌های اجتماعی
    // =============================================
    fetch('data/helps.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('helps-container');
            if (!container || !data.helps) return;
            container.innerHTML = '';
            data.helps.forEach(item => {
                const div = document.createElement('div');
                div.className = 'help-item';
                div.innerHTML = `
                    <i class="fas ${item.icon}"></i>
                    <div>
                        <div class="help-title">${item.title}</div>
                        <div class="help-desc">${item.desc}</div>
                        <span class="admin-response"><i class="fas fa-user-check"></i> مدیر پاسخگو</span>
                    </div>
                `;
                // کلیک برای نمایش جزئیات
                div.addEventListener('click', function() {
                    alert(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`);
                });
                container.appendChild(div);
            });
        })
        .catch(error => console.warn('⚠️ خطا در بارگذاری helps.json:', error));

    // =============================================
    // ۵. بارگذاری «آنچه با هم می‌سازیم»
    // =============================================
    fetch('data/builds.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('builds-container');
            if (!container || !data.builds) return;
            container.innerHTML = '';
            data.builds.forEach(item => {
                const div = document.createElement('div');
                div.className = 'help-item';
                div.innerHTML = `
                    <i class="fas ${item.icon}"></i>
                    <div>
                        <div class="help-title">${item.title}</div>
                        <div class="help-desc">${item.desc}</div>
                    </div>
                `;
                div.addEventListener('click', function() {
                    alert(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`);
                });
                container.appendChild(div);
            });
        })
        .catch(error => console.warn('⚠️ خطا در بارگذاری builds.json:', error));

    // =============================================
    // ۶. تعامل هوشمند (ارسال نظر عمومی)
    // =============================================
    window.sendInteraction = function() {
        const textarea = document.getElementById('interact-text');
        const responseArea = document.getElementById('response-area');
        const message = textarea.value.trim();
        if (!message) {
            responseArea.innerHTML = `
                <i class="fas fa-robot" style="margin-left:8px;"></i>
                <span class="admin-tag">مدیر پاسخگو</span>
                لطفاً یک متن برای ارسال وارد کنید.
            `;
            return;
        }
        const responses = [
            'از نظر شما متشکریم. این موضوع با اهداف انجمن همخوانی دارد و بررسی می‌شود.',
            'پیشنهاد شما ثبت شد. در جلسات آینده مطرح خواهد شد.',
            'سوال شما به تیم تخصصی ارجاع داده شد. پاسخ کامل اعلام می‌شود.',
            'نظر شما بسیار ارزشمند است. از مشارکت شما سپاسگزاریم.',
            'این موضوع در دستور کار گروه قرار گرفت. به زودی اطلاع‌رسانی می‌شود.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        responseArea.innerHTML = `
            <i class="fas fa-robot" style="margin-left:8px;"></i>
            <span class="admin-tag">مدیر پاسخگو</span>
            ${randomResponse}
        `;
        // ذخیره در localStorage
        const messages = JSON.parse(localStorage.getItem('general_interactions') || '[]');
        messages.push({
            message: message,
            response: randomResponse,
            date: new Date().toISOString()
        });
        localStorage.setItem('general_interactions', JSON.stringify(messages));
        textarea.value = '';
    };

    // =============================================
    // ۷. دکمه عضویت
    // =============================================
    const membershipBtn = document.querySelector('.membership-module .btn-start');
    if (membershipBtn) {
        membershipBtn.addEventListener('click', function() {
            alert('🔹 فرایند عضویت آغاز شد.\nلطفاً مدارک زیر را آماده کنید:\n- رزومه حرفه‌ای\n- عکس پرسنلی\n- تصویر کارت ملی\n- رسید واریز حق عضویت (۶۰۰,۰۰۰ تومان)');
        });
    }

    console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
});
