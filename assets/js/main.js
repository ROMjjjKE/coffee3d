/* ООО «У кофейня»: меню, конструктор заказа, заявка */

document.addEventListener('DOMContentLoaded', function () {
  initMenu();
  initPick();
  initForm();
  initYear();
});

function initMenu() {
  var b = document.getElementById('burger');
  var m = document.getElementById('menu');
  if (!b || !m) return;
  b.addEventListener('click', function () {
    var open = m.hidden;
    m.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
  });
  m.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { m.hidden = true; b.setAttribute('aria-expanded', 'false'); }
  });
}

function initPick() {
  var root = document.getElementById('zakaz');
  if (!root) return;
  var chips = Array.prototype.slice.call(root.querySelectorAll('.chip'));
  var title = document.getElementById('pick-title');
  var send = document.getElementById('pick-send');
  var clarify = document.getElementById('pick-clarify');
  var term = document.getElementById('pick-term');
  var btn = document.getElementById('pick-send-btn');

  var state = {};
  chips.forEach(function (c) {
    var g = c.getAttribute('data-group');
    if (c.classList.contains('is-on')) state[g] = c.getAttribute('data-value');
    c.addEventListener('click', function () {
      state[g] = c.getAttribute('data-value');
      chips.filter(function (x) { return x.getAttribute('data-group') === g; })
           .forEach(function (x) {
             var on = x === c;
             x.classList.toggle('is-on', on);
             x.setAttribute('aria-pressed', String(on));
           });
      render();
    });
  });

  var SENDS = {
    '3D-модель (STL)': 'Файл .stl или .step. Проверим масштаб в миллиметрах и толщину стенок.',
    'Чертёж с размерами': 'Фото чертежа или эскиз с размерами и посадочными местами.',
    'Только фото или идея': '2–3 фото с разных сторон и хотя бы один размер для масштаба.'
  };

  function render() {
    var what = state.what || 'Деталь';
    var size = state.size || '';
    var src = state.src || 'Только фото или идея';
    var rush = state.rush || 'Обычный, до 3 дней';

    title.textContent = what + (size ? ' · ' + size : '');
    send.textContent = SENDS[src] || SENDS['Только фото или идея'];
    clarify.textContent = 'Материал под задачу (жёсткость, эластичность, нагрев), толщина стенок, нужна ли постобработка.';
    term.textContent = rush === 'Хочу быстрее'
      ? 'Скажем сразу, успеваем ли: срок зависит от загрузки оборудования.'
      : 'Обычно до трёх дней. Крупные изделия и партии — дольше, срок назовём при заказе.';
  }

  function toForm() {
    var what = state.what || 'Деталь';
    var size = state.size || '';
    var src = state.src || '';
    var rush = state.rush || '';
    var sel = document.getElementById('f-what');
    var sizeIn = document.getElementById('f-size');
    var note = document.getElementById('f-note');
    if (sel) {
      var match = Array.prototype.slice.call(sel.options).filter(function (o) {
        return what.indexOf(o.text.split(',')[0].split(' ')[0]) === 0;
      });
      if (match.length) sel.value = match[0].text;
    }
    if (sizeIn) sizeIn.value = [size, src].filter(Boolean).join(', ');
    if (note) note.value = 'Собрано в конструкторе: ' + what + (size ? ', размер ' + size : '') +
      (src ? ', на руках: ' + src : '') + (rush ? ', срок: ' + rush : '') + '.';
    var form = document.getElementById('zayavka');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var name = document.getElementById('f-name');
    if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 700);
  }

  if (btn) btn.addEventListener('click', toForm);
  render();
}

function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;
  var name = document.getElementById('f-name');
  var contact = document.getElementById('f-contact');
  var ok = document.getElementById('form-ok');
  var pre = document.getElementById('order-text');
  var copy = document.getElementById('copy-order');

  [name, contact].forEach(function (el) {
    el.addEventListener('input', function () { el.setCustomValidity(''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    if (!name.value.trim() || name.value.trim().length < 2) {
      name.setCustomValidity('Как к вам обращаться?');
      bad = true;
    }
    if (!contact.value.trim() || contact.value.trim().length < 5) {
      contact.setCustomValidity('Куда ответить: телефон, Telegram или e-mail');
      bad = true;
    }
    if (bad || !form.checkValidity()) { form.reportValidity(); return; }

    var lines = [
      'Заявка с сайта: 3D-печать',
      'Имя: ' + name.value.trim(),
      'Контакт: ' + contact.value.trim(),
      'Что нужно: ' + document.getElementById('f-what').value,
      document.getElementById('f-size').value ? 'Размер / исходник: ' + document.getElementById('f-size').value : '',
      document.getElementById('f-note').value ? 'Детали: ' + document.getElementById('f-note').value : ''
    ].filter(Boolean);

    pre.textContent = lines.join('\n');
    form.hidden = true;
    ok.hidden = false;
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (copy) {
      copy.onclick = function () {
        var text = pre.textContent;
        var done = function () { copy.textContent = 'Скопировано'; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (err) {}
          document.body.removeChild(ta);
        }
      };
    }
  });
}

function initYear() {
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}
