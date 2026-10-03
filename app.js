"use strict";
const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4 4l2 2M18 18l2 2M1 12h2M21 12h2M4 20l2-2M18 6l2-2"/></svg>',moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>';
const modules={abstract:{title:"Raisonnement abstrait",code:"RA",desc:"Compléter des séries et matrices de figures.",minutes:8},verbal:{title:"Raisonnement verbal",code:"RV",desc:"Conclure uniquement à partir du texte.",minutes:9},numeric:{title:"Raisonnement numérique",code:"RN",desc:"Interpréter tableaux, proportions et variations.",minutes:10},planning:{title:"Planification",code:"PL",desc:"Organiser selon délais, disponibilités et priorités.",minutes:10},situational:{title:"Jugement situationnel",code:"JS",desc:"Évaluer chaque réaction : servir l’usager et conseiller.",minutes:12}};
const skillLabels={"suite-logique":"suite logique",matrice:"matrice",rotation:"rotation",transformation:"transformation",comprehension:"compréhension",inference:"inférence","application-consigne":"application de consigne","vrai-faux-indetermine":"vrai / faux / indéterminé",synthese:"synthèse",pourcentage:"pourcentage",variation:"variation","ratio-proportion":"ratio et proportion",moyenne:"moyenne","lecture-tableau":"lecture de tableau","lecture-graphique":"lecture de graphique","operations-simples":"opérations simples","agenda-contraintes":"agenda et contraintes",priorisation:"priorisation",dependances:"dépendances",disponibilites:"disponibilités",conflits:"conflits d'agenda","servir-client-usager":"servir le client-usager",conseiller:"conseiller"};
const ratingLabels=["Très inapproprié","Plutôt inapproprié","Plutôt approprié","Très approprié"];
/* Examen blanc : approximation de travail. GovJobs publie la durée totale (2 h) et la liste des tests A1,
   mais ni l'ordre, ni le temps par test, ni le nombre de questions. Ajustez ces valeurs dès qu'ils sont connus. */
const EXAM={sections:["abstract","verbal","numeric","planning","situational"],minutesPerSection:24,questionsPerSection:10};
/* Banque compilée par npm run build:bank dans bank/app-bank.js (chargé avant ce fichier). */
const q = globalThis.EAG_BANK || {};
const state={route:"accueil",dark:false,session:null,answered:0,points:0,sessionCount:5},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],names={accueil:"Vue d'ensemble",entrainement:"Entraînement",session:"Session",results:"Résultats",simulation:"Simulation",ressources:"Ressources",methode:"Méthode"};

/* All item text is escaped: question content is data, never markup. */
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
/* Tirage, ordre des options et notation : shared/session.js (fonctions pures, testées dans npm test). */
const S=globalThis.EagSession;
function shuffle(a){return S.shuffle(a)}
function skillOf(x){return x.skill?` · ${esc(skillLabels[x.skill]||x.skill)}`:""}
function stimulusHtml(s){
  if(s==null)return"";
  if(typeof s==="string")return`<div class="stimulus text">${esc(s)}</div>`;
  if(s.type==="shapes")return`<div class="stimulus"><div class="shapes" role="img" aria-label="Série de figures">${esc(s.text)}</div></div>`;
  if(s.type==="table"){
    const head=`<tr>${s.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join("")}</tr>`;
    const body=s.rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(typeof c==="number"?c.toLocaleString("fr-FR"):c)}</td>`).join("")}</tr>`).join("");
    return`<div class="stimulus"><table class="data">${s.caption?`<caption>${esc(s.caption)}</caption>`:""}<thead>${head}</thead><tbody>${body}</tbody></table>${s.note?`<p class="note">${esc(s.note)}</p>`:""}</div>`;
  }
  if(s.type==="chart")return globalThis.EagChart?`<div class="stimulus">${EagChart.html(s,esc)}</div>`:`<div class="stimulus text">Graphique indisponible (fichier shared/chart.js manquant). Passez cette question.</div>`;
  return"";
}
function prepare(x,m){return S.prepare(x,m)}
function scoreRating(user,key){return S.scoreRating(user,key)}

function route(n){if(state.session&&!state.session.done&&!["session","results"].includes(n)){if(!confirm("Quitter cette session ?"))return;clearInterval(state.session.interval);state.session=null}state.route=n;$$('.view').forEach(v=>v.classList.toggle('active',v.id===`v-${n}`));$$('[data-route]').forEach(b=>b.setAttribute('aria-current',b.dataset.route===n?'page':'false'));$('#crumb').textContent=names[n];history.replaceState(null,"",n==='accueil'?location.pathname:`#${n}`);scrollTo({top:0,behavior:'smooth'});if(n==='accueil')dashboard()}

function optionReview(t){
  const x=t.x,ans=t.ans;
  if(x.f==="rating"){
    return x.o.map((opt,i)=>{const u=ans&&ans.choice?ans.choice[i]:null,k=x.r[i],cls=u==null?"":Math.abs(u-k)<=0?" is-user-correct":Math.abs(u-k)===1?"":" is-user-wrong";
      return`<div class="review-opt${cls}${i===x.a?" is-target":""}"><span>${esc(opt)}${x.x?`<small class="why">${esc(x.x[i])}</small>`:""}</span><span class="review-tag ${u===k?"user correct":"target"}">Vous : ${u??"—"} · Réf. : ${k}</span></div>`}).join("");
  }
  return x.o.map((opt,i)=>{const isUser=ans&&ans.choice===i,isTarget=i===x.a;let cls="review-opt",tag="";
    if(isUser&&isTarget){cls+=" is-user-correct";tag='<span class="review-tag user correct">Votre choix (correct)</span>'}
    else if(isUser){cls+=" is-user-wrong";tag='<span class="review-tag user">Votre choix</span>'}
    else if(isTarget){cls+=" is-target";tag='<span class="review-tag target">Bonne réponse</span>'}
    return`<div class="${cls}"><span>${esc(opt)}${x.x?`<small class="why">${esc(x.x[i])}</small>`:""}</span>${tag}</div>`}).join("");
}
function renderReview(filter="all"){
  const s=state.session;if(!s)return;
  const items=s.questions.map((x,i)=>{const ans=s.answers[i];return{x,i,ans,isGood:Boolean(ans&&ans.good),isSkip:!ans||ans.choice===null}});
  const okCount=items.filter(t=>t.isGood).length;
  $('#review-filters').innerHTML=`<button type="button" data-filter="all" aria-pressed="${filter==='all'}">Toutes (${items.length})</button><button type="button" data-filter="ko" aria-pressed="${filter==='ko'}">À revoir (${items.length-okCount})</button><button type="button" data-filter="ok" aria-pressed="${filter==='ok'}">Réussies (${okCount})</button>`;
  $('#review-filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(b)renderReview(b.dataset.filter)};
  const filtered=items.filter(t=>filter==='ok'?t.isGood:filter==='ko'?!t.isGood:true);
  if(!filtered.length){$('#review').innerHTML='<p class="lede" style="padding:var(--s4);text-align:center">Aucun élément dans cette catégorie.</p>';return}
  $('#review').innerHTML=filtered.map(t=>{const st=t.isGood?['is-good','ok','Correct']:t.isSkip?['is-skip','skipped','Passée']:['is-bad','ko','À revoir'];
    const pts=t.x.f==="rating"&&t.ans&&t.ans.choice?` · ${Math.round(t.ans.points*100)} %`:"";
    return`<details class="review-item ${st[0]}" ${filter==='ko'?'open':''}><summary class="review-summary"><div class="review-summary-left"><strong>#${t.i+1}</strong><span>${esc(modules[t.x.m].title)}${skillOf(t.x)}</span></div><span class="review-badge ${st[1]}">${st[2]}${pts}</span></summary><div class="review-detail"><h3 class="qprompt">${esc(t.x.p)}</h3>${stimulusHtml(t.x.s)}<div class="review-options">${optionReview(t)}</div><div class="feedback ${t.isGood?'good':'bad'}"><strong>Explication pédagogique</strong><p>${esc(t.x.e)}</p></div></div></details>`}).join('');
}

function start(type,countChoice){
  if(type==='examen')return startExam();
  const count=countChoice!==undefined?countChoice:state.sessionCount;
  const {questions,seconds,guided}=S.buildSession(q,{modules,type,count});
  const title=type==='diagnostic'?'Diagnostic transversal':type==='simulation'?'Simulation A1':`${modules[type].title} · ${questions.length} questions`;
  if(!questions.length)return;
  state.session={type,countChoice:count,questions,title,seconds,guided,index:0,answers:[],locked:false,done:false};
  $('#sessiontitle').textContent=title;$('#sessionkind').textContent=guided?'Entraînement guidé avec retour immédiat':'Simulation chronométrée (correction à la fin)';
  route('session');render();tick();
  state.session.interval=setInterval(()=>{state.session.seconds--;tick();if(state.session.seconds<=0)finish()},1000);
}
function startExam(){
  const {questions,sections}=S.buildExam(q,EXAM);
  if(!questions.length)return;
  state.session={type:'examen',questions,title:'Examen blanc A1 · 2 h',seconds:EXAM.minutesPerSection*60,guided:false,index:0,answers:[],locked:false,done:false,exam:{sections,current:0,waiting:true}};
  $('#sessiontitle').textContent=state.session.title;$('#sessionkind').textContent='Examen blanc : tests successifs chronométrés, correction à la fin';
  route('session');tick();sectionIntro();
}
function sectionIntro(){
  const s=state.session,e=s.exam,sec=e.sections[e.current],n=sec.to-sec.from+1;
  e.waiting=true;s.seconds=EXAM.minutesPerSection*60;tick();
  $('#position').textContent=`Test ${e.current+1} / ${e.sections.length}`;
  $('#sessionbar').style.setProperty('--value',`${(sec.from/s.questions.length)*100}%`);
  $('#question').innerHTML=`<p class="eyebrow">Test ${e.current+1} sur ${e.sections.length}</p><h2 class="qprompt">${esc(modules[sec.cat].title)}</h2><p class="lede">${n} questions · ${EXAM.minutesPerSection} minutes. Le chronomètre démarre quand vous commencez ; à la fin du temps, le test suivant s'ouvre et les questions non traitées comptent comme non répondues.</p><p class="lede">Le jour de l'épreuve, lisez les consignes et résolvez les exemples proposés au début de chaque test.</p>${sec.cat==="numeric"?'<p class="lede">Une calculatrice est disponible à l\'écran, comme la calculatrice de l\'ordinateur autorisée le jour de l\'épreuve (appareils personnels interdits).</p>':''}<div class="actions"><button class="btn" id="startsection">Commencer le test</button></div>`;
  $('#startsection').onclick=()=>{e.waiting=false;s.index=sec.from;render();s.interval=setInterval(()=>{s.seconds--;tick();if(s.seconds<=0)endSection()},1000)};
}
function endSection(){
  const s=state.session;if(!s||!s.exam||s.done)return;
  clearInterval(s.interval);
  const e=s.exam,sec=e.sections[e.current];
  for(let i=sec.from;i<=sec.to;i++)if(!s.answers[i])s.answers[i]={choice:null,good:false,points:0};
  e.current++;
  if(e.current>=e.sections.length)return finish();
  s.index=e.sections[e.current].from;sectionIntro();
}
function tick(){const x=Math.max(0,state.session.seconds);$('#timer').textContent=`${String(Math.floor(x/60)).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`;$('#timer').classList.toggle('low',x<60)}
function render(){
  const s=state.session,x=s.questions[s.index];s.locked=false;
  const sec=s.exam?s.exam.sections[s.exam.current]:null;
  $('#position').textContent=sec?`Test ${s.exam.current+1}/${s.exam.sections.length} · ${s.index-sec.from+1} / ${sec.to-sec.from+1}`:`${s.index+1} / ${s.questions.length}`;
  $('#sessionbar').style.setProperty('--value',`${(s.index/s.questions.length)*100}%`);
  let body;
  if(x.f==="rating"){
    body=`<p class="rating-help">Notez chaque réaction de 1 (très inapproprié) à 4 (très approprié).</p><div class="ratings">${x.o.map((z,i)=>`<fieldset class="rating-row" data-row="${i}"><legend>${esc(z)}</legend><div class="scale">${ratingLabels.map((l,v)=>`<label title="${l}"><input type="radio" name="r${i}" value="${v+1}"><span>${v+1}</span><small>${l}</small></label>`).join("")}</div><div class="rowfeedback"></div></fieldset>`).join("")}</div>`;
  }else{
    body=`<fieldset class="options${x.m==="abstract"?" figs":""}"><legend class="sr">Options de réponse</legend>${x.o.map((z,i)=>`<label class="option"><input type="radio" name="answer" value="${i}"><span>${esc(z)}</span></label>`).join('')}</fieldset>`;
  }
  $('#question').innerHTML=`<p class="eyebrow">${esc(modules[x.m].title)}${skillOf(x)}</p><h2 class="qprompt">${esc(x.p)}</h2>${stimulusHtml(x.s)}${body}<div id="feedback" role="status" aria-live="polite"></div><div class="actions"><button class="btn" id="validate">${s.guided?'Valider':'Réponse suivante'}</button><button class="btn ghost" id="pass">Passer</button>${sec?'<button class="btn secondary" id="endsection">Terminer ce test</button>':''}</div>${x.m==="numeric"&&globalThis.EagCalc?EagCalc.html():""}`;
  if(x.m==="numeric"&&globalThis.EagCalc)EagCalc.mount($('#question'));
  $('#validate').onclick=submit;$('#pass').onclick=()=>record(null);
  if(sec)$('#endsection').onclick=()=>{if(confirm('Terminer ce test ? Les questions non traitées compteront comme non répondues.'))endSection()};
}
function submit(){
  const x=state.session.questions[state.session.index];
  if(x.f==="rating"){
    const vals=x.o.map((_,i)=>{const c=$(`input[name=r${i}]:checked`);return c?Number(c.value):null});
    if(vals.includes(null)){$('#feedback').innerHTML='<div class="feedback bad"><strong>Notation incomplète</strong>Notez chacune des réactions, ou passez la question.</div>';return}
    return record(vals);
  }
  const c=$('input[name=answer]:checked');
  if(!c){$('#feedback').innerHTML='<div class="feedback bad"><strong>Sélection requise</strong>Choisissez une option ou passez.</div>';return}
  record(Number(c.value));
}
function record(choice){
  const s=state.session;if(s.locked)return;s.locked=true;
  const x=s.questions[s.index];
  const {points,good}=S.scoreAnswer(x,choice);
  s.answers[s.index]={choice,good,points};
  if(choice!==null){state.answered++;state.points+=points}
  if(!s.guided||choice===null)return next();
  if(x.f==="rating"){
    $$('.rating-row').forEach((row,i)=>{row.querySelectorAll('input').forEach(inp=>inp.disabled=true);const u=choice[i],k=x.r[i];row.classList.add(u===k?'correct':Math.abs(u-k)===1?'near':'wrong');row.querySelector('.rowfeedback').textContent=`Votre note : ${u} · note de référence : ${k}${x.x?` — ${x.x[i]}`:""}`});
    $('#feedback').innerHTML=`<div class="feedback ${good?'good':'bad'}"><strong>${Math.round(points*100)} % de concordance</strong>${esc(x.e)}</div>`;
  }else{
    $$('.option').forEach((el,i)=>{if(i===x.a)el.classList.add('correct');if(i===choice&&choice!==x.a)el.classList.add('wrong');el.querySelector('input').disabled=true});
    $('#feedback').innerHTML=`<div class="feedback ${good?'good':'bad'}"><strong>${good?'Bonne réponse':'À revoir'}</strong>${esc(x.e)}${x.x&&choice!==x.a?`<p class="why">Votre choix : ${esc(x.x[choice])}</p>`:""}</div>`;
  }
  $('#validate').textContent=s.index===s.questions.length-1?'Voir le bilan':'Question suivante';$('#validate').onclick=next;$('#pass').disabled=true;
}
function next(){const s=state.session;if(s.exam&&s.index>=s.exam.sections[s.exam.current].to)return endSection();if(s.index<s.questions.length-1){s.index++;render()}else finish()}
function finish(){
  const s=state.session;if(!s||s.done)return;s.done=true;clearInterval(s.interval);
  const sum=S.summarize(s.questions,s.answers,s.exam?s.exam.sections:null),{total,good,pct}=sum;
  $('#ring').style.setProperty('--score',`${pct}%`);$('#score').textContent=`${pct}%`;
  $('#message').textContent=pct>=80?'Très bonne maîtrise':pct>=60?'Base solide à consolider':'Analysez vos erreurs';
  $('#detail').textContent=`${good} question(s) réussie(s) sur ${total}. Les questions de jugement situationnel comptent selon la concordance de vos notes. Ce pourcentage n’est pas une note Stanine.`;
  if(s.exam){
    const rows=sum.sections,avg=sum.avg;
    $('#ring').style.setProperty('--score',`${avg}%`);$('#score').textContent=`${avg}%`;
    $('#message').textContent=avg>=80?'Très bonne maîtrise':avg>=60?'Base solide à consolider':'Analysez vos erreurs';
    $('#detail').innerHTML=`Moyenne des ${rows.length} tests (chacun compte autant, comme dans la notation officielle) : <strong>${avg} %</strong>. Ce n'est pas une note Stanine.<span class="sectionscores">${rows.map(r=>`<span class="row"><span>${esc(modules[r.cat].title)}</span><span>${r.pct} % · ${r.done}/${r.n} traitées</span></span>`).join('')}</span>`;
  }
  renderReview('all');$('#retry').onclick=()=>start(s.type,s.countChoice);route('results');
}
function dashboard(){const pct=state.answered?Math.round(state.points/state.answered*100):null;$('#accuracy').textContent=pct===null?'—':`${pct}%`;$('#homebar').style.setProperty('--value',`${pct||0}%`);$('#summary').textContent=state.answered?`${state.answered} question(s) répondue(s), questions passées non comptées.`:'Commencez un module pour établir votre diagnostic.'}
function theme(){document.documentElement.dataset.theme=state.dark?'dark':'light';$('#theme').innerHTML=state.dark?sun:moon;$('#theme').setAttribute('aria-label',`Passer au mode ${state.dark?'clair':'sombre'}`)}
function renderModules(){
  const cnt=state.sessionCount;
  $('#modules').innerHTML=Object.entries(modules).map(([k,m])=>{
    const total=(q[k]||[]).length;
    const drawText=cnt==='all'||Number(cnt)>=total?`${total} questions`:`${cnt} sur ${total} (tirage aléatoire)`;
    return `<button class="module" data-module="${k}"><span class="code">${m.code}</span><span class="count">${drawText}</span><h3>${esc(m.title)}</h3><p>${esc(m.desc)}</p></button>`;
  }).join('');
}
function init(){
  renderModules();
  $('#modules').onclick=e=>{const b=e.target.closest('[data-module]');if(b)start(b.dataset.module)};
  const picker=$('#session-picker');
  if(picker){
    picker.onclick=e=>{
      const chip=e.target.closest('.chip');
      if(!chip)return;
      state.sessionCount=chip.dataset.size==='all'?'all':Number(chip.dataset.size);
      $$('#session-picker .chip').forEach(c=>c.setAttribute('aria-pressed',c===chip?'true':'false'));
      renderModules();
    };
  }
  $$('[data-route]').forEach(b=>b.onclick=e=>{e.preventDefault();route(b.dataset.route)});
  $$('[data-start]').forEach(b=>b.onclick=()=>start(b.dataset.start));
  state.dark=matchMedia('(prefers-color-scheme:dark)').matches;theme();$('#theme').onclick=()=>{state.dark=!state.dark;theme()};
  const first=location.hash.slice(1);route(['entrainement','simulation','ressources','methode'].includes(first)?first:'accueil');
}
init();
