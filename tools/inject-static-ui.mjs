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

console.log(`Prepared ${targets.length} static UI surfaces (${changed} changed).`);
