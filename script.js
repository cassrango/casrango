// ===== script.js - تمام منطق و رفتارهای سایت =====

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // ۱. چرخش شعارها در نوار زیر تولبار
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
    // ۲. بارگذاری داده‌ها از library.json و نمایش در گالری‌ها
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

            // --- نمایش اخبار در گالری اخبار شو ---
            const newsGallery = document.getElementById('news-gallery');
            if (newsGallery && data.organization && data.organization.news) {
                newsGallery.innerHTML = '';
                data.organization.news.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'gallery-item';
                    newsItem.innerHTML = `
                        <img src="${item.image || 'https://via.placeholder.com/300x140/4a90d9/ffffff?text=خبر'}" alt="${item.title}">
                        <div class="gallery-info">
                            <h4>${item.title}</h4>
                            <p>${item.date || ''}</p>
                            <span class="date">${item.date || ''}</span>
                        </div>
                    `;
                    // کلیک روی خبر: نمایش alert با اطلاعات
                    newsItem.addEventListener('click', function() {
                        alert(`📰 ${item.title}\n📅 ${item.date || 'تاریخ نامشخص'}`);
                    });
                    newsGallery.appendChild(newsItem);
                });
            }

            // --- نمایش رویدادها در گالری نشست شو ---
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
            // در صورت عدم وجود فایل، از داده‌های پیش‌فرض استفاده می‌شود.
            const newsGallery = document.getElementById('news-gallery');
            if (newsGallery) {
                newsGallery.innerHTML = `
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/4a90d9/ffffff?text=خبر+۱" alt="خبر ۱">
                        <div class="gallery-info"><h4>افتتاحیه دوره تربیت مشاوران</h4><p>۱۴۰۳/۰۵/۰۱</p></div>
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/e67e22/ffffff?text=خبر+۲" alt="خبر ۲">
                        <div class="gallery-info"><h4>تسلیت عروج ملکوتی امام شهدا</h4><p>۱۴۰۳/۰۴/۲۸</p></div>
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x140/27ae60/ffffff?text=خبر+۳" alt="خبر ۳">
                        <div class="gallery-info"><h4>آغاز ثبت‌نام دوره پایه</h4><p>۱۴۰۳/۰۴/۲۰</p></div>
                    </div>
                `;
            }
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
    // ۳. دکمه‌های تعامل (ارسال نظر)
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

            // شبیه‌سازی پاسخ هوشمند
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
    // ۴. دکمه‌های ماژول عضویت
    // =============================================
    const membershipBtn = document.querySelector('.membership-module .btn-start');
    if (membershipBtn) {
        membershipBtn.addEventListener('click', function() {
            alert('🔹 فرایند عضویت آغاز شد.\nلطفاً مدارک زیر را آماده کنید:\n- رزومه حرفه‌ای\n- عکس پرسنلی\n- تصویر کارت ملی\n- رسید واریز حق عضویت (۶۰۰,۰۰۰ تومان)');
        });
    }

    console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
});
