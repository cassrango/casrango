// ===== بخش‌های اضافه‌شده به انتهای فایل script.js =====

// =============================================
// ۱. گنجینه دانش
// =============================================
let knowledgeBase = [];
let interactions = [];

// بارگذاری داده‌ها از localStorage
function loadKnowledgeBase() {
    const storedKB = localStorage.getItem('knowledgeBase');
    if (storedKB) {
        knowledgeBase = JSON.parse(storedKB);
    } else {
        knowledgeBase = [
            { id: 1, type: 'text', title: 'مسئولیت اجتماعی در گردشگری', content: 'چگونه می‌توانیم مسئولیت اجتماعی را در صنعت گردشگری پیاده کنیم؟', response: 'با مشارکت جوامع محلی و حفظ محیط زیست.', date: '۱۴۰۵/۰۵/۰۱' },
            { id: 2, type: 'audio', title: 'پرسش صوتی درباره توسعه پایدار', content: 'صدای کاربر در مورد توسعه پایدار...', response: 'پاسخ مدیر: توسعه پایدار نیازمند...', date: '۱۴۰۵/۰۵/۰۲' }
        ];
        localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
    }
    
    const storedInteractions = localStorage.getItem('interactions');
    if (storedInteractions) {
        interactions = JSON.parse(storedInteractions);
    } else {
        interactions = [];
        localStorage.setItem('interactions', JSON.stringify(interactions));
    }
    
    displayKnowledgeBase();
}

// نمایش گنجینه دانش
function displayKnowledgeBase() {
    const container = document.getElementById('knowledge-base-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (knowledgeBase.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#7f8c8d;">هیچ محتوایی در گنجینه دانش یافت نشد.</p>';
        return;
    }
    
    knowledgeBase.forEach(item => {
        const div = document.createElement('div');
        div.className = 'kb-item';
        
        const typeLabel = { text: 'متن', audio: 'صوتی', video: 'تصویری' };
        const typeClass = { text: 'kb-type-text', audio: 'kb-type-audio', video: 'kb-type-video' };
        
        div.innerHTML = `
            <span class="kb-type ${typeClass[item.type] || 'kb-type-text'}">${typeLabel[item.type] || 'متن'}</span>
            <div class="kb-title">${item.title || 'بدون عنوان'}</div>
            <div class="kb-content">${item.content || ''}</div>
            <div class="kb-response"><strong>پاسخ مدیر:</strong> ${item.response || 'در انتظار پاسخ...'}</div>
            <div class="kb-meta">${item.date || ''} ${item.file ? ' | <a href="' + item.file + '" target="_blank">دانلود فایل</a>' : ''}</div>
        `;
        container.appendChild(div);
    });
}

// اضافه کردن آیتم به گنجینه
function addToKnowledgeBase(title, content, response, type, file) {
    const newItem = {
        id: Date.now(),
        type: type || 'text',
        title: title || 'بدون عنوان',
        content: content || '',
        response: response || 'در انتظار پاسخ...',
        date: new Date().toLocaleDateString('fa-IR'),
        file: file || null
    };
    knowledgeBase.unshift(newItem);
    localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
    displayKnowledgeBase();
}

// =============================================
// ۲. پنل مدیریت
// =============================================
function loginAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === 'admin123') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('admin-error').style.display = 'none';
        loadInteractions();
    } else {
        document.getElementById('admin-error').style.display = 'block';
    }
}

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

function approveInteraction(index) {
    const item = interactions[index];
    const responseText = document.getElementById('response-' + index).value;
    item.response = responseText || 'پاسخی ثبت نشده است.';
    
    // افزودن به گنجینه دانش
    addToKnowledgeBase(
        item.title || 'تعامل کاربر',
        item.text || '',
        item.response,
        item.type || 'text',
        item.file || null
    );
    
    // حذف از لیست تعاملات
    interactions.splice(index, 1);
    localStorage.setItem('interactions', JSON.stringify(interactions));
    loadInteractions();
    showNotification('✅ تعامل تأیید و به گنجینه دانش اضافه شد.');
}

function rejectInteraction(index) {
    if (confirm('آیا از رد این تعامل مطمئن هستید؟')) {
        interactions.splice(index, 1);
        localStorage.setItem('interactions', JSON.stringify(interactions));
        loadInteractions();
        showNotification('❌ تعامل رد شد.');
    }
}

function editInteraction(index) {
    const item = interactions[index];
    const newText = prompt('متن را ویرایش کنید:', item.text);
    if (newText !== null) {
        item.text = newText;
        localStorage.setItem('interactions', JSON.stringify(interactions));
        loadInteractions();
        showNotification('✅ تعامل ویرایش شد.');
    }
}

// =============================================
// ۳. دریافت تعاملات (متن، صدا، تصویر)
// =============================================
function sendInteraction(type) {
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
    
    // نمایش پاسخ هوشمند (تقلیدی)
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
}

// ضبط صدا
let mediaRecorder;
let audioChunks = [];

function startRecording() {
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
                
                // ذخیره در تعاملات
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
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('recording-status').classList.remove('active');
    }
}

// آپلود فایل
function uploadFile(event) {
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
}

// =============================================
// ۴. تولید پادکست از گنجینه
// =============================================
function generatePodcast() {
    const items = knowledgeBase.filter(item => item.type === 'text').slice(0, 5);
    if (items.length === 0) {
        showNotification('❌ هیچ محتوای متنی در گنجینه برای تولید پادکست وجود ندارد.');
        return;
    }
    
    const text = items.map(item => item.title + '. ' + item.content).join(' ');
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'fa-IR';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
    showNotification('🎙️ پادکست از گنجینه در حال پخش است.');
}

// =============================================
// ۵. تولید اسلایدشو از گنجینه
// =============================================
function generateSlideshow() {
    const items = knowledgeBase.slice(0, 10);
    if (items.length === 0) {
        showNotification('❌ هیچ محتوایی در گنجینه برای تولید اسلایدشو وجود ندارد.');
        return;
    }
    
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
                ${item.file ? `<div style="text-align: center;"><img src="${item.file}" style="max-width: 100%; max-height: 200px; border-radius: 10px; margin: 10px 0;"></div>` : ''}
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
    showNotification('📺 اسلایدشو از گنجینه نمایش داده شد.');
}

// =============================================
// ۶. ابزارهای کمکی
// =============================================
function exportKnowledgeBase() {
    const data = JSON.stringify(knowledgeBase, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `گنجینه_دانش_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ فایل گنجینه دانش دانلود شد.');
}

function clearKnowledgeBase() {
    if (confirm('آیا از پاک کردن تمام گنجینه دانش مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) {
        knowledgeBase = [];
        localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
        displayKnowledgeBase();
        showNotification('✅ گنجینه دانش پاک شد.');
    }
}

// =============================================
// ۷. ناوبری (به‌روزرسانی برای بخش‌های جدید)
// =============================================
const originalSetupNavigation = setupNavigation;
setupNavigation = function() {
    originalSetupNavigation();
    document.querySelectorAll('.art-toolbar a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                // نمایش بخش‌های خاص
                const knowledgeModule = document.getElementById('knowledge-module');
                const adminModule = document.getElementById('admin-module');
                
                if (page === 'knowledge') {
                    knowledgeModule.style.display = 'block';
                    adminModule.style.display = 'none';
                    document.getElementById('admin-panel').style.display = 'none';
                    document.getElementById('admin-login').style.display = 'block';
                    displayKnowledgeBase();
                } else if (page === 'admin') {
                    knowledgeModule.style.display = 'none';
                    adminModule.style.display = 'block';
                    document.getElementById('admin-panel').style.display = 'none';
                    document.getElementById('admin-login').style.display = 'block';
                } else {
                    knowledgeModule.style.display = 'none';
                    adminModule.style.display = 'none';
                }
                
                const target = document.getElementById(page + '-module') || document.getElementById(page) || document.getElementById(page + '-tv');
                if (target && !['knowledge', 'admin'].includes(page)) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
};

// =============================================
// ۸. بارگذاری اولیه (به‌روزرسانی)
// =============================================
const originalInit = init;
init = function() {
    originalInit();
    loadKnowledgeBase();
    console.log('✅ گنجینه دانش و پنل مدیریت با موفقیت بارگذاری شد.');
};
