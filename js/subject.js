/**
 * subject.js — 과목 페이지 공통 로직
 * (체크박스 토글, 진행률, 탭 전환)
 */

import { toggleTask, getTasks, todayKey } from './store.js';

/** 진행률 업데이트 */
function updateProgress(subjId) {
  const all  = document.querySelectorAll('.chk');
  const done = document.querySelectorAll('.chk.done');
  const t = all.length, d = done.length;

  const doneEl  = document.getElementById('prog-done');
  const totalEl = document.getElementById('prog-total');
  const pctEl   = document.getElementById('prog-pct');

  if (doneEl)  doneEl.textContent  = d;
  if (totalEl) totalEl.textContent = t;
  if (pctEl)   pctEl.textContent   = Math.round(d / t * 100) + '%';
}

/** 저장된 체크 상태 복원 */
function restoreTasks(subjId) {
  const saved = getTasks(todayKey(), subjId);
  if (!saved.length) return;

  document.querySelectorAll('.task-item').forEach(item => {
    const txt  = item.querySelector('.task-text');
    const chk  = item.querySelector('.chk');
    const entry = saved.find(t => t.text === txt?.textContent);
    if (entry?.done) {
      chk.classList.add('done');
      chk.textContent = '✓';
      txt.classList.add('done');
    }
  });
}

/** 체크박스 클릭 핸들러 */
function handleToggle(e) {
  const chk = e.currentTarget.querySelector('.chk') || e.currentTarget;
  const item = chk.closest('.task-item');
  const txt  = item.querySelector('.task-text');
  const subjId = document.body.dataset.subject;

  const wasDone = chk.classList.contains('done');
  if (wasDone) {
    chk.classList.remove('done');
    chk.textContent = '';
    txt.classList.remove('done');
  } else {
    chk.classList.add('done');
    chk.textContent = '✓';
    txt.classList.add('done');
  }

  toggleTask(subjId, txt.textContent, !wasDone);
  updateProgress(subjId);
}

/** 탭 전환 (Mo–Fr / Wochenende) */
function handleTabSwitch(e) {
  const btn  = e.currentTarget;
  const mode = btn.dataset.mode;
  btn.closest('.day-tabs').querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-weekday').style.display = mode === 'wd' ? 'block' : 'none';
  document.getElementById('panel-weekend').style.display = mode === 'we' ? 'block' : 'none';
}

/** 과목 페이지 초기화 */
export function initSubjectPage() {
  const subjId = document.body.dataset.subject;
  if (!subjId) return;

  // 탭
  document.querySelectorAll('.dtab').forEach(btn => {
    btn.addEventListener('click', handleTabSwitch);
  });

  // 태스크 클릭 (task-item 전체 클릭 가능)
  document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', handleToggle);
  });

  // 저장 상태 복원
  restoreTasks(subjId);
  updateProgress(subjId);
}
