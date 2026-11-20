const screen = document.querySelector('#screen');
const title = document.querySelector('#screen-title');
const tabs = [...document.querySelectorAll('[data-screen]')];
let current = 'dica';
let start = Date.now();
const screenImages = { chegada: 'velo-chegada.png', resumo: 'velo-resumo.png', voltas: 'velo-voltas.png', menu: 'velo-menu.png' };
const screenLabels = { chegada: 'Tela de fechamento de volta', resumo: 'Resumo da sessão', voltas: 'Lista de voltas', menu: 'Menu principal' };
function render() {
  if (current === 'dica') {
    screen.innerHTML = '<div class="coach-screen"><span>EMERSON · DICA DE PILOTAGEM</span><strong>Curva 3</strong><p>Experimente frear um pouco antes para entrar na reta com mais velocidade.</p></div>';
  } else if (current === 'pista') {
    const elapsed = (Date.now() - start) / 1000;
    const lap = 7 + Math.floor(elapsed / 12);
    const seconds = elapsed % 12;
    const time = (seconds * 4.37).toFixed(2).padStart(5, '0');
    const speed = Math.round(71 + 12 * Math.sin(seconds));
    const delta = -0.06 + 0.18 * Math.sin(seconds * 0.55);
    const deltaColor = delta <= 0 ? '#00ff00' : '#ff0000';
    const barWidth = Math.min(Math.abs(delta) / 0.24, 1) * 190;
    const barX = delta <= 0 ? 400 - barWidth : 400;
    const deltaText = `${delta <= 0 ? '−' : '+'} ${Math.abs(delta).toFixed(2)}`;
    screen.innerHTML = `<svg class="velo-screen" viewBox="0 0 800 480" role="img" aria-label="Simulação da tela do Velo em pista: volta ${lap}, tempo 00:${time}, velocidade ${speed} quilômetros por hora"><image href="assets/velo-pista.png" width="800" height="480"/><rect x="20" y="130" width="760" height="37" fill="black"/><rect x="${barX}" y="131" width="${barWidth}" height="35" fill="${deltaColor}"/><line x1="400" y1="125" x2="400" y2="171" stroke="white" stroke-width="2"/><rect x="210" y="175" width="380" height="153" fill="black"/><text x="400" y="296" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="130" fill="${deltaColor}">${deltaText}</text><g font-family="'Barlow Condensed', sans-serif" font-weight="800"><rect x="20" y="38" width="111" height="34" fill="black"/><text x="20" y="62" font-size="28" fill="white">VOLTA ${String(lap).padStart(2, '0')}</text><rect x="20" y="78" width="145" height="42" fill="black"/><text x="20" y="112" font-size="40" fill="white">00:${time}</text><rect x="689" y="78" width="49" height="42" fill="black"/><text x="737" y="112" font-size="40" fill="white" text-anchor="end">${speed}</text></g></svg>`;
  } else {
    screen.innerHTML = `<img class="velo-screen" src="assets/${screenImages[current]}" alt="${screenLabels[current]} do Velo, com dados ilustrativos">`;
  }
}
function select(name) { if (name === 'pista') start = Date.now(); current = name; tabs.forEach(t => {const active=t.dataset.screen===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active)}); render(); }
tabs.forEach(t=>t.addEventListener('click',()=>select(t.dataset.screen)));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
setInterval(() => {
  if (current === 'pista' && !reducedMotion.matches) render();
}, 150);
document.querySelector('[data-show-tip]').addEventListener('click', () => { tabs[0].click(); tabs[0].focus({preventScroll:true}); });
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
enableTabKeys(tabs, screen);
enableTabKeys(appTabs, appScreen);
