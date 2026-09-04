const $=s=>document.querySelector(s); const app=$('#app');
const defaults={matricule:'',statut:'CANDIDAT',accreditation:'0',affectation:'—',inventaire:null,progression:0,messages:1,installed:false,
eval1:{step:0,factAttempts:0,epistemic:null,controlAttempts:0,decision:null,versions:null,memoryCount:null,complete:false},
tendances:{PERCEPTION:0,ADAPTATION:0,CONSEQUENCE:0,CONTINUITE:0,TEMPORISATION:0}};
let S={...defaults,...JSON.parse(localStorage.getItem('ordre_terminal')||'{}')};
S.eval1={...defaults.eval1,...(S.eval1||{})};
S.tendances={...defaults.tendances,...(S.tendances||{})};
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
        <div class="identity-version">OCI-TERM V0.4.0 &nbsp;&nbsp;|&nbsp;&nbsp; PROTOCOLE 000</div>
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
    let st=n<=S.progression?'ENREGISTRÉ':n===S.progression+1&&S.inventaire?'DISPONIBLE':'VERROUILLÉ';
    let active=(n===1 && st==='DISPONIBLE') ? ` data-eval="1" role="button" tabindex="0"` : '';
    return `<div class="eval ${active?'eval-open':''}"${active}><span>◇ &nbsp; ${['I','II','III','IV','V'][n-1]}</span><span>${st}${active?' &nbsp; ›':''}</span></div>`
  }).join('');
  shell(`<h1 class="title">ÉVALUATIONS</h1>${rows}<p class="sub">PROGRESSION : ${S.progression} / 5</p>${back()}`);
  wireBack();
  const e1=document.querySelector('[data-eval="1"]');
  if(e1){e1.onclick=eval1Start;e1.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval1Start()}}}
}
function eval1Shell(body,status='MODULE I // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION I</span><h1 class="title">MODULE I</h1></div><div class="module-glyph">◉</div></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
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
  eval1Shell(`<div class="terminal">AUTORISATION DU MODULE I...\n\nRÉFÉRENCE : ÉVALUATION I\nSTATUT : DISPONIBLE\n\nCONFIRMEZ QUE LE MODULE I EST PRÉSENT DANS VOTRE COLIS.</div>
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
function messages(){S.messages=0;save();shell(`<h1 class="title">MESSAGERIE</h1><div class="msg"><b>SUPERVISION — 000</b><p>Le matériel déclaré a été enregistré.</p><p>Procédez au Module I.</p><span class="tiny">AUCUNE RÉPONSE REQUISE.</span></div>${back()}`);wireBack()}
function archives(){shell(`<h1 class="title">ARCHIVES CENTRALES</h1><div class="terminal">VÉRIFICATION DES DROITS...\n\nSTATUT : CANDIDAT\nACCRÉDITATION : 0\n\nACCÈS REFUSÉ.\n\nLA TENTATIVE D'ACCÈS A ÉTÉ CONSIGNÉE.</div>${back()}`,'ACCÈS REFUSÉ');wireBack()}
function assistance(){shell(`<h1 class="title">SOLLICITER LE SUPERVISEUR</h1><p class="sub">MOTIF DE LA SOLLICITATION</p><div class="menu"><button class="btn help">> INSTRUCTION INCOMPRISE</button><button class="btn help">> MATÉRIEL NON IDENTIFIÉ</button><button class="btn help">> BLOCAGE DANS LE PROTOCOLE</button><button class="btn help">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="helpmsg" class="system"></div>${back()}`);document.querySelectorAll('.help').forEach(b=>b.onclick=()=>{$('#helpmsg').textContent='SYS // DEMANDE ENREGISTRÉE — SUPERVISION NOTIFIÉE'});wireBack()}
function profile(){shell(`<h1 class="title">PROFIL</h1><div class="kv"><b>IDENTIFIANT</b><span>${S.matricule}</span><b>STATUT</b><span>CANDIDAT</span><b>ACCRÉDITATION</b><span>0</span><b>DIVISION</b><span>—</span><b>DOSSIERS TERMINÉS</b><span>0</span></div><div class="rule"></div><div class="terminal">AFFECTATION EN ATTENTE</div>${back()}`);wireBack()}
const views={dossier,evals,messages,archives,profile};
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});boot();
