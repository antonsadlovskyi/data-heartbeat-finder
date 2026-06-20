/**
 * Navio V2 — Full E2E matrix test
 *
 * Перевіряє всі 135 комбінацій: 9 сторінок × 3 ролі × 5 платформ.
 * Запуск: npm run test:e2e
 *
 * Вимоги:
 *   - Dev server запущений на localhost:8080 (npm run dev)
 *   - playwright-chromium встановлений (npm install --save-dev playwright-chromium)
 */

import { chromium } from 'playwright-chromium';

const BASE  = 'http://localhost:8080';
const EMAIL = 'antonsadlov@gmail.com';
const PASS  = 'Anton_999!';

const PAGES = [
  { key: 'dashboard',                path: '/app' },
  { key: 'competitor_radar',         path: '/app/competitors' },
  { key: 'best_competitor_outcomes', path: '/app/best-outcomes' },
  { key: 'competitor_moves',         path: '/app/competitor-moves' },
  { key: 'my_performance',           path: '/app/performance' },
  { key: 'trend_tracker',            path: '/app/trends' },
  { key: 'hypotheses',               path: '/app/hypotheses' },
  { key: 'dynamics',                 path: '/app/dynamics' },
  { key: 'settings',                 path: '/app/connected' },
];

const ROLES     = ['Owner', 'Marketer', 'SMM'];
const PLATFORMS = ['All', 'Instagram', 'TikTok', 'Threads', 'X'];

// Ці платформи мають показувати EmptyState (not_connected) — це очікувана поведінка
const NOT_CONNECTED = new Set(['Threads', 'X']);

// ── Хелпери ──────────────────────────────────────────────────────────────────

async function clickBtn(page, label) {
  try {
    await page.locator('button').filter({ hasText: new RegExp(`^${label}$`) }).first().click({ timeout: 3000 });
  } catch {}
}

/**
 * Чекає поки React завершить рендер після зміни платформи/ролі.
 * Замість фіксованого таймауту — чекає DOM-маркери фінального стану:
 *   - "Перевірити ще раз" = EmptyState або ErrorState (RPC відповів)
 *   - "Готово" / "Частково" = бейдж data_status (сторінка завантажена)
 *   - довгий текст > 200 символів = є реальний контент
 */
async function waitForRender(page) {
  await page.waitForFunction(() => {
    const main = document.querySelector('main');
    if (!main) return false;
    const text = main.textContent ?? '';
    return (
      text.includes('Перевірити ще раз') ||
      text.includes('Готово') ||
      text.includes('Частково') ||
      text.includes('Не підключено') ||
      text.includes('Немає даних') ||
      text.length > 200
    );
  }, { timeout: 8000 }).catch(() => {});
}

// ── Основний тест ─────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // Збираємо лише реальні JS-помилки (фільтруємо шум)
  const jsErrors = [];
  page.on('pageerror', err => {
    const msg = err.message;
    if (!msg.includes('ResizeObserver') && !msg.includes('ChunkLoadError')) {
      jsErrors.push(msg);
    }
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (
        !t.includes('favicon') &&
        !t.includes('ResizeObserver') &&
        !t.includes('Failed to load resource') &&
        !t.includes('net::ERR_')
      ) {
        jsErrors.push(`[console.error] ${t}`);
      }
    }
  });

  // ── Логін ───────────────────────────────────────────────────────────────────
  console.log('🔑 Logging in...');
  await page.goto(`${BASE}/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[type="submit"]');
  // TanStack Router uses history.replaceState — waitForURL misses it, so poll instead
  await page.waitForFunction(
    () => window.location.pathname.startsWith('/app'),
    { timeout: 20000, polling: 300 }
  );
  await page.waitForTimeout(500); // let React finish initial render
  console.log('✅ Logged in\n');

  console.log('STATUS | ROLE       | PAGE                           | PLATFORM   | NOTES');
  console.log('─'.repeat(95));

  const results = [];
  let totalPass = 0, totalFail = 0, totalWarn = 0;

  for (const role of ROLES) {
    // Встановити роль через navigation до dashboard
    await page.goto(`${BASE}/app`, { waitUntil: 'domcontentloaded' });
    await waitForRender(page);
    await clickBtn(page, role);
    await page.waitForTimeout(300);

    for (const pg of PAGES) {
      for (const platform of PLATFORMS) {
        jsErrors.length = 0;

        await page.goto(`${BASE}${pg.path}`, { waitUntil: 'domcontentloaded' });
        await waitForRender(page);
        await clickBtn(page, platform);
        await waitForRender(page); // чекаємо фінального рендеру після зміни платформи

        const bodyText = await page.locator('main').textContent({ timeout: 3000 }).catch(() => '');

        const isNotConn    = NOT_CONNECTED.has(platform);
        const hasEmptyState = bodyText.includes('не підключена') || bodyText.includes('Платформа');
        const hasContent   = bodyText.trim().length > 100;
        const hasCrash     = bodyText.includes('Something went wrong');

        const errors = [...jsErrors];
        const notes  = [];
        let status   = 'PASS';

        if (errors.length > 0) {
          status = 'FAIL';
          notes.push(errors.slice(0, 2).map(e => e.slice(0, 80)).join(' | '));
        }
        if (hasCrash) {
          status = 'FAIL';
          notes.push('ERROR_STATE_SHOWN');
        }
        if (isNotConn && !hasEmptyState && !hasCrash && status === 'PASS') {
          status = 'WARN';
          notes.push('not_connected але EmptyState не знайдено');
        }
        if (!isNotConn && !hasContent && !hasCrash && status === 'PASS') {
          status = 'WARN';
          notes.push('контент не знайдено');
        }

        if (status === 'PASS') totalPass++;
        else if (status === 'FAIL') totalFail++;
        else totalWarn++;

        const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️ ' : '❌';
        const line = `${icon} ${status.padEnd(4)} | ${role.padEnd(10)} | ${pg.key.padEnd(30)} | ${platform.padEnd(10)} | ${notes.join('; ') || 'OK'}`;
        console.log(line);
        results.push({ status, role, page: pg.key, platform, notes });
      }
    }
  }

  await browser.close();

  // ── Підсумок ─────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(95));
  console.log(`📊 ВСЬОГО: ${results.length} | ✅ PASS: ${totalPass} | ⚠️  WARN: ${totalWarn} | ❌ FAIL: ${totalFail}`);

  if (totalFail > 0) {
    console.log('\n❌ ПОМИЛКИ (FAIL):');
    results.filter(r => r.status === 'FAIL').forEach(r =>
      console.log(`   ${r.role} / ${r.page} / ${r.platform}: ${r.notes.join('; ')}`)
    );
  }
  if (totalWarn > 0) {
    console.log('\n⚠️  ПОПЕРЕДЖЕННЯ (WARN):');
    results.filter(r => r.status === 'WARN').forEach(r =>
      console.log(`   ${r.role} / ${r.page} / ${r.platform}: ${r.notes.join('; ')}`)
    );
  }

  if (totalFail === 0 && totalWarn === 0) {
    console.log('\n🎉 Матриця 9×3×5 повністю пройдена!');
  } else if (totalFail === 0) {
    console.log('\n✅ Критичних помилок немає (є попередження — перевір вручну).');
  }

  process.exit(totalFail > 0 ? 1 : 0);
})();
