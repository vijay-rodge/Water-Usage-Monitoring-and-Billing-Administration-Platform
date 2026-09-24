// Comprehensive catalog of 105+ languages supported by Google Translate
export const ALL_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'tl', name: 'Filipino (Tagalog)', native: 'Filipino', flag: '🇵🇭' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ab', name: 'Abkhazian', native: 'Аԥсшәа', flag: '🇬🇪' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'eu', name: 'Basque', native: 'Euskara', flag: '🇪🇸' },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'ca', name: 'Catalan', native: 'Català', flag: '🇪🇸' },
  { code: 'ceb', name: 'Cebuano', native: 'Bisaya', flag: '🇵🇭' },
  { code: 'ny', name: 'Chichewa', native: 'Chichewa', flag: '🇲🇼' },
  { code: 'cv', name: 'Chuvash', native: 'Чӑвашла', flag: '🇷🇺' },
  { code: 'co', name: 'Corsican', native: 'Corsu', flag: '🇫🇷' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'eo', name: 'Esperanto', native: 'Esperanto', flag: '🌐' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'fy', name: 'Frisian', native: 'Frysk', flag: '🇳🇱' },
  { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  { code: 'haw', name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi', flag: '🌺' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'jv', name: 'Javanese', native: 'Basa Jawa', flag: '🇮🇩' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша', flag: '🇰🇿' },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî', flag: '🇮🇶' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬' },
  { code: 'lo', name: 'Lao', native: 'ລາວ', flag: '🇱🇦' },
  { code: 'la', name: 'Latin', native: 'Latina', flag: '🏛️' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy', flag: '🇲🇬' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  { code: 'mi', name: 'Maori', native: 'Te Reo Māori', flag: '🇳🇿' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳' },
  { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫' },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', flag: '🇼🇸' },
  { code: 'gd', name: 'Scots Gaelic', native: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho', flag: '🇱🇸' },
  { code: 'sn', name: 'Shona', native: 'chiShona', flag: '🇿🇼' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴' },
  { code: 'su', name: 'Sundanese', native: 'Basa Sunda', flag: '🇮🇩' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'tk', name: 'Turkmen', native: 'Türkmen', flag: '🇹🇲' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbek', flag: '🇺🇿' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', flag: '🇿🇦' },
  { code: 'yi', name: 'Yiddish', native: 'ייִדיש', flag: '✡️' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' }
];

// Helper to find a language item by code or name
export const findLanguage = (identifier) => {
  if (!identifier || identifier === 'null' || identifier === 'undefined') {
    return ALL_LANGUAGES[0];
  }
  const lower = String(identifier).toLowerCase().trim();
  if (lower === 'en' || lower === 'english') {
    return ALL_LANGUAGES[0];
  }
  return (
    ALL_LANGUAGES.find(
      (l) =>
        l.code.toLowerCase() === lower ||
        l.name.toLowerCase() === lower ||
        l.native.toLowerCase() === lower
    ) || ALL_LANGUAGES[0]
  );
};

// Clear all Google Translate cookies completely across paths and domains
export const clearGoogTransCookie = () => {
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  const domains = ['', hostname, '.' + hostname];
  for (let d = 0; d < domainParts.length; d++) {
    const sub = domainParts.slice(d).join('.');
    domains.push(sub);
    domains.push('.' + sub);
  }

  const paths = ['/', window.location.pathname];
  const pathSegments = window.location.pathname.split('/');
  let accPath = '';
  for (let p = 0; p < pathSegments.length; p++) {
    if (pathSegments[p]) {
      accPath += '/' + pathSegments[p];
      paths.push(accPath);
      paths.push(accPath + '/');
    }
  }

  domains.forEach((d) => {
    paths.forEach((p) => {
      const dStr = d ? `; domain=${d}` : '';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}${dStr};`;
      document.cookie = `googtrans=; Max-Age=0; path=${p}${dStr};`;
    });
  });
};

// Programmatically invoke Google Translate across the DOM
export const applyGoogleTranslate = (langCode) => {
  const code = (langCode || 'en').toLowerCase().trim();
  const isEn = code === 'en' || code === 'english';
  const hostname = window.location.hostname;

  if (isEn) {
    clearGoogTransCookie();
    const select = document.querySelector('.goog-te-combo');
    if (select && select.value) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
    return;
  }

  // Set cookie specifically for selected target language
  clearGoogTransCookie();
  const cookieVal = `/en/${code}`;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  if (hostname && hostname !== 'localhost') {
    document.cookie = `googtrans=${cookieVal}; domain=.${hostname}; path=/;`;
  }

  const triggerSelect = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  };

  if (!triggerSelect()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerSelect() || attempts >= 25) {
        clearInterval(interval);
      }
    }, 200);
  }
};
