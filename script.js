// ===== script.js - نسخه کامل نهایی =====
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
    // بنرهای متحرک شعار
    // =============================================
    let bannerIndex = 0;
    const banners = document.querySelectorAll('.banner-slide');
    function showBanner(index) {
        banners.forEach((b, i) => { b.classList.toggle('active', i === index); });
    }
    function nextBanner() {
        bannerIndex = (bannerIndex + 1) % banners.length;
        showBanner(bannerIndex);
    }
    if (banners.length > 0) {
        showBanner(0);
        setInterval(nextBanner, 4000);
    }

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
    // تلویزیون اخبار
    // =============================================
    let newsData = [];
    let currentNewsIndex = 0;
    function loadNewsData() {
        newsData = [
            { id: 'n1', title: 'افتتاحیه دوره تربیت مشاوران مسئولیت اجتماعی', date: '۲۹ تیر ۱۴۰۵', summary: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» با حضور مدیران ارشد برگزار شد.', text: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» صبح سه‌شنبه ۲۳ تیر ماه ۱۴۰۵ با حضور مدیران ارشد پژوهشگاه میراث فرهنگی و گردشگری و انجمن ترویج فرهنگ مسئولیت اجتماعی در محل پژوهشگاه برگزار شد. در ابتدای این نشست، دکتر ناصر رضایی رئیس گروه پژوهشی گردشگری، دکتر حسینعلی متولی رئیس هیات مدیره انجمن و دکتر محمدابراهیم زارعی رئیس پژوهشگاه میراث‌فرهنگی و گردشگری به ایراد سخن پرداختند. دکتر رضایی، با اشاره به اهمیت مسئولیت اجتماعی در صنعت گردشگری گفت: «گردشگری تنها یک فعالیت اقتصادی نیست، بلکه پدیده‌ای عمیقاً اجتماعی است و مسئولیت اجتماعی باید به عنوان یکی از ارکان اصلی آن مورد توجه قرار گیرد.»', image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg' },
            { id: 'n2', title: 'بیانیه انجمن به‌مناسبت پایان تخاصم نظامی با آمریکا', date: '۲۵ تیر ۱۴۰۵', summary: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی با آمریکا را به فال نیک گرفت.', text: 'انجمن ترویج فرهنگ مسئولیت اجتماعی با صدور بیانیه‌ای، پایان تخاصم نظامی با آمریکا را به فال نیک گرفت و بر ضرورت بازسازی اعتماد عمومی و تقویت همبستگی ملی تأکید کرد. در این بیانیه آمده است: «مسئولیت اجتماعی، فراتر از مرزهای سیاسی است و ما وظیفه داریم از هر فرصتی برای کاهش تنش‌ها و افزایش همدلی در جامعه استفاده کنیم.»', image: 'data/images/507bc7e4-02f4-4e20-bb9c-1f343ab4493a-600x400.jpg' },
            { id: 'n3', title: 'برپایی کرسی مسئولیت اجتماعی در صنعت گردشگری', date: '۲۰ تیر ۱۴۰۵', summary: 'کرسی مسئولیت اجتماعی در صنعت گردشگری با حضور فعالان این حوزه برگزار شد.', text: 'کرسی مسئولیت اجتماعی در صنعت گردشگری با حضور فعالان این حوزه برگزار شد. در این نشست، بر لزوم توجه به توسعه پایدار، حفاظت از میراث فرهنگی و توانمندسازی جوامع محلی تأکید شد. شرکت‌کنندگان بر این باور بودند که صنعت گردشگری می‌تواند نقش کلیدی در ارتقای مسئولیت اجتماعی ایفا کند.', image: 'data/images/5d77aa63-8167-46b7-a40d-58f80391ddd3-600x422.jpg' },
            { id: 'n4', title: 'همایش ملی مسئولیت اجتماعی و توسعه پایدار', date: '۱۵ تیر ۱۴۰۵', summary: 'همایش ملی مسئولیت اجتماعی و توسعه پایدار با حضور اساتید و صاحبنظران برگزار شد.', text: 'همایش ملی مسئولیت اجتماعی و توسعه پایدار با حضور اساتید و صاحبنظران در دانشگاه تهران برگزار شد. در این همایش، مباحثی مانند نقش مسئولیت اجتماعی در تحقق اهداف توسعه پایدار، عدالت اجتماعی و حفظ محیط زیست مورد بررسی قرار گرفت.', image: 'data/images/24995731-a73f-430b-89c4-540406663850-1-600x366.jpg' },
            { id: 'n5', title: 'دوره آموزش مشاوران مسئولیت اجتماعی در بیمه', date: '۱۰ تیر ۱۴۰۵', summary: 'دوره آموزش تخصصی مشاوران مسئولیت اجتماعی در صنعت بیمه آغاز شد.', text: 'دوره آموزش تخصصی مشاوران مسئولیت اجتماعی در صنعت بیمه با حضور کارشناسان و مدیران شرکت‌های بیمه آغاز شد. این دوره با هدف تربیت نیروی متخصص در حوزه مسئولیت اجتماعی صنعت بیمه برگزار می‌شود.', image: 'data/images/13eea22b-7166-4556-9148-1a3f31778094-768x768.jpg' },
            { id: 'n6', title: 'نشست هماندیشی مسئولیت اجتماعی در مدیریت شهری', date: '۵ تیر ۱۴۰۵', summary: 'نشست هماندیشی نقش مسئولیت اجتماعی در مدیریت شهری با حضور شهرداران برگزار شد.', text: 'نشست هماندیشی نقش مسئولیت اجتماعی در مدیریت شهری با حضور شهرداران و مدیران شهری برگزار شد. در این نشست، بر لزوم توجه به عدالت شهری، مشارکت شهروندان و توسعه پایدار تأکید شد.', image: 'data/images/507bc7e4-02f4-4e20-bb9c-1f343ab4493a-600x400.jpg' },
            { id: 'n7', title: 'کارگاه توانمندسازی زنان روستایی', date: '۱ تیر ۱۴۰۵', summary: 'کارگاه توانمندسازی زنان روستایی با رویکرد مسئولیت اجتماعی برگزار شد.', text: 'کارگاه توانمندسازی زنان روستایی با رویکرد مسئولیت اجتماعی در یکی از روستاهای استان تهران برگزار شد. این کارگاه با هدف آموزش مهارت‌های کارآفرینی و توانمندسازی اقتصادی زنان روستایی برگزار گردید.', image: 'data/images/photo_2025-03-19_00-14-55-e1752182038890-600x337.jpg' },
            { id: 'n8', title: 'پویش ملی کاهش هدررفت غذا', date: '۲۵ خرداد ۱۴۰۵', summary: 'پویش ملی کاهش هدررفت غذا با مشارکت انجمن و سازمان‌های مردم‌نهاد آغاز شد.', text: 'پویش ملی کاهش هدررفت غذا با مشارکت انجمن ترویج فرهنگ مسئولیت اجتماعی و سازمان‌های مردم‌نهاد آغاز شد. این پویش با هدف فرهنگ‌سازی و آموزش شهروندان در زمینه کاهش ضایعات غذایی و ترویج مصرف بهینه اجرا می‌شود.', image: 'data/images/هدر-رفت-غذا-768x322.jpg' }
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
        document.getElementById('news-player-title').textContent = news.title || '';
        document.getElementById('news-player-date').textContent = news.date || '';
        document.getElementById('news-player-text').textContent = news.summary || news.text || '';
    }
    window.prevNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex + 1) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.6)'; }); };
    window.playNews = function() { const text = document.getElementById('news-player-text'); const currentNews = newsData[currentNewsIndex]; if (currentNews) { text.textContent = currentNews.text || currentNews.summary || ''; text.style.maxHeight = '800px'; text.style.overflowY = 'auto'; } };
    window.pauseNews = function() { const text = document.getElementById('news-player-text'); const currentNews = newsData[currentNewsIndex]; if (currentNews) { text.textContent = currentNews.summary || currentNews.text || ''; text.style.maxHeight = '100px'; text.style.overflowY = 'hidden'; } };
    window.showFullNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; const date = document.getElementById('news-player-date')?.textContent || ''; const text = document.getElementById('news-player-text')?.textContent || ''; showNotification(`📰 ${title}\n📅 ${date}\n\n${text}`); };
    window.openComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_comments', { newsTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد.'); } };
    window.likeNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_likes', { newsTitle: title }); showNotification('❤️ خبر مورد پسند شما قرار گرفت!'); };

    // =============================================
    // تلویزیون رویدادها
    // =============================================
    let eventsData = [];
    let currentEventIndex = 0;
    function loadEventsData() {
        eventsData = [
            { id: 'e1', title: 'کارگاه مسئولیت اجتماعی در صنعت گردشگری', date: '۵ مرداد ۱۴۰۵', summary: 'کارگاه آموزشی با حضور متخصصان صنعت گردشگری برگزار می‌شود.', text: 'این کارگاه با هدف آشنایی فعالان صنعت گردشگری با مفاهیم و کاربردهای مسئولیت اجتماعی برگزار می‌شود. در این کارگاه، مباحثی مانند توسعه پایدار، حفاظت از میراث فرهنگی و توانمندسازی جوامع محلی مورد بررسی قرار خواهد گرفت.', image: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg' },
            { id: 'e2', title: 'نشست تخصصی مسئولیت اجتماعی در مدیریت شهری', date: '۱۲ مرداد ۱۴۰۵', summary: 'نشست تخصصی با موضوع نقش مسئولیت اجتماعی در مدیریت شهری برگزار می‌شود.', text: 'این نشست با حضور مدیران شهری و فعالان حوزه مسئولیت اجتماعی برگزار می‌شود. موضوعات محوری نشست شامل: عدالت شهری، مشارکت شهروندان، توسعه پایدار و شفافیت در مدیریت شهری است.', image: 'data/images/5d77aa63-8167-46b7-a40d-58f80391ddd3-600x422.jpg' },
            { id: 'e3', title: 'همایش بین‌المللی مسئولیت اجتماعی و گردشگری', date: '۲۰ مرداد ۱۴۰۵', summary: 'همایش بین‌المللی مسئولیت اجتماعی و گردشگری با حضور کشورهای منطقه برگزار می‌شود.', text: 'همایش بین‌المللی مسئولیت اجتماعی و گردشگری با حضور کشورهای منطقه و نمایندگان سازمان جهانی گردشگری برگزار می‌شود. این همایش با هدف تبادل تجربیات و ارائه راهکارهای نوین در حوزه گردشگری پایدار برگزار می‌گردد.', image: 'data/images/گردشگری-سبز-1.jpg' },
            { id: 'e4', title: 'دوره توانمندسازی مدیران شرکت‌های بیمه', date: '۲۵ مرداد ۱۴۰۵', summary: 'دوره توانمندسازی مدیران شرکت‌های بیمه در حوزه مسئولیت اجتماعی برگزار می‌شود.', text: 'دوره توانمندسازی مدیران شرکت‌های بیمه در حوزه مسئولیت اجتماعی با هدف آشنایی مدیران با مفاهیم و کاربردهای مسئولیت اجتماعی در صنعت بیمه برگزار می‌شود.', image: 'data/images/13eea22b-7166-4556-9148-1a3f31778094-768x768.jpg' },
            { id: 'e5', title: 'جشنواره مسئولیت اجتماعی شرکت‌ها', date: '۱ شهریور ۱۴۰۵', summary: 'جشنواره مسئولیت اجتماعی شرکت‌ها با معرفی برترین‌های سال برگزار می‌شود.', text: 'جشنواره مسئولیت اجتماعی شرکت‌ها با معرفی برترین شرکت‌های فعال در حوزه مسئولیت اجتماعی برگزار می‌شود. این جشنواره با هدف ترویج فرهنگ مسئولیت‌پذیری و تقدیر از شرکت‌های پیشرو برگزار می‌گردد.', image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg' },
            { id: 'e6', title: 'کارگاه آموزش مشاوران مسئولیت اجتماعی', date: '۱۰ شهریور ۱۴۰۵', summary: 'کارگاه آموزش مشاوران مسئولیت اجتماعی با حضور اساتید مجرب برگزار می‌شود.', text: 'کارگاه آموزش مشاوران مسئولیت اجتماعی با حضور اساتید مجرب و کارشناسان حوزه مسئولیت اجتماعی برگزار می‌شود. این کارگاه با هدف تربیت مشاوران متخصص در حوزه مسئولیت اجتماعی برگزار می‌گردد.', image: 'data/images/پوستر-دوره-600x750.jpg' }
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
        document.getElementById('events-player-title').textContent = event.title || '';
        document.getElementById('events-player-date').textContent = event.date || '';
        document.getElementById('events-player-text').textContent = event.summary || event.text || '';
    }
    window.prevEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex - 1 + eventsData.length) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextEvent = function() { if (eventsData.length === 0) return; currentEventIndex = (currentEventIndex + 1) % eventsData.length; loadEvent(eventsData[currentEventIndex]); document.querySelectorAll('#events-list div').forEach((el, i) => { el.style.background = i === currentEventIndex ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.playEvent = function() { const text = document.getElementById('events-player-text'); const currentEvent = eventsData[currentEventIndex]; if (currentEvent) { text.textContent = currentEvent.text || currentEvent.summary || ''; text.style.maxHeight = '800px'; text.style.overflowY = 'auto'; } };
    window.pauseEvent = function() { const text = document.getElementById('events-player-text'); const currentEvent = eventsData[currentEventIndex]; if (currentEvent) { text.textContent = currentEvent.summary || currentEvent.text || ''; text.style.maxHeight = '100px'; text.style.overflowY = 'hidden'; } };
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
    function startAutoSlide() { 
        if (manifestData.length > 1 && autoSlideInterval) { 
            clearInterval(autoSlideInterval); 
        }
        if (manifestData.length > 1) {
            autoSlideInterval = setInterval(() => { showSlide(slideIndex + 1); }, 5000);
        }
    }

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
            { icon: 'fa-hand-holding-heart', title: 'حمایت از کودکان کار', desc: 'کمک به توانمندسازی کودکان کار و خیابان', details: 'این طرح با همکاری سازمان‌های مردم‌نهاد و مراکز حمایتی اجرا می‌شود.' },
            { icon: 'fa-tree', title: 'کاشت درخت و حفظ محیط زیست', desc: 'فرهنگ‌سازی برای حفظ محیط زیست و کاشت درختان مثمر', details: 'این برنامه با مشارکت شهرداری‌ها و سازمان حفاظت محیط زیست برگزار می‌شود.' },
            { icon: 'fa-water', title: 'حفظ منابع آبی', desc: 'فرهنگ‌سازی برای مصرف بهینه آب و جلوگیری از هدررفت', details: 'این طرح با همکاری شرکت آب و فاضلاب و سازمان‌های مردم‌نهاد اجرا می‌شود.' },
            { icon: 'fa-graduation-cap', title: 'آموزش رایگان کودکان محروم', desc: 'ارائه آموزش‌های رایگان به کودکان مناطق محروم', details: 'این برنامه با همکاری مدارس و مراکز آموزشی خیریه برگزار می‌شود.' },
            { icon: 'fa-heart', title: 'کمک به بیماران نیازمند', desc: 'حمایت از بیماران نیازمند و تأمین هزینه‌های درمانی', details: 'این طرح با همکاری خیریه‌های سلامت و مراکز درمانی اجرا می‌شود.' },
            { icon: 'fa-home', title: 'مسکن برای بی‌خانمان‌ها', desc: 'کمک به تأمین مسکن برای افراد بی‌خانمان و نیازمند', details: 'این برنامه با همکاری بنیاد مسکن و خیریه‌های مسکن اجرا می‌شود.' },
            { icon: 'fa-utensils', title: 'کاهش هدررفت غذا', desc: 'فرهنگ‌سازی برای کاهش ضایعات غذایی و توزیع غذا میان نیازمندان', details: 'این طرح با همکاری سازمان‌های مردم‌نهاد و رستوران‌های خیریه اجرا می‌شود.' },
            { icon: 'fa-hand-holding-usd', title: 'حمایت از زنان سرپرست خانواده', desc: 'توانمندسازی اقتصادی زنان سرپرست خانواده و ایجاد شغل', details: 'این برنامه با همکاری مراکز کارآفرینی و سازمان بهزیستی اجرا می‌شود.' },
            { icon: 'fa-user-md', title: 'خدمات بهداشتی رایگان', desc: 'ارائه خدمات بهداشتی و درمانی رایگان به مناطق محروم', details: 'این طرح با همکاری پزشکان داوطلب و مراکز درمانی خیریه اجرا می‌شود.' },
            { icon: 'fa-road', title: 'بهبود معابر روستایی', desc: 'همکاری در بهسازی و بهبود معابر روستایی و محروم', details: 'این برنامه با همکاری دهیاری‌ها و بنیاد مسکن اجرا می‌شود.' },
            { icon: 'fa-leaf', title: 'فرهنگ‌سازی برای کاهش آلودگی', desc: 'آموزش و فرهنگ‌سازی برای کاهش آلودگی هوا و محیط زیست', details: 'این طرح با همکاری سازمان حفاظت محیط زیست و شهرداری‌ها اجرا می‌شود.' },
            { icon: 'fa-hands', title: 'همبستگی با سیل‌زدگان', desc: 'کمک‌رسانی به مناطق سیل‌زده و آسیب‌دیده از بلایای طبیعی', details: 'این برنامه با همکاری هلال‌احمر و سازمان‌های امدادی اجرا می‌شود.' }
        ];
        container.innerHTML = '';
        helps.forEach(item => {
            const div = document.createElement('div');
            div.className = 'help-item';
            div.innerHTML = `<i class="fas ${item.icon}"></i><div><div class="help-title">${item.title}</div><div class="help-desc">${item.desc}</div><span class="admin-response" style="font-size:0.8rem;color:#d4a373;"><i class="fas fa-user-check"></i> مدیر پاسخگو</span></div>`;
            div.addEventListener('click', function() { showNotification(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`); });
            container.appendChild(div);
        });
    }

    function loadBuilds() {
        const container = document.getElementById('builds-container');
        if (!container) return;
        const builds = [
            { icon: 'fa-building', title: 'شهر هوشمند و پایدار', desc: 'طراحی و توسعه شهرهای هوشمند با رویکرد مسئولیت اجتماعی', details: 'این پروژه با مشارکت شهرداری‌ها و شرکت‌های دانش‌بنیان اجرا می‌شود.' },
            { icon: 'fa-graduation-cap', title: 'آکادمی مسئولیت اجتماعی', desc: 'راه‌اندازی آکادمی تخصصی مسئولیت اجتماعی برای تربیت نیروی متخصص', details: 'این پروژه با همکاری دانشگاه‌ها و مراکز علمی اجرا می‌شود.' },
            { icon: 'fa-handshake', title: 'شبکه همیاران اجتماعی', desc: 'تشکیل شبکه همیاران اجتماعی برای گسترش فرهنگ مسئولیت‌پذیری', details: 'این پروژه با مشارکت سازمان‌های مردم‌نهاد و خیریه‌ها اجرا می‌شود.' },
            { icon: 'fa-tree', title: 'پارک‌های سبز شهری', desc: 'ایجاد و توسعه پارک‌های سبز شهری با مشارکت شهروندان', details: 'این پروژه با همکاری شهرداری‌ها و سازمان حفاظت محیط زیست اجرا می‌شود.' },
            { icon: 'fa-hand-holding-heart', title: 'بانک امانات خیریه', desc: 'راه‌اندازی بانک امانات خیریه برای کمک به نیازمندان', details: 'این پروژه با مشارکت خیریه‌ها و مراکز نیکوکاری اجرا می‌شود.' },
            { icon: 'fa-users', title: 'توانمندسازی جوامع محلی', desc: 'توانمندسازی و توسعه جوامع محلی با رویکرد مسئولیت اجتماعی', details: 'این پروژه با همکاری سازمان‌های مردم‌نهاد و تسهیلگران محلی اجرا می‌شود.' },
            { icon: 'fa-book', title: 'کتابخانه‌های سیار', desc: 'ایجاد کتابخانه‌های سیار برای مناطق محروم و روستایی', details: 'این پروژه با مشارکت نهاد کتابخانه‌ها و خیریه‌های فرهنگی اجرا می‌شود.' },
            { icon: 'fa-medkit', title: 'کلینیک‌های سیار سلامت', desc: 'ایجاد کلینیک‌های سیار سلامت برای ارائه خدمات به مناطق محروم', details: 'این پروژه با همکاری وزارت بهداشت و خیریه‌های سلامت اجرا می‌شود.' }
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

    function loadGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;
        const images = [
            { src: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg', title: 'دوره تربیت مشاوران', type: 'خبر' },
            { src: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg', title: 'کارگاه مسئولیت اجتماعی', type: 'رویداد' },
            { src: 'data/images/507bc7e4-02f4-4e20-bb9c-1f343ab4493a-600x400.jpg', title: 'بیانیه پایان تخاصم', type: 'بیانیه' },
            { src: 'data/images/5d77aa63-8167-46b7-a40d-58f80391ddd3-600x422.jpg', title: 'نشست تخصصی گردشگری', type: 'نشست' },
            { src: 'data/images/24995731-a73f-430b-89c4-540406663850-1-600x366.jpg', title: 'همایش مسئولیت اجتماعی', type: 'همایش' },
            { src: 'data/images/13eea22b-7166-4556-9148-1a3f31778094-768x768.jpg', title: 'دوره تخصصی بیمه', type: 'آموزش' },
            { src: 'data/images/photo_2025-03-19_00-14-55-e1752182038890-600x337.jpg', title: 'توانمندسازی روستاییان', type: 'توانمندسازی' },
            { src: 'data/images/گردشگری-سبز-1.jpg', title: 'گردشگری پایدار', type: 'محیط زیست' },
            { src: 'data/images/58b4b5ae-5ff7-4505-b646-5a3a32e589ac-300x296.jpg', title: 'مانیفست انجمن', type: 'مانیفست' },
            { src: 'data/images/سلیمانی.jpg', title: 'پهلوان علیرضا سلیمانی', type: 'فرهنگی' },
            { src: 'data/images/عاشورا-600x402.jpg', title: 'عاشورا و مسئولیت اجتماعی', type: 'مذهبی' },
            { src: 'data/images/وقف-2.jpg', title: 'سنت حسنه وقف', type: 'خیریه' },
            { src: 'data/images/چارت-تما.jpg', title: 'چارت سازمانی انجمن', type: 'ساختار' },
            { src: 'data/images/روز-درخت-کاری.webp', title: 'روز درختکاری', type: 'محیط زیست' },
            { src: 'data/images/هدر-رفت-غذا-768x322.jpg', title: 'کاهش هدررفت غذا', type: 'آموزش' },
            { src: 'data/images/کاتالوگ-انجمن-تما-1_Page1.jpg', title: 'کاتالوگ انجمن ۱', type: 'کاتالوگ' }
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
                        if (knowledgeModule) { knowledgeModule.style.display = 'block'; displayKnowledgeBase(); }
                        if (adminModule) adminModule.style.display = 'none';
                        return;
                    } else if (page === 'admin') {
                        if (adminModule) { adminModule.style.display = 'block'; document.getElementById('admin-panel').style.display = 'none'; document.getElementById('admin-login').style.display = 'block'; }
                        if (knowledgeModule) knowledgeModule.style.display = 'none';
                        return;
                    } else {
                        if (knowledgeModule) knowledgeModule.style.display = 'none';
                        if (adminModule) adminModule.style.display = 'none';
                    }
                    
                    const target = document.getElementById(page + '-module') || document.getElementById(page) || document.getElementById(page + '-tv');
                    if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
                }
            });
        });
    }

    // =============================================
    // گنجینه دانش
    // =============================================
    let knowledgeBase = [];
    let interactions = [];
    let userKnowledge = [];

    function loadKnowledgeBase() {
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
                const stored = localStorage.getItem('knowledgeBase');
                if (stored) { knowledgeBase = JSON.parse(stored); } else { knowledgeBase = []; }
                displayKnowledgeBase();
            });
        
        const storedInteractions = localStorage.getItem('interactions');
        if (storedInteractions) { interactions = JSON.parse(storedInteractions); } else { interactions = []; localStorage.setItem('interactions', JSON.stringify(interactions)); }
        const storedUserKnowledge = localStorage.getItem('userKnowledge');
        if (storedUserKnowledge) { userKnowledge = JSON.parse(storedUserKnowledge); } else { userKnowledge = []; localStorage.setItem('userKnowledge', JSON.stringify(userKnowledge)); }
        displayUserKnowledgeBase();
    }

    function displayKnowledgeBase() {
        const container = document.getElementById('knowledge-base-container');
        if (!container) return;
        container.innerHTML = '';
        if (knowledgeBase.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#7f8c8d"><i class="fas fa-database" style="font-size:3rem;color:#f39c12;display:block;margin-bottom:15px"></i><p style="font-size:1.2rem">گنجینه دانش در حال تکمیل است...</p></div>`;
            return;
        }
        knowledgeBase.forEach(item => {
            const div = document.createElement('div');
            div.className = 'kb-item';
            div.dataset.section = item.section || 'دانستنی‌ها';
            const typeColors = { text: '#3498db', audio: '#e74c3c', video: '#2ecc71', image: '#9b59b6' };
            const typeLabels = { text: 'متن', audio: 'صوتی', video: 'تصویری', image: 'تصویر' };
            const typeIcons = { text: 'fa-file-alt', audio: 'fa-headphones', video: 'fa-video', image: 'fa-image' };
            const sectionColors = { 'دانستنی‌ها': '#3498db', 'مهارت‌های کاربردی': '#2ecc71', 'همراهان روشنایی': '#e74c3c', 'مشارکت و تأثیر': '#9b59b6' };
            div.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                        <span style="background:${typeColors[item.type] || '#3498db'};padding:3px 12px;border-radius:20px;font-size:0.7rem;color:#fff;font-weight:600;display:inline-flex;align-items:center;gap:5px">
                            <i class="fas ${typeIcons[item.type] || 'fa-file-alt'}"></i> ${typeLabels[item.type] || 'متن'}
                        </span>
                        <span style="font-size:0.7rem;background:${sectionColors[item.section] || '#3498db'};padding:2px 10px;border-radius:20px;color:#fff">${item.section || 'دانستنی‌ها'}</span>
                        <span style="font-size:0.7rem;background:#ecf0f1;padding:2px 10px;border-radius:20px;color:#7f8c8d">${item.date || ''}</span>
                    </div>
                    <span style="font-size:0.7rem;color:#f39c12;background:rgba(243,156,18,0.1);padding:2px 10px;border-radius:20px">${item.source || 'انجمن'}</span>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:10px" onerror="this.src='data/images/placeholder.jpg'">` : ''}
                <div style="font-size:1.1rem;font-weight:700;color:#2c3e50;margin:5px 0">${item.title || 'بدون عنوان'}</div>
                <div style="color:#34495e;font-size:0.95rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${item.content || ''}</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:10px">${(item.tags || []).map(tag => `<span style="background:#f8f4f0;padding:2px 10px;border-radius:20px;font-size:0.7rem;color:#7f8c8d">#${tag}</span>`).join('')}</div>
                <div style="background:#fdf3e8;padding:10px;border-radius:12px;margin-top:10px;border-right:3px solid #f39c12;font-size:0.9rem">
                    <strong style="color:#f39c12"><i class="fas fa-user-check"></i> پاسخ مدیر:</strong> ${item.response || 'در انتظار پاسخ...'}
                </div>
                <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                    <button onclick="window.location.href='#radio-module'" style="background:#3498db;border:none;padding:4px 12px;border-radius:30px;color:#fff;font-size:0.75rem;cursor:pointer"><i class="fas fa-podcast"></i> ساخت پادکست</button>
                    <button onclick="window.location.href='#tv-module'" style="background:#2ecc71;border:none;padding:4px 12px;border-radius:30px;color:#fff;font-size:0.75rem;cursor:pointer"><i class="fas fa-slideshare"></i> ساخت اسلایدشو</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    document.querySelectorAll('.section-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.section-filter').forEach(b => { b.style.background = '#ecf0f1'; b.style.color = '#2c3e50'; });
            this.style.background = '#f39c12';
            this.style.color = '#fff';
            const filter = this.dataset.section;
            document.querySelectorAll('.kb-item').forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.section === filter) ? 'block' : 'none';
            });
        });
    });

    function displayUserKnowledgeBase() {
        const container = document.getElementById('user-knowledge-container');
        if (!container) return;
        container.innerHTML = '';
        if (userKnowledge.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">هنوز محتوایی به گنجینه دانش شما اضافه نشده است.</p>';
            return;
        }
        userKnowledge.forEach(item => {
            const div = document.createElement('div');
            div.className = 'user-kb-item';
            const typeLabel = item.type === 'podcast' ? 'پادکست' : 'اسلایدشو';
            const typeClass = item.type === 'podcast' ? 'ukb-type-podcast' : 'ukb-type-slideshow';
            div.innerHTML = `
                <div><span class="ukb-type ${typeClass}">${typeLabel}</span> <span class="ukb-title">${item.title || 'بدون عنوان'}</span></div>
                <div style="color:#34495e;margin:5px 0;font-size:0.9rem">${item.content || ''}</div>
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
        showNotification('✅ محتوا به گنجینه دانش شما اضافه شد.');
    }

    // =============================================
    // مدیریت
    // =============================================
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
            container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">هیچ تعاملی دریافت نشده است.</p>';
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
                <div style="margin-top:8px"><label><strong>پاسخ مدیر:</strong></label><textarea id="response-${index}" placeholder="پاسخ خود را بنویسید...">${item.response || ''}</textarea></div>
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
        showNotification('✅ تعامل تأیید و به گنجینه اضافه شد.');
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

    // =============================================
    // تعاملات
    // =============================================
    window.sendInteraction = function(type) {
        const textarea = document.getElementById('interact-text');
        const message = textarea.value.trim();
        if (!message && type === 'text') { showNotification('لطفاً یک متن وارد کنید.'); return; }
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
        const responses = ['از نظر شما متشکریم. بررسی می‌شود.', 'پیشنهاد شما ثبت شد.', 'سوال شما به تیم تخصصی ارجاع داده شد.'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        responseArea.innerHTML = `<i class="fas fa-robot"></i><span style="font-weight:700;color:#d4a373">مدیر پاسخگو</span> ${randomResponse}`;
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
                mediaRecorder.ondataavailable = event => { audioChunks.push(event.data); };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const interaction = { id: Date.now(), type: 'audio', text: 'پیام صوتی کاربر', date: new Date().toLocaleDateString('fa-IR'), response: '', file: audioUrl };
                    interactions.unshift(interaction);
                    localStorage.setItem('interactions', JSON.stringify(interactions));
                    showNotification('✅ پیام صوتی شما ارسال شد.');
                    status.style.display = 'none';
                    stopBtn.style.display = 'none';
                };
                status.style.display = 'block';
                stopBtn.style.display = 'inline-block';
                status.textContent = '🔴 در حال ضبط...';
                status.classList.add('active');
            })
            .catch(error => { showNotification('❌ دسترسی به میکروفون امکان‌پذیر نیست.'); });
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
            const interaction = { id: Date.now(), type: type, text: `فایل ${file.name}`, date: new Date().toLocaleDateString('fa-IR'), response: '', file: fileUrl };
            interactions.unshift(interaction);
            localStorage.setItem('interactions', JSON.stringify(interactions));
            showNotification('✅ فایل شما آپلود شد.');
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    // =============================================
    // تولید پادکست و اسلایدشو
    // =============================================
    let isGenerating = false;
    let lastGeneratedContent = null;

    window.generatePodcastSimple = function() {
        if (isGenerating) return;
        isGenerating = true;
        const items = knowledgeBase.filter(item => item.type === 'text').slice(0, 5);
        if (items.length === 0) { showNotification('❌ هیچ محتوای متنی در گنجینه وجود ندارد.'); isGenerating = false; return; }
        showNotification('🎙️ در حال تولید پادکست...');
        setTimeout(() => {
            const text = items.map(item => item.title + '. ' + item.content).join(' ');
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'fa-IR';
            speech.rate = 0.9;
            window.speechSynthesis.speak(speech);
            lastGeneratedContent = { type: 'podcast', title: 'پادکست تولیدشده', content: 'پادکستی شامل ' + items.length + ' مطلب', date: new Date().toLocaleDateString('fa-IR') };
            showNotification('✅ پادکست تولید شد. برای ارسال به گنجینه، دکمه را بزنید.');
            const sendContainer = document.getElementById('radio-send-container');
            if (sendContainer) {
                sendContainer.innerHTML = `<button onclick="sendToUserKnowledge()" style="padding:10px 20px;background:#8e44ad;border:none;border-radius:30px;color:#fff;font-weight:600;cursor:pointer;margin:5px"><i class="fas fa-save"></i> ارسال به گنجینه دانش</button>`;
            }
            isGenerating = false;
        }, 2000);
    };

    window.generateSlideshowSimple = function() {
        if (isGenerating) return;
        isGenerating = true;
        const items = knowledgeBase.slice(0, 10);
        if (items.length === 0) { showNotification('❌ هیچ محتوایی در گنجینه وجود ندارد.'); isGenerating = false; return; }
        showNotification('📺 در حال تولید اسلایدشو...');
        setTimeout(() => {
            let slideshowHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px"><button onclick="this.parentElement.remove()" style="position:absolute;top:20px;right:20px;background:#e74c3c;border:none;border-radius:50%;color:#fff;font-size:1.5rem;width:50px;height:50px;cursor:pointer;z-index:10000">✕</button><div style="max-width:800px;width:100%;max-height:80vh;overflow-y:auto;background:#fff;border-radius:20px;padding:30px;color:#2c3e50">`;
            items.forEach((item, index) => {
                slideshowHTML += `<div style="border-bottom:2px solid #e0c9a6;padding:20px 0;${index===0?'padding-top:0;':''}"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span style="background:#f39c12;color:#fff;padding:2px 12px;border-radius:20px;font-size:0.8rem">${index+1}</span><h3 style="margin:0;color:#2c3e50">${item.title||'بدون عنوان'}</h3></div><p style="color:#34495e;line-height:1.6">${item.content||''}</p>${item.image?`<div style="text-align:center"><img src="${item.image}" style="max-width:100%;max-height:200px;border-radius:10px;margin:10px 0"></div>`:''}<div style="background:#f8f4f0;padding:10px;border-radius:10px;margin-top:10px"><strong>پاسخ مدیر:</strong> ${item.response||'در انتظار پاسخ...'}</div><div style="font-size:0.8rem;color:#7f8c8d;margin-top:8px">${item.date||''}</div></div>`;
            });
            slideshowHTML += `</div></div>`;
            document.body.insertAdjacentHTML('beforeend', slideshowHTML);
            lastGeneratedContent = { type: 'slideshow', title: 'اسلایدشو تولیدشده', content: 'اسلایدشو شامل ' + items.length + ' محتوا', date: new Date().toLocaleDateString('fa-IR') };
            showNotification('✅ اسلایدشو تولید شد. برای ارسال به گنجینه، دکمه را بزنید.');
            const sendContainer = document.getElementById('tv-send-container');
            if (sendContainer) {
                sendContainer.innerHTML = `<button onclick="sendToUserKnowledge()" style="padding:10px 20px;background:#8e44ad;border:none;border-radius:30px;color:#fff;font-weight:600;cursor:pointer;margin:5px"><i class="fas fa-save"></i> ارسال به گنجینه دانش</button>`;
            }
            isGenerating = false;
        }, 2000);
    };

    window.sendToUserKnowledge = function() {
        if (lastGeneratedContent) {
            addToUserKnowledgeBase(lastGeneratedContent);
            document.querySelectorAll('#radio-send-container, #tv-send-container').forEach(c => c.innerHTML = '');
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
        showNotification('✅ فایل گنجینه دانلود شد.');
    };

    window.clearKnowledgeBase = function() {
        if (confirm('آیا از پاک کردن گنجینه مطمئن هستید؟')) {
            knowledgeBase = [];
            localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
            displayKnowledgeBase();
            showNotification('✅ گنجینه پاک شد.');
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
        loadGallery();
        loadSocialLinks();
        setupNavigation();
        setupFloatingToolbar();
        loadKnowledgeBase();
        console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
    }

    init();
});
