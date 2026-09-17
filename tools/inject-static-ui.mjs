#!/usr/bin/env node
import fs from 'node:fs';

const targets = [
  { file: 'index.html', ui: 'main', href: './assets/static-ui.css' },
  { file: 'app.html', ui: 'download', href: './assets/static-ui.css' },
  { file: 'kar/index.html', ui: 'kar', href: '../assets/static-ui.css' },
  { file: 'payam/index.html', ui: 'payam', href: '../assets/static-ui.css' },
  { file: 'view/index.html', ui: 'view', href: '../assets/static-ui.css' },
  { file: 'webvault-manager/webvault.html', ui: 'webvault', href: '../assets/static-ui.css' },
];

const marker = 'data-tailwind-ui="true"';
const stylesheet = './assets/static-ui.css';
let changed = 0;

for (const { file, ui, href } of targets) {
  if (!fs.existsSync(file)) {
    console.warn(`::warning::UI target not found: ${file}`);
    continue;
  }

  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Tag each independent application so the shared stylesheet is strictly scoped.
  if (!/\bdata-ui=/.test(html.slice(0, 1024))) {
    html = html.replace(/<html\b([^>]*)>/i, `<html$1 data-ui="${ui}">`);
  }

  // Idempotent: repeated local builds/deploys never duplicate the stylesheet.
  if (!html.includes(marker)) {
    const link = `<link rel="stylesheet" href="${href}" ${marker}>`;
    if (!/<\/head>/i.test(html)) {
      throw new Error(`${file}: </head> not found; refusing unsafe injection`);
    }
    html = html.replace(/<\/head>/i, `${link}\n</head>`);
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
    console.log(`✓ ${file} → ${ui}`);
  } else {
    console.log(`— ${file}: already prepared`);
  }
}

// The root application promises a fully offline shell. Its service worker is a
// large, hand-maintained file, so deployment adds the compiled stylesheet to
// APP_SHELL idempotently instead of duplicating a fragile source-file rewrite.
const swFile = 'sw.js';
if (fs.existsSync(swFile)) {
  let sw = fs.readFileSync(swFile, 'utf8');
  if (!sw.includes(`'${stylesheet}'`) && !sw.includes(`"${stylesheet}"`)) {
    const appShell = /(const\s+APP_SHELL\s*=\s*\[\s*\n)/;
    if (!appShell.test(sw)) {
      throw new Error(`${swFile}: APP_SHELL not found; refusing unsafe offline-cache injection`);
    }
    sw = sw.replace(appShell, `$1  '${stylesheet}',\n`);
    fs.writeFileSync(swFile, sw);
    console.log(`✓ ${swFile} → cached ${stylesheet}`);
  } else {
    console.log(`— ${swFile}: stylesheet already cached`);
  }
} else {
  console.warn(`::warning::Root service worker not found: ${swFile}`);
}

console.log(`Prepared ${targets.length} static UI surfaces (${changed} changed).`);
