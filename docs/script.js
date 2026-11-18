const screen = document.querySelector('#screen');
const title = document.querySelector('#screen-title');
const tabs = [...document.querySelectorAll('[data-screen]')];
let current = 'pista', start = Date.now(), lap = 7;
const screenImages = { chegada: 'velo-chegada.png', resumo: 'velo-resumo.png', voltas: 'velo-voltas.png', menu: 'velo-menu.png' };
const screenLabels = { chegada: 'Tela de fechamento de volta', resumo: 'Resumo da sessão', voltas: 'Lista de voltas', menu: 'Menu principal' };
function render() {
  if (current === 'pista') {
    const seconds = ((Date.now() - start) / 1000) % 12;
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
function select(name) { current = name; tabs.forEach(t => {const active=t.dataset.screen===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active)}); render(); }
tabs.forEach(t=>t.addEventListener('click',()=>select(t.dataset.screen)));
let auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
tabs.forEach(t=>t.addEventListener('click',()=>{auto=false;document.querySelector('#demo-status').textContent='● TELA SELECIONADA'}));
setInterval(()=>{if(auto && current==='pista' && Date.now()-start>12000){lap++;select('chegada');setTimeout(()=>{if(auto){start=Date.now();select('pista')}},2500)} else if(current==='pista') render()},150);
render();
const appScreen = document.querySelector('#app-screen');
const appTabs = [...document.querySelectorAll('[data-app]')];
const appScreens = {visao:['visao','visão-geral','Visão geral'],sessoes:['sessoes','sessões','Sessões'],analise:['analise','análise-inteligente','Análise inteligente'],telemetria:['telemetria','dados-de-telemetria','Dados de telemetria'],sessao:['sessao','detalhes-da-sessão','Detalhes da sessão'],voltas:['voltas','voltas','Voltas'],equipamentos:['equipamentos','equipamentos','Equipamentos']};
function selectApp(name){const [file,path,label]=appScreens[name];appScreen.innerHTML=`<img src="assets/emerson-${file}.png" alt="Tela ${label} do Emerson">`;document.querySelector('#app-path').textContent=path;appTabs.forEach(t=>{const active=t.dataset.app===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active)})}
appTabs.forEach(t=>t.addEventListener('click',()=>selectApp(t.dataset.app)));selectApp('visao');
