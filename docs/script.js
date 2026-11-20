const screen = document.querySelector('#screen');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const picker = document.querySelector('#screen-choice');
const previous = document.querySelector('#screen-prev');
const next = document.querySelector('#screen-next');
let current = picker.value;
let start = Date.now();
const screenImages = { chegada: 'velo-chegada.png', resumo: 'velo-resumo.png', voltas: 'velo-voltas.png', menu: 'velo-menu.png' };
const screenLabels = { chegada: 'Tela de fechamento de volta', resumo: 'Resumo da sessão', voltas: 'Lista de voltas', menu: 'Menu principal' };
function render() {
  if (current === 'dica') {
    screen.innerHTML = '<div class="coach-screen"><span>EMERSON · DICA DE PILOTAGEM</span><strong>Curva 3</strong><p>Experimente frear um pouco antes para entrar na reta com mais velocidade.</p></div>';
  } else if (current === 'pista') {
    if (reducedMotion.matches) {
      screen.innerHTML = '<img class="velo-screen" src="assets/velo-pista.png" alt="Volta 7. Melhor volta em 52,38 segundos, última em 53,04 e ganho de 0,24 segundo na volta atual.">';
      return;
    }
    const elapsed = (Date.now() - start) / 1000;
    const lap = 7 + Math.floor(elapsed / 12);
    const seconds = elapsed % 12;
    const time = (seconds * 4.37).toFixed(2).padStart(5, '0');
    const speed = Math.round(71 + 12 * Math.sin(seconds));
    const delta = Math.round((-0.06 + 0.18 * Math.sin(seconds * 0.55)) * 100);
    const color = delta === 0 ? 'white' : delta < 0 ? '#00ff00' : '#ff0000';
    const width = Math.min(378, Math.abs(delta) * 378 / 150);
    const value = Math.abs(delta / 100).toFixed(2);
    const sign = delta === 0 ? '±' : delta < 0 ? '-' : '+';
    screen.innerHTML = `<svg class="velo-screen" viewBox="0 0 800 480" role="img"
        aria-label="Volta ${lap}, tempo atual 00:${time}, velocidade ${speed} quilômetros por hora">
      <image href="assets/velo-pista.png" width="800" height="480"/>
      <g fill="black">
        <rect x="16" y="10" width="144" height="56"/>
        <rect x="16" y="74" width="150" height="48"/>
        <rect x="650" y="74" width="90" height="48"/>
        <rect x="20" y="130" width="760" height="36"/>
        <rect x="120" y="176" width="560" height="152"/>
      </g>
      <rect x="${delta < 0 ? 400 - width : 400}" y="131" width="${width}" height="34" fill="${color}"/>
      <line x1="400" y1="125" x2="400" y2="171" stroke="white" stroke-width="2"/>
      <g font-family="Velo Saira, sans-serif" fill="white" font-weight="800">
        <text x="20" y="48" font-weight="600" font-size="28">VOLTA ${String(lap).padStart(2, '0')}</text>
        <text x="20" y="112" font-size="42">00:${time}</text>
        <text x="736" y="112" font-size="42" text-anchor="end">${speed}</text>
        <text x="258 320 383 417 480" y="297" font-size="130" fill="${color}">${sign}${value}</text>
      </g>
    </svg>`;
  } else {
    screen.innerHTML = `<img class="velo-screen" src="assets/${screenImages[current]}" alt="${screenLabels[current]} do Velo, com dados ilustrativos">`;
  }
}
function selectScreen(name) {
  picker.value = name;
  current = name;
  if (name === 'pista') start = Date.now();
  previous.disabled = picker.selectedIndex === 0;
  next.disabled = picker.selectedIndex === picker.length - 1;
  render();
}
picker.addEventListener('change', () => selectScreen(picker.value));
previous.addEventListener('click', () => selectScreen(picker.options[picker.selectedIndex - 1].value));
next.addEventListener('click', () => selectScreen(picker.options[picker.selectedIndex + 1].value));
reducedMotion.addEventListener('change', render);
setInterval(() => {
  if (current === 'pista' && !reducedMotion.matches) render();
}, 150);
document.querySelector('[data-show-tip]').addEventListener('click', () => {
  selectScreen('dica');
  picker.focus({preventScroll:true});
});
render();
const appScreen = document.querySelector('#app-screen');
const appTabs = [...document.querySelectorAll('[data-app]')];
const appScreens = {visao:['visao','visão-geral','Visão geral'],sessoes:['sessoes','sessões','Sessões'],analise:['analise','análise-inteligente','Análise inteligente'],telemetria:['telemetria','dados-de-telemetria','Dados de telemetria'],sessao:['sessao','detalhes-da-sessão','Detalhes da sessão'],voltas:['voltas','voltas','Voltas'],equipamentos:['equipamentos','equipamentos','Equipamentos']};
function selectApp(name){const [file,path,label]=appScreens[name];appScreen.innerHTML=`<img src="assets/emerson-${file}.png" alt="Tela ${label} do Emerson">`;document.querySelector('#app-path').textContent=path;appTabs.forEach(t=>{const active=t.dataset.app===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active)})}
appTabs.forEach(t=>t.addEventListener('click',()=>selectApp(t.dataset.app)));selectApp('visao');

const menu = document.querySelector('#main-nav');
const toggle = document.querySelector('.menu-toggle');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('open', open);
}
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', () => setMenu(false));
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    toggle.focus();
  }
});

function enableTabKeys(buttons, panel) {
  panel.setAttribute('role', 'tabpanel');
  function sync() {
    for (const button of buttons) {
      button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1;
      if (button.tabIndex === 0) panel.setAttribute('aria-labelledby', button.id);
    }
  }
  buttons.forEach((button, index) => {
    button.id = panel.id + '-tab-' + index;
    button.setAttribute('aria-controls', panel.id);
    button.addEventListener('click', sync);
    button.addEventListener('keydown', event => {
      const next = { ArrowRight: (index + 1) % buttons.length,
        ArrowLeft: (index + buttons.length - 1) % buttons.length,
        Home: 0, End: buttons.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
      buttons[next].click();
    });
  });
  sync();
}

enableTabKeys(appTabs, appScreen);
