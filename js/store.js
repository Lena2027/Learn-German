/**
 * store.js — localStorage 기반 데이터 관리
 * 키: "nico_log" → { "2026-4-13": { d: [{text, done}], m: [...] } }
 */

const STORE_KEY = 'nico_lernplan_log';

export const SUBJECTS = {
  d: { id: 'd', label: '📖 Deutsch',  color: '#1D9E75', bg: '#E1F5EE', tc: '#0F6E56', page: 'deutsch.html' },
  m: { id: 'm', label: '🔢 Mathe',    color: '#EF9F27', bg: '#FAEEDA', tc: '#854F0B', page: 'mathe.html' },
  n: { id: 'n', label: '🌿 Natur',    color: '#639922', bg: '#EAF3DE', tc: '#3B6D11', page: 'natur.html' },
  e: { id: 'e', label: '🌍 Englisch', color: '#E24B4A', bg: '#FCEBEB', tc: '#A32D2D', page: 'englisch.html' },
};

export const PROGRESS = {
  d: { done: 18, total: 25 },
  m: { done: 12, total: 25 },
  n: { done: 22, total: 25 },
  e: { done:  7, total: 25 },
};

/** 날짜 → 키 문자열 */
export function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** 오늘 키 */
export function todayKey() {
  return dateKey(new Date());
}

/** 전체 로그 읽기 */
export function readLog() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** 전체 로그 저장 */
function writeLog(log) {
  localStorage.setItem(STORE_KEY, JSON.stringify(log));
}

/** 특정 날짜+과목 태스크 목록 가져오기 */
export function getTasks(dateK, subjId) {
  const log = readLog();
  return log[dateK]?.[subjId] || [];
}

/** 태스크 토글 저장 */
export function toggleTask(subjId, text, done) {
  const log = readLog();
  const k = todayKey();
  if (!log[k]) log[k] = {};
  if (!log[k][subjId]) log[k][subjId] = [];

  const existing = log[k][subjId].find(t => t.text === text);
  if (existing) {
    existing.done = done;
  } else {
    log[k][subjId].push({ text, done });
  }
  writeLog(log);
}

/** 특정 날짜에 기록된 과목 목록 */
export function getSubjectsForDate(dateK) {
  const log = readLog();
  return Object.keys(log[dateK] || {});
}

/** 데모 데이터 시드 (처음 방문 시) */
export function seedDemoIfEmpty() {
  if (localStorage.getItem(STORE_KEY)) return;
  const log = {};
  const now = new Date();

  function add(daysAgo, s, tasks) {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const k = dateKey(d);
    if (!log[k]) log[k] = {};
    log[k][s] = tasks;
  }

  add(1, 'd', [
    { text: 'Kapitelname und Lernziel lesen', done: true },
    { text: 'Fettgedruckte Wörter unterstreichen', done: true },
    { text: '2 Fragen aufschreiben', done: false },
  ]);
  add(1, 'm', [
    { text: '5 Aufgaben aus dem Schulbuch lösen', done: true },
    { text: 'Rechenweg ins Heft schreiben', done: true },
  ]);
  add(3, 'd', [
    { text: 'Text laut vorlesen', done: true },
    { text: 'Neue Wörter 3-mal schreiben', done: true },
  ]);
  add(3, 'n', [
    { text: 'Bilder und Diagramme betrachten', done: true },
    { text: '2 Fachbegriffe markieren', done: true },
  ]);
  add(3, 'e', [
    { text: 'Vokabelliste laut lesen', done: false },
    { text: 'Bekannte Wörter markieren', done: true },
  ]);
  add(5, 'm', [
    { text: 'Einmaleins mündlich üben', done: true },
    { text: '3 Kopfrechenaufgaben lösen', done: true },
  ]);
  add(5, 'e', [
    { text: '5 Vokabeln schreiben', done: true },
    { text: 'Englisches Lied anhören', done: true },
  ]);
  add(7, 'd', [
    { text: 'Diktat-Übung', done: true },
    { text: 'Blatt-Methode', done: true },
  ]);
  add(7, 'n', [{ text: 'Mindmap zeichnen', done: true }]);

  writeLog(log);
}
