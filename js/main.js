/* MaxProgress — seção do celular que gira ao rolar.
   GSAP + ScrollTrigger (vendorizados em js/vendor). Sem build.
   Sem JS / tela pequena / movimento reduzido: a página usa a versão simples empilhada (só CSS). */
(function () {
  'use strict';

  var root = document.documentElement;
  var FORCED = root.getAttribute('data-motion') === 'on';   // pessoa ativou a animação manualmente
  var COND = '(min-width: 900px) and (min-height: 560px)' + (FORCED ? '' : ' and (prefers-reduced-motion: no-preference)');

  // Se o GSAP não carregou, volta para a versão simples.
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('is-3d'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // Ajustes de movimento
  var HOLD = 0.6;            // tempo "parado" em cada tela (unidades da timeline)
  var MOVE = 0.5;            // tempo da troca entre telas
  var INTRO = 0.8;           // celular vira de costas para a frente
  var OUTRO = 0.4;           // celular volta ao centro no fim
  var OFFSET = 105;          // distância lateral do celular, em % da largura dele
  var TURN = 24;             // graus de giro lateral (virado para o centro)
  var SCROLL_PER_UNIT = 90;  // % da altura da tela rolada por unidade de timeline

  var mm = gsap.matchMedia();

  // Entrada suave das seções (só com movimento permitido; sem isso, tudo já fica visível).
  mm.add(FORCED ? 'all' : '(prefers-reduced-motion: no-preference)', function () {
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 28, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  });

  mm.add(COND, function () {
    root.classList.add('is-3d');

    var section = document.getElementById('showcase');
    var stage = section.querySelector('.stage');
    var wrap = section.querySelector('.phone-wrap');
    var phone = section.querySelector('.phone');
    var shots = gsap.utils.toArray('.phone .screen .shot', section);
    var steps = gsap.utils.toArray('.step', section);
    var dots = gsap.utils.toArray('.dot', section);
    var n = steps.length;
    var off = 0;

    // Distância lateral: nunca deixa o celular sair da tela.
    function measure() {
      var pw = phone.offsetWidth, W = stage.clientWidth;
      off = Math.min(pw * OFFSET / 100, W / 2 - pw / 2 - W * 0.04);
      stage.style.setProperty('--off', off + 'px');
      return off;
    }
    function side(i) { return i % 2 === 0 ? 1 : -1; }       // 1 = celular à direita
    function x(i) { return function () { return side(i) * measure(); }; }
    function turn(i) { return -side(i) * TURN; }             // à direita olha p/ esquerda (ângulo negativo)

    measure();
    gsap.set(wrap, { x: x(0) });
    gsap.set(phone, { rotationY: -150, rotationX: 14, scale: 0.82 });
    gsap.set(steps, { opacity: 0, y: 26 });
    gsap.set(shots, { opacity: function (i) { return i === 0 ? 1 : 0; } });

    var tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: function () { setActive(tl.time()); } });
    var mids = [];
    var t = 0;

    // Intro: o celular vira de costas para a frente e o primeiro texto aparece.
    tl.to(phone, { rotationY: turn(0), rotationX: 4, scale: 1, duration: INTRO, ease: 'power2.out' }, 0);
    tl.to(steps[0], { opacity: 1, y: 0, duration: INTRO * 0.5, ease: 'power1.out' }, INTRO * 0.5);
    t = INTRO + HOLD;

    for (var i = 0; i < n - 1; i++) {
      var s = t;
      mids.push(s + MOVE / 2);
      // texto atual sai
      tl.to(steps[i], { opacity: 0, y: -22, duration: MOVE * 0.4, ease: 'power1.in' }, s);
      // celular troca de lado e vira para o outro lado (passa de frente no meio)
      tl.to(wrap, { x: x(i + 1), duration: MOVE, ease: 'power2.inOut' }, s);
      tl.to(phone, { rotationY: turn(i + 1), duration: MOVE, ease: 'power2.inOut' }, s);
      tl.to(phone, { scale: 1.07, duration: MOVE / 2, ease: 'power2.out' }, s);
      tl.to(phone, { scale: 1, duration: MOVE / 2, ease: 'power2.in' }, s + MOVE / 2);
      // tela troca no meio do giro
      tl.to(shots[i], { opacity: 0, duration: MOVE * 0.4 }, s + MOVE * 0.3);
      tl.to(shots[i + 1], { opacity: 1, duration: MOVE * 0.4 }, s + MOVE * 0.3);
      // próximo texto entra
      tl.to(steps[i + 1], { opacity: 1, y: 0, duration: MOVE * 0.4, ease: 'power1.out' }, s + MOVE * 0.65);
      t = s + MOVE + HOLD;
    }

    // Outro: texto some e o celular vai ao centro, de frente.
    tl.to(steps[n - 1], { opacity: 0, y: -22, duration: OUTRO * 0.5, ease: 'power1.in' }, t);
    tl.to(wrap, { x: 0, duration: OUTRO, ease: 'power2.inOut' }, t);
    tl.to(phone, { rotationY: 0, rotationX: 0, scale: 1.04, duration: OUTRO, ease: 'power2.inOut' }, t);
    tl.to({}, { duration: 0.1 }, t + OUTRO);   // pequena folga antes de soltar o pin

    function setActive(time) {
      var k = 0;
      for (var j = 0; j < mids.length; j++) if (time >= mids[j]) k = j + 1;
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === k); });
    }

    var st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: function () { return '+=' + Math.round(tl.duration() * SCROLL_PER_UNIT * window.innerHeight / 100); },
      pin: true,
      refreshPriority: 1,
      scrub: 0.7,
      animation: tl,
      invalidateOnRefresh: true
    });

    var onInit = function () { measure(); };
    ScrollTrigger.addEventListener('refreshInit', onInit);

    return function () {
      ScrollTrigger.removeEventListener('refreshInit', onInit);
      stage.style.removeProperty('--off');
      root.classList.remove('is-3d');
    };
  });
})();
