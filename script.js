// ===== script.js - نسخه اصلاح‌شده =====
document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // بخش اول: توابع اصلی
    // =============================================

    let sloganInterval = null;
    function startSloganRotation() {
        if (sloganInterval) { clearInterval(sloganInterval); sloganInterval = null; }
        const sloganItems = document.querySelectorAll('.slogan-bar .slogan-item');
        if (sloganItems.length > 0) {
            let sloganIndex = 0;
            sloganItems.forEach((el, i) => { el.classList.toggle('show', i === sloganIndex); });
            sloganInterval = setInterval(() => {
                sloganIndex = (sloganIndex + 1) % sloganItems.length;
                sloganItems.forEach((el, i) => { el.classList.toggle('show', i === sloganIndex); });
            }, 5000);
        }
    }

    function saveInteraction(type, data) {
        const key = 'interactions_' + type;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        items.push({ ...data, timestamp: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(items));
    }
    function showNotification(message) { alert(message); }

    // =============================================
    // رادیو هوشمند
    // =============================================
    let radioData = [];
    let currentRadioIndex = 0;
    const radioPlayer = document.getElementById('radio-player');
    function loadRadioData() {
        radioData = [
            { id: 'r1', title: 'آهنگ اول - Ayrilik', file: 'data/images/Ayrilik_aleftab.ir.mp3', date: '۱۴۰۵/۰۵/۰۴' },
            { id: 'r2', title: 'آهنگ دوم - Careless Whisper', file: 'data/images/Careless Whisper2.mp3', date: '۱۴۰۵/۰۵/۰۴' }
        ];
        renderRadioPlaylist(radioData);
        loadRadioTrack(radioData[0]);
    }
    function renderRadioPlaylist(tracks) {
        const container = document.getElementById('radio-playlist');
        if (!container) return;
        container.innerHTML = '';
        tracks.forEach((track, index) => {
            const div = document.createElement('div');
            div.className = 'playlist-item' + (index === currentRadioIndex ? ' active' : '');
            div.innerHTML = `<span>${track.title}</span><span style="font-size:0.8rem; color:#7f8c8d;">${track.date || ''}</span>`;
            div.onclick = () => { currentRadioIndex = index; loadRadioTrack(track); renderRadioPlaylist(tracks); };
            container.appendChild(div);
        });
    }
    function loadRadioTrack(track) {
        if (!radioPlayer || !track) return;
        radioPlayer.src = track.file || '';
        radioPlayer.load();
        radioPlayer.play().catch(e => console.log('پخش خودکار نیاز به تعامل دارد.'));
    }
    window.playRadio = function() { if (radioPlayer) { radioPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopRadio = function() { if (radioPlayer) { radioPlayer.pause(); radioPlayer.currentTime = 0; } };
    window.nextRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex + 1) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.prevRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex - 1 + radioData.length) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.likeRadio = function() { const track = radioData[currentRadioIndex]; if (!track) return; saveInteraction('radio_likes', { title: track.title }); showNotification('❤️ برنامه مورد پسند شما قرار گرفت!'); };

    // =============================================
    // تلویزیون هوشمند
    // =============================================
    let tvData = [];
    let currentTvIndex = 0;
    const tvPlayer = document.getElementById('tv-player');
    function loadTvData() {
        tvData = [
            { id: 't1', title: 'ویدئوی طرح همگام‌سازی خدمات هوشمند', video: 'data/images/ویدئوی طرح همگام سازی خدمات هوشمند~2.mp4' },
            { id: 't2', title: 'ویدئوی کتاب هنر هوشمند نگاری ۲', video: 'data/images/ویئوی کتاب هنر هوشمند نگاری 2.mp4' }
        ];
        renderTvPlaylist(tvData);
        loadTvChannel(tvData[0]);
    }
    function renderTvPlaylist(channels) {
        const container = document.getElementById('tv-playlist');
        if (!container) return;
        container.innerHTML = '';
        channels.forEach((channel, index) => {
            const div = document.createElement('div');
            div.className = 'playlist-item' + (index === currentTvIndex ? ' active' : '');
            div.innerHTML = `<span>${channel.title}</span>`;
            div.onclick = () => { currentTvIndex = index; loadTvChannel(channel); renderTvPlaylist(channels); };
            container.appendChild(div);
        });
    }
    function loadTvChannel(channel) {
        if (!tvPlayer || !channel) return;
        tvPlayer.src = channel.video || '';
        tvPlayer.load();
        tvPlayer.play().catch(e => console.log('پخش خودکار نیاز به تعامل دارد.'));
    }
    window.playTv = function() { if (tvPlayer) { tvPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopTv = function() { if (tvPlayer) { tvPlayer.pause(); tvPlayer.currentTime = 0; } };
    window.nextTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex + 1) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.prevTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex - 1 + tvData.length) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.likeTv = function() { const channel = tvData[currentTvIndex]; if (!channel) return; saveInteraction('tv_likes', { title: channel.title }); showNotification('❤️ کانال مورد پسند شما قرار گرفت!'); };

    // =============================================
    // تلویزیون اخبار و رویدادها
    // =============================================
    let newsData = [];
    let currentNewsIndex = 0;
    function loadNewsData() {
        newsData = [
            { 
                id: 'n1', 
                title: 'افتتاحیه دوره تربیت مشاوران مسئولیت اجتماعی', 
                date: '۲۹ تیر ۱۴۰۵', 
                summary: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» با حضور مدیران ارشد برگزار شد.', 
                text: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» صبح سه‌شنبه ۲۳ تیر ماه ۱۴۰۵ با حضور مدیران ارشد پژوهشگاه میراث فرهنگی و گردشگری و انجمن ترویج فرهنگ مسئولیت اجتماعی در محل پژوهشگاه برگزار شد...', 
                image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg' 
            },
            { 
                id: 'n2', 
                title: 'بیانیه انجمن به‌مناسبت پایان تخاصم نظامی', 
                date: '۲۵ تیر ۱۴۰۵', 
                summary: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی را به فال نیک گرفت.', 
                text: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی با آمریکا را به فال نیک گرفت و بر ضرورت بازسازی اعتماد عمومی و تقویت همبستگی ملی تأکید کرد...', 
                image: 'data/images/507bc7e4-02f4-4e20-bb9c-1f343ab4493a-600x400.jpg' 
            }
        ];
        renderNewsList(newsData);
        loadNews(newsData[0]);
    }
    function renderNewsList(newsArray) {
        const listContainer = document.getElementById('news-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        newsArray.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 10px 12px; background: ' + (index === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)') + '; border-radius: 10px; cursor: pointer; transition: 0.2s; border-right: 3px solid #e74c3c; margin-bottom: 6px;';
            div.innerHTML = `<strong>${item.title}</strong><br><span style="font-size: 0.8rem; color: #3a5e77;">${item.date}</span>`;
            div.onclick = function() {
                loadNews(item);
                document.querySelectorAll('#news-list div').forEach(el => { el.style.background = 'rgba(255,255,255,0.6)'; });
                this.style.background = 'rgba(231, 76, 60, 0.1)';
                currentNewsIndex = index;
            };
            listContainer.appendChild(div);
        });
    }
    function loadNews(news) {
        if (!news) return;
        const img = document.getElementById('news-player-image');
        if (img) { img.src = news.image || 'data/images/placeholder.jpg'; img.onerror = function() { this.src = 'data/images/placeholder.jpg'; }; }
        const title = document.getElementById('news-player-title');
        if (title) title.textContent = news.title || '';
        const date = document.getElementById('news-player-date');
        if (date) date.textContent = news.date || '';
        const text = document.getElementById('news-player-text');
        if (text) text.textContent = news.summary || news.text || '';
    }
    window.prevNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex + 1) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.playNews = function() { const text = document.getElementById('news-player-text'); if (text) { const currentNews = newsData[currentNewsIndex]; if (currentNews) { text.textContent = currentNews.text || currentNews.summary || ''; text.style.maxHeight = '800px'; text.style.overflowY = 'auto'; } } };
    window.pauseNews = function() { const text = document.getElementById('news-player-text'); if (text) { const currentNews = newsData[currentNewsIndex]; if (currentNews) { text.textContent = currentNews.summary || currentNews.text || ''; text.style.maxHeight = '100px'; text.style.overflowY = 'hidden'; } } };
    window.showFullNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; const date = document.getElementById('news-player-date')?.textContent || ''; const text = document.getElementById('news-player-text')?.textContent || ''; showNotification(`📰 ${title}\n📅 ${date}\n\n${text}`); };
    window.openComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_comments', { newsTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_likes', { newsTitle: title }); showNotification('❤️ خبر مورد پسند شما قرار گرفت!'); };

    let eventsData = [];
    let currentEventIndex = 0;
    function loadEventsData() {
        eventsData = [
            { 
                id: 'e1', 
                title: 'کارگاه مسئولیت اجتماعی در صنعت گردشگری', 
                date: '۵ مرداد ۱۴۰۵', 
                summary: 'کارگاه آموزشی با حضور متخصصان صنعت گردشگری برگزار می‌شود.', 
                text: 'این کارگاه با هدف آشنایی فعالان صنعت گردشگری با مفاهیم و کاربردهای مسئولیت اجتماعی برگزار می‌شود...', 
                image: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg' 
            },
            { 
                id: 'e2', 
                title: 'نشست تخصصی مسئولیت اجتماعی در مدیریت شهری', 
                date: '۱۲ مرداد ۱۴۰۵', 
                summary: 'نشست تخصصی با موضوع نقش مسئولیت اجتماعی در مدیریت شهری برگزار می‌شود.', 
                text: 'این نشست با حضور مدیران شهری و فعالان حوزه مسئولیت اجتماعی برگزار می‌شود...', 
                image: 'data/images/5d77aa63-8167-46b7-a40d-58f80391ddd3-600x422.jpg' 
            }
        ];
        renderEventsList(eventsData);
        loadEvent(eventsData[0]);
    }
    function renderEventsList(eventsArray) {
        const listContainer = document.getElementById('events-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        eventsArray.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 10px 12px; background: ' + (index === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)') + '; border-radius: 10px; cursor: pointer; transition: 0.2s; border-right: 3px solid #2ecc71; margin-bottom: 6px;';
            div.innerHTML = `<strong>${item.title}</strong><br><span style="font-size: 0.8rem; color: #3a5e77;">${item.date}</span>`;
            div.onclick = function() {
                loadEvent(item);
                document.querySelectorAll('#events-list div').forEach(el => { el.style.background = 'rgba(255,255,255,0.6)'; });
                this.style.background = 'rgba(46, 204, 113, 0.15)';
                currentEventIndex = index;
            };
            listContainer.appendChild(div);
        });
    }
    function loadEvent(event) {
        if (!event) return;
        const img = document.getElementById('events-player-image');
        if (img) { img.src = event.image || 'data/images/placeholder.jpg'; img.onerror = function() { this.src = 'data/images/placeholder.jpg'; }; }
        const title = document.getElementById('events-player-title');
        if (title) title.textContent = event.title || '';
        const date = document.getElementById('events-player-date');
        if (date) date.textContent = event.date || '';
        const text = document.getElementById('events-player-text');
        if (text) text.textContent = event.summary || event.text || '';
    }
    window.prevEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex - 1 + eventsData.length) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex + 1) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.playEvent = function() { const text = document.getElementById('events-player-text'); if (text) { const currentEvent = eventsData[currentEventIndex]; if (currentEvent) { text.textContent = currentEvent.text || currentEvent.summary || ''; text.style.maxHeight = '800px'; text.style.overflowY = 'auto'; } } };
    window.pauseEvent = function() { const text = document.getElementById('events-player-text'); if (text) { const currentEvent = eventsData[currentEventIndex]; if (currentEvent) { text.textContent = currentEvent.summary || currentEvent.text || ''; text.style.maxHeight = '100px'; text.style.overflowY = 'hidden'; } } };
    window.showFullEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; const date = document.getElementById('events-player-date')?.textContent || ''; const text = document.getElementById('events-player-text')?.textContent || ''; showNotification(`📅 ${title}\n📅 ${date}\n\n${text}`); };
    window.openEventComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_comments', { eventTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_likes', { eventTitle: title }); showNotification('❤️ رویداد مورد پسند شما قرار گرفت!'); };

    // =============================================
    // مانیفست اسلایدشو
    // =============================================
    let manifestData = [];
    let slideIndex = 0;
    let autoSlideInterval;
    function loadManifestData() {
        manifestData = [
            { id: 'm1', title: 'کاتالوگ انجمن - صفحه ۱', image: 'data/images/کاتالوگ-انجمن-تما-1_Page1.jpg' },
            { id: 'm2', title: 'کاتالوگ انجمن - صفحه ۲', image: 'data/images/کاتالوگ-انجمن-تما-1_Page2.jpg' },
            { id: 'm3', title: 'کاتالوگ انجمن - صفحه ۳', image: 'data/images/کاتالوگ-انجمن-تما-1_Page3.jpg' },
            { id: 'm4', title: 'کاتالوگ انجمن - صفحه ۴', image: 'data/images/کاتالوگ-انجمن-تما-1_Page4.jpg' },
            { id: 'm5', title: 'کاتالوگ انجمن - صفحه ۵', image: 'data/images/کاتالوگ-انجمن-تما-1_Page5.jpg' },
            { id: 'm6', title: 'کاتالوگ انجمن - صفحه ۶', image: 'data/images/کاتالوگ-انجمن-تما-1_Page6.jpg' }
        ];
        renderManifestSlides(manifestData);
        showSlide(0);
        startAutoSlide();
    }
    function renderManifestSlides(items) {
        const container = document.getElementById('manifest-slideshow');
        if (!container) return;
        container.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.style.minWidth = '100%';
            div.style.padding = '10px';
            div.style.textAlign = 'center';
            div.innerHTML = `<img src="${item.image || 'data/images/placeholder.jpg'}" alt="${item.title}" style="width: 100%; max-height: 550px; object-fit: contain; border-radius: 16px;" onerror="this.src='data/images/placeholder.jpg'">`;
            container.appendChild(div);
        });
        const dotsContainer = document.getElementById('manifest-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            items.forEach((item, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.style.display = 'inline-block';
                dot.style.width = '14px';
                dot.style.height = '14px';
                dot.style.borderRadius = '50%';
                dot.style.background = index === 0 ? '#d4a373' : '#ccc';
                dot.style.margin = '0 6px';
                dot.style.cursor = 'pointer';
                dot.onclick = () => { clearInterval(autoSlideInterval); showSlide(index); startAutoSlide(); };
                dotsContainer.appendChild(dot);
            });
        }
    }
    function showSlide(index) {
        const container = document.getElementById('manifest-slideshow');
        const dots = document.querySelectorAll('#manifest-dots .dot');
        if (!container) return;
        const slides = container.children;
        if (index >= slides.length) slideIndex = 0;
        else if (index < 0) slideIndex = slides.length - 1;
        else slideIndex = index;
        container.style.transform = `translateX(-${slideIndex * 100}%)`;
        dots.forEach((dot, i) => { dot.style.background = i === slideIndex ? '#d4a373' : '#ccc'; });
    }
    window.changeSlide = function(direction) { clearInterval(autoSlideInterval); showSlide(slideIndex + direction); startAutoSlide(); };
    function startAutoSlide() { if (manifestData.length > 1) { autoSlideInterval = setInterval(() => { showSlide(slideIndex + 1); }, 20000); } }

    // =============================================
    // شعر و سایر بخش‌ها
    // =============================================
    function loadPoem() {
        const img = document.getElementById('poem-image');
        if (img) img.src = 'data/images/photo_۲۰۲۴-۰۸-۱۳_۱۱-۵۶-۵۰.jpg';
    }
    window.likePoem = function() { saveInteraction('poem_likes', {}); showNotification('❤️ شعر مورد پسند شما قرار گرفت!'); };
    window.sharePoem = function() { if (navigator.share) { navigator.share({ title: 'شعر انجمن', text: 'این شعر را ببینید:', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href).then(() => showNotification('📤 لینک شعر کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    function loadHelps() {
        const container = document.getElementById('helps-container');
        if (!container) return;
        const helps = [
            { icon: 'fa-hand-holding-heart', title: 'حمایت از کودکان کار', desc: 'کمک به توانمندسازی کودکان کار و خیابان', details: 'این طرح با همکاری سازمان‌های مردم‌نهاد اجرا می‌شود.' },
            { icon: 'fa-tree', title: 'کاشت درخت و حفظ محیط زیست', desc: 'فرهنگ‌سازی برای حفظ محیط زیست و کاشت درخت', details: 'این برنامه در پارک‌های شهر تهران برگزار می‌شود.' }
        ];
        container.innerHTML = '';
        helps.forEach(item => {
            const div = document.createElement('div');
            div.className = 'help-item';
            div.innerHTML = `<i class="fas ${item.icon}"></i><div><div class="help-title">${item.title}</div><div class="help-desc">${item.desc}</div><span class="admin-response"><i class="fas fa-user-check"></i> مدیر پاسخگو</span></div>`;
            div.addEventListener('click', function() { showNotification(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`); });
            container.appendChild(div);
        });
    }

    function loadBuilds() {
        const container = document.getElementById('builds-container');
        if (!container) return;
        const builds = [
            { icon: 'fa-building', title: 'شهر سبز و پایدار', desc: 'طراحی شهری با رویکرد مسئولیت اجتماعی', details: 'این پروژه با مشارکت شهرداری‌ها اجرا می‌شود.' },
            { icon: 'fa-graduation-cap', title: 'آموزش همگانی', desc: 'ارائه آموزش‌های رایگان به جامعه', details: 'دوره‌های آموزشی در حوزه‌های مختلف برگزار می‌شود.' }
        ];
        container.innerHTML = '';
        builds.forEach(item => {
            const div = document.createElement('div');
            div.className = 'help-item';
            div.innerHTML = `<i class="fas ${item.icon}"></i><div><div class="help-title">${item.title}</div><div class="help-desc">${item.desc}</div></div>`;
            div.addEventListener('click', function() { showNotification(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`); });
            container.appendChild(div);
        });
    }

    function loadTestimonials() {
        const container = document.getElementById('testimonials-container');
        if (!container) return;
        const testimonials = [
            { name: 'دکتر محمد رضایی', role: 'عضو هیات مدیره', text: 'انجمن ترویج فرهنگ مسئولیت اجتماعی، بستری ارزشمند برای همکاری و تعامل در حوزه مسئولیت‌پذیری اجتماعی فراهم کرده است.', image: 'placeholder.jpg' }
        ];
        container.innerHTML = '';
        testimonials.forEach(item => {
            const div = document.createElement('div');
            div.className = 'testimonial-item';
            div.innerHTML = `<img src="data/images/${item.image}" alt="${item.name}" onerror="this.src='data/images/placeholder.jpg'"><div class="name">${item.name}</div><div class="role">${item.role}</div><div class="text">"${item.text}"</div>`;
            container.appendChild(div);
        });
    }

    function loadGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;
        const images = [
            { src: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg', title: 'دوره تربیت مشاوران', type: 'خبر' },
            { src: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg', title: 'کارگاه مسئولیت اجتماعی', type: 'رویداد' }
        ];
        container.innerHTML = '';
        images.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.src='data/images/placeholder.jpg'"><div class="gallery-info"><h4>${item.title}</h4><p>${item.type}</p></div>`;
            div.addEventListener('click', function() { showNotification(`🖼️ ${item.title}\nنوع: ${item.type}`); });
            container.appendChild(div);
        });
    }

    function loadSocialLinks() {
        const container = document.getElementById('social-links');
        if (!container) return;
        container.innerHTML = '';
        const platforms = [
            { icon: 'fa-telegram', color: '#0088cc', url: '#' },
            { icon: 'fa-linkedin', color: '#0a66c2', url: '#' },
            { icon: 'fa-instagram', color: '#e4405f', url: '#' },
            { icon: 'fa-play-circle', color: '#e30613', url: '#' }
        ];
        platforms.forEach(p => {
            const a = document.createElement('a');
            a.href = p.url;
            a.target = '_blank';
            a.style.color = p.color;
            a.innerHTML = `<i class="fab ${p.icon}"></i>`;
            container.appendChild(a);
        });
    }

    // =============================================
    // ناوبری
    // =============================================
    function setupNavigation() {
        document.querySelectorAll('.art-toolbar a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) {
                    const knowledgeModule = document.getElementById('knowledge-module');
                    const adminModule = document.getElementById('admin-module');
                    
                    if (page === 'knowledge') {
                        if (knowledgeModule) {
                            knowledgeModule.style.display = 'block';
                            displayKnowledgeBase();
                        }
                        if (adminModule) adminModule.style.display = 'none';
                        return;
                    } else if (page === 'admin') {
                        if (adminModule) {
                            adminModule.style.display = 'block';
                            document.getElementById('admin-panel').style.display = 'none';
                            document.getElementById('admin-login').style.display = 'block';
                        }
                        if (knowledgeModule) knowledgeModule.style.display = 'none';
                        return;
                    } else {
                        if (knowledgeModule) knowledgeModule.style.display = 'none';
                        if (adminModule) adminModule.style.display = 'none';
                    }
                    
                    const target = document.getElementById(page + '-module') || document.getElementById(page) || document.getElementById(page + '-tv');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // =============================================
    // گنجینه دان و مهارت‌های کاربردی
    // =============================================
    let knowledgeBase = [];
    let interactions = [];
    let userKnowledge = [];

    function loadKnowledgeBase() {
        // بارگذاری از فایل
        fetch('data/knowledge-base.json')
            .then(response => {
                if (!response.ok) throw new Error('فایل پیدا نشد');
                return response.json();
            })
            .then(data => {
                knowledgeBase = data.items || [];
                localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
                displayKnowledgeBase();
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری گنجینه:', error);
                // استفاده از داده‌های نمونه در صورت عدم وجود فایل
                knowledgeBase = [
                    {
                        id: 'sample1',
                        type: 'text',
                        section: 'دانستنی‌ها',
                        title: 'مسئولیت اجتماعی چیست؟',
                        content: 'مسئولیت اجتماعی به معنای تعهد فرد یا سازمان به جامعه و محیط زیست است...',
                        source: 'انجمن',
                        date: '۱۴۰۵/۰۱/۰۱',
                        image: 'data/images/placeholder.jpg',
                        tags: ['مسئولیت اجتماعی'],
                        response: 'این یک نمونه محتوای آزمایشی است.'
                    }
                ];
                localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
                displayKnowledgeBase();
            });
        
        const storedInteractions = localStorage.getItem('interactions');
        if (storedInteractions) {
            interactions = JSON.parse(storedInteractions);
        } else {
            interactions = [];
            localStorage.setItem('interactions', JSON.stringify(interactions));
        }

        const storedUserKnowledge = localStorage.getItem('userKnowledge');
        if (storedUserKnowledge) {
            userKnowledge = JSON.parse(storedUserKnowledge);
        } else {
            userKnowledge = [];
            localStorage.setItem('userKnowledge', JSON.stringify(userKnowledge));
        }
        
        displayUserKnowledgeBase();
    }

    function displayKnowledgeBase() {
        const container = document.getElementById('knowledge-base-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (knowledgeBase.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">
                    <i class="fas fa-database" style="font-size: 3rem; color: #f39c12; display: block; margin-bottom: 15px;"></i>
                    <p style="font-size: 1.2rem;">گنجینه دان و مهارت‌های کاربردی در حال تکمیل است...</p>
                    <p>به زودی محتوای ارزشمندی از سوی همراهان روشنایی به این بخش اضافه خواهد شد.</p>
                </div>
            `;
            return;
        }
        
        knowledgeBase.forEach(item => {
            const div = document.createElement('div');
            div.className = 'kb-item';
            div.dataset.section = item.section || 'دانستنی‌ها';
            div.style.cssText = `
                background: #fff; border-radius: 20px; padding: 18px; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
                border-right: 5px solid #f39c12;
                transition: all 0.3s ease;
                cursor: default;
            `;
            
            const typeLabel = { text: 'متن', audio: 'صوتی', video: 'تصویری', image: 'تصویر' };
            const typeIcon = { text: 'fa-file-alt', audio: 'fa-headphones', video: 'fa-video', image: 'fa-image' };
            const typeColors = { text: '#3498db', audio: '#e74c3c', video: '#2ecc71', image: '#9b59b6' };
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="background: ${typeColors[item.type] || '#3498db'}; padding: 3px 12px; border-radius: 20px; font-size: 0.7rem; color: #fff; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
                            <i class="fas ${typeIcon[item.type] || 'fa-file-alt'}"></i>
                            ${typeLabel[item.type] || 'متن'}
                        </span>
                        <span style="font-size: 0.7rem; background: ${item.section === 'دانستنی‌ها' ? '#3498db' : item.section === 'مهارت‌های کاربردی' ? '#2ecc71' : item.section === 'همراهان روشنایی' ? '#e74c3c' : '#9b59b6'}; padding: 2px 10px; border-radius: 20px; color: #fff;">${item.section || 'دانستنی‌ها'}</span>
                        <span style="font-size: 0.7rem; background: #ecf0f1; padding: 2px 10px; border-radius: 20px; color: #7f8c8d;">${item.date || ''}</span>
                    </div>
                    <span style="font-size: 0.7rem; color: #f39c12; background: rgba(243, 156, 18, 0.1); padding: 2px 10px; border-radius: 20px;">${item.source || 'انجمن'}</span>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 12px; margin-bottom: 10px;" onerror="this.src='data/images/placeholder.jpg'">` : ''}
                <div style="font-size: 1.1rem; font-weight: 700; color: #2c3e50; margin: 5px 0;">${item.title || 'بدون عنوان'}</div>
                <div style="color: #34495e; font-size: 0.95rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${item.content || ''}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px;">
                    ${(item.tags || []).map(tag => `<span style="background: #f8f4f0; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; color: #7f8c8d;">#${tag}</span>`).join('')}
                </div>
                <div style="background: #fdf3e8; padding: 10px; border-radius: 12px; margin-top: 10px; border-right: 3px solid #f39c12; font-size: 0.9rem;">
                    <strong style="color: #f39c12;"><i class="fas fa-user-check"></i> پاسخ مدیر:</strong> ${item.response || 'در انتظار پاسخ...'}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
                    <button onclick="window.location.href='#radio-module'" style="background: #3498db; border: none; padding: 4px 12px; border-radius: 30px; color: #fff; font-size: 0.75rem; cursor: pointer; transition: 0.2s;">
                        <i class="fas fa-podcast"></i> ساخت پادکست
                    </button>
                    <button onclick="window.location.href='#tv-module'" style="background: #2ecc71; border: none; padding: 4px 12px; border-radius: 30px; color: #fff; font-size: 0.75rem; cursor: pointer; transition: 0.2s;">
                        <i class="fas fa-slideshare"></i> ساخت اسلایدشو
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // فیلتر بر اساس بخش‌های چهارگانه
    document.querySelectorAll('.section-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.section-filter').forEach(b => {
                b.style.background = '#ecf0f1';
                b.style.color = '#2c3e50';
            });
            this.style.background = '#f39c12';
            this.style.color = '#fff';
            
            const filter = this.dataset.section;
            const items = document.querySelectorAll('.kb-item');
            items.forEach(item => {
                if (filter === 'all' || item.dataset.section === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // =============================================
    // توابع مدیریت و تعاملات
    // =============================================
    function displayUserKnowledgeBase() {
        const container = document.getElementById('user-knowledge-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (userKnowledge.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#7f8c8d;">هنوز محتوایی به گنجینه‌ی دانش شما اضافه نشده است.</p>';
            return;
        }
        
        userKnowledge.forEach(item => {
            const div = document.createElement('div');
            div.className = 'user-kb-item';
            const typeLabel = item.type === 'podcast' ? 'پادکست' : 'اسلایدشو';
            const typeClass = item.type === 'podcast' ? 'ukb-type-podcast' : 'ukb-type-slideshow';
            div.innerHTML = `
                <div>
                    <span class="ukb-type ${typeClass}">${typeLabel}</span>
                    <span class="ukb-title">${item.title || 'بدون عنوان'}</span>
                </div>
                <div style="color: #34495e; margin: 5px 0; font-size: 0.9rem;">${item.content || ''}</div>
                <div class="ukb-meta">${item.date || ''}</div>
            `;
            container.appendChild(div);
        });
    }

    function addToUserKnowledgeBase(content) {
        if (!content) return;
        userKnowledge.unshift(content);
        localStorage.setItem('userKnowledge', JSON.stringify(userKnowledge));
        displayUserKnowledgeBase();
        showNotification('✅ محتوا با موفقیت به گنجینه‌ی دانش شما اضافه شد.');
    }

    // پنل مدیریت
    window.loginAdmin = function() {
        const password = document.getElementById('admin-password').value;
        if (password === 'admin123') {
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('admin-error').style.display = 'none';
            loadInteractions();
        } else {
            document.getElementById('admin-error').style.display = 'block';
        }
    };

    function loadInteractions() {
        const container = document.getElementById('interactions-list');
        if (!container) return;
        container.innerHTML = '';
        
        if (interactions.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#7f8c8d;">هیچ تعاملی دریافت نشده است.</p>';
            return;
        }
        
        interactions.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.id = 'interaction-' + index;
            const typeLabel = { text: 'متن', audio: 'صوتی', video: 'تصویری' };
            div.innerHTML = `
                <div><strong>نوع:</strong> ${typeLabel[item.type] || 'متن'}</div>
                <div><strong>متن:</strong> ${item.text || 'بدون متن'}</div>
                ${item.file ? `<div><strong>فایل:</strong> <a href="${item.file}" target="_blank">دانلود</a></div>` : ''}
                <div><strong>تاریخ:</strong> ${item.date || ''}</div>
                <div style="margin-top: 8px;">
                    <label><strong>پاسخ مدیر:</strong></label>
                    <textarea id="response-${index}" placeholder="پاسخ خود را بنویسید...">${item.response || ''}</textarea>
                </div>
                <div class="admin-actions">
                    <button class="btn-approve" onclick="approveInteraction(${index})"><i class="fas fa-check"></i> تأیید و ارسال به گنجینه</button>
                    <button class="btn-reject" onclick="rejectInteraction(${index})"><i class="fas fa-times"></i> رد</button>
                    <button class="btn-edit" onclick="editInteraction(${index})"><i class="fas fa-edit"></i> ویرایش</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    window.approveInteraction = function(index) {
        const item = interactions[index];
        const responseText = document.getElementById('response-' + index).value;
        item.response = responseText || 'پاسخی ثبت نشده است.';
        
        const newItem = {
            id: Date.now(),
            type: 'text',
            section: 'دانستنی‌ها',
            title: item.title || 'تعامل کاربر',
            content: item.text || '',
            source: 'تعامل کاربران',
            date: new Date().toLocaleDateString('fa-IR'),
            image: 'data/images/placeholder.jpg',
            tags: ['تعامل کاربران'],
            response: item.response
        };
        knowledgeBase.unshift(newItem);
        localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
        displayKnowledgeBase();
        
        interactions.splice(index, 1);
        localStorage.setItem('interactions', JSON.stringify(interactions));
        loadInteractions();
        showNotification('✅ تعامل تأیید و به گنجینه دانش اضافه شد.');
    };

    window.rejectInteraction = function(index) {
        if (confirm('آیا از رد این تعامل مطمئن هستید؟')) {
            interactions.splice(index, 1);
            localStorage.setItem('interactions', JSON.stringify(interactions));
            loadInteractions();
            showNotification('❌ تعامل رد شد.');
        }
    };

    window.editInteraction = function(index) {
        const item = interactions[index];
        const newText = prompt('متن را ویرایش کنید:', item.text);
        if (newText !== null) {
            item.text = newText;
            localStorage.setItem('interactions', JSON.stringify(interactions));
            loadInteractions();
            showNotification('✅ تعامل ویرایش شد.');
        }
    };

    // دریافت تعاملات
    window.sendInteraction = function(type) {
        const textarea = document.getElementById('interact-text');
        const message = textarea.value.trim();
        
        if (!message && type === 'text') {
            showNotification('لطفاً یک متن وارد کنید.');
            return;
        }
        
        const interaction = {
            id: Date.now(),
            type: type || 'text',
            text: message || 'پیام صوتی/تصویری',
            date: new Date().toLocaleDateString('fa-IR'),
            response: '',
            file: null
        };
        
        interactions.unshift(interaction);
        localStorage.setItem('interactions', JSON.stringify(interactions));
        
        const responseArea = document.getElementById('response-area');
        const responses = [
            'از نظر شما متشکریم. این موضوع با اهداف انجمن همخوانی دارد و بررسی می‌شود.',
            'پیشنهاد شما ثبت شد. در جلسات آینده مطرح خواهد شد.',
            'سوال شما به تیم تخصصی ارجاع داده شد. پاسخ کامل اعلام می‌شود.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        responseArea.innerHTML = `<i class="fas fa-robot" style="margin-left:8px;"></i><span style="font-weight:700; color:#d4a373;">مدیر پاسخگو</span> ${randomResponse}`;
        
        textarea.value = '';
        showNotification('✅ پیام شما با موفقیت ارسال شد.');
    };

    // ضبط صدا
    let mediaRecorder;
    let audioChunks = [];

    window.startRecording = function() {
        const status = document.getElementById('recording-status');
        const stopBtn = document.getElementById('stopRecordingBtn');
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                audioChunks = [];
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    const interaction = {
                        id: Date.now(),
                        type: 'audio',
                        text: 'پیام صوتی کاربر',
                        date: new Date().toLocaleDateString('fa-IR'),
                        response: '',
                        file: audioUrl
                    };
                    interactions.unshift(interaction);
                    localStorage.setItem('interactions', JSON.stringify(interactions));
                    
                    showNotification('✅ پیام صوتی شما با موفقیت ارسال شد.');
                    status.style.display = 'none';
                    stopBtn.style.display = 'none';
                };
                
                status.style.display = 'block';
                stopBtn.style.display = 'inline-block';
                status.textContent = '🔴 در حال ضبط... (برای توقف کلیک کنید)';
                status.classList.add('active');
            })
            .catch(error => {
                console.error('خطا در دسترسی به میکروفون:', error);
                showNotification('❌ دسترسی به میکروفون امکان‌پذیر نیست.');
            });
    };

    window.stopRecording = function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            document.getElementById('recording-status').classList.remove('active');
        }
    };

    window.uploadFile = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result;
            const type = file.type.startsWith('video') ? 'video' : 'image';
            
            const interaction = {
                id: Date.now(),
                type: type,
                text: `فایل ${file.name}`,
                date: new Date().toLocaleDateString('fa-IR'),
                response: '',
                file: fileUrl
            };
            interactions.unshift(interaction);
            localStorage.setItem('interactions', JSON.stringify(interactions));
            
            showNotification('✅ فایل شما با موفقیت آپلود شد.');
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    // تولید پادکست
    let isGenerating = false;
    let lastGeneratedContent = null;

    window.generatePodcastSimple = function() {
        if (isGenerating) return;
        isGenerating = true;
        
        const items = knowledgeBase.filter(item => item.type === 'text').slice(0, 5);
        if (items.length === 0) {
            showNotification('❌ هیچ محتوای متنی در گنجینه برای تولید پادکست وجود ندارد.');
            isGenerating = false;
            return;
        }
        
        showNotification('🎙️ در حال تولید پادکست از گنجینه دانش... لطفاً چند لحظه صبر کنید.');
        
        setTimeout(() => {
            const text = items.map(item => item.title + '. ' + item.content).join(' ');
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'fa-IR';
            speech.rate = 0.9;
            window.speechSynthesis.speak(speech);
            
            lastGeneratedContent = {
                type: 'podcast',
                title: 'پادکست تولیدشده از گنجینه',
                content: 'پادکستی شامل ' + items.length + ' مطلب از گنجینه دانش',
                date: new Date().toLocaleDateString('fa-IR')
            };
            
            showNotification('✅ پادکست با موفقیت تولید شد. اگر مفید بود، روی دکمه "ارسال به گنجینه دانش" کلیک کنید.');
            
            const sendContainer = document.getElementById('radio-send-container');
            if (sendContainer) {
                sendContainer.innerHTML = `
                    <button onclick="sendToUserKnowledge()" style="padding: 10px 20px; background: #8e44ad; border: none; border-radius: 30px; color: #fff; font-weight: 600; cursor: pointer; margin: 5px;">
                        <i class="fas fa-save"></i> ارسال به گنجینه دانش
                    </button>
                `;
            }
            
            isGenerating = false;
        }, 2000);
    };

    // تولید اسلایدشو
    window.generateSlideshowSimple = function() {
        if (isGenerating) return;
        isGenerating = true;
        
        const items = knowledgeBase.slice(0, 10);
        if (items.length === 0) {
            showNotification('❌ هیچ محتوایی در گنجینه برای تولید اسلایدشو وجود ندارد.');
            isGenerating = false;
            return;
        }
        
        showNotification('📺 در حال تولید اسلایدشو از گنجینه دانش... لطفاً چند لحظه صبر کنید.');
        
        setTimeout(() => {
            let slideshowHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                    <button onclick="this.parentElement.remove()" style="position: absolute; top: 20px; right: 20px; background: #e74c3c; border: none; border-radius: 50%; color: #fff; font-size: 1.5rem; width: 50px; height: 50px; cursor: pointer; z-index: 10000;">✕</button>
                    <div style="max-width: 800px; width: 100%; max-height: 80vh; overflow-y: auto; background: #fff; border-radius: 20px; padding: 30px; color: #2c3e50;">
            `;
            
            items.forEach((item, index) => {
                slideshowHTML += `
                    <div style="border-bottom: 2px solid #e0c9a6; padding: 20px 0; ${index === 0 ? 'padding-top: 0;' : ''}">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="background: #f39c12; color: #fff; padding: 2px 12px; border-radius: 20px; font-size: 0.8rem;">${index + 1}</span>
                            <h3 style="margin: 0; color: #2c3e50;">${item.title || 'بدون عنوان'}</h3>
                        </div>
                        <p style="color: #34495e; line-height: 1.6;">${item.content || ''}</p>
                        ${item.image ? `<div style="text-align: center;"><img src="${item.image}" style="max-width: 100%; max-height: 200px; border-radius: 10px; margin: 10px 0;"></div>` : ''}
                        <div style="background: #f8f4f0; padding: 10px; border-radius: 10px; margin-top: 10px;">
                            <strong>پاسخ مدیر:</strong> ${item.response || 'در انتظار پاسخ...'}
                        </div>
                        <div style="font-size: 0.8rem; color: #7f8c8d; margin-top: 8px;">${item.date || ''}</div>
                    </div>
                `;
            });
            
            slideshowHTML += `
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', slideshowHTML);
            
            lastGeneratedContent = {
                type: 'slideshow',
                title: 'اسلایدشو تولیدشده از گنجینه',
                content: 'اسلایدشو شامل ' + items.length + ' محتوا از گنجینه دانش',
                date: new Date().toLocaleDateString('fa-IR')
            };
            
            showNotification('✅ اسلایدشو با موفقیت تولید شد. اگر مفید بود، روی دکمه "ارسال به گنجینه دانش" کلیک کنید.');
            
            const sendContainer = document.getElementById('tv-send-container');
            if (sendContainer) {
                sendContainer.innerHTML = `
                    <button onclick="sendToUserKnowledge()" style="padding: 10px 20px; background: #8e44ad; border: none; border-radius: 30px; color: #fff; font-weight: 600; cursor: pointer; margin: 5px;">
                        <i class="fas fa-save"></i> ارسال به گنجینه دانش
                    </button>
                `;
            }
            
            isGenerating = false;
        }, 2000);
    };

    // ارسال به گنجینه دانش کاربر
    window.sendToUserKnowledge = function() {
        if (lastGeneratedContent) {
            addToUserKnowledgeBase(lastGeneratedContent);
            document.querySelectorAll('#radio-send-container, #tv-send-container').forEach(container => {
                container.innerHTML = '';
            });
            showNotification('✅ محتوا با موفقیت به گنجینه دانش شما اضافه شد.');
        } else {
            showNotification('❌ هیچ محتوایی برای ارسال وجود ندارد.');
        }
    };

    window.exportKnowledgeBase = function() {
        const data = JSON.stringify(knowledgeBase, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `گنجینه_دانش_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('✅ فایل گنجینه دانش دانلود شد.');
    };

    window.clearKnowledgeBase = function() {
        if (confirm('آیا از پاک کردن تمام گنجینه دانش مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) {
            knowledgeBase = [];
            localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
            displayKnowledgeBase();
            showNotification('✅ گنجینه دانش پاک شد.');
        }
    };

    // =============================================
    // نوار ابزار شناور
    // =============================================
    function setupFloatingToolbar() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });

        document.getElementById('scrollToTop').addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('scrollToBottom').addEventListener('click', function() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // =============================================
    // بارگذاری اولیه
    // =============================================
    function init() {
        startSloganRotation();
        loadRadioData();
        loadTvData();
        loadNewsData();
        loadEventsData();
        loadManifestData();
        loadPoem();
        loadHelps();
        loadBuilds();
        loadTestimonials();
        loadGallery();
        loadSocialLinks();
        setupNavigation();
        setupFloatingToolbar();
        loadKnowledgeBase();
        console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
    }

    init();
});
