// ===== script.js - نسخه نهایی با همه توابع =====
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
            }, 5000);
        }
    }

    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    // =============================================
    // ۳. تلویزیون اخبار - توابع
    // =============================================

    // تابع پخش خبر با داده‌های کامل
    window.playNewsWithData = function(image, title, date, text, link) {
        document.getElementById('news-player-image').src = image;
        document.getElementById('news-player-title').textContent = title;
        document.getElementById('news-player-date').textContent = date;
        document.getElementById('news-player-text').textContent = text;
        document.getElementById('news-player-link').href = link;
        // هایلایت آیتم انتخاب‌شده در لیست
        document.querySelectorAll('#news-list div').forEach(el => {
            el.style.background = 'rgba(255,255,255,0.6)';
        });
        // هایلایت آیتم کلیک‌شده
        if (window.event && window.event.target) {
            const clickedItem = window.event.target.closest('div');
            if (clickedItem) {
                clickedItem.style.background = 'rgba(241, 196, 15, 0.15)';
            }
        }
    };

    // تابع پخش (باز کردن متن کامل)
    window.playNews = function() {
        const text = document.getElementById('news-player-text');
        if (text.style.maxHeight === '100px' || text.style.maxHeight === '') {
            text.style.maxHeight = '400px';
            text.style.overflowY = 'auto';
        } else {
            text.style.maxHeight = '100px';
        }
    };

    // تابع توقف (جمع کردن متن)
    window.pauseNews = function() {
        const text = document.getElementById('news-player-text');
        text.style.maxHeight = '100px';
        text.style.overflowY = 'auto';
    };

    // =============================================
    // ۴. بارگذاری رویدادها از library.json (برای نشست شو)
    // =============================================
    fetch('library.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('خطا در بارگذاری library.json');
            }
            return response.json();
        })
        .then(data => {
            console.log('📚 اطلاعات بارگذاری شد:', data);
            const eventsGallery = document.getElementById('events-gallery');
            if (eventsGallery && data.organization && data.organization.events) {
                eventsGallery.innerHTML = '';
                data.organization.events.forEach(item => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'gallery-item';
                    eventItem.innerHTML = `
                        <img src="${item.image || 'https://via.placeholder.com/300x140/8e44ad/ffffff?text=نشست'}" alt="${item.title}">
                        <div class="gallery-info">
                            <h4>${item.title}</h4>
                            <p>${item.date || ''}</p>
                            <span class="date">${item.date || ''}</span>
                        </div>
                    `;
                    eventItem.addEventListener('click', function() {
                        alert(`📅 ${item.title}\n📆 ${item.date || 'تاریخ نامشخص'}`);
                    });
                    eventsGallery.appendChild(eventItem);
                });
            }
        })
        .catch(error => {
            console.warn('ℹ️ خطا در بارگذاری library.json:', error);
            const eventsGallery = document.getElementById('events-gallery');
            if (eventsGallery) {
                eventsGallery.innerHTML = `
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/8e44ad/ffffff?text=نشست+۱" alt="نشست ۱">
                        <div class="gallery-info"><h4>کارآفرینی اجتماعی در ایران</h4><p>۱۴۰۳/۰۵/۱۷</p></div>
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/2980b9/ffffff?text=نشست+۲" alt="نشست ۲">
                        <div class="gallery-info"><h4>گردشگری و مسئولیت اجتماعی</h4><p>۱۴۰۳/۰۴/۲۲</p></div>
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/e74c3c/ffffff?text=نشست+۳" alt="نشست ۳">
                        <div class="gallery-info"><h4>هم‌اندیشی خوشه‌های اقتصادی</h4><p>۱۴۰۳/۰۴/۱۰</p></div>
                    </div>
                `;
            }
        });

    // =============================================
    // ۵. تعامل هوشمند (ارسال نظر)
    // =============================================
    const sendBtn = document.querySelector('.interact-box .btn-send');
    const responseArea = document.querySelector('.response-area');
    const textarea = document.querySelector('.interact-box textarea');
    if (sendBtn && responseArea && textarea) {
        sendBtn.addEventListener('click', function() {
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
            textarea.value = '';
        });
    }

    // =============================================
    // ۶. دکمه عضویت
    // =============================================
    const membershipBtn = document.querySelector('.membership-module .btn-start');
    if (membershipBtn) {
        membershipBtn.addEventListener('click', function() {
            alert('🔹 فرایند عضویت آغاز شد.\nلطفاً مدارک زیر را آماده کنید:\n- رزومه حرفه‌ای\n- عکس پرسنلی\n- تصویر کارت ملی\n- رسید واریز حق عضویت (۶۰۰,۰۰۰ تومان)');
        });
    }

    console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
});
