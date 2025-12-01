/* ----------------- Sample data ----------------- */
const sampleResorts = [
  {id:'r1',name:'Coralview Resort',location:'El Nido, Palawan',price:'7,500',stars:1,score:5.0,img:"resort1.webp"},
  {id:'r2',name:'Lagoon Eco-Lodge',location:'Coron, Palawan',price:'9,000',stars:0,score:4.2, img:"resort2.jpg"},
  {id:'r3',name:'Palawan Sands',location:'Puerto Princesa, Palawan', price:'6,700',stars:0,score:1.5,img:"resort3.jpg"}
];

const activities = [
  {id:'a1',name:'Jet Ski',img:"jetski.jpg",impact: "Oil, fuel and waves may harm the corals.",tip:'Keep jet skis away from shallow reefs; use designated zones.'},
  {id:'a2',name:'Snorkeling',img:"snorkel.webp",impact: "Do not harm or disturb the marine creatures.",tip:'Use reef-safe sunscreen and avoid touching corals.'},
  {id:'a3',name:'Kayaking',img:"kayak.webp",impact: "The paddle may hit corals, but is a better alternative than a jet ski.",tip:'Non-motorized, low-impact option—use guided routes.'},
  {id:'a4',name:'Guided Dive',img:"dive.webp",impact: "Do not harm or disturb the marine creatures.",tip:'Choose master divers with and do not touch corals.'}
];

const rates = [
  {name:'Coralview Resort'},
  {name:'Lagoon Eco-Lodge'},
  {name:'Palawan Sands'},
  {name:'Jet Ski'},
  {name:'Snorkeling'},
  {name:'Kayaking'},
  {name:'Guided Dive'},
]

/* ----------------- State and storage ----------------- */
const STORAGE_KEY = 'maribuddy-demo';
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
if(!state.pet) state.pet = {health:50,happy:50,clean:50};
if(!state.resorts) state.resorts = sampleResorts;
if(!state.global) state.global = {health:30};
if(!state.rates) state.rates = rates;

/* ----------------- UI helpers ----------------- */
function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderAll();}

/* ----------------- Navigation ----------------- */
$all('.nav-btn').forEach(b=>b.addEventListener('click',e=>{setPage(b.dataset.page)}));
$all('.new-btn').forEach(b=>b.addEventListener('click',e=>{setPage(b.dataset.page)}));
$all('[data-goto]').forEach(b=>b.addEventListener('click',e=>setPage(b.dataset.goto)));

function setPage(page){
  $all('main section').forEach(s=>s.style.display='none');
  const el = document.getElementById(page);
  if(el) el.style.display='block';
  $all('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
}

/* ----------------- Render Resorts ----------------- */
function renderResorts(){
  const container = $('#resortList'); container.innerHTML='';
  state.resorts.forEach(r=>{
    const div = document.createElement('div'); 
    div.className='resort card';
    
    div.innerHTML = 
    `<div class="top">
      <img src="./img/${r.img}" alt=image of resort ${r.id} class="resort-img">
    </div>
    <div class="bottom">
        <h3> ${ r.stars >= 1 ? '<span class="star">★</span>' : ''} ${r.name}</h3>
        <div class="muted">${r.location}</div>
        <div class="price"><strong>₱</strong> ${r.price} &middot <strong>${r.score}</strong> eco-rating</div>
        <div class="controls" style="margin-top:8px">
          <button class='btn' data-action='view' data-id='${r.id}'>View</button>
          <button class='btn alt' data-action='rate' data-id='${r.id}'>Rate</button>
        </div>
      </div>`
      ;
    container.appendChild(div);
  });
  // attach listeners
  container.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',e=>{
    const id=b.dataset.id; const act=b.dataset.action;
    if(act==='view') alert('Resort: '+ state.resorts.find(x=>x.id===id).name + '\nScore: '+state.resorts.find(x=>x.id===id).score);
    if(act==='rate'){ setPage('rate'); $('#resortSelect').value=id }
  }))
}

/* ----------------- Activities ----------------- */
function renderActivities(){
  const c = $('#activityGrid'); c.innerHTML='';
  activities.forEach(a=>{
    const el = document.createElement('div'); el.className='activity card';
    el.innerHTML = `
      <div class="top-activity">
        <img src="./img/${a.img}" alt=image of resort ${a.id} class="resort-img">
      </div>
      <div class="bottom-activity">
      <h4>${a.name}</h4><div class='muted'>Impact: ${a.impact>0? '+'+a.impact : a.impact}</div><p class='muted' style='margin-top:8px'>${a.tip}</p>
      </div>
      `;
    c.appendChild(el);
  })
}

/* ----------------- Rating Form ----------------- */
function setupRatingForm(){
  const sel = $('#resortSelect'); sel.innerHTML='';
  state.rates.forEach(r=>{ const o=document.createElement('option'); o.textContent=r.name; sel.appendChild(o) });

  $('#ratingForm').addEventListener('submit',e=>{
    e.preventDefault();
    applyPetChange(5);
    save(); 
    alert('Thanks! Your rating was recorded.');
    setPage('list');
  });
}

/* ----------------- Pet logic ----------------- */
function applyPetChange(delta) {
  if(!delta) return;
  state.pet.health = Math.max(0,Math.min(100,state.pet.health + delta));
  state.pet.happy = Math.max(0,Math.min(100,state.pet.happy + Math.round(delta/2)));
  state.pet.clean = Math.max(0,Math.min(100,state.pet.clean + Math.round(delta/2)));
  // update community/global health slightly
  state.global.health = Math.max(0,Math.min(100, Math.round((state.global.health + state.pet.health)/2)));
}

function renderPet() {
  $('#petMeter').style.width = state.pet.health + '%';
  $('#petHappy').textContent = state.pet.happy;
  $('#petClean').textContent = state.pet.clean;
  $('#petText').textContent = state.pet.health>70? 'Thriving! Your buddy loves clean reefs.' : (state.pet.health>40? 'Okay. Keep using eco choices.' : 'Struggling — do more eco-actions.');
  $('#globalMeter').style.width = state.global.health + '%';
  $('#global-health').textContent = state.global.health + '%';
  // change pet color slightly based on health
  const hue = 180 - Math.round(state.pet.health/100*60);
  $('#fishBody ellipse').setAttribute('fill',`hsl(${hue} 90% 70%)`);
}

$('#doQuest')?.addEventListener('click',()=>{ applyPetChange(3); save(); });

/* ----------------- Theme switcher ----------------- */
$('#themeColor').addEventListener('input',e=>{ document.documentElement.style.setProperty('--accent', e.target.value); });

/* ----------------- Initial render ----------------- */
function renderAll() { 
  renderResorts(); 
  renderActivities(); 
  renderPet(); 
}

// init
setPage('home'); 
setupRatingForm(); 
renderAll();

// expose save to window for debugging
window.state = state; window.saveState = save;