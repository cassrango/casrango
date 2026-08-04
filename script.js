// ===== script.js - نسخه نهایی با مسیرهای اصلاح‌شده =====
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
        fetch('data/radio.json')
            .then(response => response.json())
            .then(data => {
                radioData = data.tracks || [];
                if (radioData.length > 0) {
                    renderRadioPlaylist(radioData);
                    loadRadioTrack(radioData[0]);
                }
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری رادیو:', error);
                radioData = [
                    { id: 'r1', title: 'برنامه اول - مسئولیت اجتماعی', file: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/audio1.mp3.mp3', date: '۱۴۰۵/۰۴/۲۵' },
                    { id: 'r2', title: 'برنامه دوم - توسعه پایدار', file: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/audio1.mp3.mp3', date: '۱۴۰۵/۰۴/۲۰' }
                ];
                renderRadioPlaylist(radioData);
                loadRadioTrack(radioData[0]);
            });
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
            console.log('پخش خودکار نیاز به تعامل دارد. کاربر باید دکمه پخش را بزند.');
        });
    }

    window.playRadio = function() { if (radioPlayer) { radioPlayer.play().catch(e => console.log('خطا در پخش:', e)); } };
    window.stopRadio = function() { if (radioPlayer) { radioPlayer.pause(); radioPlayer.currentTime = 0; } };
    window.nextRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex + 1) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.prevRadio = function() { if (radioData.length === 0) return; currentRadioIndex = (currentRadioIndex - 1 + radioData.length) % radioData.length; loadRadioTrack(radioData[currentRadioIndex]); renderRadioPlaylist(radioData); };
    window.likeRadio = function() { const track = radioData[currentRadioIndex]; if (!track) return; saveInteraction('radio_likes', { title: track.title }); showNotification('❤️ برنامه مورد پسند شما قرار گرفت!'); };
    window.shareRadio = function() { const track = radioData[currentRadioIndex]; if (!track) return; if (navigator.share) { navigator.share({ title: track.title, text: 'به این برنامه رادیویی گوش دهید: ' + track.title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href + '?radio=' + track.id).then(() => showNotification('📤 لینک رادیو کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    // =============================================
    // ۴. تلویزیون هوشمند
    // =============================================
    let tvData = [];
    let currentTvIndex = 0;
    const tvPlayer = document.getElementById('tv-player');

    function loadTvData() {
        fetch('data/tv.json')
            .then(response => response.json())
            .then(data => {
                tvData = data.channels || [];
                if (tvData.length > 0) {
                    renderTvPlaylist(tvData);
                    loadTvChannel(tvData[0]);
                }
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری تلویزیون:', error);
                tvData = [
                    { id: 't1', title: 'کانال اول - معرفی انجمن', video: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/video1.mp4.mp4' },
                    { id: 't2', title: 'کانال دوم - نشست تخصصی', video: 'https://github.com/ghrezaei1399/ghrezaei1399.github.io/raw/refs/heads/main/house/ai/video1.mp4.mp4' }
                ];
                renderTvPlaylist(tvData);
                loadTvChannel(tvData[0]);
            });
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
    window.shareTv = function() { const channel = tvData[currentTvIndex]; if (!channel) return; if (navigator.share) { navigator.share({ title: channel.title, text: 'این کانال تلویزیونی را ببینید: ' + channel.title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href + '?tv=' + channel.id).then(() => showNotification('📤 لینک تلویزیون کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    // =============================================
    // ۵. تلویزیون اخبار
    // =============================================
    let newsData = [];
    let currentNewsIndex = 0;

    function loadNewsData() {
        fetch('data/news.json')
            .then(response => response.json())
            .then(data => {
                newsData = data.news || [];
                if (newsData.length > 0) {
                    renderNewsList(newsData);
                    loadNews(newsData[0]);
                }
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری اخبار:', error);
                newsData = [
                    { 
                        id: 'n1', 
                        title: 'افتتاحیه دوره تربیت مشاوران مسئولیت اجتماعی', 
                        date: '۲۹ تیر ۱۴۰۵', 
                        summary: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» برگزار شد.', 
                        text: 'نخستین جلسه دوره پایه «مشاور مسئولیت اجتماعی در صنعت گردشگری» صبح سه‌شنبه ۲۳ تیر ماه ۱۴۰۵ با حضور مدیران ارشد برگزار شد...', 
                        image: 'data/images/3d58c07d-f5a3-4893-9fb1-3d801ef104a5-600x320.jpg' 
                    }
                ];
                renderNewsList(newsData);
                loadNews(newsData[0]);
            });
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
        if (text) text.textContent = news.text || news.summary || '';
    }

    window.playNews = function() { const text = document.getElementById('news-player-text'); if (text) { if (text.style.maxHeight === '100px' || text.style.maxHeight === '') { text.style.maxHeight = '400px'; text.style.overflowY = 'auto'; } else { text.style.maxHeight = '100px'; } } };
    window.pauseNews = function() { const text = document.getElementById('news-player-text'); if (text) { text.style.maxHeight = '100px'; text.style.overflowY = 'auto'; } };
    window.prevNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex - 1 + newsData.length) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.nextNews = function() { if (newsData.length === 0) return; currentNewsIndex = (currentNewsIndex + 1) % newsData.length; loadNews(newsData[currentNewsIndex]); document.querySelectorAll('#news-list div').forEach((el, i) => { el.style.background = i === currentNewsIndex ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.6)'; }); };
    window.showFullNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; const date = document.getElementById('news-player-date')?.textContent || ''; const text = document.getElementById('news-player-text')?.textContent || ''; showNotification(`📰 ${title}\n📅 ${date}\n\n${text}`); };
    window.openComment = function() { const comment = prompt('لطفاً نظر خود را بنویسید:'); if (comment) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_comments', { newsTitle: title, comment: comment }); showNotification('✅ نظر شما ثبت شد و برای ادمین ارسال گردید.'); } };
    window.openInteraction = function() { const message = prompt('لطفاً پیام خود را برای ادمین بنویسید:'); if (message) { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_interactions', { newsTitle: title, message: message }); showNotification('✅ پیام شما به ادمین ارسال شد. پاسخگویی متعاقباً انجام می‌شود.'); } };
    window.likeNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; saveInteraction('news_likes', { newsTitle: title }); showNotification('❤️ خبر مورد پسند شما قرار گرفت!'); };
    window.shareNews = function() { const title = document.getElementById('news-player-title')?.textContent || ''; if (navigator.share) { navigator.share({ title: title, text: 'این خبر را بخوانید: ' + title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href).then(() => showNotification('📤 لینک خبر کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    // =============================================
    // ۶. اسلایدشو مانیفست
    // =============================================
    let manifestData = [];
    let slideIndex = 0;
    let autoSlideInterval;

    function loadManifestData() {
        fetch('data/manifest.json')
            .then(response => response.json())
            .then(data => {
                manifestData = data.manifest || [];
                if (manifestData.length > 0) {
                    renderManifestSlides(manifestData);
                    showSlide(0);
                    startAutoSlide();
                }
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری مانیفست:', error);
                manifestData = [
                    { id: 'm1', title: 'مسئولیت اجتماعی', image: 'data/images/58b4b5ae-5ff7-4505-b646-5a3a32e589ac-300x296.jpg' },
                    { id: 'm2', title: 'همیاری اجتماعی', image: 'data/images/301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg' }
                ];
                renderManifestSlides(manifestData);
                showSlide(0);
                startAutoSlide();
            });
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
    window.currentSlide = function(index) { clearInterval(autoSlideInterval); showSlide(index); startAutoSlide(); };

    function startAutoSlide() { if (manifestData.length > 1) { autoSlideInterval = setInterval(() => { showSlide(slideIndex + 1); }, 20000); } }

    // =============================================
    // ۷. شعر
    // =============================================
    function loadPoem() {
        fetch('data/poem.json')
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById('poem-image');
                if (img && data.image) {
                    img.src = data.image;
                    img.onerror = function() { this.src = 'data/images/placeholder.jpg'; };
                }
            })
            .catch(error => {
                console.warn('⚠️ خطا در بارگذاری شعر:', error);
                const img = document.getElementById('poem-image');
                if (img) img.src = 'data/images/photo_۲۰۲۴-۰۸-۱۳_۱۱-۵۶-۵۰.jpg';
            });
    }

    window.likePoem = function() { saveInteraction('poem_likes', {}); showNotification('❤️ شعر مورد پسند شما قرار گرفت!'); };
    window.sharePoem = function() { if (navigator.share) { navigator.share({ title: 'شعر انجمن', text: 'این شعر را ببینید:', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href).then(() => showNotification('📤 لینک شعر کپی شد!')).catch(() => showNotification('📤 لینک: ' + window.location.href)); } };

    // =============================================
    // ۸. عضویت
    // =============================================
    function loadMembership() {
        fetch('data/membership.json')
            .then(response => response.json())
            .then(data => {
                const documents = data.documents || [];
                const list = document.getElementById('documents-list');
                if (list) {
                    list.innerHTML = '';
                    documents.forEach(doc => { const li = document.createElement('li'); li.innerHTML = `<i class="fas fa-check-circle"></i> ${doc}`; list.appendChild(li); });
                }
                const fee = document.getElementById('fee-amount');
                if (fee) fee.textContent = data.fee || '۶۰۰,۰۰۰ تومان';
                const card = document.getElementById('card-number');
                if (card) card.textContent = data.card_number || '5859.8370.1464.3403';
                const duration = document.getElementById('duration');
                if (duration) duration.textContent = data.duration || '۵ دقیقه';
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری عضویت:', error));
    }

    window.startMembership = function() { showNotification('🔹 فرایند عضویت آغاز شد.\nلطفاً مدارک زیر را آماده کنید:\n- رزومه حرفه‌ای\n- عکس پرسنلی\n- تصویر کارت ملی\n- رسید واریز حق عضویت (۶۰۰,۰۰۰ تومان)'); };

    // =============================================
    // ۹. همیاری‌های اجتماعی
    // =============================================
    function loadHelps() {
        fetch('data/helps.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('helps-container');
                if (!container || !data.helps) return;
                container.innerHTML = '';
                data.helps.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'help-item';
                    div.innerHTML = `<i class="fas ${item.icon}"></i><div><div class="help-title">${item.title}</div><div class="help-desc">${item.desc}</div><span class="admin-response"><i class="fas fa-user-check"></i> مدیر پاسخگو</span></div>`;
                    div.addEventListener('click', function() { showNotification(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`); });
                    container.appendChild(div);
                });
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری همیاری:', error));
    }

    // =============================================
    // ۱۰. آنچه با هم می‌سازیم
    // =============================================
    function loadBuilds() {
        fetch('data/builds.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('builds-container');
                if (!container || !data.builds) return;
                container.innerHTML = '';
                data.builds.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'help-item';
                    div.innerHTML = `<i class="fas ${item.icon}"></i><div><div class="help-title">${item.title}</div><div class="help-desc">${item.desc}</div></div>`;
                    div.addEventListener('click', function() { showNotification(`📌 ${item.title}\n\n${item.details || 'توضیحات کامل در دسترس است.'}`); });
                    container.appendChild(div);
                });
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری builds:', error));
    }

    // =============================================
    // ۱۱. آمار
    // =============================================
    function loadStatistics() {
        fetch('data/statistics.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('statistics-container');
                if (!container || !data.items) return;
                container.innerHTML = '';
                data.items.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'stat-item';
                    div.innerHTML = `<span class="number">${item.value}</span><span class="label">${item.label}</span>`;
                    container.appendChild(div);
                });
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری آمار:', error));
    }

    // =============================================
    // ۱۲. نظرات همراهان
    // =============================================
    function loadTestimonials() {
        fetch('data/testimonials.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('testimonials-container');
                if (!container || !data.items) return;
                container.innerHTML = '';
                data.items.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'testimonial-item';
                    div.innerHTML = `<img src="${item.image || 'data/images/placeholder.jpg'}" alt="${item.name}" onerror="this.src='data/images/placeholder.jpg'"><div class="name">${item.name}</div><div class="role">${item.role}</div><div class="text">"${item.text}"</div>`;
                    container.appendChild(div);
                });
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری نظرات:', error));
    }

    // =============================================
    // ۱۳. گالری
    // =============================================
    function loadGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;
        Promise.all([
            fetch('data/news.json').then(res => res.json()).catch(() => ({ news: [] })),
            fetch('data/events.json').then(res => res.json()).catch(() => ({ events: [] }))
        ]).then(([newsData, eventsData]) => {
            const images = [];
            if (newsData.news) { newsData.news.forEach(item => { if (item.image) images.push({ src: item.image, title: item.title, type: 'خبر' }); }); }
            if (eventsData.events) { eventsData.events.forEach(item => { if (item.image) images.push({ src: item.image, title: item.title, type: 'رویداد' }); }); }
            if (images.length === 0) { 
                const defaultImages = [
                    '58b4b5ae-5ff7-4505-b646-5a3a32e589ac-300x296.jpg',
                    '301c12e1-4c2e-4d75-bb7e-204776b56a43-600x400.jpg'
                ];
                defaultImages.forEach(img => {
                    images.push({ src: 'data/images/' + img, title: 'تصویر انجمن', type: 'گالری' });
                });
            }
            container.innerHTML = '';
            images.forEach(item => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.src='data/images/placeholder.jpg'"><div class="gallery-info"><h4>${item.title}</h4><p>${item.type}</p></div>`;
                div.addEventListener('click', function() { showNotification(`🖼️ ${item.title}\nنوع: ${item.type}`); });
                container.appendChild(div);
            });
        }).catch(error => console.warn('⚠️ خطا در بارگذاری گالری:', error));
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
            'سوال شما به تیم تخصصی ارجاع داده شد. پاسخ کامل اعلام می‌شود.',
            'نظر شما بسیار ارزشمند است. از مشارکت شما سپاسگزاریم.',
            'این موضوع در دستور کار گروه قرار گرفت. به زودی اطلاع‌رسانی می‌شود.'
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
        fetch('data/social.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('social-links');
                if (!container) return;
                container.innerHTML = '';
                const platforms = [
                    { key: 'telegram', icon: 'fa-telegram', color: '#0088cc' },
                    { key: 'linkedin', icon: 'fa-linkedin', color: '#0a66c2' },
                    { key: 'instagram', icon: 'fa-instagram', color: '#e4405f' },
                    { key: 'aparat', icon: 'fa-play-circle', color: '#e30613' }
                ];
                platforms.forEach(p => {
                    if (data[p.key]) {
                        const a = document.createElement('a');
                        a.href = data[p.key];
                        a.target = '_blank';
                        a.style.color = p.color;
                        a.innerHTML = `<i class="fab ${p.icon}"></i>`;
                        container.appendChild(a);
                    }
                });
            })
            .catch(error => console.warn('⚠️ خطا در بارگذاری شبکه‌های اجتماعی:', error));
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
        loadRadioData();
        loadTvData();
        loadNewsData();
        loadManifestData();
        loadPoem();
        loadMembership();
        loadHelps();
        loadBuilds();
        loadStatistics();
        loadTestimonials();
        loadGallery();
        loadSocialLinks();
        setupNavigation();
        console.log('✅ رادیوتلویزیون هوشمند با موفقیت بارگذاری شد.');
    }

    init();
});
