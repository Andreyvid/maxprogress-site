/* Alternância de tema escuro/claro (funciona mesmo sem GSAP). A escolha fica salva neste navegador. */
(function () {
  'use strict';
  var root = document.documentElement;
  var btns = document.querySelectorAll('[data-theme-toggle]');
  var meta = document.querySelector('meta[name="theme-color"]');

  function sync() {
    var light = root.getAttribute('data-theme') === 'light';
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', light ? 'true' : 'false');
    if (meta) meta.setAttribute('content', light ? '#F5F4F0' : '#17161B');
  }
  function toggle() {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('mp-theme', next); } catch (e) {}
    sync();
  }
  for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', toggle);
  sync();

  // Comparador escuro × claro dos prints do app.
  var cmp = document.querySelector('[data-cmp]');
  if (cmp) {
    var view = cmp.querySelector('.cmp-view'), input = cmp.querySelector('.cmp-input');
    var dark = cmp.querySelector('.cmp-dark'), light = cmp.querySelector('.cmp-light');
    var tabs = cmp.querySelectorAll('.cmp-tabs button');
    var screens = [['01-inicio', 'Tela inicial'], ['02-registrar', 'Registro de treino'], ['03-musculos', 'Mapa de músculos'],
                   ['04-evolucao', 'Evolução do exercício'], ['05-historico', 'Histórico de treinos']];
    var touched = false;
    var setPos = function (v) { view.style.setProperty('--pos', v + '%'); };
    input.addEventListener('input', function () { touched = true; setPos(input.value); });
    input.addEventListener('pointerdown', function () { touched = true; });
    for (var k = 0; k < tabs.length; k++) {
      tabs[k].addEventListener('click', function () {
        var sc = screens[+this.getAttribute('data-i')];
        dark.src = 'assets/screens/dark/' + sc[0] + '.webp';  dark.alt = sc[1] + ' no tema escuro';
        light.src = 'assets/screens/light/' + sc[0] + '.webp'; light.alt = sc[1] + ' no tema claro';
        for (var j = 0; j < tabs.length; j++) {
          var on = tabs[j] === this;
          tabs[j].classList.toggle('is-on', on);
          tabs[j].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      });
    }
    // Dica de movimento: uma vez, ao aparecer, a alça vai e volta (só se o sistema permitir movimento).
    var calm = false;
    try { calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (!calm && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        var t0 = null, D = 1800;
        (function step(ts) {
          if (touched) return;
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / D);
          var v = 50 + 28 * Math.sin(p * Math.PI * 2) * (1 - p * 0.35);
          input.value = v; setPos(v);
          if (p < 1) requestAnimationFrame(step); else { input.value = 50; setPos(50); }
        })(performance.now());
      }, { threshold: 0.6 });
      io.observe(view);
    }
  }

  // Animação do celular: respeita "reduzir movimento" do sistema, mas deixa a pessoa ativar.
  var note = document.getElementById('motion-note');
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (note && reduced) {
    var forced = root.getAttribute('data-motion') === 'on';
    var btn = note.querySelector('[data-motion-toggle]');
    if (forced) {
      note.firstChild.textContent = 'Animação do celular ativada, mesmo com o sistema pedindo menos movimento. ';
      btn.textContent = 'Desativar';
    }
    note.hidden = false;
    btn.addEventListener('click', function () {
      try { localStorage.setItem('mp-motion', forced ? 'off' : 'on'); } catch (e) {}
      var u = location.pathname + (forced ? '?motion=off' : '?motion=on') + location.hash;
      location.href = u;
    });
  }
})();
