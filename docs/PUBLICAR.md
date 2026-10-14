# Publicar e manter o site

Passo a passo para colocar o site no ar e o que conferir antes de divulgar.

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
