let dictionary = {
    pinyin: {},
    english: {}
};

const DICTIONARY_URL = 'https://chinese-test-test.oss-ap-southeast-6.aliyuncs.com/cedict_1_0_ts_utf-8_mdbg.txt';

const translations = {
    en: {
        pinyinToEnglish: "Pinyin to English",
        englishToChinese: "English to Chinese and Pinyin",
        inputPlaceholder: "Enter Pinyin or English...",
        translate: "Translate"
    },
    zh: {
        pinyinToEnglish: "拼音到英文",
        englishToChinese: "英文到中文和拼音",
        inputPlaceholder: "输入拼音或英文...",
        translate: "翻译"
    }
};

let currentLang = 'en';

function loadDictionary() {
    console.log('开始加载字典...');
    fetch(DICTIONARY_URL)
        .then(response => {
            console.log('收到响应:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            console.log('字典文本长度:', text.length);
            parseDictionary(text);
            console.log('字典加载完成，拼音条目数:', Object.keys(dictionary.pinyin).length);
            console.log('字典加载完成，英文条目数:', Object.keys(dictionary.english).length);
        })
        .catch(error => console.error('加载字典出错:', error));
}

// ... [其他函数保持不变: parseDictionary, addPhraseToDictionary, convertToneNumbers, translate, translatePinyinToEnglish, translatePhrase, translateEnglishToChinese] ...

function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (el.placeholder) {
            el.placeholder = translations[currentLang][key];
        } else {
            el.textContent = translations[currentLang][key];
        }
    });
    document.documentElement.lang = currentLang;
    document.getElementById('languageDropdown').firstChild.textContent = lang === 'en' ? 'English' : '中文';
}

function setupEventListeners() {
    document.getElementById('languageDropdown').addEventListener('click', function() {
        document.getElementById('languageMenu').classList.toggle('hidden');
    });

    document.querySelectorAll('#languageMenu a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            updateLanguage(this.getAttribute('data-lang'));
            document.getElementById('languageMenu').classList.add('hidden');
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('#languageDropdown') && !event.target.closest('#languageMenu')) {
            document.getElementById('languageMenu').classList.add('hidden');
        }
    });

    const translateButton = document.getElementById('translateBtn');
    if (translateButton) {
        translateButton.addEventListener('click', translate);
    } else {
        console.error('未找到翻译按钮');
    }
}

// 初始化函数
function init() {
    loadDictionary();
    setupEventListeners();
    updateLanguage('en');
}

// 当 DOM 加载完成后执行初始化
document.addEventListener('DOMContentLoaded', init);