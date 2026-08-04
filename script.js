// ===== script.js (اضافه شدن توابع تلویزیون اخبار) =====

// ... (کدهای قبلی بدون تغییر) ...

// =============================================
// تلویزیون اخبار - توابع جدید
// =============================================

// تابع پخش خبر با داده‌های واقعی
function playNewsWithData(image, title, date, text, link) {
    document.getElementById('news-player-image').src = image;
    document.getElementById('news-player-title').textContent = title;
    document.getElementById('news-player-date').textContent = date;
    document.getElementById('news-player-text').textContent = text;
    document.getElementById('news-player-link').href = link;
    // هایلایت آیتم انتخاب‌شده در لیست
    document.querySelectorAll('#news-list div').forEach(el => {
        el.style.background = 'rgba(255,255,255,0.6)';
    });
    // هایلایت آیتم کلیک‌شده (با استفاده از event)
    window.event.target.closest('div').style.background = 'rgba(241, 196, 15, 0.15)';
}

// تابع پخش (نمایش متن کامل)
function playNews() {
    const text = document.getElementById('news-player-text');
    if (text.style.maxHeight === '100px') {
        text.style.maxHeight = '300px';
        text.style.overflowY = 'auto';
    } else {
        text.style.maxHeight = '100px';
    }
}

// تابع توقف (جمع کردن متن)
function pauseNews() {
    const text = document.getElementById('news-player-text');
    text.style.maxHeight = '100px';
    text.style.overflowY = 'auto';
}

// =============================================
// اسلایدشو مانیفست (توابع قبلی بدون تغییر)
// =============================================
// (توابع changeSlide, currentSlide, startAutoSlide, و ...)
