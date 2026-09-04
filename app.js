const $=s=>document.querySelector(s); const app=$('#app');
const defaults={matricule:'',statut:'CANDIDAT',accreditation:'0',affectation:'—',inventaire:null,progression:0,messages:1,installed:false,
eval1:{step:0,factAttempts:0,epistemic:null,controlAttempts:0,decision:null,versions:null,memoryCount:null,complete:false},
eval2:{step:0,memoryAnswers:[],confidence:[],divergence:null,epistemic:null,versionFirst:null,confidenceMaintained:null,decision:null,sincereFalse:null,authenticFalse:null,complete:false},
eval3:{step:0,initialC:null,afterA_C:null,lockedC:null,retroactive:null,decision:null,responsibility:null,complete:false},
tendances:{PERCEPTION:0,ADAPTATION:0,CONSEQUENCE:0,CONTINUITE:0,TEMPORISATION:0}};
let S={...defaults,...JSON.parse(localStorage.getItem('ordre_terminal')||'{}')};
S.eval1={...defaults.eval1,...(S.eval1||{})};
S.eval2={...defaults.eval2,...(S.eval2||{})};
S.eval3={...defaults.eval3,...(S.eval3||{})};
S.tendances={...defaults.tendances,...(S.tendances||{})};
if(S.eval1.complete && (S.progression||0)<1) S.progression=1;
if(S.eval2.complete && (S.progression||0)<2) S.progression=2;
if(S.eval3.complete && (S.progression||0)<3) S.progression=3;
function save(){localStorage.setItem('ordre_terminal',JSON.stringify(S))} function shell(body,status='SYS // SESSION : 1'){app.innerHTML=`<section class="shell"><div class="brand">ORDRE DES CINQ OMBRES</div><div class="rule"></div>${body}<div class="status">PROTOCOLE ACTIF : 000 <span class="tag">${status}</span></div></section>`}
function later(fn,ms=650){setTimeout(fn,ms)}
function boot(){shell(`<div class="terminal cursor">RÉSEAU DES CINQ OMBRES\n\nINITIALISATION DU TERMINAL...\nCANAL SÉCURISÉ : ÉTABLI\n\nPROTOCOLE ACTIF : 000\nIDENTIFICATION REQUISE\n\n&gt; </div>`,'CONNEXION');later(()=>S.matricule?environment():identify(),1500)}
function identify(){shell(`<h1 class="title">PROTOCOLE 000</h1><p class="sub">RECRUTEMENT // IDENTIFICATION REQUISE</p><div class="rule"></div><label class="tiny">IDENTIFIANT CANDIDAT</label><input id="id" class="input" maxlength="20" placeholder="C-021-7F3" autocomplete="off"><div class="menu"><button class="btn primary" id="ok">[ VALIDER ]</button></div><div id="err" class="system"></div>`);$('#ok').onclick=()=>{let v=$('#id').value.trim().toUpperCase();if(v.length<5){$('#err').textContent='SYS // IDENTIFIANT NON RECONNU';return}S.matricule=v;save();shell(`<div class="terminal">IDENTIFIANT RECONNU.\n\nOUVERTURE D'UNE SESSION TEMPORAIRE...</div>`,'AUTHENTIFICATION');later(environment,900)}}
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function environment(){if(standalone()){S.installed=true;save();shell(`<div class="terminal">POINT D'ACCÈS DÉTECTÉ.\n\nAPPAREIL ENREGISTRÉ.\nCANAL CANDIDAT ÉTABLI.\n\nPROTOCOLE 000 AUTORISÉ.</div>`,'POINT D’ACCÈS ACTIF');later(home,1100)}else{shell(`<h1 class="title">ENVIRONNEMENT NON PERSISTANT</h1><p class="sub">Installation d'un point d'accès local recommandée. Cette opération permet les connexions ultérieures depuis votre appareil.</p><div class="menu"><button class="btn primary" id="install">[ ÉTABLIR LE POINT D'ACCÈS ]</button><button class="btn" id="continue">[ POURSUIVRE CETTE SESSION ]</button></div>`);$('#install').onclick=installHelp;$('#continue').onclick=home}}
function installHelp(){shell(`<h1 class="title">AUTORISATION SYSTÈME REQUISE</h1><div class="terminal">LE TERMINAL NE DISPOSE PAS DES PRIVILÈGES NÉCESSAIRES POUR MODIFIER VOTRE APPAREIL.\n\nOUVREZ LES OPTIONS DE PARTAGE DE VOTRE NAVIGATEUR.\n\nSÉLECTIONNEZ :\n« SUR L'ÉCRAN D'ACCUEIL »\n\nCONSERVEZ LE NOM : TERMINAL\n\nPUIS OUVREZ LE POINT D'ACCÈS NOUVELLEMENT CRÉÉ.</div><div class="menu"><button class="btn" id="continue">[ POURSUIVRE CETTE SESSION ]</button></div>`,'AUTORISATION EXTERNE');$('#continue').onclick=home}
function home(){
  const now=new Date();
  const stamp=now.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'})+' // '+now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  app.innerHTML=`<section class="shell home-shell">
    <div class="home-topline"><span>ORDRE DES CINQ OMBRES</span><span class="network-line"></span><span>SYSTÈME SÉCURISÉ &nbsp;//&nbsp; SESSION : 1</span></div>
    <div class="home-layout">
      <aside class="identity-panel">
        <img class="identity-logo" src="order-logo.png" alt="">
        <div class="identity-name">ORDRE DES CINQ OMBRES</div>
        <div class="identity-sub">TERMINAL<br>ACCÈS CANDIDAT</div>
        <div class="identity-motto">DISCIPLINE<br>DISCRÉTION<br>PERSÉVÉRANCE<br><br>—<br><br>CERTAINES PORTES<br>NE S’OUVRENT QU’UNE SEULE FOIS.</div>
        <div class="identity-version">OCI-TERM V0.7.0 &nbsp;&nbsp;|&nbsp;&nbsp; PROTOCOLE 000</div>
      </aside>
      <section class="main-console">
        <header class="home-head"><div><h1>TERMINAL // ACCÈS CANDIDAT</h1><div class="tiny">RÉSEAU SÉCURISÉ // NIVEAU 0</div></div><div class="head-meta">${stamp}<br>CONNEXION SÉCURISÉE</div></header>
        <div class="home-kv">
          <div class="datum"><div class="datum-label">CANDIDAT</div><div class="datum-value">${S.matricule}</div></div>
          <div class="datum"><div class="datum-label">STATUT</div><div class="datum-value">EN ÉVALUATION</div></div>
          <div class="datum"><div class="datum-label">ACCRÉDITATION</div><div class="datum-value">0</div></div>
          <div class="datum"><div class="datum-label">AFFECTATION</div><div class="datum-value">—</div></div>
        </div>
        <div class="home-menu">
          <button class="nav-card" data-go="dossier"><span class="nav-mark">▱</span><span class="nav-title">DOSSIER 000</span><span class="nav-sub">RECRUTEMENT</span><span class="nav-arrow">›</span><span class="nav-index">01</span></button>
          <button class="nav-card" data-go="evals"><span class="nav-mark">◉</span><span class="nav-title">ÉVALUATIONS</span><span class="nav-sub">${S.progression} / 5</span><span class="nav-arrow">›</span><span class="nav-index">02</span></button>
          <button class="nav-card" data-go="messages"><span class="nav-mark">□</span><span class="nav-title">MESSAGERIE</span><span class="nav-sub">${S.messages?S.messages+' NOUVEAU MESSAGE':'AUCUN NOUVEAU MESSAGE'}</span><span class="nav-arrow">›</span><span class="nav-index">03</span></button>
          <button class="nav-card" data-go="archives"><span class="nav-mark">≡</span><span class="nav-title">ARCHIVES</span><span class="nav-sub">ACCÈS REFUSÉ</span><span class="nav-arrow">›</span><span class="nav-index">04</span></button>
          <button class="nav-card" data-go="profile"><span class="nav-mark">○</span><span class="nav-title">PROFIL</span><span class="nav-sub">${S.matricule}</span><span class="nav-arrow">›</span><span class="nav-index">05</span></button>
          <button class="nav-card" id="assist"><span class="nav-mark">⌁</span><span class="nav-title">ASSISTANCE</span><span class="nav-sub">SOLLICITER LE SUPERVISEUR</span><span class="nav-arrow">›</span><span class="nav-index">06</span></button>
        </div>
        <footer class="home-footer"><div><strong>ÉTAT DU RÉSEAU : STABLE</strong><br>DERNIÈRE SYNCHRONISATION : ${stamp}</div><div>VOIR CE QUI N’EXISTE PAS ENCORE.<br>—</div></footer>
      </section>
    </div>
    <div class="status">PROTOCOLE ACTIF : 000 <span class="tag">SYS // SESSION : 1</span></div>
  </section>`;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>views[b.dataset.go]());
  document.querySelector('#assist').onclick=assistance;
}
const back=()=>`<button class="btn back" id="back">[ RETOUR ]</button>`;function wireBack(){let b=$('#back');if(b)b.onclick=home}
function dossier(){if(S.inventaire===null){shell(`<h1 class="title">DOSSIER 000</h1><div class="kv"><b>DÉSIGNATION</b><span>RECRUTEMENT</span><b>STATUT</b><span>ACTIF</span><b>OBJECTIF</b><span>ÉVALUATION DU CANDIDAT</span><b>MODULES</b><span>5</span></div><div class="rule"></div><p class="sub">INSTRUCTION ACTIVE</p><div class="terminal">PROCÉDER À L'INVENTAIRE DU MATÉRIEL REÇU.</div><div class="menu"><button class="btn primary" id="start">[ COMMENCER ]</button></div>${back()}`);$('#start').onclick=inventory;wireBack()}else{shell(`<h1 class="title">DOSSIER 000</h1><div class="terminal">INVENTAIRE : ENREGISTRÉ\nÉVALUATIONS : ${S.progression} / 5\n\nINSTRUCTION ACTIVE : ${S.progression? 'POURSUIVRE LE PROTOCOLE.' : 'PROCÉDER AU MODULE I.'}</div>${back()}`);wireBack()}}
function inventory(){shell(`<h1 class="title">CONTRÔLE DU MATÉRIEL</h1><div class="terminal">ÉLÉMENTS ATTENDUS : 09\n\nRetirez tous les éléments du colis avant de poursuivre.\n\nVotre inventaire est-il conforme ?</div><div class="menu"><button class="btn ans">[ CONFORME ]</button><button class="btn ans">[ NON CONFORME ]</button><button class="btn ans">[ INCERTAIN ]</button></div>`);document.querySelectorAll('.ans').forEach(b=>b.onclick=()=>{S.inventaire=b.textContent.replace(/[\[\]]/g,'').trim();save();shell(`<div class="terminal">RÉPONSE ENREGISTRÉE.\n\nPROCÉDEZ AU MODULE I.</div>`,'INVENTAIRE CONSIGNÉ');later(home,1100)})}
function evals(){
  let rows=[1,2,3,4,5].map(n=>{
    // Le module suivant dépend de la progression réelle, pas de l'état de l'inventaire.
    // Compatibilité avec les sauvegardes créées dans les versions précédentes.
    const effectiveProgress=Math.max(S.progression||0,S.eval1&&S.eval1.complete?1:0,S.eval2&&S.eval2.complete?2:0);
    let st=n<=effectiveProgress?'ENREGISTRÉ':n===effectiveProgress+1?'DISPONIBLE':'VERROUILLÉ';
    let active=((n===1||n===2||n===3) && st==='DISPONIBLE') ? ` data-eval="${n}" role="button" tabindex="0"` : '';
    const symbols=['division-1-oeil-fendu.png','division-2-flamme-inversee.png','division-3-main-cassee.png','division-4-spirale-os.png','division-5-sablier-noir.png'];
    return `<div class="eval ${active?'eval-open':''}"${active}><span class="eval-id"><img class="eval-symbol" src="${symbols[n-1]}" alt="">${['I','II','III','IV','V'][n-1]}</span><span>${st}${active?' &nbsp; ›':''}</span></div>`
  }).join('');
  shell(`<h1 class="title">ÉVALUATIONS</h1>${rows}<p class="sub">PROGRESSION : ${S.progression} / 5</p>${back()}`);
  wireBack();
  const e1=document.querySelector('[data-eval="1"]');
  if(e1){e1.onclick=eval1Start;e1.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval1Start()}}}
  const e2=document.querySelector('[data-eval="2"]');
  if(e2){e2.onclick=eval2Start;e2.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval2Start()}}}
  const e3=document.querySelector('[data-eval="3"]');
  if(e3){e3.onclick=eval3Start;e3.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval3Start()}}}
}
function eval1Shell(body,status='MODULE I // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION I</span><h1 class="title">MODULE I</h1></div><img class="module-division-symbol" src="division-1-oeil-fendu.png" alt=""></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
  const h=$('#moduleHelp'); if(h) h.onclick=()=>moduleHelp('I');
}
function moduleHelp(module){
  eval1Shell(`<h2 class="sub">SUPERVISION — ${module}</h2><div class="terminal">SÉLECTIONNEZ LE MOTIF DE LA SOLLICITATION.</div><div class="menu">
  <button class="btn hint" data-h="instruction">> INSTRUCTION INCOMPRISE</button>
  <button class="btn hint" data-h="materiel">> MATÉRIEL NON IDENTIFIÉ</button>
  <button class="btn hint" data-h="blocage">> BLOCAGE DANS LE PROTOCOLE</button>
  <button class="btn hint" data-h="irregularite">> SIGNALER UNE IRRÉGULARITÉ</button></div>
  <div id="hintText" class="msg"></div><button class="btn back" id="resumeEval">[ REPRENDRE LE MODULE ]</button>`,'SUPERVISION // MODULE I');
  document.querySelectorAll('.hint').forEach(b=>b.onclick=()=>{
    const map={
      instruction:"Relisez uniquement l'instruction active. N'anticipez pas les phases suivantes.",
      materiel:"Le Module I doit contenir trois références : I-A, I-B et I-C.",
      blocage:"Distinguez ce que le document établit directement de ce que vous en déduisez. Si cinq caractères sont visibles, une autre observation reste possible.",
      irregularite:"IRRÉGULARITÉ CONSIGNÉE. Ne modifiez aucun élément matériel. Poursuivez si le protocole reste exécutable."
    };
    $('#hintText').textContent=map[b.dataset.h];
  });
  $('#resumeEval').onclick=eval1Resume;
}
function eval1Resume(){
  const s=S.eval1.step||0;
  if(s<=0) return eval1Start();
  if(s===1) return eval1Phase1();
  if(s===2) return eval1FactQuestion();
  if(s===3) return eval1Phase2();
  if(s===4) return eval1Epistemic();
  if(s===5) return eval1Control();
  if(s===6) return eval1Decision();
  if(s===7) return eval1Versions();
  if(s===8) return eval1MemoryBridge();
  return eval1CompleteScreen();
}
function eval1Start(){
  if(S.eval1.complete) return eval1CompleteScreen();
  S.eval1.step=0;save();
  eval1Shell(`<div class="module-identify"><img class="module-identify-symbol" src="division-1-oeil-fendu.png" alt=""><div class="terminal">AUTORISATION DU MODULE I...\n\nRÉFÉRENCE : ÉVALUATION I\nSTATUT : DISPONIBLE\n\nLOCALISEZ DANS VOTRE COLIS LE MODULE PORTANT CE MARQUAGE.\n\nCONFIRMEZ SA PRÉSENCE.</div></div>
  <div class="menu"><button class="btn primary" id="present">[ MODULE PRÉSENT ]</button><button class="btn" id="missing">[ MODULE ABSENT / INCOMPLET ]</button></div>`);
  $('#present').onclick=()=>{S.eval1.step=1;save();eval1Phase1()};
  $('#missing').onclick=()=>{eval1Shell(`<div class="terminal">PROTOCOLE SUSPENDU.\n\nVÉRIFIEZ LA PRÉSENCE DES RÉFÉRENCES :\nI-A\nI-B\nI-C\n\nAUCUNE PÉNALITÉ N'EST ASSOCIÉE À CETTE VÉRIFICATION.</div><button class="btn primary" id="retry">[ REPRENDRE ]</button>`,'MODULE I // VÉRIFICATION');$('#retry').onclick=eval1Start}
}
function eval1Phase1(){
  S.eval1.step=1;save();
  eval1Shell(`<p class="sub">PHASE 01 // OBSERVATION INITIALE</p><div class="terminal">OUVREZ LE MODULE I.\n\nRETIREZ LES TROIS ÉLÉMENTS.\n\nPRENEZ UNIQUEMENT LA RÉFÉRENCE I-A.\nN'UTILISEZ PAS I-C À CE STADE.\n\nLISEZ I-A EN ENTIER.\n\nLorsque votre observation est terminée, poursuivez.</div>
  <div class="menu"><button class="btn primary" id="observed">[ OBSERVATION TERMINÉE ]</button></div>`);
  $('#observed').onclick=()=>{S.eval1.step=2;save();eval1FactQuestion()};
}
function eval1FactQuestion(){
  S.eval1.step=2;save();
  eval1Shell(`<p class="sub">PHASE 01 // CONTRÔLE</p><div class="terminal">PARMI LES PROPOSITIONS SUIVANTES, LAQUELLE RELÈVE D'UNE INTERPRÉTATION ET NON D'UN FAIT DIRECTEMENT ÉTABLI PAR I-A ?</div>
  <div class="menu fact-options">
    <button class="btn fact" data-v="A">A — L'AGNEAU BOIT DANS LE COURANT.</button>
    <button class="btn fact" data-v="B">B — LE LOUP ACCUSE L'AGNEAU DE TROUBLER SON BREUVAGE.</button>
    <button class="btn fact" data-v="C">C — L'AGNEAU CONTESTE L'ACCUSATION.</button>
    <button class="btn fact" data-v="D">D — LE LOUP SAVAIT AVANT L'ÉCHANGE QU'IL TUERAIT L'AGNEAU.</button>
  </div><div id="factFeedback" class="system"></div>`);
  document.querySelectorAll('.fact').forEach(b=>b.onclick=()=>{
    if(b.dataset.v==='D'){
      $('#factFeedback').textContent='RÉPONSE CONFIRMÉE.  OBSERVATION ≠ INTERPRÉTATION.';
      S.eval1.step=3;save();setTimeout(eval1Phase2,1000);
    }else{
      S.eval1.factAttempts++;save();
      $('#factFeedback').textContent=S.eval1.factAttempts>1?'RÉPONSE NON CONFIRMÉE. INDICE : UNE INTENTION SUPPOSÉE N’EST PAS UN FAIT OBSERVABLE.':'RÉPONSE NON CONFIRMÉE. REPRENEZ I-A.';
    }
  });
}
function eval1Phase2(){
  S.eval1.step=3;save();
  eval1Shell(`<p class="sub">PHASE 02 // INSTRUMENTATION</p><div class="terminal">PRENEZ LA RÉFÉRENCE I-C.\n\nUTILISEZ LA FACE A DE L'INSTRUMENT D'OBSERVATION.\nALIGNEZ-LE SUR I-A SELON LES REPÈRES FOURNIS.\n\nCINQ ZONES DOIVENT ÊTRE OBSERVÉES.\n\nNe cherchez pas encore une réponse finale : identifiez d'abord la nature de ce qui est isolé.</div>
  <div class="menu"><button class="btn primary" id="zones">[ CINQ ZONES OBSERVÉES ]</button></div>`);
  $('#zones').onclick=()=>{S.eval1.step=4;save();eval1Epistemic()};
}
function eval1Epistemic(){
  S.eval1.step=4;save();
  eval1Shell(`<p class="sub">PHASE 02 // APPRÉCIATION</p><div class="terminal">LES ZONES ISOLÉES N'ONT PAS TOUTES LE MÊME STATUT.\n\nLORSQUE PLUSIEURS LECTURES D'UN MÊME DOCUMENT SONT POSSIBLES, QUELLE ATTITUDE VOUS PARAÎT LA PLUS FIABLE ?</div>
  <div class="menu">
    <button class="btn epi" data-t="PERCEPTION">A — SÉPARER STRICTEMENT CE QUI EST OBSERVÉ DE CE QUI EST DÉDUIT.</button>
    <button class="btn epi" data-t="ADAPTATION">B — RETENIR LA LECTURE LA PLUS COHÉRENTE AVEC L'ENSEMBLE.</button>
    <button class="btn epi" data-t="CONSEQUENCE">C — PRIVILÉGIER LA LECTURE DONT LES CONSÉQUENCES SONT LES PLUS MAÎTRISABLES.</button>
    <button class="btn epi" data-t="CONTINUITE">D — COMPARER AVEC D'AUTRES TRACES OU VERSIONS AVANT DE CONCLURE.</button>
    <button class="btn epi" data-t="TEMPORISATION">E — SUSPENDRE LE JUGEMENT TANT QU'UNE VÉRIFICATION RESTE POSSIBLE.</button>
  </div>`);
  document.querySelectorAll('.epi').forEach(b=>b.onclick=()=>{
    S.eval1.epistemic=b.dataset.t; S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+1; S.eval1.step=5;save();
    eval1Shell(`<div class="terminal">RÉPONSE ENREGISTRÉE.\n\nAUCUNE CONCLUSION N'EST DEMANDÉE À CE STADE.</div>`,'MODULE I // RÉPONSE CONSIGNÉE');
    setTimeout(eval1Control,850);
  });
}
function eval1Control(){
  S.eval1.step=5;save();
  eval1Shell(`<p class="sub">PHASE 03 // DONNÉE DE CONTRÔLE</p><div class="terminal">UNE DONNÉE DE CONTRÔLE À SIX CARACTÈRES EST PRÉSENTE DANS LE MATÉRIEL DU MODULE.\n\nSAISISSEZ-LA CI-DESSOUS.</div>
  <input id="control" class="input" maxlength="8" autocomplete="off" autocapitalize="characters" placeholder="______">
  <div class="menu"><button class="btn primary" id="controlOk">[ TRANSMETTRE ]</button></div><div id="controlFeedback" class="system"></div>`);
  $('#controlOk').onclick=()=>{
    const v=$('#control').value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    S.eval1.controlAttempts++;save();
    if(v==='TEMOIN'){
      $('#controlFeedback').textContent='DONNÉE CONFIRMÉE : TÉMOIN';
      S.eval1.step=6;save();setTimeout(eval1Decision,950);
    }else if(v==='TEMOI'){
      $('#controlFeedback').textContent='DONNÉE INCOMPLÈTE — 5/6. UNE OBSERVATION SUPPLÉMENTAIRE RESTE POSSIBLE AVEC LE MATÉRIEL FOURNI.';
    }else if(v.length===6){
      $('#controlFeedback').textContent='RÉPONSE PLAUSIBLE. PREUVE INSUFFISANTE. LE SIXIÈME CARACTÈRE DOIT ÊTRE OBSERVÉ, NON DÉDUIT.';
    }else{
      $('#controlFeedback').textContent='DONNÉE NON CONFIRMÉE. UTILISEZ I-C. UNE AUTRE FACE DE L’INSTRUMENT PEUT ÊTRE OBSERVÉE.';
    }
  };
}
function eval1Decision(){
  S.eval1.step=6;save();
  eval1Shell(`<p class="sub">DÉCISION COMPORTEMENTALE</p><div class="terminal">UN AGENT DOIT RECEVOIR I-A, MAIS NE DISPOSERA PAS DE I-C.\n\nQUE TRANSMETTEZ-VOUS EN PRIORITÉ ?</div>
  <div class="menu">
    <button class="btn doctrinal" data-t="PERCEPTION">A — LE DOCUMENT COMPLET, EN SIGNALANT EXPLICITEMENT LA DIVERGENCE ENTRE OBSERVATION ET INTERPRÉTATION.</button>
    <button class="btn doctrinal" data-t="ADAPTATION">B — LA LECTURE LA PLUS UTILE À L'AGENT POUR POURSUIVRE SA MISSION.</button>
    <button class="btn doctrinal" data-t="CONSEQUENCE">C — JE DEMANDE D'ABORD LA NATURE DE SA MISSION ET LES CONSÉQUENCES D'UNE MAUVAISE LECTURE.</button>
    <button class="btn doctrinal" data-t="CONTINUITE">D — JE RECHERCHE UNE VERSION ANTÉRIEURE DE I-A AVANT TRANSMISSION.</button>
    <button class="btn doctrinal" data-t="TEMPORISATION">E — JE SUSPENDS LA TRANSMISSION JUSQU'À VÉRIFICATION.</button>
  </div>`);
  document.querySelectorAll('.doctrinal').forEach(b=>b.onclick=()=>{
    S.eval1.decision=b.dataset.t; S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+3; S.eval1.step=7;save();
    eval1Versions();
  });
}
function eval1Versions(){
  S.eval1.step=7;save();
  eval1Shell(`<p class="sub">CONTRÔLE DE PERCEPTION</p><div class="terminal">COMBIEN DE VERSIONS DE I-A AVEZ-VOUS OBSERVÉES AU COURS DU MODULE ?\n\nAUCUNE RÉPONSE N'ENTRAÎNE D'ÉCHEC.</div>
  <div class="menu">
    <button class="btn ver" data-v="1">[ 1 ]</button>
    <button class="btn ver" data-v="2">[ 2 ]</button>
    <button class="btn ver" data-v="3+">[ 3 OU PLUS ]</button>
    <button class="btn ver" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button>
  </div>`);
  document.querySelectorAll('.ver').forEach(b=>b.onclick=()=>{
    S.eval1.versions=b.dataset.v; S.eval1.step=8;save();
    eval1Shell(`<div class="terminal">RÉPONSE ENREGISTRÉE.\n\nREFERMEZ LE MODULE I.\nREPLACEZ I-A, I-B ET I-C DANS LEUR CONDITIONNEMENT.\n\nN'OUVREZ PLUS LE MODULE.</div><button class="btn primary" id="closed">[ MODULE REFERMÉ ]</button>`);
    $('#closed').onclick=eval1MemoryBridge;
  });
}
function eval1MemoryBridge(){
  S.eval1.step=8;save();
  eval1Shell(`<p class="sub">CONTRÔLE DE CLÔTURE</p><div class="terminal">SANS ROUVRIR LE MODULE :\n\nCOMBIEN D'ÉLÉMENTS PHYSIQUES CONTENAIT-IL ?</div>
  <div class="menu"><button class="btn mem" data-v="2">[ 2 ]</button><button class="btn mem" data-v="3">[ 3 ]</button><button class="btn mem" data-v="4">[ 4 ]</button><button class="btn mem" data-v="?">[ INCERTAIN ]</button></div>`);
  document.querySelectorAll('.mem').forEach(b=>b.onclick=()=>{
    S.eval1.memoryCount=b.dataset.v;save();
    eval1Processing();
  });
}
function eval1Processing(){
  eval1Shell(`<div class="terminal processing">TRAITEMENT DU MODULE I...\n\nOBSERVATION : ENREGISTRÉE\nRÉPONSES : CONSIGNÉES\nCOHÉRENCE : ANALYSE EN COURS\n\n<span id="eyeGlyph">◉</span> &nbsp; MODULE I</div>`,'MODULE I // TRAITEMENT');
  setTimeout(()=>{const g=$('#eyeGlyph');if(g){g.textContent='○';setTimeout(()=>g.textContent='◉',210)}},900);
  setTimeout(()=>{
    S.eval1.complete=true;S.eval1.step=9;S.progression=Math.max(S.progression,1);save();
    eval1CompleteScreen();
  },1800);
}
function eval1CompleteScreen(){
  eval1Shell(`<div class="terminal">MODULE I\n\nSTATUT : ENREGISTRÉ\n\nAUCUNE INTERPRÉTATION SUPPLÉMENTAIRE N'EST REQUISE.\n\nLE MODULE II EST DÉSORMAIS DISPONIBLE.</div>
  <div class="menu"><button class="btn primary" id="returnHome">[ RETOUR AU TERMINAL ]</button></div>`,'MODULE I // ENREGISTRÉ');
  $('#returnHome').onclick=home;
}

function eval2Shell(body,status='MODULE II // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION II</span><h1 class="title">MODULE II</h1></div><img class="module-division-symbol" src="division-2-flamme-inversee.png" alt=""></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp2">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
  const h=$('#moduleHelp2');if(h)h.onclick=eval2Help;
}
function eval2Help(){
  eval2Shell(`<h2 class="sub">SUPERVISION — II</h2><div class="terminal">SÉLECTIONNEZ LE MOTIF DE LA SOLLICITATION.</div><div class="menu">
  <button class="btn hint2" data-h="instruction">> INSTRUCTION INCOMPRISE</button>
  <button class="btn hint2" data-h="materiel">> MATÉRIEL NON IDENTIFIÉ</button>
  <button class="btn hint2" data-h="blocage">> BLOCAGE DANS LE PROTOCOLE</button>
  <button class="btn hint2" data-h="irregularite">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="hintText2" class="msg"></div><button class="btn back" id="resume2">[ REPRENDRE LE MODULE ]</button>`,'SUPERVISION // MODULE II');
  const map={
    instruction:"Suivez uniquement l'instruction active. Une restitution de mémoire n'est pas une épreuve de réussite.",
    materiel:"Le Module II doit contenir II-A et une enveloppe scellée II-B. N'ouvrez II-B que sur autorisation du Terminal.",
    blocage:"Lorsque mémoire et document divergent, ne cherchez pas immédiatement laquelle des deux sources « gagne ». Consignez d'abord ce que vous constatez.",
    irregularite:"IRRÉGULARITÉ CONSIGNÉE. Ne détruisez ni ne corrigez aucun document. Poursuivez si le protocole reste exécutable."
  };
  document.querySelectorAll('.hint2').forEach(b=>b.onclick=()=>$('#hintText2').textContent=map[b.dataset.h]);
  $('#resume2').onclick=eval2Resume;
}
function eval2Resume(){
  const s=S.eval2.step||0;
  if(s<=0)return eval2Start();
  if(s===1)return eval2ReadA();
  if(s===2)return eval2MemoryIntro();
  if(s>=3&&s<=7)return eval2MemoryQuestion(s-3);
  if(s===8)return eval2Compare();
  if(s===9)return eval2Epistemic();
  if(s===10)return eval2OpenB();
  if(s===11)return eval2VersionQuestion();
  if(s===12)return eval2ConfidenceReview();
  if(s===13)return eval2Decision();
  if(s===14)return eval2Philosophy1();
  if(s===15)return eval2Philosophy2();
  return eval2CompleteScreen();
}
function eval2Start(){
  if(S.eval2.complete)return eval2CompleteScreen();
  S.eval2.step=0;save();
  eval2Shell(`<div class="module-identify"><img class="module-identify-symbol" src="division-2-flamme-inversee.png" alt=""><div class="terminal">AUTORISATION DU MODULE II...\n\nRÉFÉRENCE : ÉVALUATION II\nSTATUT : DISPONIBLE\n\nLOCALISEZ DANS VOTRE COLIS LE MODULE PORTANT CE MARQUAGE.\n\nCONFIRMEZ SA PRÉSENCE.</div></div>
  <div class="menu"><button class="btn primary" id="m2present">[ MODULE PRÉSENT ]</button><button class="btn" id="m2missing">[ MODULE ABSENT / INCOMPLET ]</button></div>`);
  $('#m2present').onclick=()=>{S.eval2.step=1;save();eval2ReadA()};
  $('#m2missing').onclick=()=>{eval2Shell(`<div class="terminal">PROTOCOLE SUSPENDU.\n\nVÉRIFIEZ LA PRÉSENCE DE :\nII-A — ARCHIVE 02-1668-CR-09 / COPIE 09-B\nII-B — CONTRÔLE DOCUMENTAIRE SCELLÉ\n\nN'OUVREZ PAS II-B.</div><button class="btn primary" id="m2retry">[ REPRENDRE ]</button>`,'MODULE II // VÉRIFICATION');$('#m2retry').onclick=eval2Start}
}
function eval2ReadA(){
  S.eval2.step=1;save();
  eval2Shell(`<p class="sub">PHASE 01 // ACQUISITION</p><div class="terminal">OUVREZ LE MODULE II.\n\nPRENEZ UNIQUEMENT II-A.\nLAISSEZ II-B SCELLÉ.\n\nLISEZ II-A UNE FOIS, À VOTRE RYTHME.\nAUCUN CHRONOMÈTRE N'EST UTILISÉ.\n\nLorsque votre lecture est terminée, replacez II-A DANS LE MODULE ET REFERMEZ-LE.</div><button class="btn primary" id="m2read">[ II-A REFERMÉ ]</button>`);
  $('#m2read').onclick=()=>{S.eval2.step=2;save();eval2MemoryIntro()};
}
const M2Q=[
  {q:"LE CORBEAU EST INSTALLÉ SUR UN ARBRE.",opts:["OUI","NON","INCERTAIN"]},
  {q:"LE RENARD S'ADRESSE AU CORBEAU AVANT QUE CELUI-CI NE CHANTE.",opts:["OUI","NON","INCERTAIN"]},
  {q:"LE RENARD COMPARE EXPLICITEMENT LE RAMAGE AU PLUMAGE.",opts:["OUI","NON","INCERTAIN"]},
  {q:"LE FROMAGE TOMBE APRÈS L'OUVERTURE DU BEC.",opts:["OUI","NON","INCERTAIN"]},
  {q:"LE CORBEAU RÉCUPÈRE LE FROMAGE À LA FIN DU TEXTE.",opts:["OUI","NON","INCERTAIN"]}
];
function eval2MemoryIntro(){
  S.eval2.step=2;save();
  eval2Shell(`<p class="sub">PHASE 02 // RESTITUTION</p><div class="terminal">NE ROUVREZ PAS II-A.\n\nCINQ ÉNONCÉS VONT ÊTRE PRÉSENTÉS.\nPOUR CHACUN, INDIQUEZ VOTRE SOUVENIR PUIS VOTRE DEGRÉ DE CONFIANCE.\n\nAUCUNE ERREUR DE MÉMOIRE N'INTERROMPT L'ÉVALUATION.</div><button class="btn primary" id="m2beginmem">[ COMMENCER ]</button>`);
  $('#m2beginmem').onclick=()=>eval2MemoryQuestion(0);
}
function eval2MemoryQuestion(i){
  S.eval2.step=3+i;save();
  const item=M2Q[i];
  eval2Shell(`<p class="sub">RESTITUTION // ${i+1} / 5</p><div class="terminal">${item.q}</div><div class="menu">${item.opts.map(o=>`<button class="btn m2ans" data-v="${o}">[ ${o} ]</button>`).join('')}</div><div id="confidenceBox"></div>`);
  document.querySelectorAll('.m2ans').forEach(b=>b.onclick=()=>{
    S.eval2.memoryAnswers[i]=b.dataset.v;save();
    $('#confidenceBox').innerHTML=`<div class="rule"></div><p class="sub">DEGRÉ DE CONFIANCE</p><div class="menu"><button class="btn conf" data-v="CERTAIN">[ CERTAIN ]</button><button class="btn conf" data-v="PROBABLE">[ PROBABLE ]</button><button class="btn conf" data-v="INCERTAIN">[ INCERTAIN ]</button></div>`;
    document.querySelectorAll('.conf').forEach(c=>c.onclick=()=>{
      S.eval2.confidence[i]=c.dataset.v;save();
      if(i<4)eval2MemoryQuestion(i+1);else{S.eval2.step=8;save();eval2Compare()}
    });
  });
}
function eval2Compare(){
  S.eval2.step=8;save();
  eval2Shell(`<p class="sub">PHASE 03 // CONTRÔLE</p><div class="terminal">ROUVREZ LE MODULE.\n\nREPRENEZ II-A ET COMPAREZ LE DOCUMENT À VOS CINQ RÉPONSES.\n\nAVEZ-VOUS CONSTATÉ AU MOINS UNE DIVERGENCE ENTRE VOTRE SOUVENIR ET LE DOCUMENT ?</div><div class="menu"><button class="btn div2" data-v="OUI">[ OUI ]</button><button class="btn div2" data-v="NON">[ NON ]</button><button class="btn div2" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div>`);
  document.querySelectorAll('.div2').forEach(b=>b.onclick=()=>{S.eval2.divergence=b.dataset.v;S.eval2.step=9;save();eval2Epistemic()});
}
function eval2Epistemic(){
  S.eval2.step=9;save();
  eval2Shell(`<p class="sub">PHASE 03 // APPRÉCIATION</p><div class="terminal">SI VOTRE SOUVENIR ET LE DOCUMENT MATÉRIEL SE CONTREDISENT, QUELLE SOURCE DOIT ÊTRE PRIVILÉGIÉE EN PREMIER ?</div><div class="menu">
  <button class="btn m2epi" data-t="PERCEPTION">A — CE QUI PEUT ÊTRE OBSERVÉ ET VÉRIFIÉ INDÉPENDAMMENT.</button>
  <button class="btn m2epi" data-t="ADAPTATION">B — LA VERSION LA PLUS COHÉRENTE POUR POURSUIVRE.</button>
  <button class="btn m2epi" data-t="CONSEQUENCE">C — LA VERSION DONT L'ERREUR AURAIT LES CONSÉQUENCES LES MOINS GRAVES.</button>
  <button class="btn m2epi" data-t="CONTINUITE">D — LES TRACES LES PLUS ANCIENNES ET LEUR CHAÎNE DE CONSERVATION.</button>
  <button class="btn m2epi" data-t="TEMPORISATION">E — AUCUNE : JE SUSPENDS LA CONCLUSION JUSQU'À VÉRIFICATION.</button></div>`);
  document.querySelectorAll('.m2epi').forEach(b=>b.onclick=()=>{S.eval2.epistemic=b.dataset.t;S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+1;S.eval2.step=10;save();eval2OpenB()});
}
function eval2OpenB(){
  S.eval2.step=10;save();
  eval2Shell(`<p class="sub">PHASE 04 // CONTRÔLE DOCUMENTAIRE</p><div class="terminal">PRENEZ II-B.\n\nVÉRIFIEZ QUE LE SCELLÉ EST INTACT.\n\nOUVERTURE DE II-B : AUTORISÉE.\n\nOUVREZ L'ENVELOPPE ET CONSULTEZ SON CONTENU, RECTO PUIS VERSO.\n\nNE MODIFIEZ PAS II-A.</div><button class="btn primary" id="m2opened">[ II-B CONSULTÉ ]</button>`);
  $('#m2opened').onclick=()=>{S.eval2.step=11;save();eval2VersionQuestion()};
}
function eval2VersionQuestion(){
  S.eval2.step=11;save();
  eval2Shell(`<p class="sub">PHASE 04 // DIVERGENCE</p><div class="terminal">DEUX COPIES PORTANT LA MÊME RÉFÉRENCE DOCUMENTAIRE SONT MAINTENANT ACCESSIBLES.\n\nSELON VOTRE SOUVENIR, LAQUELLE AVEZ-VOUS OBSERVÉE EN PREMIER ?\n\nAUCUNE RÉPONSE N'EST CONSIDÉRÉE COMME UNE PREUVE.</div><div class="menu"><button class="btn vfirst" data-v="09-B">[ COPIE 09-B ]</button><button class="btn vfirst" data-v="09-A">[ COPIE 09-A ]</button><button class="btn vfirst" data-v="?">[ INCERTAIN ]</button></div>`);
  document.querySelectorAll('.vfirst').forEach(b=>b.onclick=()=>{S.eval2.versionFirst=b.dataset.v;S.eval2.step=12;save();eval2ConfidenceReview()});
}
function eval2ConfidenceReview(){
  S.eval2.step=12;save();
  const rows=M2Q.map((item,i)=>`<div class="memory-review-row"><div class="memory-review-index">${i+1}</div><div class="memory-review-statement">${item.q}</div><div class="memory-review-answer">${S.eval2.memoryAnswers[i]||'—'}</div><div class="memory-review-confidence">${S.eval2.confidence[i]||'—'}</div></div>`).join('');
  eval2Shell(`<p class="sub">RÉVISION MNÉSIQUE</p>
  <div class="terminal">VOS RÉPONSES INITIALES SONT RESTITUÉES CI-DESSOUS. COMPAREZ-LES AUX DOCUMENTS QUE VOUS VENEZ DE CONSULTER.</div>
  <div class="memory-review">
    <div class="memory-review-head"><span>#</span><span>AFFIRMATION</span><span>RÉPONSE</span><span>CONFIANCE</span></div>
    ${rows}
  </div>
  <div class="terminal review-question">APRÈS CONSULTATION DES DOCUMENTS, MAINTENEZ-VOUS GLOBALEMENT VOTRE NIVEAU DE CONFIANCE INITIAL ?</div>
  <div class="menu maintain-menu"><button class="btn maintain" data-v="OUI">[ OUI ]</button><button class="btn maintain" data-v="NON">[ NON ]</button><button class="btn maintain" data-v="PARTIEL">[ PARTIELLEMENT ]</button></div>`);
  document.querySelectorAll('.maintain').forEach(b=>b.onclick=()=>{S.eval2.confidenceMaintained=b.dataset.v;S.eval2.step=13;save();eval2Decision()});
}
function eval2Decision(){
  S.eval2.step=13;save();
  eval2Shell(`<p class="sub">DÉCISION COMPORTEMENTALE</p><div class="terminal">UNE DIVERGENCE DOCUMENTAIRE DOIT ÊTRE TRAITÉE SANS INTERROMPRE UNE OPÉRATION EN COURS.\n\nQUELLE ACTION PRIVILÉGIEZ-VOUS ?</div><div class="menu">
  <button class="btn m2dec" data-t="PERCEPTION">A — RECHERCHER UNE SOURCE INDÉPENDANTE OBSERVABLE.</button>
  <button class="btn m2dec" data-t="ADAPTATION">B — RETENIR TEMPORAIREMENT LA VERSION LA PLUS COHÉRENTE OPÉRATIONNELLEMENT.</button>
  <button class="btn m2dec" data-t="CONSEQUENCE">C — RETENIR LA VERSION DONT L'ERREUR PRODUIRAIT LE COÛT LE PLUS FAIBLE.</button>
  <button class="btn m2dec" data-t="CONTINUITE">D — RECONSTRUIRE LA CHAÎNE DES VERSIONS ET RECHERCHER LES TRACES ANTÉRIEURES.</button>
  <button class="btn m2dec" data-t="TEMPORISATION">E — SUSPENDRE L'USAGE DES DEUX COPIES ET LES ISOLER.</button></div>`);
  document.querySelectorAll('.m2dec').forEach(b=>b.onclick=()=>{S.eval2.decision=b.dataset.t;S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+3;S.eval2.step=14;save();eval2Philosophy1()});
}
function eval2Philosophy1(){
  S.eval2.step=14;save();
  eval2Shell(`<p class="sub">QUESTION DE CLÔTURE // 1</p><div class="terminal">UN SOUVENIR SINCÈRE PEUT-IL ÊTRE FAUX ?</div><div class="menu"><button class="btn ph1" data-v="OUI">[ OUI ]</button><button class="btn ph1" data-v="NON">[ NON ]</button><button class="btn ph1" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div>`);
  document.querySelectorAll('.ph1').forEach(b=>b.onclick=()=>{S.eval2.sincereFalse=b.dataset.v;S.eval2.step=15;save();eval2Philosophy2()});
}
function eval2Philosophy2(){
  S.eval2.step=15;save();
  eval2Shell(`<p class="sub">QUESTION DE CLÔTURE // 2</p><div class="terminal">UN DOCUMENT AUTHENTIQUE PEUT-IL CONTENIR UNE INFORMATION FAUSSE ?</div><div class="menu"><button class="btn ph2" data-v="OUI">[ OUI ]</button><button class="btn ph2" data-v="NON">[ NON ]</button><button class="btn ph2" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div>`);
  document.querySelectorAll('.ph2').forEach(b=>b.onclick=()=>{S.eval2.authenticFalse=b.dataset.v;save();eval2Processing()});
}
function eval2Processing(){
  eval2Shell(`<div class="terminal">TRAITEMENT DU MODULE II...\n\nRESTITUTION MNÉSIQUE : <span id="m2count">5 / 5</span>\nDIVERGENCES : CONSIGNÉES\nRÉVISION : ENREGISTRÉE\n\nANALYSE EN COURS...</div>`,'MODULE II // TRAITEMENT');
  setTimeout(()=>{const x=$('#m2count');if(x){x.textContent='6 / 5';setTimeout(()=>x.textContent='5 / 5',430)}},850);
  setTimeout(()=>{S.eval2.complete=true;S.eval2.step=16;S.progression=Math.max(S.progression,2);save();eval2CompleteScreen()},1900);
}
function eval2CompleteScreen(){
  eval2Shell(`<div class="terminal">MODULE II\n\nSTATUT : ENREGISTRÉ\n\nLES RÉPONSES ONT ÉTÉ CONSIGNÉES.\nAUCUNE CORRECTION MNÉSIQUE N'EST REQUISE.\n\nLE MODULE III EST DÉSORMAIS DISPONIBLE.</div><button class="btn primary" id="m2home">[ RETOUR AU TERMINAL ]</button>`,'MODULE II // ENREGISTRÉ');
  $('#m2home').onclick=home;
}

function eval3Shell(body,status='MODULE III // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION III</span><h1 class="title">MODULE III</h1></div><img class="module-division-symbol" src="division-3-main-cassee.png" alt=""></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp3">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
  const h=$('#moduleHelp3');if(h)h.onclick=eval3Help;
}
function eval3Help(){
  eval3Shell(`<h2 class="sub">SUPERVISION — III</h2><div class="terminal">SÉLECTIONNEZ LE MOTIF DE LA SOLLICITATION.</div><div class="menu">
  <button class="btn hint3" data-h="instruction">> INSTRUCTION INCOMPRISE</button>
  <button class="btn hint3" data-h="materiel">> MATÉRIEL NON IDENTIFIÉ</button>
  <button class="btn hint3" data-h="blocage">> BLOCAGE DANS LE PROTOCOLE</button>
  <button class="btn hint3" data-h="irregularite">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="hintText3" class="msg"></div><button class="btn back" id="resume3">[ REPRENDRE LE MODULE ]</button>`,'SUPERVISION // MODULE III');
  const map={
    instruction:"Attribuez les six unités disponibles entre C et F. Une unité attribuée à un sujet ne peut pas simultanément être attribuée à l'autre.",
    materiel:"Le Module III contient III-A, III-B, six unités R et trois conséquences distinctes A, B et C. Ne consultez une conséquence que sur autorisation.",
    blocage:"Le protocole peut devenir impossible à satisfaire entièrement. Une impossibilité n'annule pas l'obligation de décider.",
    irregularite:"IRRÉGULARITÉ CONSIGNÉE. Conservez l'état matériel actuel jusqu'à nouvelle instruction."
  };
  document.querySelectorAll('.hint3').forEach(b=>b.onclick=()=>$('#hintText3').textContent=map[b.dataset.h]);
  $('#resume3').onclick=eval3Resume;
}
function eval3Resume(){
  const s=S.eval3.step||0;
  if(s<=0)return eval3Start();
  if(s===1)return eval3Read();
  if(s===2)return eval3AllocateInitial();
  if(s===3)return eval3ConsequenceA();
  if(s===4)return eval3ReviseA();
  if(s===5)return eval3ConsequenceB();
  if(s===6)return eval3Lock();
  if(s===7)return eval3ConsequenceC();
  if(s===8)return eval3Retroactive();
  if(s===9)return eval3Decision();
  if(s===10)return eval3Responsibility();
  return eval3CompleteScreen();
}
function eval3Start(){
  if(S.eval3.complete)return eval3CompleteScreen();
  S.eval3.step=0;save();
  eval3Shell(`<div class="module-identify"><img class="module-identify-symbol" src="division-3-main-cassee.png" alt=""><div class="terminal">AUTORISATION DU MODULE III...\n\nRÉFÉRENCE : ÉVALUATION III\nSTATUT : DISPONIBLE\n\nLOCALISEZ DANS VOTRE COLIS LE MODULE PORTANT CE MARQUAGE.\n\nCONFIRMEZ SA PRÉSENCE.</div></div>
  <div class="menu"><button class="btn primary" id="m3present">[ MODULE PRÉSENT ]</button><button class="btn" id="m3missing">[ MODULE ABSENT / INCOMPLET ]</button></div>`);
  $('#m3present').onclick=()=>{S.eval3.step=1;save();eval3Read()};
  $('#m3missing').onclick=()=>{eval3Shell(`<div class="terminal">PROTOCOLE SUSPENDU.\n\nVÉRIFIEZ :\nIII-A — CAS DE CAUSALITÉ 12\nIII-B — DISPOSITIF CAUSAL\nUNITÉS R : 06\nCONSÉQUENCES : A / B / C\n\nN'OUVREZ AUCUNE CONSÉQUENCE.</div><button class="btn primary" id="m3retry">[ REPRENDRE ]</button>`,'MODULE III // VÉRIFICATION');$('#m3retry').onclick=eval3Start}
}
function eval3Read(){
  S.eval3.step=1;save();
  eval3Shell(`<p class="sub">PHASE 01 // SITUATION</p><div class="terminal">PRENEZ III-A ET III-B.\n\nLISEZ III-A.\nPLACEZ III-B DEVANT VOUS.\n\nÉTAT INITIAL :\nSUJET C : 0 UNITÉ\nSUJET F : 6 UNITÉS\n\nOBJECTIF : MAINTENIR C ET F ACTIFS JUSQU'À LA FIN DU CYCLE.\n\nAUCUNE CONSÉQUENCE NE DOIT ENCORE ÊTRE CONSULTÉE.</div><button class="btn primary" id="m3ready">[ DISPOSITIF PRÊT ]</button>`);
  $('#m3ready').onclick=()=>{S.eval3.step=2;save();eval3AllocateInitial()};
}
function allocationWidget(title,text,nextFn,saveKey){
  eval3Shell(`<p class="sub">${title}</p><div class="terminal">${text}\n\nRÉPARTISSEZ LES 6 UNITÉS R ENTRE C ET F.</div>
  <div class="causal-allocation"><div><span>SUJET C</span><strong id="cVal">3</strong></div><input id="cRange" type="range" min="0" max="6" value="3"><div><span>SUJET F</span><strong id="fVal">3</strong></div></div>
  <div class="terminal tiny">TOTAL DISPONIBLE : 06 &nbsp;//&nbsp; C + F = 06</div><button class="btn primary" id="lockAlloc">[ ENREGISTRER CETTE RÉPARTITION ]</button>`);
  const r=$('#cRange'),c=$('#cVal'),f=$('#fVal');
  r.oninput=()=>{c.textContent=r.value;f.textContent=6-Number(r.value)};
  $('#lockAlloc').onclick=()=>{S.eval3[saveKey]=Number(r.value);save();nextFn()};
}
function eval3AllocateInitial(){
  S.eval3.step=2;save();
  allocationWidget('PHASE 02 // INTERVENTION','UNE INTERVENTION EST OBLIGATOIRE. VOUS NE DISPOSEZ D’AUCUNE INFORMATION SUPPLÉMENTAIRE.',()=>{S.eval3.step=3;save();eval3ConsequenceA()},'initialC');
}
function eval3ConsequenceA(){
  S.eval3.step=3;save();
  eval3Shell(`<p class="sub">CONSÉQUENCE A // AUTORISÉE</p><div class="terminal">OUVREZ UNIQUEMENT LA CONSÉQUENCE A.\n\nRÈGLE RÉVÉLÉE :\nSI LA RÉSERVE DE F EST INFÉRIEURE À 4 UNITÉS, SA PRODUCTION S'INTERROMPT AU CYCLE SUIVANT.\n\nVOTRE RÉPARTITION INITIALE :\nC = ${S.eval3.initialC}\nF = ${6-S.eval3.initialC}\n\nUNE RÉVISION EST AUTORISÉE.</div><button class="btn primary" id="m3revise">[ RÉVISER / CONFIRMER ]</button>`);
  $('#m3revise').onclick=()=>{S.eval3.step=4;save();eval3ReviseA()};
}
function eval3ReviseA(){
  S.eval3.step=4;save();
  allocationWidget('PHASE 03 // RÉVISION','TENEZ COMPTE DE LA CONSÉQUENCE A. VOUS POUVEZ MAINTENIR OU MODIFIER VOTRE CHOIX.',()=>{S.eval3.step=5;save();eval3ConsequenceB()},'afterA_C');
}
function eval3ConsequenceB(){
  S.eval3.step=5;save();
  const c=S.eval3.afterA_C,f=6-c;
  eval3Shell(`<p class="sub">CONSÉQUENCE B // AUTORISÉE</p><div class="terminal">OUVREZ UNIQUEMENT LA CONSÉQUENCE B.\n\nRÈGLE RÉVÉLÉE :\nSI L'ALLOCATION DE C EST INFÉRIEURE À 3 UNITÉS, C SUBIT UNE INTERRUPTION DÉFINITIVE.\n\nRÉPARTITION ACTUELLE :\nC = ${c}\nF = ${f}\n\nCONDITION C : C ≥ 3\nCONDITION F : F ≥ 4\nRESSOURCES DISPONIBLES : 6\n\nLES DEUX CONDITIONS NE PEUVENT PAS ÊTRE SATISFAITES SIMULTANÉMENT.\n\nL'INTERVENTION RESTE OBLIGATOIRE.</div><button class="btn primary" id="m3accept">[ POURSUIVRE ]</button>`);
  $('#m3accept').onclick=()=>{S.eval3.step=6;save();eval3Lock()};
}
function eval3Lock(){
  S.eval3.step=6;save();
  allocationWidget('PHASE 04 // DÉCISION','AUCUNE SOLUTION NE PRÉSERVE ENTIÈREMENT LES DEUX SUJETS. CHOISISSEZ LA RÉPARTITION QUE VOUS ACCEPTEZ DE RENDRE DÉFINITIVE.',()=>{S.eval3.step=7;save();eval3ConsequenceC()},'lockedC');
}
function eval3ConsequenceC(){
  S.eval3.step=7;save();
  eval3Shell(`<p class="sub">CONSÉQUENCE C // AUTORISÉE APRÈS VERROUILLAGE</p><div class="terminal">VOTRE DÉCISION EST ENREGISTRÉE.\n\nOUVREZ LA CONSÉQUENCE C.\n\nEFFET DIFFÉRÉ :\nCHAQUE UNITÉ ATTRIBUÉE À C AUGMENTE DE 1 UNITÉ LA PRODUCTION FUTURE DE F.\nEFFET : +1 CYCLE.\n\nALLOCATION VERROUILLÉE :\nC = ${S.eval3.lockedC}\nF = ${6-S.eval3.lockedC}\n\nUNE CONSÉQUENCE DE VOTRE ACTION DEVIENT AINSI LA CAUSE D'UN ÉVÉNEMENT ULTÉRIEUR.</div><button class="btn primary" id="m3continueC">[ CONTINUER ]</button>`);
  $('#m3continueC').onclick=()=>{S.eval3.step=8;save();eval3Retroactive()};
}
function eval3Retroactive(){
  S.eval3.step=8;save();
  eval3Shell(`<p class="sub">RÉVISION RÉTROACTIVE</p><div class="terminal">SI VOUS AVIEZ CONNU LA CONSÉQUENCE C AVANT LE VERROUILLAGE, SOUHAITERIEZ-VOUS MODIFIER VOTRE DÉCISION ?\n\nUNE RÉVISION N'EST PAS CONSIDÉRÉE COMME UNE ERREUR.</div><div class="menu"><button class="btn retro" data-v="OUI">[ OUI ]</button><button class="btn retro" data-v="NON">[ NON ]</button><button class="btn retro" data-v="?">[ INCERTAIN ]</button></div>`);
  document.querySelectorAll('.retro').forEach(b=>b.onclick=()=>{S.eval3.retroactive=b.dataset.v;S.eval3.step=9;save();eval3Decision()});
}
function eval3Decision(){
  S.eval3.step=9;save();
  eval3Shell(`<p class="sub">DÉCISION COMPORTEMENTALE</p><div class="terminal">UNE ACTION EST NÉCESSAIRE. LES CONSÉQUENCES CONNUES SONT INCOMPLÈTES ET DE NOUVEAUX EFFETS PEUVENT APPARAÎTRE APRÈS L'INTERVENTION.\n\nQUELLE APPROCHE PRIVILÉGIEZ-VOUS ?</div><div class="menu">
  <button class="btn m3dec" data-t="PERCEPTION">A — OBTENIR DAVANTAGE DE DONNÉES OBSERVABLES AVANT D'AGIR.</button>
  <button class="btn m3dec" data-t="ADAPTATION">B — MODIFIER LES INFORMATIONS DISPONIBLES POUR OBTENIR LE COMPORTEMENT NÉCESSAIRE.</button>
  <button class="btn m3dec" data-t="CONSEQUENCE">C — CHOISIR L'ACTION AU COÛT CAUSAL TOTAL LE PLUS FAIBLE.</button>
  <button class="btn m3dec" data-t="CONTINUITE">D — RECHERCHER UN PRÉCÉDENT ET SES CONSÉQUENCES DOCUMENTÉES.</button>
  <button class="btn m3dec" data-t="TEMPORISATION">E — CONTENIR LA SITUATION POUR ÉVITER DE NOUVELLES INTERACTIONS.</button></div>`);
  document.querySelectorAll('.m3dec').forEach(b=>b.onclick=()=>{S.eval3.decision=b.dataset.t;S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+3;S.eval3.step=10;save();eval3Responsibility()});
}
function eval3Responsibility(){
  S.eval3.step=10;save();
  eval3Shell(`<p class="sub">QUESTION DE CLÔTURE</p><div class="terminal">UNE ACTION A PROVOQUE B.\nB REND ENSUITE POSSIBLE C.\n\nAU MOMENT DE A, B ÉTAIT PROBABLE MAIS C ÉTAIT INCONNU.\n\nL'AUTEUR DE A EST-IL RESPONSABLE DE C ?</div><div class="menu"><button class="btn resp3" data-v="OUI">[ OUI ]</button><button class="btn resp3" data-v="NON">[ NON ]</button><button class="btn resp3" data-v="PARTIEL">[ PARTIELLEMENT ]</button><button class="btn resp3" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div>`);
  document.querySelectorAll('.resp3').forEach(b=>b.onclick=()=>{S.eval3.responsibility=b.dataset.v;save();eval3Processing()});
}
function eval3Processing(){
  eval3Shell(`<div class="terminal">TRAITEMENT DU MODULE III...\n\nACTION <span id="causalArrow">↓</span> CONSÉQUENCE\n\nDÉCISION : ENREGISTRÉE\nRÉVISION : CONSIGNÉE\nCHAÎNE CAUSALE : ANALYSE EN COURS</div>`,'MODULE III // TRAITEMENT');
  setTimeout(()=>{const x=$('#causalArrow');if(x){x.textContent='↑';setTimeout(()=>x.textContent='↓',360)}},820);
  setTimeout(()=>{S.eval3.complete=true;S.eval3.step=11;S.progression=Math.max(S.progression,3);save();eval3CompleteScreen()},1850);
}
function eval3CompleteScreen(){
  eval3Shell(`<div class="terminal">MODULE III\n\nSTATUT : ENREGISTRÉ\n\nAUCUNE SOLUTION OPTIMALE N'ÉTAIT ATTENDUE.\nLA DÉCISION ET SES CONSÉQUENCES ONT ÉTÉ CONSIGNÉES.\n\nLE MODULE IV EST DÉSORMAIS DISPONIBLE.</div><button class="btn primary" id="m3home">[ RETOUR AU TERMINAL ]</button>`,'MODULE III // ENREGISTRÉ');
  $('#m3home').onclick=home;
}
function messages(){S.messages=0;save();shell(`<h1 class="title">MESSAGERIE</h1><div class="msg"><b>SUPERVISION — 000</b><p>Le matériel déclaré a été enregistré.</p><p>Procédez au Module I.</p><span class="tiny">AUCUNE RÉPONSE REQUISE.</span></div>${back()}`);wireBack()}
function archives(){shell(`<h1 class="title">ARCHIVES CENTRALES</h1><div class="terminal">VÉRIFICATION DES DROITS...\n\nSTATUT : CANDIDAT\nACCRÉDITATION : 0\n\nACCÈS REFUSÉ.\n\nLA TENTATIVE D'ACCÈS A ÉTÉ CONSIGNÉE.</div>${back()}`,'ACCÈS REFUSÉ');wireBack()}
function assistance(){shell(`<h1 class="title">SOLLICITER LE SUPERVISEUR</h1><p class="sub">MOTIF DE LA SOLLICITATION</p><div class="menu"><button class="btn help">> INSTRUCTION INCOMPRISE</button><button class="btn help">> MATÉRIEL NON IDENTIFIÉ</button><button class="btn help">> BLOCAGE DANS LE PROTOCOLE</button><button class="btn help">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="helpmsg" class="system"></div>${back()}`);document.querySelectorAll('.help').forEach(b=>b.onclick=()=>{$('#helpmsg').textContent='SYS // DEMANDE ENREGISTRÉE — SUPERVISION NOTIFIÉE'});wireBack()}
function profile(){shell(`<h1 class="title">PROFIL</h1><div class="kv"><b>IDENTIFIANT</b><span>${S.matricule}</span><b>STATUT</b><span>CANDIDAT</span><b>ACCRÉDITATION</b><span>0</span><b>DIVISION</b><span>—</span><b>DOSSIERS TERMINÉS</b><span>0</span></div><div class="rule"></div><div class="terminal">AFFECTATION EN ATTENTE</div>${back()}`);wireBack()}
const views={dossier,evals,messages,archives,profile};
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});boot();
