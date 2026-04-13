/**
 * calendar.js — 달력 렌더 + 날짜 클릭 상세 표시
 */

import { readLog, getSubjectsForDate, SUBJECTS } from './store.js';
import { formatDate } from './nav.js';

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const DAYS_SHORT = ['Mo','Di','Mi','Do','Fr','Sa','So'];

let calYear, calMonth, selectedKey;
const today = new Date();

export function initCalendar() {
  calYear  = today.getFullYear();
  calMonth = today.getMonth();
  selectedKey = null;

  document.getElementById('cal-prev').addEventListener('click', () => { moveMonth(-1); });
  document.getElementById('cal-next').addEventListener('click', () => { moveMonth(1); });

  render();
}

function moveMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  render();
}

function dk(y, m, d) { return `${y}-${m + 1}-${d}`; }

function render() {
  document.getElementById('cal-title').textContent = `${MONTHS[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  // 요일 헤더
  DAYS_SHORT.forEach((d, i) => {
    const el = document.createElement('div');
    el.className = 'cal-dow' + (i === 5 ? ' sat' : i === 6 ? ' sun' : '');
    el.textContent = d;
    grid.appendChild(el);
  });

  const log = readLog();
  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysInM  = new Date(calYear, calMonth + 1, 0).getDate();
  const prevDays = new Date(calYear, calMonth, 0).getDate();

  // 이전 달 빈칸
  for (let i = 0; i < offset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month empty';
    el.innerHTML = `<div class="day-num">${prevDays - offset + 1 + i}</div>`;
    grid.appendChild(el);
  }

  // 이번 달 날짜
  for (let day = 1; day <= daysInM; day++) {
    const dow = (offset + day - 1) % 7;
    const k   = dk(calYear, calMonth, day);
    const isToday = (
      calYear  === today.getFullYear() &&
      calMonth === today.getMonth() &&
      day      === today.getDate()
    );
    let cls = 'cal-day';
    if (dow === 5) cls += ' sat';
    if (dow === 6) cls += ' sun';
    if (isToday)          cls += ' today';
    if (selectedKey === k) cls += ' selected';

    const el = document.createElement('div');
    el.className = cls;

    el.innerHTML = `<div class="day-num">${day}</div>`;

    // 과목 점
    if (log[k]) {
      const dotsRow = document.createElement('div');
      dotsRow.className = 'dots-row';
      Object.keys(log[k]).forEach(s => {
        if (SUBJECTS[s]) {
          const dot = document.createElement('div');
          dot.className = 'cdot';
          dot.style.background = SUBJECTS[s].color;
          dotsRow.appendChild(dot);
        }
      });
      el.appendChild(dotsRow);
    }

    el.addEventListener('click', () => {
      selectedKey = k;
      render();
      showDetail(k, day);
    });
    grid.appendChild(el);
  }

  // 다음 달 빈칸
  const rem = (offset + daysInM) % 7;
  if (rem !== 0) {
    for (let i = 1; i <= 7 - rem; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day other-month empty';
      el.innerHTML = `<div class="day-num">${i}</div>`;
      grid.appendChild(el);
    }
  }
}

function showDetail(k, day) {
  const card    = document.getElementById('day-detail');
  const titleEl = document.getElementById('dd-title');
  const bodyEl  = document.getElementById('dd-body');

  const dateObj = new Date(calYear, calMonth, day);
  titleEl.textContent = formatDate(dateObj);
  card.style.display = 'block';

  const log = readLog();
  if (!log[k] || Object.keys(log[k]).length === 0) {
    bodyEl.innerHTML = '<div class="dd-empty">Keine Lerneinträge für diesen Tag.</div>';
    return;
  }

  bodyEl.innerHTML = Object.keys(log[k]).map(s => {
    const info  = SUBJECTS[s];
    if (!info) return '';
    const tasks = log[k][s];
    const done  = tasks.filter(t => t.done).length;
    const taskHtml = tasks.map(t => `
      <div class="dd-task">
        <div class="dd-chk ${t.done ? 'done' : 'open'}">${t.done ? '✓' : ''}</div>
        <span>${t.text}</span>
      </div>
    `).join('');
    return `
      <div class="dd-subject">
        <div class="dd-subj-head">
          <span class="dd-subj-title">${info.label}</span>
          <span class="dd-badge" style="background:${info.bg};color:${info.tc};">${done}/${tasks.length} erledigt</span>
        </div>
        ${taskHtml}
      </div>
    `;
  }).join('');
}

/** 외부에서 달력 새로고침 (체크 후 점 업데이트) */
export function refreshCalendar() {
  render();
}
