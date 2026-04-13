/**
 * nav.js — 공통 네비게이션 렌더링 + 날짜/날씨 헤더
 */

const NAV_ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Übersicht', href: 'index.html' },
  { id: 'deutsch',  icon: '📖', label: 'Deutsch',   href: 'deutsch.html' },
  { id: 'mathe',    icon: '🔢', label: 'Mathe',     href: 'mathe.html' },
  { id: 'natur',    icon: '🌿', label: 'Natur',     href: 'natur.html' },
  { id: 'englisch', icon: '🌍', label: 'Englisch',  href: 'englisch.html' },
];

const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const DAYS_DE   = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

/** 현재 페이지 ID를 data-page 속성에서 읽음 */
function currentPage() {
  return document.body.dataset.page || 'home';
}

/** 날짜 문자열 반환 */
export function formatDate(date) {
  return `${DAYS_DE[date.getDay()]}, ${date.getDate()}. ${MONTHS_DE[date.getMonth()]} ${date.getFullYear()}`;
}

/** 네비게이션 렌더 */
export function renderNav() {
  const container = document.getElementById('main-nav');
  if (!container) return;
  const page = currentPage();

  container.innerHTML = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="nav-btn${item.id === page ? ' active' : ''}">
      <span class="nav-icon">${item.icon}</span>
      ${item.label}
    </a>
  `).join('');
}

/** 헤더 날짜 렌더 */
export function renderDate() {
  const el = document.getElementById('date-display');
  if (el) el.textContent = formatDate(new Date());
}

/** 초기화 (DOMContentLoaded 전에 호출) */
export function initNav() {
  renderNav();
  renderDate();
}
