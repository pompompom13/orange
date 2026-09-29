(function () {
  // часы работы: [открытие, закрытие], 26/27 = 02:00/03:00 следующего дня. Пн = 0
  var HOURS = [[14, 26], [14, 26], [14, 26], [14, 26], [14, 27], [14, 27], [14, 26]];
  var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var root = document.documentElement;

  // --- 18+ ---
  document.getElementById('ageYes').addEventListener('click', function () {
    try { localStorage.setItem('apelsin-age', 'yes'); } catch (e) {}
    root.classList.add('age-ok');
  });
  document.getElementById('ageNo').addEventListener('click', function () {
    document.getElementById('ageAsk').hidden = true;
    document.getElementById('ageDeny').hidden = false;
  });

  // --- open status & week (Moscow time) ---
  function hh(h) { return (h % 24 < 10 ? '0' : '') + (h % 24) + ':00'; }
  var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  var d = (msk.getDay() + 6) % 7, h = msk.getHours() + msk.getMinutes() / 60;
  var prev = HOURS[(d + 6) % 7], cur = HOURS[d], txt, open = false;
  if (h < prev[1] - 24) { open = true; txt = 'открыто до ' + hh(prev[1]); }
  else if (h >= cur[0]) { open = true; txt = 'открыто до ' + hh(cur[1]); }
  else { txt = 'откроемся в ' + hh(cur[0]); }
  var st = document.getElementById('status');
  st.textContent = 'Балашиха · ул. Ситникова, 6 · ' + txt;
  st.classList.add(open ? 'is-open' : 'is-closed');
  document.getElementById('week').innerHTML = DAYS.map(function (n, i) {
    return '<li' + (i === d ? ' class="is-today"' : '') + '><span>' + n + (i === d ? ' · сегодня' : '') + '</span><span>' + hh(HOURS[i][0]) + '–' + hh(HOURS[i][1]) + '</span></li>';
  }).join('');

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
