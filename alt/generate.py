#!/usr/bin/env python3
"""Regenerate alt/dark.html and alt/light.html as ERP re-skins of index.html.
Run from repo root: python3 alt/generate.py"""
import re
src = open("index.html").read()

PILL = {
 "dark": '''  <a href="/" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; color: #94A3B8">Current</a>
  <a href="/alt/dark.html" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; background: #6366f1; color: #fff">ERP Dark</a>
  <a href="/alt/light.html" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; color: #94A3B8">ERP Light</a>''',
 "light": '''  <a href="/" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; color: #6B7A86">Current</a>
  <a href="/alt/dark.html" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; color: #6B7A86">ERP Dark</a>
  <a href="/alt/light.html" style="text-decoration: none; padding: 6px 11px; border-radius: 999px; background: #6366f1; color: #fff">ERP Light</a>'''
}

for theme in ("dark", "light"):
    h = src
    h = h.replace('<html lang="en">', f'<html lang="en" data-theme="{theme}">')
    h = h.replace('Confidential Mental Health Care | மனநல மருத்துவம்</title>',
                  f'Confidential Mental Health Care (ERP {theme.capitalize()} preview)</title>')
    h = h.replace('<link rel="canonical" href="https://mspsychiatryclinic.com/">',
                  '<meta name="robots" content="noindex">')
    h = h.replace('family=Hind+Madurai:wght@400;500;600;700&display=swap',
                  'family=Hind+Madurai:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap')
    h = re.sub(r'<link rel="stylesheet" href="css/style\.css\?v=(\d+)">',
               r'<link rel="stylesheet" href="../css/style.css?v=\1">\n  <link rel="stylesheet" href="erp.css?v=2">', h)
    h = h.replace('src="assets/', 'src="../assets/')
    h = re.sub(r'src="js/main\.js\?v=(\d+)"', r'src="../js/main.js?v=\1"', h)
    h = re.sub(r'  <a href="/" style=[^\n]*Current</a>\n  <a href="/alt/dark\.html"[^\n]*ERP Dark</a>\n  <a href="/alt/light\.html"[^\n]*ERP Light</a>',
               PILL[theme], h)
    open(f"alt/{theme}.html", "w").write(h)
    print(theme, "ok | assets:", h.count('../assets/'), "| erp.css:", 'erp.css?v=2' in h, "| css:", '../css/style.css' in h)
