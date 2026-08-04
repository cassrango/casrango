// ===== script.js - نسخه به‌روزشده با مدیریت چهار پخش‌کننده =====
document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // ۱. چرخش شعارها
    // =============================================
    let sloganInterval = null;

    function startSloganRotation() {
        if (sloganInterval) {
            clearInterval(sloganInterval);
            sloganInterval = null;
        }
        const sloganItems = document.querySelectorAll('.slogan-bar .slogan-item');
        if (sloganItems.length > 0) {
            let sloganIndex = 0;
            sloganItems.forEach((el, i) => {
                el.classList.toggle('show', i === sloganIndex);
            });
            sloganInterval = setInterval(() => {
                sloganIndex = (sloganIndex + 1) % sloganItems.length;
                sloganItems.forEach((el, i) => {
                    el.classList.toggle('show', i === sloganIndex);
                });
            }, 5000);
        }
    }

    // =============================================
    // ۲. نوار ابزار متحرک (Ticker)
    // =============================================
    let tickerInterval = null;

    function startTickerRotation() {
        if (tickerInterval) {
            clearInterval(tickerInterval);
            tickerInterval = null;
        }
        const tickerContent = document.getElementById('ticker-content');
        if (!tickerContent) return;
        const items = tickerContent.querySelectorAll('span');
        if (items.length <= 1) return;
        let currentIndex = 0;
        items.forEach((el, i) => {
            el.style.display = i === 0 ? 'inline-block' : 'none';
        });
        tickerInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            items.forEach((el, i) => {
                el.style.display = i === currentIndex ? 'inline-block' : 'none';
            });
        }, 5000);
    }

    // =============================================
    // ۳. توابع کمکی
    // =============================================
    function saveInteraction(type, data) {
        const key = 'interactions_' + type;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        items.push({ ...data, timestamp: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(items));
    }

    function showNotification(message) {
        alert(message);
    }

    // =============================================
    // ۴. رادیو هوشمند
    // =============================================
    let radioData = [];
    let currentRadioIndex = 0;
    const radioPlayer = document.getElementById('radio-player');

    function loadRadioData() {
        // داده‌های آزمایشی
        radioData = [
            { id: 'r1', title: 'برنامه اول - معرفی انجمن', file: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/audio1.mp3.mp3', date: '۱۴۰۵/۰۴/۲۵' },
            { id: 'r2', title: 'برنامه دوم - مسئولیت اجتماعی', file: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/audio1.mp3.mp3', date: '۱۴۰۵/۰۴/۲۰' }
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
            div.innerHTML = `<span class="title">${track.title}</span><span class="date">${track.date || ''}</span>`;
            div.onclick = () => {
                currentRadioIndex = index;
                loadRadioTrack(track);
                renderRadioPlaylist(tracks);
            };
            container.appendChild(div);
        });
    }

    function loadRadioTrack(track) {
        if (!radioPlayer || !track) return;
        radioPlayer.src = track.file || '';
        radioPlayer.load();
        radioPlayer.play().catch(e => {
            console.log('پخش خودکار نیاز به تعامل دارد.');
        });
    }

    window.playRadio = function() { if (radioPlayer) { radioPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopRadio = function() { if (radioPlayer) { radioPlayer.pause(); radioPlayer.currentTime = 0; } };
    window.nextRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex + 1) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.prevRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex - 1 + radioData.length) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.likeRadio = function() { const track = radioData[currentRadioIndex]; if (!track) return; saveInteraction('radio_likes', { title: track.title }); showNotification('❤️ برنامه مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۵. تلویزیون هوشمند
    // =============================================
    let tvData = [];
    let currentTvIndex = 0;
    const tvPlayer = document.getElementById('tv-player');

    function loadTvData() {
        // داده‌های آزمایشی
        tvData = [
            { id: 't1', title: 'کانال اول - معرفی انجمن', video: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/video1.mp4.mp4' },
            { id: 't2', title: 'کانال دوم - نشست تخصصی', video: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/video1.mp4.mp4' }
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
            div.innerHTML = `<span class="title">${channel.title}</span>`;
            div.onclick = () => {
                currentTvIndex = index;
                loadTvChannel(channel);
                renderTvPlaylist(channels);
            };
            container.appendChild(div);
        });
    }

    function loadTvChannel(channel) {
        if (!tvPlayer || !channel) return;
        tvPlayer.src = channel.video || '';
        tvPlayer.load();
        tvPlayer.play().catch(e => {
            console.log('پخش خودکار نیاز به تعامل دارد.');
        });
    }

    window.playTv = function() { if (tvPlayer) { tvPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopTv = function() { if (tvPlayer) { tvPlayer.pause(); tvPlayer.currentTime = 0; } };
    window.nextTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex + 1) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.prevTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex - 1 + tvData.length) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.likeTv = function() { const channel = tvData[currentTvIndex]; if (!channel) return; saveInteraction('tv_likes', { title: channel.title }); showNotification('❤️ کانال مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۶. تلویزیون اخبار
    // =============================================
    let newsData = [];
    let currentNewsIndex = 0;

    function loadNewsData() {
        // داده‌های آزمایشی
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
            div.style.cssText = 'padding: 10px 12px; background: rgba(255,255,255,0.6); border-radius: 10px; cursor: pointer; transition: 0.2s; border-right: 3px solid #f1c40f; margin-bottom: 6px;';
            div.innerHTML = `<strong>${item.title}</strong><br><span style="font-size: 0.8rem; color: #3a5e77;">${item.date}</span>`;
            div.onclick = function() {
                loadNews(item);
                document.querySelectorAll('#news-list div').forEach(el => { el.style.background = 'rgba(255,255,255,0.6)'; });
                this.style.background = 'rgba(241, 196, 15, 0.15)';
                currentNewsIndex = index;
            };
            listContainer.appendChild(div);
        });
    }

    function loadNews(news) {
        if (!news) return;
        const img = document.getElementById('news-player-image');
        if (img) {
            img.src = news.image || 'data/images/placeholder.jpg';
            img.onerror = function() { this.src = 'data/images/placeholder.jpg'; };
        }
        const title = document.getElementById('news-player-title');
        if (title) title.textContent = news.title || '';
        const date = document.getElementById('news-player-date');
        if (date) date.textContent = news.date || '';
        const text = document.getElementById('news-player-text');
        if (text) text.textContent = news.summary || news.text || '';
    }

    window.prevNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex + 1) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.showFullNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; const date = document.getElementById('news-player-date')?.textContent || ''; const text = document.getElementById('news-player-text')?.textContent || ''; showNotification(`📰 ${title}\n📅 ${date}\n\n${text}`); };
    window.openComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_comments', { newsTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_likes', { newsTitle: title }); showNotification('❤️ خبر مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۷. تلویزیون رویدادها
    // =============================================
    let eventsData = [];
    let currentEventIndex = 0;

    function loadEventsData() {
        // داده‌های آزمایشی
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
            div.style.cssText = 'padding: 10px 12px; background: rgba(255,255,255,0.6); border-radius: 10px; cursor: pointer; transition: 0.2s; border-right: 3px solid #2ecc71; margin-bottom: 6px;';
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
        if (img) {
            img.src = event.image || 'data/images/placeholder.jpg';
            img.onerror = function() { this.src = 'data/images/placeholder.jpg'; };
        }
        const title = document.getElementById('events-player-title');
        if (title) title.textContent = event.title || '';
        const date = document.getElementById('events-player-date');
        if (date) date.textContent = event.date || '';
        const text = document.getElementById('events-player-text');
        if (text) text.textContent = event.summary || event.text || '';
    }

    window.prevEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex - 1 + eventsData.length) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex + 1) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.showFullEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; const date = document.getElementById('events-player-date')?.textContent || ''; const text = document.getElementById('events-player-text')?.textContent || ''; showNotification(`📅 ${title}\n📅 ${date}\n\n${text}`); };
    window.openEventComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_comments', { eventTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_likes', { eventTitle: title }); showNotification('❤️ رویداد مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۸. اسلایدشو مانیفست
    // =============================================
    let manifestData = [];
    let slideIndex = 0;
    let autoSlideInterval;

    function loadManifestData() {
        manifestData = [
            { id: 'm1', title: 'مسئولیت اجتماعی', image: 'data/images/58b4b5ae-5ff7-4505-b646-5a3a32e589ac-300x296.jpg' },
            { id: 'm2', title: 'همیاری اجتماعی', image: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg' },
            { id: 'm3', title: 'گردشگری پایدار', image: 'data/images/5d77aa63-8167-46b7-a40d-58f80391ddd3-600x422.jpg' }
        ];
        renderManifestSlides(manifestData);
        showSlide(0);
        startAutoSlide();
    }

    function renderManifestSlides(manifestItems) {
        const container = document.getElementById('manifest-slideshow');
        if (!container) return;
        container.innerHTML = '';
        manifestItems.forEach(item => {
            const div = document.createElement('div');
            div.style.minWidth = '100%';
            div.style.background = '#f5efe8';
            div.style.padding = '15px';
            div.style.textAlign = 'center';
            div.innerHTML = `<img src="${item.image || 'data/images/placeholder.jpg'}" alt="${item.title}" style="width: 100%; max-height: 500px; object-fit: contain; border-radius: 12px;" onerror="this.src='data/images/placeholder.jpg'">`;
            container.appendChild(div);
        });
        const dotsContainer = document.getElementById('manifest-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            manifestItems.forEach((item, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.style.display = 'inline-block';
                dot.style.width = '12px';
                dot.style.height = '12px';
                dot.style.borderRadius = '50%';
                dot.style.background = index === 0 ? '#d4a373' : '#ccc';
                dot.style.margin = '0 4px';
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
    // ۹. شعر
    // =============================================
    function loadPoem() {
        const img = document.getElementById('poem-image');
        if (img) img.src = 'data/images/photo_۲۰۲۴-۰۸-۱۳_۱۱-۵۶-۵۰.jpg';
    }
    window.likePoem = function() { saveInteraction('poem_likes', {}); showNotification('❤️ شعر مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۱۰. همیاری‌های اجتماعی
    // =============================================
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

    // =============================================
    // ۱۱. آنچه با هم می‌سازیم
    // =============================================
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

    // =============================================
    // ۱۲. نظرات همراهان
    // =============================================
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

    // =============================================
    // ۱۳. گالری
    // =============================================
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

    // =============================================
    // ۱۴. تعامل هوشمند
    // =============================================
    window.sendInteraction = function() {
        const textarea = document.getElementById('interact-text');
        const responseArea = document.getElementById('response-area');
        const message = textarea.value.trim();
        if (!message) {
            responseArea.innerHTML = `<i class="fas fa-robot" style="margin-left:8px;"></i><span class="admin-tag">مدیر پاسخگو</span> لطفاً یک متن برای ارسال وارد کنید.`;
            return;
        }
        const responses = [
            'از نظر شما متشکریم. این موضوع با اهداف انجمن همخوانی دارد و بررسی می‌شود.',
            'پیشنهاد شما ثبت شد. در جلسات آینده مطرح خواهد شد.',
            'سوال شما به تیم تخصصی ارجاع داده شد. پاسخ کامل اعلام می‌شود.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        responseArea.innerHTML = `<i class="fas fa-robot" style="margin-left:8px;"></i><span class="admin-tag">مدیر پاسخگو</span> ${randomResponse}`;
        saveInteraction('general', { message: message, response: randomResponse });
        textarea.value = '';
    };

    // =============================================
    // ۱۵. شبکه‌های اجتماعی
    // =============================================
    function loadSocialLinks() {
        const container = document.getElementById('social-links');
        if (!container) return;
        container.innerHTML = '';
        const platforms = [
            { key: 'telegram', icon: 'fa-telegram', color: '#0088cc', url: '#' },
            { key: 'linkedin', icon: 'fa-linkedin', color: '#0a66c2', url: '#' },
            { key: 'instagram', icon: 'fa-instagram', color: '#e4405f', url: '#' },
            { key: 'aparat', icon: 'fa-play-circle', color: '#e30613', url: '#' }
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
    // ۱۶. ناوبری
    // =============================================
    function setupNavigation() {
        document.querySelectorAll('.art-toolbar a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) {
                    const target = document.getElementById(page + '-module') || document.getElementById(page) || document.getElementById(page + '-tv');
                    if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
                }
            });
        });
    }

    // =============================================
    // ۱۷. بارگذاری اولیه
    // =============================================
    function init() {
        startSloganRotation();
        startTickerRotation();
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
        console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
    }

    init();
});
