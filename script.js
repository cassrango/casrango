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
    window.nextEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex + 1) %
