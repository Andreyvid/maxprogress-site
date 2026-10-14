# MaxProgress — site

Landing page do app: celular 3D que **gira conforme você rola**, seções de recursos, tema escuro/claro, roteiro, tecnologia e dúvidas, mais uma página de **case study** (`case-study.html`) e as páginas legais (privacidade e exclusão de conta).
HTML + CSS + JS puro (sem build), pronto para GitHub Pages.

## Rodar
Abra `index.html` direto no navegador, ou sirva a pasta: `python3 -m http.server 8000`.

## Trocar as telas
Cada tela tem uma versão escura e uma clara, com o mesmo nome, em `assets/screens/dark/` e `assets/screens/light/`: `01-inicio`, `02-registrar`, `03-musculos`, `04-evolucao`, `05-historico` (`.webp`, ~780×1688). As duas versões devem ter o mesmo conteúdo e a mesma rolagem, para o slider ficar alinhado. Antes de publicar, apague a barra de status do celular (notificações) e dados pessoais (e-mail, nome). **Não use a tela Conta.**

## Tema escuro/claro
`js/theme.js` alterna `data-theme` no `<html>` (escolha salva em `localStorage`; padrão = preferência do sistema). As cores ficam em variáveis no topo de `css/style.css`.
O celular 3D e as telas simples mostram automaticamente a versão do tema atual do site. Na seção "Escuro e claro", um slider compara os dois temas do app lado a lado.

## Como funciona
- `js/main.js`: uma timeline GSAP ligada à rolagem (ScrollTrigger com `pin` + `scrub`). Constantes no topo (`HOLD`, `MOVE`, `OFFSET`, `TURN`, `SCROLL_PER_UNIT`) controlam ritmo, distância e giro.
- `css/style.css`: celular em CSS 3D (`perspective`, `preserve-3d`, camadas empilhadas para a espessura).
- Versão simples (telas empilhadas) em: telas < 900px ou baixas, `prefers-reduced-motion`, sem JS, ou se o GSAP falhar. A classe `is-3d` liga o modo animado.

## Licenças de terceiros
- GSAP 3.15 + ScrollTrigger (`js/vendor`): licença "no charge" da GreenSock — https://gsap.com/standard-license
- Inter e Barlow Condensed (`assets/fonts`): SIL OFL 1.1 (arquivos de licença na pasta).

## Qualidade e deploy (GitHub Actions)
Workflow em `.github/workflows/site.yml`:
1. **checks**: `node scripts/check-site.mjs` (links e âncoras locais, imagens com `alt`, sitemap, placeholders esquecidos).
2. **lighthouse**: monta `_site/` e roda Lighthouse CI (`lighthouserc.json`): acessibilidade, boas práticas e SEO devem ficar ≥ 90–95; desempenho só avisa abaixo de 90.
3. **deploy**: só em `main`, publica `_site/` no GitHub Pages.

Medição local (sem compressão do servidor): desempenho 94–99, acessibilidade 100, boas práticas 100, SEO 100.
Para montar a pasta publicada localmente: `./scripts/build-site.sh`.

## Colocar no ar (passo a passo)
1. **E-mail de contato:** já configurado como `maxprogress.app@gmail.com` em `privacidade.html` e `excluir-conta.html`. Se trocar, o check do CI falha caso o texto `CONTATO_EMAIL` volte a aparecer.
2. **Repositório:** crie `maxprogress-site` no GitHub (público), envie estes arquivos para a branch `main`.
3. **Pages:** Settings → Pages → Source: **GitHub Actions**. O primeiro push em `main` publica em `https://andreyvid.github.io/maxprogress-site/`.
4. **Domínio (opcional):** registre `maxprogress.com.br` no Registro.br e, no DNS, crie 4 registros `A` para o domínio raiz (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) e um `CNAME` de `www` para `andreyvid.github.io`. Depois crie um arquivo `CNAME` na raiz do repositório contendo `maxprogress.com.br`, defina o domínio em Settings → Pages e marque "Enforce HTTPS" quando liberar.
   Só crie o arquivo `CNAME` depois que o DNS estiver apontando; antes disso o site sairia do ar.
5. **Se não usar esse domínio:** troque `https://maxprogress.com.br` pelo endereço real em `index.html` (canonical, Open Graph), `case-study.html`, `privacidade.html`, `excluir-conta.html`, `robots.txt` e `sitemap.xml`.

## Antes de divulgar, confirme
- Textos de **privacidade** e **exclusão de conta** (prazo de 30 dias, "sem anúncios", "não direcionado a menores de 13"): ajuste ao que o app realmente faz. Não é aconselhamento jurídico.
- A Play Store exige que o app também ofereça uma opção de excluir conta **dentro do app**; hoje a tela Conta só tem "Sair da conta".
- O texto do **case study** (`case-study.html`) usa só fatos do projeto; ajuste a motivação e a lista de "Próximos passos" ao que você pretende mesmo fazer.
