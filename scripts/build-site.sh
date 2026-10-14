#!/usr/bin/env bash
# Monta a pasta _site só com o que vai para o ar (sem README, scripts, vídeos de preview etc.).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir _site
cp index.html 404.html case-study.html privacidade.html excluir-conta.html robots.txt sitemap.xml .nojekyll _site/
[ -f CNAME ] && cp CNAME _site/ || true
cp -r css js assets _site/
echo "_site pronto: $(find _site -type f | wc -l) arquivos, $(du -sh _site | cut -f1)"
