// ===== script.js - نسخه کامل با تمام بخش‌ها و قابلیت‌های جدید =====
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
    // ۲. توابع کمکی
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
    // ۳. رادیو هوشمند
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
        radioPlayer.play().catch(e => console.log('پخش خودکار نیاز به تعامل دارد.'));
    }

    window.playRadio = function() { if (radioPlayer) { radioPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopRadio = function() { if (radioPlayer) { radioPlayer.pause(); radioPlayer.currentTime = 0; } };
    window.nextRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex + 1) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.prevRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex - 1 + radioData.length) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.likeRadio = function() { const track = radioData[currentRadioIndex]; if (!track) return; saveInteraction('radio_likes', { title: track.title }); showNotification('❤️ برنامه مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۴. تلویزیون هوشمند
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
        tvPlayer.play().catch(e => console.log('پخش خودکار نیاز به تعامل دارد.'));
    }

    window.playTv = function() { if (tvPlayer) { tvPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopTv = function() { if (tvPlayer) { tvPlayer.pause(); tvPlayer.currentTime = 0; } };
    window.nextTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex + 1) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.prevTv = function() { if (tvData.length === 0) return; currentTvIndex = (currentTvIndex - 1 + tvData.length) % tvData.length; loadTvChannel(tvData[currentTvIndex]); renderTvPlaylist(tvData); };
    window.likeTv = function() { const channel = tvData[currentTvIndex]; if (!channel) return; saveInteraction('tv_likes', { title: channel.title }); showNotification('❤️ کانال مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۵. تلویزیون اخبار
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
                text: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» صبح سه‌شنبه ۲۳ تیر ماه ۱۴۰۵ با حضور مدیران ارشد پژوهشگاه میراث فرهنگی و گردشگری و انجمن ترویج فرهنگ مسئولیت اجتماعی در محل پژوهشگاه برگزار شد. در ابتدای این نشست، دکتر ناصر رضایی رئیس گروه پژوهشی گردشگری، دکتر حسینعلی متولی رئیس هیات مدیره انجمن و دکتر محمدابراهیم زارعی رئیس پژوهشگاه میراث‌فرهنگی و گردشگری به ایراد سخن پرداختند. دکتر رضایی، با اشاره به اهمیت مسئولیت اجتماعی در صنعت گردشگری گفت: «گردشگری تنها یک فعالیت اقتصادی نیست، بلکه پدیده‌ای عمیقاً اجتماعی است و مسئولیت اجتماعی باید به عنوان یکی از ارکان اصلی آن مورد توجه قرار گیرد.»', 
                image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg' 
            },
            { 
                id: 'n2', 
                title: 'بیانیه انجمن به‌مناسبت پایان تخاصم نظامی', 
                date: '۲۵ تیر ۱۴۰۵', 
                summary: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی را به فال نیک گرفت.', 
                text: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی با آمریکا را به فال نیک گرفت و بر ضرورت بازسازی اعتماد عمومی و تقویت همبستگی ملی تأکید کرد. در این بیانیه آمده است: «مسئولیت اجتماعی، فراتر از مرزهای سیاسی است و ما وظیفه داریم از هر فرصتی برای کاهش تنش‌ها و افزایش همدلی در جامعه استفاده کنیم.»', 
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

    window.prevNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex + 1) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.playNews = function() { 
        const text = document.getElementById('news-player-text');
        if (text) {
            const currentNews = newsData[currentNewsIndex];
            if (currentNews) {
                text.textContent = currentNews.text || currentNews.summary || '';
                text.style.maxHeight = '800px';
                text.style.overflowY = 'auto';
            }
        }
    };
    window.pauseNews = function() { 
        const text = document.getElementById('news-player-text');
        if (text) {
            const currentNews = newsData[currentNewsIndex];
            if (currentNews) {
                text.textContent = currentNews.summary || currentNews.text || '';
                text.style.maxHeight = '100px';
                text.style.overflowY = 'hidden';
            }
        }
    };
    window.showFullNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; const date = document.getElementById('news-player-date')?.textContent || ''; const text = document.getElementById('news-player-text')?.textContent || ''; showNotification(`📰 ${title}\n📅 ${date}\n\n${text}`); };
    window.openComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_comments', { newsTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_likes', { newsTitle: title }); showNotification('❤️ خبر مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۶. تلویزیون رویدادها
    // =============================================
    let eventsData = [];
    let currentEventIndex = 0;

    function loadEventsData() {
        eventsData = [
            { 
                id: 'e1', 
                title: 'کارگاه مسئولیت اجتماعی در صنعت گردشگری', 
                date: '۵ مرداد ۱۴۰۵', 
                summary: 'کارگاه آموزشی با حضور متخصصان صنعت گردشگری برگزار می‌شود.', 
                text: 'این کارگاه با هدف آشنایی فعالان صنعت گردشگری با مفاهیم و کاربردهای مسئولیت اجتماعی برگزار می‌شود. در این کارگاه، مباحثی مانند توسعه پایدار، حفاظت از میراث فرهنگی و توانمندسازی جوامع محلی مورد بررسی قرار خواهد گرفت. شرکت‌کنندگان با نمونه‌های موفق مسئولیت اجتماعی در صنعت گردشگری آشنا می‌شوند.', 
                image: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg' 
            },
            { 
                id: 'e2', 
                title: 'نشست تخصصی مسئولیت اجتماعی در مدیریت شهری', 
                date: '۱۲ مرداد ۱۴۰۵', 
                summary: 'نشست تخصصی با موضوع نقش مسئولیت اجتماعی در مدیریت شهری برگزار می‌شود.', 
                text: 'این نشست با حضور مدیران شهری و فعالان حوزه مسئولیت اجتماعی برگزار می‌شود. موضوعات محوری نشست شامل: عدالت شهری، مشارکت شهروندان، توسعه پایدار و شفافیت در مدیریت شهری است. هدف این نشست، ارائه راهکارهای عملی برای ارتقای کیفیت زندگی شهروندان از طریق مسئولیت اجتماعی است.', 
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
    window.playEvent = function() { 
        const text = document.getElementById('events-player-text');
        if (text) {
            const currentEvent = eventsData[currentEventIndex];
            if (currentEvent) {
                text.textContent = currentEvent.text || currentEvent.summary || '';
                text.style.maxHeight = '800px';
                text.style.overflowY = 'auto';
            }
        }
    };
    window.pauseEvent = function() { 
        const text = document.getElementById('events-player-text');
        if (text) {
            const currentEvent = eventsData[currentEventIndex];
            if (currentEvent) {
                text.textContent = currentEvent.summary || currentEvent.text || '';
                text.style.maxHeight = '100px';
                text.style.overflowY = 'hidden';
            }
        }
    };
    window.showFullEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; const date = document.getElementById('events-player-date')?.textContent || ''; const text = document.getElementById('events-player-text')?.textContent || ''; showNotification(`📅 ${title}\n📅 ${date}\n\n${text}`); };
    window.openEventComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_comments', { eventTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeEvent = function() { const title = document.getElementById('events-player-title')?.textContent || ''; saveInteraction('event_likes', { eventTitle: title }); showNotification('❤️ رویداد مورد پسند شما قرار گرفت!'); };

    // =============================================
    // ۷. اسلایدشو مانیفست
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
    // ۸. شعر
    // =============================================
    function loadPoem() {
        const img = document.getElementById('poem-image');
        if (img) img.src = 'data/images/photo_۲۰۲۴-۰۸-۱۳_۱۱-۵۶-۵۰.jpg';
    }

    window.likePoem = function() { saveInteraction('poem_likes', {}); showNotification('❤️ شعر مورد پسند شما قرار گرفت!'); };
    window.sharePoem = function() { if (navigator.share) { navigator.share({ title: 'شعر انجمن', text: 'این شعر را ببینید:', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href).then(() => showNotification('📤 لینک شعر کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    // =============================================
    // ۹. همیاری‌های اجتماعی
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
    // ۱۰. آنچه با هم می‌سازیم
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
    // ۱۱. نظرات همراهان
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
    // ۱۲. گالری
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
    // ۱۳. تعامل هوشمند
    // =============================================
    window.sendInteraction = function() {
        const textarea = document.getElementById('interact-text');
        const responseArea = document.getElementById('response-area');
        const message = textarea.value.trim();
        if (!message) {
            responseArea.innerHTML = `<i class="fas fa-robot" style="margin-left:8px;"></i><span style="font-weight:700; color:#d4a373;">مدیر پاسخگو</span> لطفاً یک متن برای ارسال وارد کنید.`;
            return;
        }
        const responses = [
            'از نظر شما متشکریم. این موضوع با اهداف انجمن همخوانی دارد و بررسی می‌شود.',
            'پیشنهاد شما ثبت شد. در جلسات آینده مطرح خواهد شد.',
            'سوال شما به تیم تخصصی ارجاع داده شد. پاسخ کامل اعلام می‌شود.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        responseArea.innerHTML = `<i class="fas fa-robot" style="margin-left:8px;"></i><span style="font-weight:700; color:#d4a373;">مدیر پاسخگو</span> ${randomResponse}`;
        saveInteraction('general', { message: message, response: randomResponse });
        textarea.value = '';
    };

    // =============================================
    // ۱۴. شبکه‌های اجتماعی
    // =============================================
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
    // ۱۵. ناوبری
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
    // ۱۶. دکمه‌های نوار ابزار شناور (شب/روز و آسانسور)
    // =============================================
    function setupFloatingToolbar() {
        // دکمه تغییر حالت شب/روز
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // بررسی وضعیت ذخیره‌شده در localStorage
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

        // دکمه رفتن به بالای صفحه
        const scrollToTopBtn = document.getElementById('scrollToTop');
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // دکمه رفتن به پایین صفحه
        const scrollToBottomBtn = document.getElementById('scrollToBottom');
        scrollToBottomBtn.addEventListener('click', function() {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // ۱۷. بارگذاری اولیه
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
        console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
    }

    init();
});
