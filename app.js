'use strict';

// ---------------------------------------------------------------- your settings
const CONFIG = {
  city: 'الشارقة',
  lat: 25.3463,
  lon: 55.4209,
  tz: 'Asia/Dubai',
  prayerMethod: 16,            // Aladhan: Dubai, 18.2 degrees
  teamId: '133738',            // TheSportsDB: Real Madrid
  teamName: 'ريال مدريد',
  standbyMinutes: 10,
  // Apps on this TV are web addresses (from VIDAA's own app list); icon null draws the name instead.
  apps: [
    { name: 'ثمانية', url: 'https://vidaa.tv.thmanyah.com', icon: 'https://img.vidaahub.com/vidaa/2025/11/202511050241556507.jpg' },
    { name: 'YouTube', url: 'https://www.youtube.com/tv', icon: null, colour: '#ff0000' },
    { name: 'TOD', url: 'https://me-vidda.bein-massive.com/', icon: 'https://img.vidaahub.com/vidaa/2023/2/202302231006146142.png' },
    { name: 'STARZPLAY', url: 'https://hisense.starzplay.com/', icon: 'https://img.vidaahub.com/vidaa/2026/3/202603190120068638.png' },
  ],
};

const CREDITS = {
  dawn: 'Michal Klajban (CC BY-SA 4.0)', morning: 'Eric Kilby (CC BY-SA 2.0)', day: 'Dietmar Rabich (CC BY-SA 4.0)',
  golden: 'Eric Kilby (CC BY-SA 2.0)', sunset: 'Eric Kilby (CC BY-SA 2.0)', dusk: 'Dietmar Rabich (CC BY-SA 4.0)',
  night: 'Martin Mark (CC BY-SA 4.0)',
};

// ---------------------------------------------------------------- Arabic wording
const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const PRAYERS = [['Fajr', 'الفجر'], ['Dhuhr', 'الظهر'], ['Asr', 'العصر'], ['Maghrib', 'المغرب'], ['Isha', 'العشاء']];
const TEAMS = {
  'real madrid': 'ريال مدريد', 'barcelona': 'برشلونة', 'atletico madrid': 'أتلتيكو مدريد', 'sevilla': 'إشبيلية',
  'valencia': 'فالنسيا', 'villarreal': 'فياريال', 'real betis': 'ريال بيتيس', 'real sociedad': 'ريال سوسيداد',
  'athletic bilbao': 'أتلتيك بيلباو', 'girona': 'جيرونا', 'celta vigo': 'سيلتا فيغو', 'getafe': 'خيتافي',
  'osasuna': 'أوساسونا', 'mallorca': 'مايوركا', 'rayo vallecano': 'رايو فاليكانو', 'alaves': 'ألافيس',
  'espanyol': 'إسبانيول', 'manchester city': 'مانشستر سيتي', 'liverpool': 'ليفربول', 'arsenal': 'آرسنال',
  'chelsea': 'تشيلسي', 'bayern munich': 'بايرن ميونخ', 'paris sg': 'باريس سان جيرمان', 'juventus': 'يوفنتوس',
  'inter milan': 'إنتر ميلان', 'ac milan': 'ميلان', 'borussia dortmund': 'بوروسيا دورتموند',
};
const LEAGUES = {
  'spanish la liga': 'الدوري الإسباني', 'uefa champions league': 'دوري أبطال أوروبا',
  'copa del rey': 'كأس ملك إسبانيا', 'spanish super cup': 'كأس السوبر الإسباني', 'fifa club world cup': 'كأس العالم للأندية',
};
const plain = (s) => (s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
const team = (s) => TEAMS[plain(s)] || s;
const league = (s) => LEAGUES[plain(s)] || s;
const clock12 = (h, m) => `${h % 12 || 12}:${String(m).padStart(2, '0')}`;
const meridiem = (h) => (h < 12 ? 'ص' : 'م');
const withMeridiem = (h, m) => `${clock12(h, m)} ${meridiem(h)}`;
const degrees = (n) => `‎${Math.round(n)}°‎`;
const hoursAr = (n) => (n === 1 ? 'ساعة' : n === 2 ? 'ساعتين' : n <= 10 ? `${n} ساعات` : `${n} ساعة`);
const minutesAr = (n) => (n === 1 ? 'دقيقة' : n === 2 ? 'دقيقتين' : n <= 10 ? `${n} دقائق` : `${n} دقيقة`);
const daysAr = (n) => (n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? `${n} أيام` : `${n} يوماً`);
function after(ms) {
  const total = Math.ceil(ms / 60000);
  if (total <= 0) return 'الآن';
  const h = Math.floor(total / 60), m = total % 60;
  if (!h) return `بعد ${minutesAr(m)}`;
  if (!m) return `بعد ${hoursAr(h)}`;
  return `بعد ${hoursAr(h)} و${minutesAr(m)}`;
}
const WEATHER = (c) => (c === 0 ? 'صافٍ' : c === 1 ? 'صافٍ غالباً' : c === 2 ? 'غائم جزئياً' : c === 3 ? 'غائم'
  : c === 45 || c === 48 ? 'ضباب' : c >= 51 && c <= 57 ? 'رذاذ' : (c >= 61 && c <= 67) || (c >= 80 && c <= 82) ? 'ماطر'
  : c >= 95 ? 'عاصفة رعدية' : '');

// ---------------------------------------------------------------- time in the city's zone
function now() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFIG.tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    second: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd };
}
const ddmmyyyy = (t) => `${String(t.d).padStart(2, '0')}-${String(t.mo).padStart(2, '0')}-${t.y}`;
const toMin = (hhmm) => { const [h, m] = hhmm.slice(0, 5).split(':').map(Number); return h * 60 + m; };

// ---------------------------------------------------------------- data, cached so the screen fills offline
const cache = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full or blocked */ } },
};
async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
async function refresh() {
  const t = now();
  const tomorrow = new Date(Date.UTC(t.y, t.mo - 1, t.d + 1));
  const tm = { y: tomorrow.getUTCFullYear(), mo: tomorrow.getUTCMonth() + 1, d: tomorrow.getUTCDate() };
  for (const day of [t, tm]) {
    const key = 'prayer_' + ddmmyyyy(day);
    if (cache.get(key)) continue;
    try {
      const j = await getJson(`https://api.aladhan.com/v1/timings/${ddmmyyyy(day)}?latitude=${CONFIG.lat}&longitude=${CONFIG.lon}&method=${CONFIG.prayerMethod}`);
      cache.set(key, j.data);
    } catch (e) { /* keep the last values */ }
  }
  const w = cache.get('weather');
  if (!w || Date.now() - w.at > 30 * 60000) {
    try {
      const j = await getJson(`https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.lat}&longitude=${CONFIG.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=${CONFIG.tz}&forecast_days=1`);
      cache.set('weather', { at: Date.now(), j });
    } catch (e) { /* keep the last values */ }
  }
  const m = cache.get('match');
  if (!m || Date.now() - m.at > 3 * 3600000) {
    try {
      const j = await getJson(`https://www.thesportsdb.com/api/v1/json/123/eventsnext.php?id=${CONFIG.teamId}`);
      cache.set('match', { at: Date.now(), j });
    } catch (e) { /* keep the last values */ }
  }
  const today = cache.get('prayer_' + ddmmyyyy(t));
  if (today) {
    const hy = +today.date.hijri.year, hm = today.date.hijri.month.number;
    const ry = hm < 9 ? hy : hy + 1;
    if (!cache.get('ramadan_' + ry)) {
      try { cache.set('ramadan_' + ry, (await getJson(`https://api.aladhan.com/v1/hToG/01-09-${ry}`)).data.gregorian.date); } catch (e) { /* later */ }
    }
  }
  render();
}

// ---------------------------------------------------------------- screen
const $ = (id) => document.getElementById(id);
let photoKey = '';

function photoFor(p, sunrise, m) {
  if (!p) { const h = Math.floor(m / 60); return h < 5 || h >= 20 ? 'night' : h < 7 ? 'dawn' : h < 12 ? 'morning' : h < 16 ? 'day' : h < 18 ? 'sunset' : 'dusk'; }
  const [fajr, dhuhr, asr, maghrib, isha] = p;
  if (m < fajr) return 'night';
  if (m < sunrise + 40) return 'dawn';
  if (m < dhuhr) return 'morning';
  if (m < asr) return 'day';
  if (m < maghrib - 30) return 'golden';
  if (m < maghrib + 30) return 'sunset';
  if (m < isha + 60) return 'dusk';
  return 'night';
}

function setPhoto(key) {
  if (key === photoKey) return;
  photoKey = key;
  const url = `url(bg/${key}.jpg)`;
  $('bg').style.backgroundImage = url;
  $('standby').style.backgroundImage = url;
  $('credit').textContent = $('s-credit').textContent = `تصوير: ‪${CREDITS[key]}‬`;
}

function render() {
  const t = now();
  const minute = t.h * 60 + t.mi;
  const today = cache.get('prayer_' + ddmmyyyy(t));
  const tomorrow = new Date(Date.UTC(t.y, t.mo - 1, t.d + 1));
  const next = cache.get('prayer_' + ddmmyyyy({ y: tomorrow.getUTCFullYear(), mo: tomorrow.getUTCMonth() + 1, d: tomorrow.getUTCDate() }));
  const dateText = `${WEEKDAYS[t.wd]} ${t.d} ${MONTHS[t.mo - 1]} ${t.y}`;
  const hijri = today ? `، ${today.date.hijri.day} ${today.date.hijri.month.ar.replace(/[ً-ْٰ]/g, '')} ${today.date.hijri.year} هـ` : '';

  $('clock').textContent = $('s-time').textContent = clock12(t.h, t.mi);
  $('meridiem').textContent = $('s-meridiem').textContent = meridiem(t.h);
  $('date').textContent = dateText + hijri;
  $('s-weekday').textContent = WEEKDAYS[t.wd];
  $('s-full').textContent = `${t.d} ${MONTHS[t.mo - 1]} ${t.y}${hijri}`;
  $('s-city').textContent = $('prayer-city').textContent = CONFIG.city;

  const w = cache.get('weather');
  if (w) {
    const c = w.j.current, d = w.j.daily;
    $('weather').textContent = `${CONFIG.city} ${degrees(c.temperature_2m)} ${WEATHER(c.weather_code)}`;
    $('s-temp').textContent = `${degrees(c.temperature_2m)} ${WEATHER(c.weather_code)}`;
    $('s-hilo').textContent = `العظمى ${degrees(d.temperature_2m_max[0])} والصغرى ${degrees(d.temperature_2m_min[0])}`;
  }

  let times = null;
  if (today) {
    times = PRAYERS.map(([k]) => toMin(today.timings[k]));
    setPhoto(photoFor(times, toMin(today.timings.Sunrise), minute));
    let i = times.findIndex((x) => x > minute);
    const at = i >= 0 ? times[i] : (next ? toMin(next.timings.Fajr) : times[0]);
    const name = PRAYERS[i >= 0 ? i : 0][1];
    const until = ((i >= 0 ? at : at + 1440) - minute) * 60000 - t.s * 1000;
    $('s-prayer').textContent = `${name} ${withMeridiem(Math.floor(at / 60), at % 60)}`;
    $('s-prayer-sub').textContent = after(until);
    $('prayers').innerHTML = PRAYERS.map(([, ar], j) =>
      `<div class="prayer${j === (i >= 0 ? i : 0) ? ' next' : ''}"><div class="name">${ar}</div><div class="time">${withMeridiem(Math.floor(times[j] / 60), times[j] % 60)}</div></div>`).join('');
  } else {
    setPhoto(photoFor(null, 0, minute));
  }

  if (today && today.date.hijri.month.number === 9) {
    $('s-ramadan').textContent = `اليوم ${today.date.hijri.day}`;
    $('s-ramadan-sub').textContent = 'رمضان كريم';
  } else if (today) {
    const hy = +today.date.hijri.year;
    const r = cache.get('ramadan_' + (today.date.hijri.month.number < 9 ? hy : hy + 1));
    if (r) {
      const [dd, mm, yy] = r.split('-').map(Number);
      const days = Math.round((Date.UTC(yy, mm - 1, dd) - Date.UTC(t.y, t.mo - 1, t.d)) / 86400000);
      const start = new Date(Date.UTC(yy, mm - 1, dd));
      $('s-ramadan').textContent = daysAr(days);
      $('s-ramadan-sub').textContent = `يبدأ ${WEEKDAYS[start.getUTCDay()]} ${dd} ${MONTHS[mm - 1]} تقريباً`;
    }
  }

  const m = cache.get('match');
  const ev = m && m.j && m.j.events ? m.j.events.find((e) => Date.parse(e.strTimestamp + 'Z') + 2 * 3600000 > Date.now()) : null;
  $('s-match-label').textContent = `مباراة ${CONFIG.teamName} القادمة`;
  $('s-match-block').hidden = $('s-match-divider').hidden = !ev;
  if (ev) {
    const at = Date.parse(ev.strTimestamp + 'Z');
    const local = new Date(at + 4 * 3600000);   // UAE is UTC+4 all year
    const day = at <= Date.now() ? 'الآن'
      : `${WEEKDAYS[local.getUTCDay()]} ${local.getUTCDate()} ${MONTHS[local.getUTCMonth()]} ${withMeridiem(local.getUTCHours(), local.getUTCMinutes())}`;
    $('s-match').textContent = `${team(ev.strHomeTeam)} × ${team(ev.strAwayTeam)}`;
    $('s-match-sub').textContent = `${league(ev.strLeague)}، ${day}`;
    $('match').textContent = `${team(ev.strHomeTeam)} × ${team(ev.strAwayTeam)}، ${day}`;
  } else {
    $('match').textContent = '';
  }
}

// ---------------------------------------------------------------- apps and focus
function buildApps() {
  $('apps').innerHTML = CONFIG.apps.map((a, i) =>
    `<button class="tile focusable" data-app="${i}" style="${a.icon ? '' : `background:#fff;color:${a.colour}`}">${a.icon
      ? `<img src="${a.icon}" alt="${a.name}">` : `<span class="word">${a.name}</span>`}</button>`).join('');
}

let row = 1, col = 0;
const rowItems = (r) => [...document.querySelectorAll(`[data-row="${r}"] .focusable`)];
function focus(r, c) {
  const items = rowItems(r);
  if (!items.length) return;
  row = r;
  col = Math.max(0, Math.min(c, items.length - 1));
  document.querySelectorAll('.focused').forEach((e) => e.classList.remove('focused'));
  const el = items[col];
  el.classList.add('focused');
  if (r === 1) { $('title').textContent = CONFIG.apps[col].name; $('subtitle').textContent = `تطبيقاتي ${col + 1} من ${CONFIG.apps.length}`; }
  else { $('title').textContent = 'شاشتي'; $('subtitle').textContent = ''; }
}
function activate() {
  const el = rowItems(row)[col];
  if (!el) return;
  if (el.dataset.app) location.href = CONFIG.apps[+el.dataset.app].url;
  else if (el.dataset.action === 'standby') showStandby();
  else if (el.dataset.action === 'reload') location.reload();
}

// ---------------------------------------------------------------- standby
let idle;
const standbyShown = () => !$('standby').hidden;
function showStandby() { render(); $('standby').hidden = false; }
function hideStandby() { $('standby').hidden = true; armIdle(); }
function armIdle() { clearTimeout(idle); idle = setTimeout(showStandby, CONFIG.standbyMinutes * 60000); }

const BACK = [8, 27, 461, 10009];
document.addEventListener('keydown', (e) => {
  armIdle();
  if (standbyShown()) { hideStandby(); e.preventDefault(); return; }
  switch (e.keyCode) {
    case 37: focus(row, col + 1); break;   // right-to-left: the next item sits to the left
    case 39: focus(row, col - 1); break;
    case 38: focus(Math.max(0, row - 1), row === 1 ? 0 : col); break;
    case 40: focus(Math.min(1, row + 1), 0); break;
    case 13: activate(); break;
    case 403: showStandby(); break;      // red
    default: if (BACK.includes(e.keyCode) && row !== 1) focus(1, 0); else return;
  }
  e.preventDefault();
});

buildApps();
render();
focus(1, 0);
armIdle();
refresh();
setInterval(render, 15000);
setInterval(refresh, 30 * 60000);
