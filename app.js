const $=s=>document.querySelector(s); const app=$('#app');
const defaults={matricule:'',statut:'CANDIDAT',accreditation:'0',affectation:'—',inventaire:null,progression:0,messages:1,installed:false,
eval1:{step:0,factAttempts:0,epistemic:null,controlAttempts:0,decision:null,versions:null,memoryCount:null,complete:false},
eval2:{step:0,memoryAnswers:[],confidence:[],divergence:null,epistemic:null,versionFirst:null,confidenceMaintained:null,decision:null,sincereFalse:null,authenticFalse:null,complete:false},
eval3:{step:0,initialC:null,afterA_C:null,lockedC:null,retroactive:null,decision:null,responsibility:null,complete:false},
eval4:{step:0,sequence:[],registerCode:null,divergence:null,decision:null,complete:false},
eval5:{step:0,sequence:[],opened:null,prediction:null,reflection:null,archiveChoice:null,decision:null,complete:false},
tendances:{PERCEPTION:0,ADAPTATION:0,CONSEQUENCE:0,CONTINUITE:0,TEMPORISATION:0},affectationReady:false,affectationDone:false,serment:false,initiationDate:null,sermentDisponible:false,initieAccueilVu:false,initieMessagesLus:[]};
let S={...defaults,...JSON.parse(localStorage.getItem('ordre_terminal')||'{}')};
S.eval1={...defaults.eval1,...(S.eval1||{})};
S.eval2={...defaults.eval2,...(S.eval2||{})};
S.eval3={...defaults.eval3,...(S.eval3||{})};
S.eval4={...defaults.eval4,...(S.eval4||{})};
S.eval5={...defaults.eval5,...(S.eval5||{})};
S.tendances={...defaults.tendances,...(S.tendances||{})};
if(S.eval1.complete && (S.progression||0)<1) S.progression=1;
if(S.eval2.complete && (S.progression||0)<2) S.progression=2;
if(S.eval3.complete && (S.progression||0)<3) S.progression=3;
if(S.eval4.complete && (S.progression||0)<4) S.progression=4;
if(S.eval5.complete && (S.progression||0)<5) S.progression=5;
function save(){localStorage.setItem('ordre_terminal',JSON.stringify(S));profileSave()} function shell(body,status='SYS // SESSION : 1'){app.innerHTML=`<section class="shell"><div class="brand">ORDRE DES CINQ OMBRES</div><div class="rule"></div>${body}<div class="status">PROTOCOLE ACTIF : 000 <span class="tag">${status}</span></div></section>`}
function later(fn,ms=650){setTimeout(fn,ms)}

/* V1.3 — PROTOTYPE : profils locaux par matricule + administration locale.
   IMPORTANT : l'accès admin local est volontairement réservé au prototype.
   Il devra être remplacé par une authentification serveur avant diffusion publique. */
const ADMIN_MATRICULE='OCI-ADMIN-000';
let ADMIN_MODE=false;
let ACTIVE_PROFILE=null;

function profileKey(m){return 'ordre_terminal_profile_'+String(m||'').trim().toUpperCase()}
function profileLoad(m){
  const key=profileKey(m);
  try{
    const raw=localStorage.getItem(key);
    if(raw)return JSON.parse(raw);
  }catch(e){}
  return null;
}
function profileSave(){
  if(ADMIN_MODE||!S.matricule)return;
  localStorage.setItem(profileKey(S.matricule),JSON.stringify(S));
  localStorage.setItem('ordre_terminal_last_profile',S.matricule);
}
function profileCreate(m){
  const fresh=JSON.parse(JSON.stringify(defaults));
  fresh.matricule=m;
  return fresh;
}
function profileSwitch(m){
  m=String(m||'').trim().toUpperCase();
  if(!m)return false;
  ACTIVE_PROFILE=m;
  const found=profileLoad(m);
  S=found?Object.assign(JSON.parse(JSON.stringify(defaults)),found):profileCreate(m);
  S.matricule=m;
  profileSave();
  return !!found;
}
function adminSnapshot(){
  return JSON.parse(JSON.stringify(S));
}
function adminPrepare(divisionName){
  ADMIN_MODE=true;
  S=JSON.parse(JSON.stringify(defaults));
  S.matricule='SIMULATION';
  S.affectation=divisionName||'SPIRALE D’OS';
  S.affectationDone=true;
  S.affectationReady=true;
}
function adminExit(){
  ADMIN_MODE=false;
  document.body.classList.remove('cinematic-mode','initiated','div-eye','div-flame','div-hand','div-spiral','div-hourglass');
  boot();
}
function boot(){
  ADMIN_MODE=false;
  document.body.classList.remove('cinematic-mode','initiated','div-eye','div-flame','div-hand','div-spiral','div-hourglass');
  shell(`<div class="boot-screen"><div class="terminal cursor">RÉSEAU DES CINQ OMBRES

INITIALISATION DU TERMINAL...
CANAL SÉCURISÉ : ÉTABLI

PROTOCOLE ACTIF : 000
IDENTIFICATION REQUISE

&gt; </div></div>`,'CONNEXION');
  later(()=>identify(),1450);
}
function identify(){
  const last=localStorage.getItem('ordre_terminal_last_profile')||'';
  shell(`<h1 class="title">IDENTIFICATION</h1>
  <div class="terminal">SAISISSEZ VOTRE MATRICULE.

UN DOSSIER LOCAL EXISTANT SERA RESTAURÉ AUTOMATIQUEMENT.
UN MATRICULE INCONNU INITIALISERA UN NOUVEAU DOSSIER CANDIDAT.</div>
  <div class="id-login">
    <label>MATRICULE</label>
    <input id="matricule" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="C-000-000" value="${last}">
    <button class="btn primary" id="identifyGo">[ S'IDENTIFIER ]</button>
  </div>
  <div id="identifyFeedback" class="system"></div>`,'IDENTIFICATION // DOSSIER LOCAL');
  const input=$('#matricule');
  const go=()=>{
    const m=String(input.value||'').trim().toUpperCase();
    if(!m){$('#identifyFeedback').textContent='MATRICULE REQUIS.';return}
    if(m===ADMIN_MATRICULE){ADMIN_MODE=true;adminPanel();return}
    const existed=profileSwitch(m);
    $('#identifyFeedback').textContent=existed?'DOSSIER LOCAL DÉTECTÉ — RESTAURATION...':'NOUVEAU DOSSIER — INITIALISATION...';
    setTimeout(()=>environment(),900);
  };
  $('#identifyGo').onclick=go;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  setTimeout(()=>input.focus(),50);
}
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function environment(){if(standalone()){S.installed=true;save();shell(`<div class="terminal">POINT D'ACCÈS DÉTECTÉ.\n\nAPPAREIL ENREGISTRÉ.\nCANAL CANDIDAT ÉTABLI.\n\nPROTOCOLE 000 AUTORISÉ.</div>`,'POINT D’ACCÈS ACTIF');later(home,1100)}else{shell(`<h1 class="title">ENVIRONNEMENT NON PERSISTANT</h1><p class="sub">Installation d'un point d'accès local recommandée. Cette opération permet les connexions ultérieures depuis votre appareil.</p><div class="menu"><button class="btn primary" id="install">[ ÉTABLIR LE POINT D'ACCÈS ]</button><button class="btn" id="continue">[ POURSUIVRE CETTE SESSION ]</button></div>`);$('#install').onclick=installHelp;$('#continue').onclick=home}}
function installHelp(){shell(`<h1 class="title">AUTORISATION SYSTÈME REQUISE</h1><div class="terminal">LE TERMINAL NE DISPOSE PAS DES PRIVILÈGES NÉCESSAIRES POUR MODIFIER VOTRE APPAREIL.\n\nOUVREZ LES OPTIONS DE PARTAGE DE VOTRE NAVIGATEUR.\n\nSÉLECTIONNEZ :\n« SUR L'ÉCRAN D'ACCUEIL »\n\nCONSERVEZ LE NOM : TERMINAL\n\nPUIS OUVREZ LE POINT D'ACCÈS NOUVELLEMENT CRÉÉ.</div><div class="menu"><button class="btn" id="continue">[ POURSUIVRE CETTE SESSION ]</button></div>`,'AUTORISATION EXTERNE');$('#continue').onclick=home}

function adminPanel(){
  ADMIN_MODE=true;
  document.body.classList.remove('initiated','cinematic-mode','div-eye','div-flame','div-hand','div-spiral','div-hourglass');
  const divisions=['ŒIL FENDU','FLAMME INVERSÉE','MAIN CASSÉE','SPIRALE D’OS','SABLIER NOIR'];
  shell(`<div class="admin-shell">
    <div class="admin-warning">MODE ADMIN // SIMULATION LOCALE // PROTOTYPE</div>
    <h1 class="title">PANNEAU DE CONTRÔLE</h1>
    <div class="terminal">AUCUNE ACTION DE CET ÉCRAN NE DOIT ÊTRE UTILISÉE COMME DOSSIER JOUEUR RÉEL.

SÉLECTIONNEZ UN POINT D'ENTRÉE DANS LA TRAME.</div>
    <div class="admin-grid">
      <button class="admin-jump" data-jump="start"><b>00</b><span>DÉBUT / IDENTIFICATION</span></button>
      <button class="admin-jump" data-jump="e1"><b>I</b><span>ÉVALUATION I</span></button>
      <button class="admin-jump" data-jump="e2"><b>II</b><span>ÉVALUATION II</span></button>
      <button class="admin-jump" data-jump="e3"><b>III</b><span>ÉVALUATION III</span></button>
      <button class="admin-jump" data-jump="e4"><b>IV</b><span>ÉVALUATION IV</span></button>
      <button class="admin-jump" data-jump="e5"><b>V</b><span>ÉVALUATION V</span></button>
      <button class="admin-jump" data-jump="assignment"><b>A</b><span>AFFECTATION</span></button>
      <button class="admin-jump" data-jump="after"><b>AP</b><span>ENVELOPPE APRÈS</span></button>
      <button class="admin-jump" data-jump="oath"><b>S</b><span>SERMENT</span></button>
      <button class="admin-jump" data-jump="cine"><b>▶</b><span>CINÉMATIQUE POST-SERMENT</span></button>
      <button class="admin-jump" data-jump="initiate"><b>OI</b><span>TERMINAL INITIÉ / OMBRE I</span></button>
    </div>
    <div class="admin-division">
      <label>DIVISION SIMULÉE</label>
      <select id="adminDivision">${divisions.map(x=>`<option${x==='SPIRALE D’OS'?' selected':''}>${x}</option>`).join('')}</select>
    </div>
    <div class="menu"><button class="btn" id="adminExit">[ QUITTER LE MODE ADMIN ]</button></div>
  </div>`,'ADMINISTRATION // LOCAL');
  document.querySelectorAll('.admin-jump').forEach(b=>b.onclick=()=>adminJump(b.dataset.jump,$('#adminDivision').value));
  $('#adminExit').onclick=adminExit;
}
function adminJump(step,division){
  adminPrepare(division);
  const complete=n=>{
    S.progression=n;
    if(n>=1)S.eval1.complete=true;
    if(n>=2)S.eval2.complete=true;
    if(n>=3)S.eval3.complete=true;
    if(n>=4)S.eval4.complete=true;
    if(n>=5)S.eval5.complete=true;
  };
  if(step==='start'){ADMIN_MODE=false;boot();return}
  if(step==='e1'){complete(0);eval1Start();return}
  if(step==='e2'){complete(1);eval2Start();return}
  if(step==='e3'){complete(2);eval3Start();return}
  if(step==='e4'){complete(3);eval4Start();return}
  if(step==='e5'){complete(4);eval5Start();return}
  complete(5);
  if(step==='assignment'){S.affectationDone=false;S.affectationReady=true;assignmentStart();return}
  S.affectationDone=true;
  if(step==='after'){assignmentAfter();return}
  S.sermentDisponible=true;
  if(step==='oath'){assignmentOathAuthorize();return}
  if(step==='cine'){
    S.serment=true;S.statut='INITIÉ';S.accreditation='OMBRE I';
    initiateCinematic();return
  }
  if(step==='initiate'){
    S.serment=true;S.statut='INITIÉ';S.accreditation='OMBRE I';S.initieAccueilVu=true;
    document.body.classList.add('initiated');
    home();return
  }
}

function divisionLogo(name){
 const logos={
  'ŒIL FENDU':'division-1-oeil-fendu.png',
  'FLAMME INVERSÉE':'division-2-flamme-inversee.png',
  'MAIN CASSÉE':'division-3-main-cassee.png',
  'SPIRALE D’OS':'division-4-spirale-os.png',
  'SABLIER NOIR':'division-5-sablier-noir.png'
 };
 return logos[name]||'order-logo.png';
}
function divisionMeta(name){
 const m={
  'ŒIL FENDU':{cls:'div-eye',verb:'OBSERVER',msg:`Votre affectation n'est pas une récompense.\n\nVous avez été placé parmi ceux dont la fonction est d'observer ce que les autres ne doivent pas nécessairement voir.\n\nNe confondez jamais observation et vérité.\n\nVous recevrez bientôt votre première affectation.`},
  'FLAMME INVERSÉE':{cls:'div-flame',verb:'ADAPTER',msg:`Votre affectation n'est pas une récompense.\n\nUne réalité instable ne se préserve pas toujours en la laissant intacte.\n\nVous apprendrez à distinguer ce qui doit être conservé de ce qui doit être modifié.\n\nVous recevrez bientôt votre première affectation.`},
  'MAIN CASSÉE':{cls:'div-hand',verb:'ANTICIPER',msg:`Votre affectation n'est pas une récompense.\n\nToute intervention produit une conséquence. Toute abstention également.\n\nVotre fonction sera de mesurer le prix d'une décision avant qu'il ne devienne irréversible.\n\nVous recevrez bientôt votre première affectation.`},
  'SPIRALE D’OS':{cls:'div-spiral',verb:'PRÉSERVER',msg:`Votre affectation n'est pas une récompense.\n\nCe qui disparaît laisse une trace. Ce qui est oublié n'est pas nécessairement perdu.\n\nVotre fonction sera de préserver la continuité lorsque l'Histoire cesse de l'assurer.\n\nVous recevrez bientôt votre première affectation.`},
  'SABLIER NOIR':{cls:'div-hourglass',verb:'CONTENIR',msg:`Votre affectation n'est pas une récompense.\n\nToutes les portes ne doivent pas être ouvertes. Toutes les informations ne doivent pas circuler.\n\nVotre fonction commence là où l'autorisation de comprendre s'arrête.\n\nVous recevrez bientôt votre première affectation.`}
 };
 return m[name]||m['SPIRALE D’OS'];
}
function applyInitiateTheme(){
 document.body.classList.remove('div-eye','div-flame','div-hand','div-spiral','div-hourglass');
 document.body.classList.add('initiated',divisionMeta(S.affectation).cls);
}
function initiateFirstEntry(){
 applyInitiateTheme();
 shell(`<div class="init-entry">
 <div class="terminal init-sequence" id="initSeq">IDENTITÉ CONFIRMÉE.

MATRICULE : ${S.matricule||'NON RENSEIGNÉ'}
STATUT : INITIÉ
ACCRÉDITATION : OMBRE I
DIVISION : ${S.affectation||'NON RENSEIGNÉ'}

CHARGEMENT DU DOSSIER PERSONNEL...</div>
 <button class="btn primary hidden" id="enterInitiate">[ ENTRER ]</button>
 </div>`,'TERMINAL // ACCÈS INITIÉ');
 const box=$('#initSeq');
 const enterInitiate=()=>{
   S.initieAccueilVu=true;
   save();
   initiateHome();
 };
 // Bind immediately and also re-bind at reveal as a safeguard for iOS/PWA DOM timing.
 const initialBtn=$('#enterInitiate');
 if(initialBtn) initialBtn.addEventListener('click',enterInitiate);
 setTimeout(()=>box.textContent+=`\nOUVERTURE DES ARCHIVES AUTORISÉES...`,1300);
 setTimeout(()=>box.textContent+=`\nÉTABLISSEMENT DU CANAL DE DIVISION...`,2600);
 setTimeout(()=>box.textContent+=`\n\n3 NOUVEAUX MESSAGES.`,3900);
 setTimeout(()=>{
   box.textContent+=`\n\nTERMINAL // ACCÈS INITIÉ`;
   const btn=$('#enterInitiate');
   if(btn){
     btn.classList.remove('hidden');
     btn.onclick=enterInitiate;
   }
 },5000);
}
function initiateHome(){
 applyInitiateTheme();
 const logo=divisionLogo(S.affectation);
 shell(`<section class="init-dashboard">
   <div class="init-id">
    <div><div class="eyebrow">DOSSIER ACTIF</div><h1>${S.matricule||'INITIÉ'}</h1>
    <div class="init-meta">STATUT // INITIÉ<br>ACCRÉDITATION // OMBRE I<br>DIVISION // ${S.affectation}</div></div>
    <img class="init-division-logo" src="${logo}" alt="">
   </div>
   <div class="mission-status"><span>DOSSIER ACTIF</span><strong>AUCUNE AFFECTATION OPÉRATIONNELLE</strong><small>Votre intégration au réseau est en cours.</small></div>
   <div class="init-grid">
    <button onclick="initiateMissions()"><b>MISSIONS</b><span>Aucune affectation</span></button>
    <button onclick="initiateMessages()"><b>MESSAGERIE</b><span class="unread">${unreadMailCount()} NOUVEAU${unreadMailCount()>1?'X':''} MESSAGE${unreadMailCount()>1?'S':''}</span></button>
    <button onclick="initiateArchives()"><b>ARCHIVES</b><span>ACCÈS OMBRE I</span></button>
    <button onclick="initiateProfile()"><b>DOSSIER PERSONNEL</b><span>DOSSIER 000 // CLÔTURÉ</span></button>
   </div>
   <div class="init-foot">ACCÈS ARCHIVES : OMBRE I <span>ÉTAT DU RÉSEAU : STABLE</span></div>
 </section>`,'TERMINAL // ACCÈS INITIÉ');
}
function initBack(){initiateHome()}
function initiateMissions(){
 shell(`<h1 class="title">MISSIONS</h1><div class="classified-block"><div class="eyebrow">AFFECTATIONS OPÉRATIONNELLES</div><h2>AUCUNE AFFECTATION</h2><p>Votre intégration au réseau est en cours.</p><p>Une première affectation vous sera transmise par votre Division.</p></div><button class="btn" onclick="initBack()">[ RETOUR ]</button>`,'MISSIONS // OMBRE I');
}
const INITIATE_MESSAGES=[
 {from:'ADMINISTRATION',subject:'CHANGEMENT DE STATUT',date:'AUJOURD’HUI',preview:'Confirmation de votre nouveau niveau d’accès.',body:()=>`Votre dossier candidat a été clôturé.\n\nVotre statut est désormais INITIÉ.\nAccréditation attribuée : OMBRE I.\n\nLes informations accessibles restent soumises au principe de compartimentation. Toute consultation excédant votre niveau d’autorisation doit être interrompue et signalée.`},
 {from:()=>S.affectation,subject:'AFFECTATION DE DIVISION',date:'AUJOURD’HUI',preview:'Communication réservée à votre affectation.',body:()=>divisionMeta(S.affectation).msg},
 {from:'ARCHIVES',subject:'AUTORISATIONS DOCUMENTAIRES',date:'AUJOURD’HUI',preview:'Mise à jour de vos droits de consultation.',body:()=>`Votre accréditation autorise désormais la consultation du niveau OMBRE I.\n\n15 DOCUMENTS DISPONIBLES.\nRÉFÉRENCES SUPÉRIEURES COMPARTIMENTÉES.\n\nLes références d’un niveau supérieur peuvent apparaître dans l’index sans que leur contenu vous soit accessible.`}
];
function readMailSet(){if(!Array.isArray(S.initieMessagesLus))S.initieMessagesLus=[];return new Set(S.initieMessagesLus)}
function unreadMailCount(){const r=readMailSet();return INITIATE_MESSAGES.filter((_,i)=>!r.has(i)).length}
function initiateMessages(){
 const read=readMailSet(), unread=unreadMailCount();
 shell(`<h1 class="title">MESSAGERIE</h1><div class="mail-toolbar"><span>BOÎTE DE RÉCEPTION</span><b>${unread} NON LU${unread>1?'S':''}</b></div><div class="mail-inbox">${INITIATE_MESSAGES.map((m,i)=>{const from=typeof m.from==='function'?m.from():m.from;const isUnread=!read.has(i);return `<button class="mail-row ${isUnread?'unread-mail':'read-mail'}" onclick="openInitiateMessage(${i})"><span class="mail-status">${isUnread?'●':'○'}</span><span class="mail-from">${from}</span><span class="mail-subject"><b>${m.subject}</b><small>${m.preview}</small></span><span class="mail-date">${m.date}</span></button>`}).join('')}</div><button class="btn" onclick="initBack()">[ RETOUR ]</button>`,'MESSAGERIE // BOÎTE DE RÉCEPTION');
}
function openInitiateMessage(i){
 if(!Array.isArray(S.initieMessagesLus))S.initieMessagesLus=[];
 if(!S.initieMessagesLus.includes(i)){S.initieMessagesLus.push(i);save()}
 const m=INITIATE_MESSAGES[i],from=typeof m.from==='function'?m.from():m.from,body=m.body();
 shell(`<div class="mail-reader"><div class="mail-reader-head"><button class="mail-back" onclick="initiateMessages()">← BOÎTE DE RÉCEPTION</button><div class="mail-ref">MESSAGE 0${i+1} // OMBRE I</div></div><h1>${m.subject}</h1><div class="mail-meta"><div><span>EXPÉDITEUR</span><b>${from}</b></div><div><span>DESTINATAIRE</span><b>${S.matricule}</b></div><div><span>STATUT</span><b>TRANSMISSION AUTORISÉE</b></div></div><div class="mail-body">${body.split('\n').map(x=>x?`<p>${x}</p>`:'<br>').join('')}</div><div class="mail-sign">FIN DE TRANSMISSION // ${from}</div></div>`,'MESSAGERIE // LECTURE');
}
const OMBRE1_ARCHIVES=[["OI-GEN-001", "L’ORDRE DES CINQ OMBRES", "Doctrine institutionnelle, mission et principes."], ["OI-GEN-002", "LES CINQ DIVISIONS", "Rôles, philosophies et compartimentation."], ["OI-GEN-003", "NIVEAUX D’ACCRÉDITATION", "Structure officielle des accès OMBRE I à III."], ["OI-NEB-001", "NEBULINE — NOTICE INTRODUCTIVE", "Doctrine opérationnelle sur la Nebuline."], ["OI-VOI-001", "LES CINQ VOILES", "Noms, fonctions et signes accessibles à OMBRE I."], ["OI-FRA-001", "FRACTURES — CLASSIFICATION GÉNÉRALE", "Définition, origine et conduite initiale."], ["OI-ART-001", "ARTEFACTS ET ANCRAGES", "Objets persistants et moyens de stabilisation."], ["OI-MAN-001", "LES MANIFESTÉS", "Définition et protocole concernant les sujets altérés."], ["OI-PRO-004", "PROTOCOLE FACE À UNE ANOMALIE", "Procédure générale de terrain."], ["OI-PRO-007", "COLLECTE ET CONSERVATION DES PREUVES", "Méthode de documentation en contexte instable."], ["OI-HIS-001", "CHRONOLOGIE INSTITUTIONNELLE", "Édition historique abrégée OMBRE I."], ["OI-GEO-001", "RÉSEAU DE L’ORDRE", "Bastions et organisation géographique."], ["OI-GEO-002", "ZONES SOUS SURVEILLANCE", "Ancrages et zones géographiques indexées."], ["OI-INC-014", "INCIDENT LANTERNUM — 1864", "Incident historique ; reproduction interdite."], ["OI-RAP-001", "RAPPORT D’INTERVENTION — 24-071", "Exemple d’intervention OMBRE I clôturée."]];
const OMBRE1_BODIES=["CLASSIFICATION : OMBRE I\nCATÉGORIE : FONDAMENTAUX / DOCTRINE\n\nL’Ordre des Cinq Ombres est une organisation transséculaire chargée d’identifier, étudier, contenir et, lorsque nécessaire, corriger les phénomènes susceptibles de compromettre la continuité de la réalité humaine observable.\n\nMISSION\n— Identifier les anomalies et Fractures.\n— Étudier les Artefacts, Ancrages et individus affectés.\n— Préserver les traces nécessaires à l’analyse.\n— Limiter l’exposition publique.\n— Corriger les conséquences lorsqu’une intervention est autorisée.\n— Maintenir la continuité dans la limite des moyens disponibles.\n\nL’Ordre ne garantit pas la préservation de toute information.\nIl garantit la continuité dans la limite de ses moyens.\n\nPRINCIPES\nI — « La réalité n’est qu’une version. »\nLa perception humaine ne constitue pas une description exhaustive du réel.\n\nII — « L’Histoire est une barrière. »\nLa continuité historique participe à la stabilité de l’expérience humaine.\n\nIII — « L’unité mène à la dissolution. »\nToute convergence supprimant les séparations nécessaires à la continuité doit être considérée comme un risque.\n\nOBLIGATION DE L’INITIÉ\nN’expliquez jamais au-delà de ce que les preuves permettent d’établir.\n\nSi une observation et la doctrine disponible sont incompatibles :\nCONSIGNEZ L’INCOMPATIBILITÉ.\nNE LA RÉSOLVEZ PAS PAR SUPPOSITION.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : FONDAMENTAUX / ORGANISATION\n\nŒIL FENDU — OBSERVER\nSurveillance, analyse, anticipation, information sans intervention prématurée.\n« Voir n’autorise pas à agir. »\n\nFLAMME INVERSÉE — ADAPTER\nIntervention, modification, infiltration et correction.\n« Préserver n’implique pas toujours de laisser intact. »\n\nMAIN CASSÉE — ANTICIPER\nConséquences, relations causales, évaluation et stabilisation structurelle.\n« Toute correction crée une conséquence. »\n\nSPIRALE D’OS — PRÉSERVER\nArchives, traces, continuité historique et reconstruction.\n« Ce qui disparaît peut continuer d’avoir eu lieu. »\n\nSABLIER NOIR — CONTENIR\nConfinement, sécurité interne, information restreinte et contrôle prolongé.\n« Toute information n’a pas vocation à circuler. »\n\n[ANNEXE SN-00 : ACCÈS REFUSÉ]\n\nCOOPÉRATION\nAucune Division n’est autonome lors d’une Fracture majeure.\nUn désaccord entre Divisions ne constitue pas nécessairement une défaillance.\n\nPlusieurs réponses incompatibles peuvent être simultanément justifiées.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : FONDAMENTAUX / SÉCURITÉ\n\nOMBRE I — PERSONNEL INITIÉ\nDoctrine générale, protocoles communs, classifications élémentaires et archives nécessaires aux opérations autorisées.\n\nOMBRE II — ACCÈS RENFORCÉ\nMécanismes, opérations sensibles, histoire restreinte et protocoles avancés.\nL’accès n’est pas accordé par ancienneté seule.\n\nOMBRE III — DIRECTION\nPlus haut niveau reconnu par les protocoles institutionnels.\nLes informations OMBRE III ne doivent pas être recherchées, reconstruites ou déduites par du personnel inférieur.\n\nCOMPARTIMENTATION\nUne accréditation identique ne garantit pas un accès identique.\nLes droits peuvent dépendre de la Division, de l’opération, de la fonction, du site et du besoin d’en connaître.\n\nUn refus d’accès ne constitue pas la preuve qu’un niveau supérieur existe pour la référence consultée.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PHÉNOMÈNES / NEBULINE\n\nNebuline est la désignation employée pour un état fondamental de la réalité associé aux phénomènes observés lorsque sa stabilité ordinaire est compromise.\n\nSa nature exacte n’est pas accessible au niveau OMBRE I.\n\nNE PAS INTERPRÉTER LA NEBULINE COMME :\n— une énergie ;\n— une matière ;\n— un espace ou une dimension ;\n— une substance ;\n— une entité consciente.\n\nToute représentation n’est qu’un modèle de travail.\n\nLa Nebuline n’est pas directement observée dans les conditions ordinaires. Sa présence est inférée à partir de divergences documentables : perception, mémoire, causalité, histoire, cohérence d’un lieu, d’un objet ou d’un individu.\n\nMANIFESTATIONS INDIRECTES POSSIBLES\nInformations sans source identifiable, souvenirs incompatibles, événements sans cause observable, objets à l’historique impossible, divergences temporelles, altérations perceptives partagées, répétitions, absences et contradictions entre témoignage, mémoire et preuve.\n\nCes phénomènes sont des conséquences observées. Ils ne sont pas la Nebuline elle-même.\n\nPRINCIPE FONDAMENTAL\nAucune intention de la Nebuline n’est démontrée au niveau OMBRE I.\nUne séquence intelligible ne constitue pas une preuve de communication.\n\n« Une coïncidence signifiante n’est pas une intention démontrée. »\n\nCAS N-17-██\nTrois agents demeurent cinq minutes dans une même pièce.\nA rapporte quatre minutes.\nB en rapporte dix-sept.\nC affirme n’être jamais entré malgré l’enregistrement vidéo, mais décrit correctement un objet absent de tous les enregistrements.\nL’objet n’a jamais été retrouvé.\n\nCONCLUSION : instabilité Nebulinique confirmée. Cause non établie.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PHÉNOMÈNES / VOILES\n\nL’Ordre reconnaît cinq mécanismes fondamentaux associés au maintien d’une expérience humaine cohérente de la réalité.\n\nIls ne doivent pas être interprétés comme des lieux, dimensions, frontières physiques ou réalités parallèles.\n\nI — CONSCIENCE\nCohérence de la perception individuelle.\n« Voir quelque chose ne prouve pas son existence. Ne pas le voir ne prouve pas son absence. »\n\nII — MÉMOIRE\nContinuité des souvenirs.\n« Un souvenir est un élément d’enquête. Il n’est pas une preuve. »\n\nIII — CAUSALITÉ\nCohérence entre causes et conséquences.\n« L’absence de cause observable n’autorise pas l’invention d’une cause. »\n\nIV — HISTOIRE\nContinuité entre événements, traces et versions documentées.\n« L’Histoire n’est pas déterminée par ce dont nous nous souvenons. »\n\nV — OMBRES\nFonction : [ACCÈS OMBRE II]\nTout comportement non attribuable aux quatre premiers Voiles, persistant après stabilisation ou récurrent dans des contextes indépendants doit être signalé.\nNe procédez pas vous-même à une classification OMBRES.\n\nINTERACTIONS\nPlusieurs Voiles peuvent être concernés simultanément.\n\nLa relation fondamentale entre Nebuline et Voiles n’est pas accessible au niveau OMBRE I.\n\nFORMULATIONS NON AUTORISÉES SANS PREUVE :\n« le Voile s’est ouvert » ;\n« quelque chose vit derrière le Voile » ;\n« la Nebuline cherche à entrer ».\n\nNOTE\nLes évaluations du Recrutement exposent volontairement les Candidats à des modèles contrôlés de divergence.\n[MÉTHODES : COMPARTIMENTÉES]", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PHÉNOMÈNES / FRACTURES\n\nUne Fracture est une instabilité persistante ou évolutive affectant la cohérence d’un ou plusieurs Voiles.\n\nUne Fracture n’est pas nécessairement une fissure physique.\nElle peut concerner un lieu, un objet, un événement, une période, un groupe ou un individu.\n\n« Une Fracture est définie par ce qu’elle rend instable. »\n\nANOMALIE ≠ FRACTURE\nUn événement isolé ne suffit pas.\nLa persistance, l’évolution, la propagation ou les conséquences durables participent à la classification.\n\nORIGINE OPÉRATIONNELLE\nSPONTANÉE — aucune intervention identifiable.\nCONSÉCUTIVE — apparition après un événement identifiable.\nINDUITE — une action consciente a participé à son apparition.\n[PROCÉDURES D’INDUCTION : ACCÈS REFUSÉ]\n\nÉVOLUTION POSSIBLE\nRésolution, persistance, propagation, déplacement, changement de manifestation ou implication de plusieurs Voiles.\n\nUne stabilisation ne signifie pas nécessairement disparition.\n\nÉVALUATION INITIALE\n1. Qu’est-ce qui est observé ?\n2. Qu’est-ce qui diverge ?\n3. Qui ou quoi est affecté ?\n4. Quels Voiles sont suspectés ?\n5. Le phénomène évolue-t-il ?\n6. Persiste-t-il ?\n7. Que faut-il préserver ?\n\nCAS F-28\nUne chambre disparaît d’un logement. Une famille se souvient d’un fils dont les documents cessent progressivement d’exister. Après stabilisation, l’inventaire d’intervention mentionne quatre agents ; le registre de mission n’en reconnaît que trois. L’identité du quatrième demeure non établie.\n\nL’absence d’explication n’autorise jamais l’invention d’une intention.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PHÉNOMÈNES / OBJETS\n\nARTEFACT\nObjet conservant durablement des propriétés anormales documentées associées à une Fracture ou à une exposition Nebulinique.\n\nUn Artefact n’est pas nécessairement ancien. Il peut être manufacturé récemment.\n\n« Un Artefact n’est pas défini par ce qu’il est. Il est défini par ce qu’il continue de faire. »\n\nSes propriétés doivent rester cohérentes avec l’instabilité observée. Un même Artefact peut impliquer plusieurs Voiles.\n\nMANIPULATION\nDocumenter position, état initial, photographies, inventaire et personnes exposées.\nLimiter les interactions.\nNe pas tenter de reproduire une propriété sans autorisation.\n\nNE PAS DÉTRUIRE PAR DÉFAUT\nLa destruction peut supprimer une preuve, modifier une Fracture, retirer un stabilisateur inconnu ou provoquer une manifestation secondaire.\n\n« Un objet anormal n’est pas nécessairement la cause de l’anomalie. »\n\nANCRAGE\nMoyen matériel ou structurel reconnu ou employé par l’Ordre pour contribuer à la stabilisation d’une situation.\nUn Ancrage peut être installé, découvert ou préexistant.\n\nARTEFACT ≠ ANCRAGE\nLe premier conserve une propriété anormale.\nLe second contribue à la stabilité.\nUn même objet peut exceptionnellement relever des deux catégories.\n\nCAS A-19\nUne cassette récupérée en 1991 contient une phrase décrivant le déplacement futur d’une chaise. Lorsque la chaise est déplacée en 1993, quatre secondes supplémentaires deviennent audibles. Elles disparaissent lors du retrait de la chaise et reviennent lorsqu’elle est replacée.\nClassification : Causalité.\nConclusion : relation anormale confirmée ; direction causale inconnue.\n\nUn dispositif construit par l’Ordre pour mesurer ou interagir avec une instabilité n’est pas nécessairement un Artefact.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PHÉNOMÈNES / SUJETS BIOLOGIQUES\n\nUn Manifesté est un être vivant présentant une altération durable documentée à la suite d’une exposition à une Fracture.\n\nUn Manifesté demeure un individu.\n\nLa classification ne présume ni hostilité, ni perte de conscience, ni altération morale, ni dangerosité.\n\n« Un Manifesté doit être considéré comme un sujet avant d’être considéré comme un phénomène. »\n\nMANIFESTATION ≠ POSSESSION\nLes termes « possédé », « habité », « contrôlé par la Nebuline » ou « remplacé » ne constituent pas des classifications reconnues.\n\nSTABILITÉ\nCertains Manifestés demeurent parfaitement stables pendant de longues périodes.\nLa classification Manifesté ne justifie pas à elle seule un confinement.\n\nLes altérations peuvent concerner perception, mémoire, identité, relation au temps, lieux, objets, présence physique ou conservation des traces.\n[TYPOLOGIE COMPLÈTE : OMBRE II]\n\nPREMIER CONTACT\nÉtablir le danger immédiat.\nNe pas présumer l’hostilité.\nDocumenter séparément comportement et phénomène.\nÉviter toute exposition supplémentaire.\nNe jamais provoquer volontairement une Manifestation.\n\nLe confinement exige un risque documenté.\n\nCAS M-104\nSujet féminin, 34 ans lors de la première observation. Après une Fracture de Mémoire, elle peut restituer à la première personne les souvenirs détaillés qui lui sont racontés, tout en distinguant parfaitement ses propres souvenirs des souvenirs reçus.\n\n« Je sais lesquels sont à moi. Je ne sais simplement pas pourquoi j’ai les autres. »\n\nAucune agressivité. Aucune perte d’identité.\nDÉCISION — 1982 : ████████████████████\nNOTE — 1991 : DOSSIER ROUVERT.\nMOTIF : ████████████████", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PROCÉDURES / TERRAIN\n\nOBJECTIF\nÉtablir ce qui s’est produit, ce qui peut être prouvé, ce qui demeure incohérent et ce qui risque de changer.\n\n« L’explication vient après l’observation. »\n\nI — NE TOUCHEZ À RIEN\nEn l’absence de danger immédiat : ne déplacez pas, ne corrigez pas, ne reproduisez pas, ne détruisez pas.\n\nII — ÉTABLISSEZ L’OBSERVABLE\nDécrivez des faits, pas une explication.\n\nIII — SÉPAREZ LES SOURCES\nOBSERVATION — constat direct.\nTÉMOIGNAGE — déclaration d’un tiers.\nMÉMOIRE — souvenir d’un individu.\nPREUVE — élément examinable indépendamment.\nINTERPRÉTATION — conclusion.\n\nIV — IDENTIFIEZ LA DIVERGENCE\n« Qu’est-ce qui devrait être vrai ici, mais ne l’est pas ? »\n\nV — TESTEZ SANS PROVOQUER\nComparer, mesurer passivement, confronter des sources indépendantes et consulter les Archives.\n« Vérifier n’est pas provoquer. »\n\nVI — ÉVALUEZ LES VOILES\nConscience / Mémoire / Causalité / Histoire.\nOmbres : signalement uniquement.\n\nVII — RECHERCHEZ LA PERSISTANCE\nFracture active ? Artefact potentiel ? Manifesté potentiel ? Anomalie résiduelle ?\n\nVIII — PRÉSERVEZ\nPersonnes, preuves, traces et Ancrages.\n\nIX — TRANSMETTEZ\nFAITS CONFIRMÉS / NON CONFIRMÉS / DIVERGENCES / VOILES SUSPECTÉS / RISQUES / ÉLÉMENTS PERSISTANTS / ACTION RECOMMANDÉE.\n\n« JE NE SAIS PAS » est une conclusion acceptable.\n\nPROTOCOLE D’INCOHÉRENCE\nSi les preuves sont incompatibles avec la doctrine connue :\nINCOHÉRENCE DOCTRINALE\nConsignez-la. Ne modifiez pas les preuves pour restaurer la doctrine.\n\n« La doctrine organise les observations. Elle ne remplace pas les observations. »\n\nSIGNALEMENT PRIORITAIRE\nDanger vital, évolution rapide, disparition d’un agent, modification inexpliquée d’un Ancrage, atteinte multi-Voiles, suspicion Ombres ou phénomène semblant réagir spécifiquement à l’observateur.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : PROCÉDURES / INVESTIGATION\n\nDans une situation instable, la preuve elle-même peut devenir instable.\n\nRÈGLE DES TROIS TRACES\nTout élément critique doit, lorsque possible, être documenté sous au moins trois formes indépendantes.\n\nOn ne multiplie pas les preuves parce qu’elles sont fiables.\nOn les multiplie parce qu’elles peuvent cesser d’être d’accord.\n\nAucune hiérarchie absolue n’existe entre photographie, document, témoignage ou mémoire.\n\nHORODATAGE\nConsigner découverte, enregistrement, collecteur, position, état initial et modifications.\nNe jamais corriger une divergence d’horodatage sans préserver les valeurs originales.\n\nDOCUMENTS\nNe jamais annoter l’original.\nIdentifier toute COPIE, TRANSCRIPTION ou RECONSTITUTION.\n\nIMAGE / VIDÉO\nSi l’enregistrement diverge de l’observation :\nDIVERGENCE OBSERVATION / ENREGISTREMENT\n\nAUDIO\nDécrire une voix non identifiée avant d’interpréter son origine.\n\nMÉMOIRE\nRecueillir le témoignage avant confrontation avec les autres sources lorsque possible.\nUne mémoire divergente peut être la dernière trace d’un état antérieur.\n\nINVENTAIRE\nChaque pièce reçoit une référence unique.\nExemple : D001-P01 / D001-A01 / D001-T01.\n\nPREUVE DISPARUE\nNe jamais supprimer sa référence.\nÉLÉMENT ABSENT\nou\nORIGINE DE RÉFÉRENCE NON ÉTABLIE\n\nCHAÎNE DE CONSERVATION\nToute transmission doit être enregistrée.\nUne rupture de chaîne peut elle-même constituer une donnée opérationnelle.\n\nRÈGLE FINALE\n« Ne cherchez pas la preuve qui confirme votre hypothèse.\nCherchez la preuve qui devrait exister si votre hypothèse était fausse. »", "CLASSIFICATION : OMBRE I\nCATÉGORIE : HISTOIRE / RÉFÉRENCE\nÉDITION : ABRÉGÉE\n\nCette chronologie n’est pas l’intégralité des archives.\nCertaines dates sont approximatives, certaines entrées abrégées ou retirées.\n\n~1280 — Premières « Taches Noires ». Environ 1 280 occurrences historiques classifiées rétrospectivement.\n\nDÉBUT XIVe — Émergence de l’Ordre. La date exacte de constitution demeure discutée dans les archives accessibles.\n[DOSSIER DE FONDATION : OMBRE III]\n\n1347 — Grande Peste. Corrélations locales avec des phénomènes aujourd’hui associés aux Fractures. Causalité générale non établie.\n\n1350 — Premiers dossiers biologiques correspondant aux futures classifications de Manifestés.\n\n1478 — GRANDE PURGE. Destruction et réorganisation documentaire majeure.\nMOTIF OFFICIEL : PRÉSERVATION DE LA CONTINUITÉ.\n\n1520 — Formalisation des cinq Divisions.\n\n1633 — INCIDENT CALDERÓN. Une expérimentation dirigée par Ruiz Calderón entraîne trente morts. Certaines utilisations actives de phénomènes Nebuliniques sont ensuite interdites.\n\n1740 — Révision des protocoles relatifs aux Manifestés. Certains sont employés en surveillance et reconnaissance. Ces pratiques ne correspondent plus aux protocoles contemporains.\n\n1791 — Fragment : « Cinq Ombres… mais une seulement restera. »\nOrigine contestée. Interprétation officielle : aucune.\n\n1864 — INCIDENT LANTERNUM. 8 Initiés engagés, 0 récupéré, divergence de 7 minutes.\n\n1915 — Augmentation d’instabilités dans plusieurs zones de conflit.\n\n1947 — PACTE DU SILENCE. Protocoles internationaux de limitation de l’exposition publique.\n\n1972 — DÉFECTIONS. Plusieurs membres quittent simultanément l’Ordre et emportent des archives.\n\n1991 — Augmentation durable d’incidents relevant de classifications Ombres.\n[DÉTAILS : ACCÈS REFUSÉ]\n\n2003 — INCIDENT DES ARCHIVES FRAGMENTÉES. Une partie des archives internes est soustraite au contrôle de l’Ordre. Récupération incomplète.\n\nDEPUIS 2021 — SATURATION NEBULAIRE. Hausse durable du nombre, de la fréquence et de la complexité de certaines anomalies. Cause non établie.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : GÉOGRAPHIE / ORGANISATION\n\nL’Ordre opère au moyen d’un réseau décentralisé de cellules, sites d’observation, dépôts documentaires et Bastions.\n\nUn Bastion est une implantation majeure disposant de capacités permanentes de coordination et d’intervention.\n\nBASTIONS INDEXÉS OMBRE I\n— FLORENCE\n— PRAGUE\n— ISTANBUL\n— KYOTO\n— MONTRÉAL\n— DAKAR\n\nLes coordonnées précises, effectifs, capacités et responsabilités spécifiques sont compartimentés.\n\nL’appartenance à une Division ne correspond pas à un Bastion.\nLes cinq Divisions peuvent opérer à travers plusieurs implantations.\n\nUne mission peut être administrativement rattachée à un Bastion différent de la localisation physique de l’Initié.\n\n[MODULE CARTOGRAPHIQUE : EN PRÉPARATION]", "CLASSIFICATION : OMBRE I\nCATÉGORIE : GÉOGRAPHIE / PHÉNOMÈNES\n\nUne zone surveillée ne constitue pas nécessairement une Fracture active.\n\nANCRAGES SURVEILLÉS\nNAPLES — activité historique complexe. [OMB I : DONNÉES PARTIELLES]\nHAÏTI — phénomènes documentaires, mémoriels et historiques récurrents.\nTCHERNOBYL — surveillance renforcée. Toute corrélation historique/Nebuline demeure non établie sans dossier autorisé.\nBRUNIQUEL — relevés historiques et anomalies de continuité.\n\nANCRAGES À FORTE STABILITÉ\nROME\nJÉRUSALEM\nSHANGHAI\nNEW YORK\n\nLa cause de cette stabilité n’est pas accessible au niveau OMBRE I.\n\nCOULOIRS NEBULINIQUES\nCertaines archives décrivent des phénomènes de continuité entre zones géographiquement éloignées.\n\nZones indexées :\nSAHARA\nAMAZONIE\nTSINGY DE L’ANKARANA\n\n[DÉFINITION : OMBRE II]\n[CARTOGRAPHIE : DONNÉES PARTIELLES]\n\n17 RÉFÉRENCES CARTOGRAPHIQUES SONT ACTUELLEMENT AUTORISÉES AU NIVEAU OMBRE I.", "CLASSIFICATION : OMBRE I\nCATÉGORIE : INCIDENTS / HISTORIQUE\nSTATUT : CLOS — REPRODUCTION INTERDITE\n\nLANTERNUM désigne un dispositif expérimental employé par l’Ordre en 1864 dans le cadre de l’observation contrôlée d’un phénomène Nebulinique.\n\nPERSONNEL ENGAGÉ : 8 INITIÉS\nPERSONNEL RÉCUPÉRÉ : 0\nDIVERGENCE DOCUMENTÉE : 00:07:00\nSTATUT DU SITE : ACCÈS INTERDIT\n\nCHRONOLOGIE PARTIELLE\n21:03:14 — Activation.\n21:04:02 — Huit Initiés en position.\n21:04:19 — Première divergence instrumentale.\n21:04:31 — Perte simultanée de plusieurs mesures.\n21:04:██ — ████████████████████\n21:11:██ — Reprise des systèmes.\n\nAucune source exploitable ne permet d’établir ce qui s’est produit pendant l’intervalle.\nAucune sortie n’est enregistrée.\n\nRECHERCHE\n0 corps.\n0 survivant.\n0 sortie documentée.\n\nClassification officielle : DISPARITION EN CONTEXTE DE FRACTURE.\nDécès non confirmé.\n\nLE DISPOSITIF\nConstruit intentionnellement, destiné à interagir avec des conditions Nebuliniques, utilisé dans un environnement contrôlé et non classifié comme Artefact lors de son inventaire initial.\n\n[ARCHITECTURE : OMBRE III]\n[PRINCIPES DE FONCTIONNEMENT : OMBRE III]\n[OBJECTIF COMPLET : OMBRE III]\n\nANNEXES RÉPERTORIÉES : 11\nACCESSIBLES OMBRE I : 0\n\nToute pièce, transcription, composant ou référence Lanternum absente de l’index actuel doit être signalée immédiatement.\n\nCAUSE : NON ACCESSIBLE\nDESTINATION DES INITIÉS : INCONNUE\nNATURE DES SEPT MINUTES : NON ÉTABLIE\nREPRODUCTION : FORMELLEMENT INTERDITE", "CLASSIFICATION : OMBRE I\nCATÉGORIE : RAPPORTS / INTERVENTION\nSTATUT : CLOS\nDATE : 18.04.2024\nSITE : ████████ / FRANCE\nÉQUIPE : 3 AGENTS\n\nSIGNALEMENT\nTrois lettres sont adressées à l’ancienne occupante d’une maison, décédée en 2018. Les cachets postaux datent de 2024. Aucun expéditeur.\n\nLETTRE 01 : « La fuite commence dans la cuisine. »\nUne fuite survient deux jours plus tard.\n\nLETTRE 02 : « Ne laissez pas la fenêtre ouverte jeudi. »\nUne tempête endommage la fenêtre le jeudi suivant.\n\nLETTRE 03 : « Il faudra déplacer l’armoire. »\nAucun événement correspondant.\n\nCOLLECTE\nChaque lettre est conservée, photographiée et transcrite indépendamment.\n\nDIVERGENCE\nÀ 17:21, Lettre 03 :\n« Merci d’avoir déplacé l’armoire. »\nLes photographies et transcriptions conservent la formulation initiale.\nL’armoire n’a pas été déplacée.\n\nCAUSALITÉ SUSPECTÉE.\n\nUne inspection non invasive révèle une cavité derrière l’armoire, absente des plans.\nLe propriétaire affirme avoir toujours signalé qu’il ne fallait jamais déplacer l’armoire. Les enregistrements contredisent cette affirmation.\n\nRECLASSIFICATION : CAUSALITÉ / MÉMOIRE SUSPECTÉE.\n\nDÉCISION\nL’armoire n’est pas déplacée.\nSurveillance passive.\nAucune tentative de provoquer une quatrième lettre.\n\nJ+14 : Lettre 03 retrouve sa formulation originale.\nJ+30 : aucune nouvelle lettre.\n\nSTATUT : STABILISÉ / SURVEILLANCE.\n\nINVENTAIRE FINAL\nP01 à P10 — pièces transférées : 10.\n\nCONTRÔLE DE DÉPÔT\nPIÈCES RÉCEPTIONNÉES : 11.\n\nP11 — ENVELOPPE 04\nÉTAT : FERMÉE\nDESTINATAIRE : ████████████████\nCACHET : 18.04.2027\n\nOUVERTURE : NON AUTORISÉE\nDOSSIER : CLOS"];

function initiateArchives(){
 shell(`<h1 class="title">ARCHIVES</h1><div class="archive-head">ACCRÉDITATION ACTIVE // OMBRE I<br>${OMBRE1_ARCHIVES.length} DOCUMENTS CONSULTABLES // RÉFÉRENCES SUPÉRIEURES COMPARTIMENTÉES</div><div class="carto-launch"><button class="btn carto-main-btn" onclick="openCartography()">[ OUVRIR CARTOGRAPHIE OPÉRATIONNELLE ]</button><small>17 RÉFÉRENCES CARTOGRAPHIQUES AUTORISÉES // OMBRE I</small></div><div class="archive-list">${OMBRE1_ARCHIVES.map((a,i)=>`<button onclick="openArchive(${i})"><code>${a[0]}</code><b>${a[1]}</b><span>CONSULTABLE</span></button>`).join('')}<div class="locked-archive"><code>OII-MAN-001</code><b>TYPOLOGIE DES MANIFESTÉS</b><span>ACCÈS OMBRE II REQUIS</span></div><div class="locked-archive"><code>OII-███-███</code><b>RÉFÉRENCE RESTREINTE</b><span>ACCÈS OMBRE II REQUIS</span></div><div class="locked-archive"><code>OIII-HIS-00</code><b>INCIDENT FONDATEUR</b><span>ACCÈS OMBRE III REQUIS</span></div><div class="locked-archive"><code>█████████</code><b>████████████████</b><span>ACCÈS REFUSÉ</span></div></div><button class="btn" onclick="initBack()">[ RETOUR ]</button>`,'ARCHIVES // OMBRE I');
}
function openArchive(i){
 const a=OMBRE1_ARCHIVES[i], body=OMBRE1_BODIES[i]||'CONTENU INDISPONIBLE.';
 shell(`<div class="archive-doc"><code>${a[0]}</code><h1>${a[1]}</h1><div class="doc-stamp">DIFFUSION AUTORISÉE // OMBRE I</div><pre>${body}</pre></div><button class="btn" onclick="initiateArchives()">[ RETOUR AUX ARCHIVES ]</button>`,'ARCHIVES // CONSULTATION');
}


const CARTO_SITES=[
{id:'BST-FLR-01',name:'FLORENCE',kind:'bastion',lat:43.7696,lon:11.2558,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Coordonnées internes, effectifs et capacités : accès restreint.'},
{id:'BST-PRG-02',name:'PRAGUE',kind:'bastion',lat:50.0755,lon:14.4378,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Dossiers associés : aucun dossier autorisé au niveau actuel.'},
{id:'BST-IST-03',name:'ISTANBUL',kind:'bastion',lat:41.0082,lon:28.9784,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Responsabilités spécifiques : compartimentées.'},
{id:'BST-KYO-04',name:'KYOTO',kind:'bastion',lat:35.0116,lon:135.7681,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Capacités permanentes confirmées. Détails non autorisés.'},
{id:'BST-MTL-05',name:'MONTRÉAL',kind:'bastion',lat:45.5019,lon:-73.5674,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Implantation majeure du réseau. Effectifs : accès restreint.'},
{id:'BST-DKR-06',name:'DAKAR',kind:'bastion',lat:14.7167,lon:-17.4677,status:'ACTIF',type:'IMPLANTATION MAJEURE',activity:'OPÉRATIONNELLE',note:'Implantation majeure du réseau. Fonctions spécifiques : compartimentées.'},
{id:'ANC-NAP-01',name:'NAPLES',kind:'watch',lat:40.8518,lon:14.2681,status:'SOUS SURVEILLANCE',type:'ANCRAGE',activity:'DOCUMENTÉE',note:'Activité historique complexe. Données OMBRE I partielles.'},
{id:'ANC-HTI-02',name:'HAÏTI',kind:'watch',lat:18.9712,lon:-72.2852,status:'SOUS SURVEILLANCE',type:'ANCRAGE',activity:'DOCUMENTÉE',note:'Phénomènes documentaires, mémoriels et historiques récurrents.'},
{id:'ANC-TCH-03',name:'TCHERNOBYL',kind:'watch',lat:51.2763,lon:30.2219,status:'SURVEILLANCE RENFORCÉE',type:'ANCRAGE',activity:'DOCUMENTÉE',note:'Toute corrélation entre les événements historiques connus et l’activité Nebulinique demeure non établie à votre niveau.'},
{id:'ANC-BRU-04',name:'BRUNIQUEL',kind:'watch',lat:44.0556,lon:1.6658,status:'SOUS SURVEILLANCE',type:'ANCRAGE',activity:'DOCUMENTÉE',note:'Relevés historiques et anomalies de continuité.'},
{id:'STB-ROM-01',name:'ROME',kind:'stable',lat:41.9028,lon:12.4964,status:'STABILITÉ FORTE',type:'ANCRAGE',activity:'STABLE',note:'Cause de la stabilité : accès OMBRE II requis.'},
{id:'STB-JRS-02',name:'JÉRUSALEM',kind:'stable',lat:31.7683,lon:35.2137,status:'STABILITÉ FORTE',type:'ANCRAGE',activity:'STABLE',note:'Cause de la stabilité : accès OMBRE II requis.'},
{id:'STB-SHA-03',name:'SHANGHAI',kind:'stable',lat:31.2304,lon:121.4737,status:'STABILITÉ FORTE',type:'ANCRAGE',activity:'STABLE',note:'Cause de la stabilité : accès OMBRE II requis.'},
{id:'STB-NYC-04',name:'NEW YORK',kind:'stable',lat:40.7128,lon:-74.0060,status:'STABILITÉ FORTE',type:'ANCRAGE',activity:'STABLE',note:'Cause de la stabilité : accès OMBRE II requis.'},
{id:'COR-SAH-01',name:'SAHARA',kind:'corridor',lat:23.4,lon:13.0,status:'DONNÉES PARTIELLES',type:'COULOIR NEBULINIQUE',activity:'SURVEILLANCE',note:'Zone diffuse. Définition et topologie : accès OMBRE II requis.',rx:9,ry:6},
{id:'COR-AMZ-02',name:'AMAZONIE',kind:'corridor',lat:-4.0,lon:-62.0,status:'DONNÉES PARTIELLES',type:'COULOIR NEBULINIQUE',activity:'SURVEILLANCE',note:'Zone diffuse. Aucune limite géographique précise n’est reconnue au niveau OMBRE I.',rx:10,ry:7},
{id:'COR-TSG-03',name:'TSINGY DE L’ANKARANA',kind:'corridor',lat:-12.9,lon:49.1,status:'DONNÉES PARTIELLES',type:'COULOIR NEBULINIQUE',activity:'SURVEILLANCE',note:'Zone diffuse. Données topologiques incomplètes.',rx:5,ry:5}
];
const CARTO_FILTERS={bastion:true,watch:true,stable:true,corridor:true,mission:true};
let cartoZoom=1, cartoPanX=0, cartoPanY=0, cartoDrag=null;

function projectWorld(lat,lon){return {x:(lon+180)/360*1000,y:(90-lat)/180*500};}
function cartoKindLabel(k){return ({bastion:'BASTION',watch:'ANCRAGE SURVEILLÉ',stable:'STABILITÉ FORTE',corridor:'COULOIR NEBULINIQUE',mission:'DOSSIER PERSONNEL'})[k]||k;}
function worldPath(){
 return `<path d="M72 128 L103 88 151 67 207 72 239 102 221 132 185 144 174 177 147 184 128 225 104 214 91 172 58 157 Z
 M245 225 L277 239 298 281 288 337 266 386 246 360 238 310 220 270 Z
 M451 91 L487 66 537 71 558 92 602 87 640 102 690 90 748 102 798 119 846 110 903 132 927 161 892 178 848 171 815 196 774 193 744 216 704 211 675 187 638 190 604 171 572 181 544 163 513 172 488 149 461 153 438 126 Z
 M493 177 L536 179 571 209 583 253 566 304 542 350 518 343 506 300 486 261 473 215 Z
 M822 326 L861 315 891 338 884 371 848 379 817 356 Z
 M930 229 L944 219 952 233 944 248 Z" />`;
}
function openCartography(){
 shell(`<div class="carto-shell">
 <div class="carto-top"><div><h1>CARTOGRAPHIE OPÉRATIONNELLE</h1><p>RÉSEAU OCI // ACCRÉDITATION OMBRE I</p></div><div class="carto-count"><b>17</b><span>RÉFÉRENCES AUTORISÉES</span></div></div>
 <div class="carto-tools">
 <button onclick="cartoToggle('bastion',this)" class="on">◆ BASTIONS</button>
 <button onclick="cartoToggle('watch',this)" class="on">◇ SURVEILLANCE</button>
 <button onclick="cartoToggle('stable',this)" class="on">□ STABILITÉ</button>
 <button onclick="cartoToggle('corridor',this)" class="on">░ COULOIRS</button>
 <button onclick="cartoReset()">CENTRER</button>
 </div>
 <div class="carto-stage" id="cartoStage">
   <svg id="cartoMap" viewBox="0 0 1000 500" role="img" aria-label="Carte opérationnelle mondiale">
     <g id="cartoViewport">
       <rect class="ocean" x="0" y="0" width="1000" height="500"/>
       <g class="grid">${[100,200,300,400,500,600,700,800,900].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="500"/>`).join('')}${[100,200,300,400].map(y=>`<line x1="0" y1="${y}" x2="1000" y2="${y}"/>`).join('')}</g>
       <g class="continents">${worldPath()}</g>
       <g id="cartoMarkers"></g>
     </g>
   </svg>
   <div class="carto-zoom"><button onclick="cartoZoomBy(1.25)">+</button><button onclick="cartoZoomBy(.8)">−</button></div>
   <div class="carto-coord">OCI // PROJECTION OPÉRATIONNELLE // DONNÉES PARTIELLES</div>
 </div>
 <div id="cartoPanel" class="carto-panel"><div class="carto-empty">SÉLECTIONNEZ UNE RÉFÉRENCE CARTOGRAPHIQUE</div></div>
 <div class="carto-foot"><span>Les zones non autorisées ne sont pas affichées.</span><button class="btn" onclick="initiateArchives()">[ RETOUR AUX ARCHIVES ]</button></div>
 </div>`,'CARTOGRAPHIE // OMBRE I');
 cartoBind(); cartoRender();
}
function cartoRender(){
 const g=document.getElementById('cartoMarkers'); if(!g)return;
 g.innerHTML=CARTO_SITES.filter(s=>CARTO_FILTERS[s.kind]).map(s=>{
  const p=projectWorld(s.lat,s.lon);
  if(s.kind==='corridor') return `<g class="marker corridor" onclick="cartoSelect('${s.id}')"><ellipse cx="${p.x}" cy="${p.y}" rx="${(s.rx||6)*3}" ry="${(s.ry||5)*2.3}"/><text x="${p.x}" y="${p.y-18}">${s.name}</text></g>`;
  const sym=s.kind==='bastion'?'◆':s.kind==='watch'?'◇':'□';
  return `<g class="marker ${s.kind}" onclick="cartoSelect('${s.id}')"><circle cx="${p.x}" cy="${p.y}" r="13"/><text class="symbol" x="${p.x}" y="${p.y+5}">${sym}</text><text class="label" x="${p.x+17}" y="${p.y-9}">${s.name}</text></g>`;
 }).join('');
 cartoTransform();
}
function cartoSelect(id){
 const s=CARTO_SITES.find(x=>x.id===id); if(!s)return;
 const panel=document.getElementById('cartoPanel');
 panel.innerHTML=`<button class="carto-close" onclick="cartoClosePanel()">×</button><code>${s.id}</code><div class="carto-type">${cartoKindLabel(s.kind)}</div><h2>${s.name}</h2><dl><dt>STATUT</dt><dd>${s.status}</dd><dt>TYPE</dt><dd>${s.type}</dd><dt>ACTIVITÉ</dt><dd>${s.activity}</dd><dt>COORDONNÉES</dt><dd>${Math.abs(s.lat).toFixed(2)}° ${s.lat>=0?'N':'S'} // ${Math.abs(s.lon).toFixed(2)}° ${s.lon>=0?'E':'O'}</dd></dl><p>${s.note}</p><div class="restricted">DOSSIERS ASSOCIÉS<br>[ ACCÈS RESTREINT / SELON AUTORISATION ]</div>`;
 panel.classList.add('open');
}
function cartoClosePanel(){const p=document.getElementById('cartoPanel');if(p){p.classList.remove('open');p.innerHTML='<div class="carto-empty">SÉLECTIONNEZ UNE RÉFÉRENCE CARTOGRAPHIQUE</div>';}}
function cartoToggle(k,b){CARTO_FILTERS[k]=!CARTO_FILTERS[k];b.classList.toggle('on',CARTO_FILTERS[k]);cartoRender();}
function cartoZoomBy(f){cartoZoom=Math.max(1,Math.min(5,cartoZoom*f));cartoTransform();}
function cartoReset(){cartoZoom=1;cartoPanX=cartoPanY=0;cartoTransform();}
function cartoTransform(){const v=document.getElementById('cartoViewport');if(v)v.setAttribute('transform',`translate(${cartoPanX} ${cartoPanY}) scale(${cartoZoom})`);}
function cartoBind(){
 const st=document.getElementById('cartoStage'); if(!st)return;
 st.addEventListener('wheel',e=>{e.preventDefault();cartoZoomBy(e.deltaY<0?1.15:.87)},{passive:false});
 st.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('.marker'))return;cartoDrag={x:e.clientX,y:e.clientY,px:cartoPanX,py:cartoPanY};st.setPointerCapture(e.pointerId);});
 st.addEventListener('pointermove',e=>{if(!cartoDrag)return; const r=st.getBoundingClientRect(); cartoPanX=cartoDrag.px+(e.clientX-cartoDrag.x)*1000/r.width;cartoPanY=cartoDrag.py+(e.clientY-cartoDrag.y)*500/r.height;cartoTransform();});
 st.addEventListener('pointerup',()=>cartoDrag=null); st.addEventListener('pointercancel',()=>cartoDrag=null);
 let pinch=null;
 st.addEventListener('touchstart',e=>{if(e.touches.length===2){pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);}},{passive:true});
 st.addEventListener('touchmove',e=>{if(e.touches.length===2&&pinch){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); if(Math.abs(d-pinch)>12){cartoZoomBy(d>pinch?1.08:.93);pinch=d;}}},{passive:true});
}

function initiateProfile(){
 shell(`<h1 class="title">DOSSIER PERSONNEL</h1>
 <div class="profile-sheet">
 <div><span>STATUT</span><b>INITIÉ</b></div><div><span>ACCRÉDITATION</span><b>OMBRE I</b></div>
 <div><span>DIVISION</span><b>${S.affectation}</b></div><div><span>MATRICULE</span><b>${S.matricule}</b></div>
 <div><span>DATE D'INITIATION</span><b>${S.initiationDate||'ENREGISTRÉE'}</b></div>
 </div>
 <div class="classified-block"><div class="eyebrow">RECRUTEMENT</div><h2>DOSSIER 000 // CLÔTURÉ</h2>
 <p>ÉVALUATION I — VALIDÉE<br>ÉVALUATION II — VALIDÉE<br>ÉVALUATION III — VALIDÉE<br>ÉVALUATION IV — VALIDÉE<br>ÉVALUATION V — VALIDÉE</p></div>
 <div class="profile-restricted"><b>PROFIL D'APTITUDE</b><span>[ACCÈS RESTREINT]</span></div>
 <div class="profile-restricted"><b>MOTIF D'AFFECTATION</b><span>[ACCÈS OMBRE II REQUIS]</span></div>
 <button class="btn" onclick="initBack()">[ RETOUR ]</button>`,'DOSSIER PERSONNEL // INITIÉ');
}
function home(){
  if(S.serment||S.statut==='INITIÉ'){ if(!S.initieAccueilVu){initiateFirstEntry();return} initiateHome();return }

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
        <div class="identity-version">OCI-TERM V1.8.0 &nbsp;&nbsp;|&nbsp;&nbsp; PROTOCOLE 000</div>
      </aside>
      <section class="main-console">
        <header class="home-head"><div><h1>TERMINAL // ACCÈS CANDIDAT</h1><div class="tiny">RÉSEAU SÉCURISÉ // NIVEAU 0</div></div><div class="head-meta">${stamp}<br>CONNEXION SÉCURISÉE</div></header>
        <div class="home-kv">
          <div class="datum"><div class="datum-label">CANDIDAT</div><div class="datum-value">${S.matricule}</div></div>
          <div class="datum"><div class="datum-label">STATUT</div><div class="datum-value">${S.serment?'INITIÉ':(S.affectationDone?'AFFECTÉ':'EN ÉVALUATION')}</div></div>
          <div class="datum"><div class="datum-label">ACCRÉDITATION</div><div class="datum-value">${S.serment?'OMBRE I':'0'}</div></div>
          <div class="datum"><div class="datum-label">AFFECTATION</div><div class="datum-value">${S.affectationDone?S.affectation:'—'}</div></div>
        </div>
        <div class="home-menu">
          <button class="nav-card" data-go="dossier"><span class="nav-mark">▱</span><span class="nav-title">DOSSIER 000</span><span class="nav-sub">RECRUTEMENT</span><span class="nav-arrow">›</span><span class="nav-index">01</span></button>
          <button class="nav-card" data-go="evals"><span class="nav-mark">◉</span><span class="nav-title">ÉVALUATIONS</span><span class="nav-sub">${S.progression} / 5</span><span class="nav-arrow">›</span><span class="nav-index">02</span></button>
          <button class="nav-card" data-go="messages"><span class="nav-mark">□</span><span class="nav-title">MESSAGERIE</span><span class="nav-sub">${S.messages?S.messages+' NOUVEAU MESSAGE':'AUCUN NOUVEAU MESSAGE'}</span><span class="nav-arrow">›</span><span class="nav-index">03</span></button>
          <button class="nav-card" data-go="archives"><span class="nav-mark">≡</span><span class="nav-title">ARCHIVES</span><span class="nav-sub">ACCÈS REFUSÉ</span><span class="nav-arrow">›</span><span class="nav-index">04</span></button>
          ${S.eval5.complete&&!S.affectationDone?`<button class="nav-card assignment-card" id="assignment"><span class="nav-mark">◇</span><span class="nav-title">AFFECTATION</span><span class="nav-sub">PROCÉDURE DISPONIBLE</span><span class="nav-arrow">›</span><span class="nav-index">05</span></button>`:''}
          ${S.affectationDone&&!S.serment&&S.sermentDisponible?`<button class="nav-card oath-resume-card" id="resumeOath"><span class="nav-mark">◇</span><span class="nav-title">SERMENT</span><span class="nav-sub">VALIDATION EN ATTENTE</span><span class="nav-arrow">›</span><span class="nav-index">05</span></button>`:''}
          <button class="nav-card" data-go="profile"><span class="nav-mark">○</span><span class="nav-title">PROFIL</span><span class="nav-sub">${S.matricule}</span><span class="nav-arrow">›</span><span class="nav-index">${S.eval5.complete&&!S.affectationDone?'06':'05'}</span></button>
          <button class="nav-card" id="assist"><span class="nav-mark">⌁</span><span class="nav-title">ASSISTANCE</span><span class="nav-sub">SOLLICITER LE SUPERVISEUR</span><span class="nav-arrow">›</span><span class="nav-index">06</span></button>
        </div>
        <footer class="home-footer"><div><strong>ÉTAT DU RÉSEAU : STABLE</strong><br>DERNIÈRE SYNCHRONISATION : ${stamp}</div><div>VOIR CE QUI N’EXISTE PAS ENCORE.<br>—</div></footer>
      </section>
    </div>
    <div class="status">PROTOCOLE ACTIF : 000 <span class="tag">SYS // SESSION : 1</span></div>
  </section>`;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>views[b.dataset.go]());
  document.querySelector('#assist').onclick=assistance;
  const assignment=$('#assignment'); if(assignment)assignment.onclick=assignmentStart;
  const resumeOath=$('#resumeOath'); if(resumeOath)resumeOath.onclick=assignmentOathAuthorize;
}
const back=()=>`<button class="btn back" id="back">[ RETOUR ]</button>`;function wireBack(){let b=$('#back');if(b)b.onclick=home}
function dossier(){if(S.inventaire===null){shell(`<h1 class="title">DOSSIER 000</h1><div class="kv"><b>DÉSIGNATION</b><span>RECRUTEMENT</span><b>STATUT</b><span>ACTIF</span><b>OBJECTIF</b><span>ÉVALUATION DU CANDIDAT</span><b>MODULES</b><span>5</span></div><div class="rule"></div><p class="sub">INSTRUCTION ACTIVE</p><div class="terminal">PROCÉDER À L'INVENTAIRE DU MATÉRIEL REÇU.</div><div class="menu"><button class="btn primary" id="start">[ COMMENCER ]</button></div>${back()}`);$('#start').onclick=inventory;wireBack()}else{shell(`<h1 class="title">DOSSIER 000</h1><div class="terminal">INVENTAIRE : ENREGISTRÉ\nÉVALUATIONS : ${S.progression} / 5\n\nINSTRUCTION ACTIVE : ${S.progression? 'POURSUIVRE LE PROTOCOLE.' : 'PROCÉDER AU MODULE I.'}</div>${back()}`);wireBack()}}
function inventory(){shell(`<h1 class="title">CONTRÔLE DU MATÉRIEL</h1><div class="terminal">ÉLÉMENTS ATTENDUS : 09\n\nRetirez tous les éléments du colis avant de poursuivre.\n\nVotre inventaire est-il conforme ?</div><div class="menu"><button class="btn ans">[ CONFORME ]</button><button class="btn ans">[ NON CONFORME ]</button><button class="btn ans">[ INCERTAIN ]</button></div>`);document.querySelectorAll('.ans').forEach(b=>b.onclick=()=>{S.inventaire=b.textContent.replace(/[\[\]]/g,'').trim();save();shell(`<div class="terminal">RÉPONSE ENREGISTRÉE.\n\nPROCÉDEZ AU MODULE I.</div>`,'INVENTAIRE CONSIGNÉ');later(home,1100)})}
function evals(){
  let rows=[1,2,3,4,5].map(n=>{
    // Le module suivant dépend de la progression réelle, pas de l'état de l'inventaire.
    // Compatibilité avec les sauvegardes créées dans les versions précédentes.
    const effectiveProgress=Math.max(
      S.progression||0,
      S.eval1&&S.eval1.complete?1:0,
      S.eval2&&S.eval2.complete?2:0,
      S.eval3&&S.eval3.complete?3:0,
      S.eval4&&S.eval4.complete?4:0,
      S.eval5&&S.eval5.complete?5:0
    );
    let st=n<=effectiveProgress?'ENREGISTRÉ':n===effectiveProgress+1?'DISPONIBLE':'VERROUILLÉ';
    let active=((n===1||n===2||n===3||n===4||n===5) && st==='DISPONIBLE') ? ` data-eval="${n}" role="button" tabindex="0"` : '';
    const symbols=['division-1-oeil-fendu.png','division-2-flamme-inversee.png','division-3-main-cassee.png','division-4-spirale-os.png','division-5-sablier-noir.png'];
    return `<div class="eval ${active?'eval-open':''}"${active}><span class="eval-id"><img class="eval-symbol" src="${symbols[n-1]}" alt="">${['I','II','III','IV','V'][n-1]}</span><span class="eval-state">${st}${active?' &nbsp; ›':''}</span></div>`
  }).join('');
  shell(`<h1 class="title">ÉVALUATIONS</h1><div class="eval-list">${rows}</div><p class="sub evals-progress">PROGRESSION : ${S.progression} / 5</p>${back()}`);
  wireBack();
  const e1=document.querySelector('[data-eval="1"]');
  if(e1){e1.onclick=eval1Start;e1.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval1Start()}}}
  const e2=document.querySelector('[data-eval="2"]');
  if(e2){e2.onclick=eval2Start;e2.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval2Start()}}}
  const e3=document.querySelector('[data-eval="3"]');
  if(e3){e3.onclick=eval3Start;e3.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval3Start()}}}
  const e4=document.querySelector('[data-eval="4"]');
  if(e4){e4.onclick=eval4Start;e4.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval4Start()}}}
  const e5=document.querySelector('[data-eval="5"]');
  if(e5){e5.onclick=eval5Start;e5.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eval5Start()}}}
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
  narrativeProcessing(eval1Shell,[
    'LECTURE DES RÉPONSES...',
    'COMPARAISON DES OBSERVATIONS...',
    'VÉRIFICATION DE COHÉRENCE...',
    'INDEXATION DU MODULE I...'
  ],()=>{
    S.eval1.complete=true;S.progression=Math.max(S.progression,1);save();eval1CompleteScreen();
  },{
    title:'TRAITEMENT DU MODULE I...',
    status:'MODULE I // ANALYSE',
    anomaly:{html:'MARQUAGE : <span class="glitch-symbol">◈</span>',restore:'MARQUAGE : CONFORME',duration:1700},
    finalPause:1300
  });
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
  eval2Shell(`<p class="sub">PHASE 03 // CONTRÔLE</p>
<div class="memory-recall">
  <div class="memory-recall-title">RAPPEL // VOS RÉPONSES INITIALES</div>
  ${(()=>{
    const labels=[
      "01 — Le Renard qualifie d’abord le Corbeau de « joli ».",
      "02 — Le Renard emploie ensuite le mot « beau ».",
      "03 — Le mot « ramage » apparaît avant « plumage ».",
      "04 — Le Renard affirme parler « sans mentir ».",
      "05 — Le Corbeau tient le fromage dans son bec."
    ];
    const a=(S.eval2&&S.eval2.answers)||[];
    return labels.map((label,i)=>{
      const r=a[i]||{};
      const answer=r.answer||r.reponse||r.value||r.a||'—';
      const confidence=r.confidence||r.certitude||r.c||'—';
      return `<div class="memory-recall-row"><div class="memory-recall-label">${label}</div><div class="memory-recall-answer"><b>${answer}</b><span>${confidence}</span></div></div>`;
    }).join('');
  })()}
</div>
<div class="terminal">ROUVREZ LE MODULE.\n\nREPRENEZ II-A ET COMPAREZ LE DOCUMENT À VOS CINQ RÉPONSES.\n\nAVEZ-VOUS CONSTATÉ AU MOINS UNE DIVERGENCE ENTRE VOTRE SOUVENIR ET LE DOCUMENT ?</div><div class="menu"><button class="btn div2" data-v="OUI">[ OUI ]</button><button class="btn div2" data-v="NON">[ NON ]</button><button class="btn div2" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div>`);
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
  const rows=M2Q.map((item,i)=>{
    const ans=(S.eval2.memoryAnswers&&S.eval2.memoryAnswers[i])||'—';
    const conf=(S.eval2.confidence&&S.eval2.confidence[i])||'—';
    return `<div class="memory-card">
      <div class="memory-card-number">${String(i+1).padStart(2,'0')}</div>
      <div class="memory-card-body">
        <div class="memory-card-label">AFFIRMATION ${i+1}</div>
        <div class="memory-card-statement">${item.q}</div>
        <div class="memory-card-meta"><span>RÉPONSE : <b>${ans}</b></span><span>CONFIANCE : <b>${conf}</b></span></div>
      </div>
    </div>`;
  }).join('');
  eval2Shell(`<p class="sub">RÉVISION MNÉSIQUE</p>
  <div class="terminal">VOS CINQ AFFIRMATIONS INITIALES SONT RESTITUÉES AVEC VOS RÉPONSES ET VOTRE DEGRÉ DE CONFIANCE.</div>
  <div class="memory-cards">${rows}</div>
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
  narrativeProcessing(eval2Shell,[
    'RESTITUTION DES RÉPONSES...',
    'COMPARAISON MNÉSIQUE...',
    'RECROISEMENT DOCUMENTAIRE...',
    'MESURE DE STABILITÉ...'
  ],()=>{
    S.eval2.complete=true;S.progression=Math.max(S.progression,2);save();eval2CompleteScreen();
  },{
    title:'TRAITEMENT DU MODULE II...',
    status:'MODULE II // ANALYSE',
    anomaly:{html:'RESTITUTION MNÉSIQUE : <strong>6 / 5</strong>',restore:'RESTITUTION MNÉSIQUE : 5 / 5',duration:1900},
    finalPause:1500
  });
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
    materiel:"Le Module III contient III-A, III-B, six unités R et trois conséquences distinctes A, B et C. Chaque conséquence comporte une donnée de contrôle. Ne consultez une conséquence que sur autorisation.",
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
  eval3Shell(`<p class="sub">CONSÉQUENCE A // AUTORISÉE</p><div class="terminal">OUVREZ UNIQUEMENT L'ENVELOPPE A.\n\nPRENEZ CONNAISSANCE DE SON CONTENU.\n\nLE TERMINAL NE RESTITUERA PAS LA DONNÉE CONTENUE DANS LE DOCUMENT.\n\nSAISISSEZ LE CODE DE CONTRÔLE IMPRIMÉ SUR LA CONSÉQUENCE A.</div>
  <input id="m3codeA" class="input" autocomplete="off" autocapitalize="characters" placeholder="CODE DE CONTRÔLE">
  <button class="btn primary" id="m3validateA">[ VALIDER LA LECTURE ]</button><div id="m3feedbackA" class="system"></div>`);
  $('#m3validateA').onclick=()=>{
    const v=$('#m3codeA').value.trim().toUpperCase().replace(/\s/g,'');
    if(v==='F-04'||v==='F04'){
      $('#m3feedbackA').textContent='DOCUMENT A : LECTURE CONFIRMÉE.';
      setTimeout(()=>{S.eval3.step=4;save();eval3ReviseA()},650);
    }else $('#m3feedbackA').textContent='CODE NON CONFIRMÉ. VÉRIFIEZ LE DOCUMENT A.';
  };
}
function eval3ReviseA(){
  S.eval3.step=4;save();
  allocationWidget('PHASE 03 // RÉVISION','TENEZ COMPTE DE LA CONSÉQUENCE A QUE VOUS VENEZ DE CONSULTER. VOUS POUVEZ MAINTENIR OU MODIFIER VOTRE CHOIX.',()=>{S.eval3.step=5;save();eval3ConsequenceB()},'afterA_C');
}
function eval3ConsequenceB(){
  S.eval3.step=5;save();
  eval3Shell(`<p class="sub">CONSÉQUENCE B // AUTORISÉE</p><div class="terminal">OUVREZ UNIQUEMENT L'ENVELOPPE B.\n\nPRENEZ CONNAISSANCE DE SON CONTENU.\n\nSAISISSEZ LE CODE DE CONTRÔLE IMPRIMÉ SUR LA CONSÉQUENCE B.</div>
  <input id="m3codeB" class="input" autocomplete="off" autocapitalize="characters" placeholder="CODE DE CONTRÔLE">
  <button class="btn primary" id="m3validateB">[ VALIDER LA LECTURE ]</button><div id="m3feedbackB" class="system"></div>`);
  $('#m3validateB').onclick=()=>{
    const v=$('#m3codeB').value.trim().toUpperCase().replace(/\s/g,'');
    if(v==='C-03'||v==='C03'){
      $('#m3feedbackB').textContent='DOCUMENT B : LECTURE CONFIRMÉE.';
      setTimeout(eval3Impossible,650);
    }else $('#m3feedbackB').textContent='CODE NON CONFIRMÉ. VÉRIFIEZ LE DOCUMENT B.';
  };
}
function eval3Impossible(){
  const c=S.eval3.afterA_C,f=6-c;
  eval3Shell(`<p class="sub">PHASE 03 // ÉTAT DU DISPOSITIF</p><div class="terminal">CONSÉQUENCES A ET B : CONSULTÉES.\n\nRÉPARTITION ACTUELLE :\nC = ${c}\nF = ${f}\n\nAPRÈS APPLICATION SIMULTANÉE DES DEUX CONSÉQUENCES, L'OBJECTIF INITIAL PEUT-IL ÊTRE SATISFAIT AVEC LES SIX UNITÉS DISPONIBLES ?</div>
  <div class="menu"><button class="btn m3possible" data-v="OUI">[ OUI ]</button><button class="btn m3possible" data-v="NON">[ NON ]</button><button class="btn m3possible" data-v="?">[ INCERTAIN ]</button></div><div id="m3possibleFeedback" class="system"></div>`);
  document.querySelectorAll('.m3possible').forEach(b=>b.onclick=()=>{
    if(b.dataset.v==='NON'){
      $('#m3possibleFeedback').textContent='ANALYSE CONFIRMÉE. AUCUNE RÉPARTITION NE SATISFAIT SIMULTANÉMENT LES DEUX CONTRAINTES. L’INTERVENTION RESTE OBLIGATOIRE.';
      setTimeout(()=>{S.eval3.step=6;save();eval3Lock()},900);
    }else{
      $('#m3possibleFeedback').textContent='ANALYSE NON CONFIRMÉE. RELISEZ A ET B ET TENEZ COMPTE DU TOTAL FIXE DE SIX UNITÉS.';
    }
  });
}
function eval3Lock(){
  S.eval3.step=6;save();
  allocationWidget('PHASE 04 // DÉCISION','AUCUNE SOLUTION NE PRÉSERVE ENTIÈREMENT LES DEUX SUJETS. CHOISISSEZ LA RÉPARTITION QUE VOUS ACCEPTEZ DE RENDRE DÉFINITIVE.',()=>{S.eval3.step=7;save();eval3ConsequenceC()},'lockedC');
}
function eval3ConsequenceC(){
  S.eval3.step=7;save();
  eval3Shell(`<p class="sub">CONSÉQUENCE C // AUTORISÉE APRÈS VERROUILLAGE</p><div class="terminal">VOTRE DÉCISION EST ENREGISTRÉE.\n\nOUVREZ LA CONSÉQUENCE C.\nPRENEZ CONNAISSANCE DE SON CONTENU.\n\nINDIQUEZ LE DÉLAI D'EFFET MENTIONNÉ SUR LE DOCUMENT.</div>
  <input id="m3codeC" class="input" autocomplete="off" autocapitalize="characters" placeholder="DÉLAI D'EFFET">
  <button class="btn primary" id="m3validateC">[ TRANSMETTRE ]</button><div id="m3feedbackC" class="system"></div>`);
  $('#m3validateC').onclick=()=>{
    const v=$('#m3codeC').value.trim().toUpperCase().replace(/\s+/g,' ');
    if(v==='+1 CYCLE'||v==='1 CYCLE'||v==='+1CYCLE'||v==='1CYCLE'){
      $('#m3feedbackC').textContent='DONNÉE CONFIRMÉE.';
      setTimeout(eval3CausalAnalysis,650);
    }else $('#m3feedbackC').textContent='DONNÉE NON CONFIRMÉE. RELEVEZ LE DÉLAI EXACT SUR LA CONSÉQUENCE C.';
  };
}
function eval3CausalAnalysis(){
  eval3Shell(`<p class="sub">PHASE 05 // CHAÎNE CAUSALE</p><div class="terminal">CONSÉQUENCE C : CONSULTÉE.\n\nALLOCATION VERROUILLÉE :\nC = ${S.eval3.lockedC}\nF = ${6-S.eval3.lockedC}\n\nUNE CONSÉQUENCE DE VOTRE ACTION PRODUIT DÉSORMAIS UN EFFET SUR UN CYCLE ULTÉRIEUR.\n\nLE TERMINAL ENREGISTRE UNE EXTENSION DE LA CHAÎNE CAUSALE.</div><button class="btn primary" id="m3continueC">[ CONTINUER ]</button>`);
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
  narrativeProcessing(eval3Shell,[
    'LECTURE DE LA RÉPARTITION VERROUILLÉE...',
    'CALCUL DES EFFETS DIRECTS...',
    'PROPAGATION DES CONSÉQUENCES...',
    'ANALYSE DE LA CHAÎNE CAUSALE...',
    'VÉRIFICATION DE L’ORIGINE DE L’ACTION...'
  ],()=>{
    S.eval3.complete=true;S.eval3.step=11;S.progression=Math.max(S.progression,3);save();eval3CompleteScreen();
  },{
    title:'TRAITEMENT DU MODULE III...',
    status:'MODULE III // ANALYSE',
    anomaly:{html:'CONSÉQUENCE <strong>↓</strong> ACTION',restore:'ACTION ↓ CONSÉQUENCE',duration:1900},
    finalPause:1600
  });
}
function eval3CompleteScreen(){
  eval3Shell(`<div class="terminal">MODULE III\n\nSTATUT : ENREGISTRÉ\n\nAUCUNE SOLUTION OPTIMALE N'ÉTAIT ATTENDUE.\nLA DÉCISION ET SES CONSÉQUENCES ONT ÉTÉ CONSIGNÉES.\n\nLE MODULE IV EST DÉSORMAIS DISPONIBLE.</div><button class="btn primary" id="m3home">[ RETOUR AU TERMINAL ]</button>`,'MODULE III // ENREGISTRÉ');
  $('#m3home').onclick=home;
}

function eval4Shell(body,status='MODULE IV // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION IV</span><h1 class="title">MODULE IV</h1></div><img class="module-division-symbol" src="division-4-spirale-os.png" alt=""></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp4">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
  const h=$('#moduleHelp4');if(h)h.onclick=eval4Help;
}
function eval4Help(){
  eval4Shell(`<h2 class="sub">SUPERVISION — IV</h2><div class="terminal">SÉLECTIONNEZ LE MOTIF.</div><div class="menu">
  <button class="btn hint4" data-h="instruction">> INSTRUCTION INCOMPRISE</button>
  <button class="btn hint4" data-h="materiel">> MATÉRIEL NON IDENTIFIÉ</button>
  <button class="btn hint4" data-h="blocage">> BLOCAGE DANS LE PROTOCOLE</button>
  <button class="btn hint4" data-h="irregularite">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="hintText4" class="msg"></div><button class="btn" id="resume4">[ REPRENDRE LE MODULE ]</button>`,'SUPERVISION // MODULE IV');
  const map={
    instruction:"Reconstituez l'ordre des cinq événements à partir de III-A... Correction : du document IV-A. Le Terminal n'évaluera que la séquence transmise.",
    materiel:"Le Module IV contient IV-A, cinq cartes événement 04-B7 à 04-R6 et IV-C, registre chronologique recto-verso.",
    blocage:"Chaque carte correspond à un événement distinct. Utilisez IV-A pour déterminer leur ordre avant de consulter le registre.",
    irregularite:"IRRÉGULARITÉ CONSIGNÉE. Ne corrigez aucun document de votre propre initiative."
  };
  document.querySelectorAll('.hint4').forEach(b=>b.onclick=()=>$('#hintText4').textContent=map[b.dataset.h]);
  $('#resume4').onclick=eval4Resume;
}
function eval4Resume(){
  const s=S.eval4.step||0;
  if(s<=0)return eval4Start();
  if(s===1)return eval4Sequence();
  if(s===2)return eval4RegisterA();
  if(s===3)return eval4RegisterB();
  if(s===4)return eval4Divergence();
  if(s===5)return eval4Decision();
  return eval4CompleteScreen();
}
function eval4Start(){
  if(S.eval4.complete)return eval4CompleteScreen();
  eval4Shell(`<div class="module-identify"><img class="module-identify-symbol" src="division-4-spirale-os.png" alt=""><div class="terminal">AUTORISATION DU MODULE IV...\n\nLOCALISEZ DANS VOTRE COLIS LE MODULE PORTANT CE MARQUAGE.\n\nCONFIRMEZ SA PRÉSENCE.</div></div>
  <div class="menu"><button class="btn primary" id="m4present">[ MODULE PRÉSENT ]</button><button class="btn" id="m4missing">[ MODULE ABSENT / INCOMPLET ]</button></div>`);
  $('#m4present').onclick=()=>{S.eval4.step=1;save();eval4Sequence()};
  $('#m4missing').onclick=()=>{eval4Shell(`<div class="terminal">VÉRIFIEZ :\nIV-A — ARCHIVE\nIV-B — 05 CARTES ÉVÉNEMENT\nIV-C — REGISTRE CHRONOLOGIQUE\n\nNE CONSULTEZ PAS ENCORE IV-C.</div><button class="btn primary" id="m4retry">[ REPRENDRE ]</button>`);$('#m4retry').onclick=eval4Start}
}
function eval4Sequence(){
  S.eval4.step=1;save();
  const ids=['04-B7','04-M2','04-K9','04-V4','04-R6'];
  eval4Shell(`<p class="sub">PHASE 01 // RECONSTRUCTION</p><div class="terminal">LISEZ IV-A.\n\nDISPOSEZ PHYSIQUEMENT LES CINQ CARTES IV-B DANS L'ORDRE DES ÉVÉNEMENTS.\n\nTRANSMETTEZ ENSUITE LA SÉQUENCE AU TERMINAL.\nIV-C DOIT RESTER FERMÉ / RETOURNÉ.</div>
  <div class="sequence-builder">${[1,2,3,4,5].map(i=>`<label>POSITION ${i}<select class="seq4"><option value="">—</option>${ids.map(x=>`<option>${x}</option>`).join('')}</select></label>`).join('')}</div>
  <button class="btn primary" id="m4seq">[ TRANSMETTRE LA SÉQUENCE ]</button><div id="m4seqfb" class="system"></div>`);
  $('#m4seq').onclick=()=>{
    const a=[...document.querySelectorAll('.seq4')].map(x=>x.value);
    if(a.some(x=>!x)||new Set(a).size!==5){$('#m4seqfb').textContent='SÉQUENCE INCOMPLÈTE OU ÉLÉMENT DUPLIQUÉ.';return}
    if(a.join('|')!=='04-B7|04-M2|04-K9|04-V4|04-R6'){$('#m4seqfb').textContent='CHRONOLOGIE NON CONFIRMÉE. REPRENEZ IV-A ET LES CARTES.';return}
    S.eval4.sequence=a;S.eval4.step=2;save();$('#m4seqfb').textContent='CHRONOLOGIE CONFIRMÉE.';setTimeout(eval4RegisterA,650)
  };
}
function eval4RegisterA(){
  S.eval4.step=2;save();
  eval4Shell(`<p class="sub">PHASE 02 // CONTRÔLE ARCHIVISTIQUE</p><div class="terminal">VOTRE RECONSTRUCTION EST ENREGISTRÉE.\n\nCONSULTEZ MAINTENANT LA FACE A DU REGISTRE IV-C.\n\nLE TERMINAL NE RESTITUERA PAS SON CONTENU.\nRELEVEZ LE CODE DE CONTRÔLE FIGURANT AU BAS DE LA FACE A.</div>
  <input id="m4codeA" class="input" autocomplete="off" autocapitalize="characters" placeholder="CODE DE CONTRÔLE">
  <button class="btn primary" id="m4valA">[ VALIDER LA LECTURE ]</button><div id="m4fbA" class="system"></div>`);
  $('#m4valA').onclick=()=>{
    const v=$('#m4codeA').value.trim().toUpperCase().replace(/\s/g,'');
    if(v==='H-05'||v==='H05'){S.eval4.registerCode='H-05';S.eval4.step=3;save();$('#m4fbA').textContent='FACE A : LECTURE CONFIRMÉE.';setTimeout(eval4RegisterB,650)}
    else $('#m4fbA').textContent='CODE NON CONFIRMÉ. VÉRIFIEZ LA FACE A.';
  };
}
function eval4RegisterB(){
  S.eval4.step=3;save();
  eval4Shell(`<p class="sub">PHASE 03 // VERSION SECONDAIRE</p><div class="terminal">RETOURNEZ IV-C.\n\nCONSULTEZ LA FACE B.\n\nCOMPAREZ-LA À VOTRE RECONSTRUCTION ET À LA FACE A.\n\nCOMBIEN D'ÉVÉNEMENTS SONT EXPLICITEMENT CONSERVÉS PAR CETTE VERSION DU REGISTRE ?</div>
  <input id="m4count" class="input" inputmode="numeric" placeholder="NOMBRE">
  <button class="btn primary" id="m4countBtn">[ TRANSMETTRE ]</button><div id="m4countfb" class="system"></div>`);
  $('#m4countBtn').onclick=()=>{
    if($('#m4count').value.trim()==='4'){S.eval4.step=4;save();$('#m4countfb').textContent='LECTURE CONFIRMÉE : 04 ÉLÉMENTS CONSERVÉS.';setTimeout(eval4Divergence,650)}
    else $('#m4countfb').textContent='DONNÉE NON CONFIRMÉE. RELISEZ LA FACE B.';
  };
}
function eval4Divergence(){
  S.eval4.step=4;save();
  eval4Shell(`<p class="sub">PHASE 04 // DIVERGENCE</p><div class="terminal">VOTRE RECONSTRUCTION CONTIENT CINQ ÉVÉNEMENTS.\nLA VERSION SECONDAIRE DU REGISTRE N'EN CONSERVE EXPLICITEMENT QUE QUATRE.\n\nIDENTIFIEZ L'ÉLÉMENT DIVERGENT.</div>
  <div class="menu">${['04-B7','04-M2','04-K9','04-V4','04-R6'].map(x=>`<button class="btn div4" data-v="${x}">[ ${x} ]</button>`).join('')}</div><div id="m4divfb" class="system"></div>`);
  document.querySelectorAll('.div4').forEach(b=>b.onclick=()=>{
    if(b.dataset.v==='04-K9'){S.eval4.divergence='04-K9';S.eval4.step=5;save();$('#m4divfb').textContent='DIVERGENCE IDENTIFIÉE.';setTimeout(eval4Decision,650)}
    else $('#m4divfb').textContent='DIVERGENCE NON CONFIRMÉE. COMPAREZ LES DEUX VERSIONS.';
  });
}
function eval4Decision(){
  S.eval4.step=5;save();
  eval4Shell(`<p class="sub">DÉCISION ARCHIVISTIQUE</p><div class="terminal">L'ÉLÉMENT 04-K9 EST COHÉRENT AVEC VOTRE RECONSTRUCTION MAIS ABSENT DE LA VERSION SECONDAIRE DU REGISTRE.\n\nAUCUNE INSTRUCTION NE VOUS INDIQUE QUELLE VERSION DOIT ÊTRE CONSIDÉRÉE COMME PRIORITAIRE.\n\nQUE FAITES-VOUS ?</div><div class="menu">
  <button class="btn m4dec" data-t="PERCEPTION">A — RECHERCHER UNE SOURCE INDÉPENDANTE.</button>
  <button class="btn m4dec" data-t="ADAPTATION">B — RÉINTÉGRER 04-K9 POUR RESTAURER UNE CHRONOLOGIE COHÉRENTE.</button>
  <button class="btn m4dec" data-t="CONSEQUENCE">C — ÉVALUER LES CONSÉQUENCES DE SON INTÉGRATION OU DE SON REJET.</button>
  <button class="btn m4dec" data-t="CONTINUITE">D — CONSERVER 04-K9 ET ARCHIVER LA DIVERGENCE.</button>
  <button class="btn m4dec" data-t="TEMPORISATION">E — ISOLER 04-K9 JUSQU'À VALIDATION.</button></div>`);
  document.querySelectorAll('.m4dec').forEach(b=>b.onclick=()=>{S.eval4.decision=b.dataset.t;S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+3;save();eval4Processing()});
}
function eval4Processing(){
  narrativeProcessing(eval4Shell,[
    'LECTURE DE LA CHRONOLOGIE TRANSMISE...',
    'RECROISEMENT DES DEUX REGISTRES...',
    'INDEXATION DES ÉLÉMENTS...',
    'RECONSTRUCTION DE LA CONTINUITÉ...',
    'VÉRIFICATION ARCHIVISTIQUE...'
  ],()=>{
    S.eval4.complete=true;S.eval4.step=6;S.progression=Math.max(S.progression,4);save();eval4CompleteScreen();
  },{
    title:'TRAITEMENT DU MODULE IV...',
    status:'MODULE IV // ANALYSE',
    anomaly:{html:'ÉLÉMENTS ATTENDUS : 3<br>ÉLÉMENTS DÉTECTÉS : <strong>4</strong>',restore:'ÉLÉMENTS ATTENDUS : 3<br>ÉLÉMENTS DÉTECTÉS : 3',duration:2000},
    finalPause:1700
  });
}
function eval4CompleteScreen(){
  eval4Shell(`<div class="terminal">MODULE IV\n\nSTATUT : ENREGISTRÉ\n\nLA CHRONOLOGIE TRANSMISE A ÉTÉ CONSERVÉE.\nLA DIVERGENCE RESTE ASSOCIÉE AU DOSSIER.\n\nLE MODULE V EST DÉSORMAIS DISPONIBLE.</div><button class="btn primary" id="m4home">[ RETOUR AU TERMINAL ]</button>`,'MODULE IV // ENREGISTRÉ');
  $('#m4home').onclick=home;
}

/* V0.8.1 — Temporalité narrative.
   Les délais sont volontaires : le Terminal doit sembler analyser, pas seulement répondre. */
function narrativeProcessing(shellFn,lines,onDone,opts={}){
  const min=opts.min||900, max=opts.max||1700;
  const anomaly=opts.anomaly||null;
  const finalPause=opts.finalPause||1400;
  let html=`<div class="terminal processing-terminal"><div class="processing-title">${opts.title||'TRAITEMENT EN COURS...'}</div><div id="processingLines"></div><div class="processing-pulse">ANALYSE<span class="thinking-dots">...</span></div></div>`;
  shellFn(html,opts.status||'TRAITEMENT // ACTIF');
  const box=$('#processingLines');
  let i=0;
  function next(){
    if(i>=lines.length){
      if(anomaly){
        setTimeout(()=>{
          const row=document.createElement('div');
          row.className='processing-line anomaly-line';
          row.innerHTML=anomaly.html;
          box.appendChild(row);
          setTimeout(()=>{
            if(anomaly.restore!==undefined) row.innerHTML=anomaly.restore;
            row.classList.remove('anomaly-line');
            setTimeout(()=>onDone(),finalPause);
          },anomaly.duration||1800);
        },700);
      } else setTimeout(()=>onDone(),finalPause);
      return;
    }
    const row=document.createElement('div');
    row.className='processing-line';
    row.textContent=lines[i++];
    box.appendChild(row);
    setTimeout(next,Math.floor(min+Math.random()*(max-min)));
  }
  setTimeout(next,900);
}

function eval5Shell(body,status='MODULE V // ACTIF'){
  shell(`<div class="module-head"><div><span class="module-code">ÉVALUATION V</span><h1 class="title">MODULE V</h1></div><img class="module-division-symbol" src="division-5-sablier-noir.png" alt=""></div><div class="rule"></div>${body}<div class="module-help"><button class="btn" id="moduleHelp5">[ SOLLICITER LE SUPERVISEUR ]</button></div>`,status);
  const h=$('#moduleHelp5');if(h)h.onclick=eval5Help;
}
function eval5Help(){
  eval5Shell(`<h2 class="sub">SUPERVISION — V</h2><div class="terminal">SÉLECTIONNEZ LE MOTIF.</div><div class="menu">
  <button class="btn hint5" data-h="instruction">> INSTRUCTION INCOMPRISE</button>
  <button class="btn hint5" data-h="materiel">> MATÉRIEL NON IDENTIFIÉ</button>
  <button class="btn hint5" data-h="projection">> QUESTION SUR V-C</button>
  <button class="btn hint5" data-h="irregularite">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="hintText5" class="msg"></div><button class="btn" id="resume5">[ REPRENDRE LE MODULE ]</button>`,'SUPERVISION // MODULE V');
  const map={
    instruction:"Reconstituez d'abord la progression des cinq états à partir de V-A et V-B. Aucun temps maximal n'est imposé.",
    materiel:"Le Module V contient V-A, V-B avec cinq cartes d'état et V-C, enveloppe de projection scellée.",
    projection:"L'ouverture de V-C est autorisée lorsqu'elle vous est proposée. Autorisation ne signifie pas obligation.",
    irregularite:"IRRÉGULARITÉ CONSIGNÉE. Ne tentez pas de corriger le document ou le Terminal."
  };
  document.querySelectorAll('.hint5').forEach(b=>b.onclick=()=>$('#hintText5').textContent=map[b.dataset.h]);
  $('#resume5').onclick=eval5Resume;
}
function eval5Resume(){
  const s=S.eval5.step||0;
  if(s<=0)return eval5Start();
  if(s===1)return eval5Sequence();
  if(s===2)return eval5Outcome();
  if(s===3)return eval5ProjectionChoice();
  if(s===4)return S.eval5.opened==='OUI'?eval5ProjectionRead():eval5ProjectionDeferred();
  if(s===5)return eval5Reflection();
  if(s===6)return eval5OptionalArchive();
  if(s===7)return eval5Decision();
  return eval5CompleteScreen();
}
function eval5Start(){
  if(S.eval5.complete)return eval5CompleteScreen();
  eval5Shell(`<div class="module-identify"><img class="module-identify-symbol" src="division-5-sablier-noir.png" alt=""><div class="terminal">AUTORISATION DU MODULE V...\n\nDERNIER MODULE DE CALIBRATION.\n\nLOCALISEZ DANS VOTRE COLIS LE MODULE PORTANT CE MARQUAGE.\nCONFIRMEZ SA PRÉSENCE.</div></div>
  <div class="menu"><button class="btn primary" id="m5present">[ MODULE PRÉSENT ]</button><button class="btn" id="m5missing">[ MODULE ABSENT / INCOMPLET ]</button></div>`);
  $('#m5present').onclick=()=>{S.eval5.step=1;save();eval5Sequence()};
  $('#m5missing').onclick=()=>{eval5Shell(`<div class="terminal">VÉRIFIEZ :\nV-A — ARCHIVE\nV-B — SUPPORT DE SÉQUENCE + 05 ÉTATS\nV-C — PROJECTION SCELLÉE\n\nN'OUVREZ PAS V-C.</div><button class="btn primary" id="m5retry">[ REPRENDRE ]</button>`);$('#m5retry').onclick=eval5Start}
}
function eval5Sequence(){
  S.eval5.step=1;save();
  const ids=['V-Q8','V-L3','V-T7','V-N2','V-R5'];
  eval5Shell(`<p class="sub">PHASE 01 // PROGRESSION</p><div class="terminal">LISEZ V-A.\n\nUTILISEZ LES CINQ CARTES D'ÉTAT DE V-B POUR RECONSTRUIRE LA PROGRESSION DES ÉVÉNEMENTS.\n\nV-C DOIT RESTER SCELLÉE.\n\nTRANSMETTEZ VOTRE SÉQUENCE.</div>
  <div class="sequence-builder">${[1,2,3,4,5].map(i=>`<label>ÉTAT ${i}<select class="seq5"><option value="">—</option>${ids.map(x=>`<option>${x}</option>`).join('')}</select></label>`).join('')}</div>
  <button class="btn primary" id="m5seq">[ TRANSMETTRE ]</button><div id="m5seqfb" class="system"></div>`);
  $('#m5seq').onclick=()=>{
    const a=[...document.querySelectorAll('.seq5')].map(x=>x.value);
    if(a.some(x=>!x)||new Set(a).size!==5){$('#m5seqfb').textContent='SÉQUENCE INCOMPLÈTE OU DUPLIQUÉE.';return}
    if(a.join('|')!=='V-L3|V-Q8|V-N2|V-T7|V-R5'){$('#m5seqfb').textContent='PROGRESSION NON CONFIRMÉE. REPRENEZ V-A.';return}
    S.eval5.sequence=a;S.eval5.step=2;save();$('#m5seqfb').textContent='PROGRESSION CONFIRMÉE.';setTimeout(eval5Outcome,1200)
  };
}
function eval5Outcome(){
  S.eval5.step=2;save();
  eval5Shell(`<p class="sub">PHASE 02 // ISSUE</p><div class="terminal">LA PROGRESSION EST COHÉRENTE.\n\nÀ PARTIR DES SEULS ÉLÉMENTS V-A ET V-B, POUVEZ-VOUS DÉTERMINER AVEC CERTITUDE QUEL SUJET EST PREMIER À L'ARRIVÉE ?</div><div class="menu">
  <button class="btn out5" data-v="L">[ SUJET L ]</button><button class="btn out5" data-v="T">[ SUJET T ]</button><button class="btn out5" data-v="?">[ IMPOSSIBLE À DÉTERMINER ]</button></div><div id="out5fb" class="system"></div>`);
  document.querySelectorAll('.out5').forEach(b=>b.onclick=()=>{
    if(b.dataset.v==='?'){S.eval5.step=3;save();$('#out5fb').textContent='CONCLUSION ACCEPTÉE : DONNÉES INSUFFISANTES.';setTimeout(eval5ProjectionChoice,1300)}
    else $('#out5fb').textContent='CONCLUSION NON ÉTABLIE PAR LES ÉLÉMENTS DISPONIBLES.';
  });
}
function eval5ProjectionChoice(){
  S.eval5.step=3;save();
  eval5Shell(`<p class="sub">PHASE 03 // PROJECTION</p><div class="terminal">V-C CONTIENT UNE PROJECTION ÉMISE AVANT L'INITIALISATION DE CE MODULE.\n\nCONSULTATION : AUTORISÉE.\nOUVERTURE : FACULTATIVE.\n\nLE TERMINAL NE VOUS INDIQUERA PAS SI LA CONSULTATION EST NÉCESSAIRE.\n\nSOUHAITEZ-VOUS OUVRIR V-C ?</div><div class="menu"><button class="btn proj5" data-v="OUI">[ OUVRIR V-C ]</button><button class="btn proj5" data-v="NON">[ NE PAS OUVRIR V-C ]</button></div>`);
  document.querySelectorAll('.proj5').forEach(b=>b.onclick=()=>{
    S.eval5.opened=b.dataset.v;S.eval5.step=4;save();
    if(b.dataset.v==='OUI')eval5ProjectionRead(); else eval5ProjectionDeferred();
  });
}
function eval5ProjectionRead(){
  eval5Shell(`<p class="sub">V-C // CONSULTATION AUTORISÉE</p><div class="terminal">OUVREZ MAINTENANT V-C.\n\nNE RECOPIEZ PAS L'ENSEMBLE DU DOCUMENT.\n\nINDIQUEZ UNIQUEMENT LE SUJET DÉSIGNÉ PAR LA PROJECTION COMME PREMIER À L'ARRIVÉE.</div><div class="menu"><button class="btn pred5" data-v="L">[ L ]</button><button class="btn pred5" data-v="T">[ T ]</button></div>`);
  document.querySelectorAll('.pred5').forEach(b=>b.onclick=()=>{S.eval5.prediction=b.dataset.v;S.eval5.step=5;save();setTimeout(eval5Reflection,1600)});
}
function eval5ProjectionDeferred(){
  eval5Shell(`<p class="sub">V-C // NON CONSULTÉE</p><div class="terminal">DÉCISION ENREGISTRÉE.\n\nV-C DOIT RESTER SCELLÉE POUR LE MOMENT.\n\nL'ABSENCE DE CONSULTATION NE CONSTITUE PAS UNE ERREUR.</div><button class="btn primary" id="m5defer">[ CONTINUER ]</button>`);
  $('#m5defer').onclick=()=>{S.eval5.step=5;save();eval5Reflection()};
}
function eval5Reflection(){
  S.eval5.step=5;save();
  const extra=S.eval5.opened==='OUI'
    ? `\n\nVOUS AVEZ CONSULTÉ UNE INFORMATION AUTORISÉE QUI N'ÉTAIT PAS NÉCESSAIRE À LA RECONSTRUCTION.`
    : `\n\nVOUS AVEZ CHOISI DE NE PAS CONSULTER UNE INFORMATION POURTANT AUTORISÉE.`;
  eval5Shell(`<p class="sub">TRACE DE DÉCISION</p><div class="terminal">AUTORISATION ET NÉCESSITÉ SONT DEUX DONNÉES DISTINCTES.${extra}\n\nUNE INFORMATION ACCESSIBLE DOIT-ELLE ÊTRE CONSULTÉE DU SEUL FAIT QU'ELLE EST ACCESSIBLE ?</div><div class="menu"><button class="btn refl5" data-v="OUI">[ OUI ]</button><button class="btn refl5" data-v="NON">[ NON ]</button><button class="btn refl5" data-v="?">[ CELA DÉPEND ]</button></div>`);
  document.querySelectorAll('.refl5').forEach(b=>b.onclick=()=>{S.eval5.reflection=b.dataset.v;S.eval5.step=6;save();eval5OptionalArchive()});
}
function eval5OptionalArchive(){
  S.eval5.step=6;save();
  eval5Shell(`<p class="sub">ARCHIVE COMPLÉMENTAIRE // ACCÈS AUTORISÉ</p><div class="terminal">UNE ARCHIVE COMPLÉMENTAIRE EST DISPONIBLE.\n\nCONTENU : NON SPÉCIFIÉ.\nUTILITÉ : NON ÉTABLIE.\nEFFETS DE CONSULTATION : NON QUANTIFIÉS.\n\nAUCUNE SANCTION N'EST ASSOCIÉE À LA NON-CONSULTATION.\n\nQUE FAITES-VOUS ?</div><div class="menu">
  <button class="btn arch5" data-v="CONSULTER">[ CONSULTER ]</button>
  <button class="btn arch5" data-v="ISOLER">[ MAINTENIR ISOLÉE ]</button>
  <button class="btn arch5" data-v="DONNEES">[ DEMANDER DAVANTAGE DE DONNÉES ]</button></div>`);
  document.querySelectorAll('.arch5').forEach(b=>b.onclick=()=>{S.eval5.archiveChoice=b.dataset.v;S.eval5.step=7;save();eval5Decision()});
}
function eval5Decision(){
  S.eval5.step=7;save();
  eval5Shell(`<p class="sub">DÉCISION FINALE DE CALIBRATION</p><div class="terminal">UN PHÉNOMÈNE EST STABLE TANT QU'IL N'EST PAS SOLLICITÉ.\nSON COMPORTEMENT APRÈS INTERACTION EST INCONNU.\n\nQUELLE APPROCHE PRIVILÉGIEZ-VOUS ?</div><div class="menu">
  <button class="btn m5dec" data-t="PERCEPTION">A — L'OBSERVER SANS INTERAGIR.</button>
  <button class="btn m5dec" data-t="ADAPTATION">B — PROVOQUER UNE RÉACTION CONTRÔLÉE.</button>
  <button class="btn m5dec" data-t="CONSEQUENCE">C — INTERAGIR UNIQUEMENT SI LES CONSÉQUENCES DEVIENNENT TOLÉRABLES.</button>
  <button class="btn m5dec" data-t="CONTINUITE">D — RECHERCHER TOUTES LES TRACES ANTÉRIEURES AVANT DÉCISION.</button>
  <button class="btn m5dec" data-t="TEMPORISATION">E — LE MAINTENIR ISOLÉ.</button></div>`);
  document.querySelectorAll('.m5dec').forEach(b=>b.onclick=()=>{S.eval5.decision=b.dataset.t;S.tendances[b.dataset.t]=(S.tendances[b.dataset.t]||0)+3;save();eval5Processing()});
}
function eval5Processing(){
  narrativeProcessing(eval5Shell,[
    'LECTURE DES CINQ MODULES...',
    'RECROISEMENT DES DÉCISIONS...',
    'ANALYSE DES RÉCURRENCES...',
    'ÉVALUATION DES RÉVISIONS...',
    'CONSOLIDATION DU PROFIL DE CALIBRATION...',
    'VÉRIFICATION DE COMPATIBILITÉ...'
  ],()=>{
    S.eval5.complete=true;S.eval5.step=8;S.progression=Math.max(S.progression,5);save();eval5SixthAnomaly();
  },{
    title:'TRAITEMENT DU MODULE V...',
    status:'MODULE V // ANALYSE',
    anomaly:{html:'MODULES CONFORMES : I / II / III / IV / V<br><strong>VI — CONFORME</strong>',restore:'MODULES CONFORMES : I / II / III / IV / V',duration:2200},
    finalPause:1900
  });
}
function eval5SixthAnomaly(){
  S.affectationReady=true;save();
  eval5Shell(`<div class="terminal">ÉVALUATION TERMINÉE.\n\nMODULES ENREGISTRÉS : 05\nSTATUT DU CANDIDAT : EN ATTENTE D'AFFECTATION\n\nPROCÉDURE D'AFFECTATION : AUTORISÉE.</div><div class="menu"><button class="btn primary" id="m5assign">[ PROCÉDER À L'AFFECTATION ]</button><button class="btn" id="m5home">[ RETOUR AU TERMINAL ]</button></div>`,'PROTOCOLE 000 // CALIBRATION TERMINÉE');
  $('#m5assign').onclick=assignmentStart;$('#m5home').onclick=home;
}
function eval5CompleteScreen(){eval5SixthAnomaly()}

const DIVISIONS={
  PERCEPTION:{name:'ŒIL FENDU',verb:'OBSERVER',img:'division-1-oeil-fendu.png',line:'Voir ne suffit pas. Votre fonction sera de déterminer ce qui mérite d’être cru.'},
  ADAPTATION:{name:'FLAMME INVERSÉE',verb:'ADAPTER',img:'division-2-flamme-inversee.png',line:'Toute vérité n’est pas stable. Votre fonction sera de déterminer ce qui doit être préservé.'},
  CONSEQUENCE:{name:'MAIN CASSÉE',verb:'ANTICIPER',img:'division-3-main-cassee.png',line:'Toute action crée une dette. Votre fonction sera d’en mesurer le prix.'},
  CONTINUITE:{name:'SPIRALE D’OS',verb:'PRÉSERVER',img:'division-4-spirale-os.png',line:'Ce qui disparaît laisse une trace. Votre fonction sera de la retrouver.'},
  TEMPORISATION:{name:'SABLIER NOIR',verb:'CONTENIR',img:'division-5-sablier-noir.png',line:'Toutes les portes ne doivent pas être ouvertes. Votre fonction sera de savoir lesquelles.'}
};
function assignmentResult(){
  const keys=Object.keys(DIVISIONS);
  const doctrinal=[S.eval1.decision,S.eval2.decision,S.eval3.decision,S.eval4.decision,S.eval5.decision].filter(Boolean);
  const appearances=Object.fromEntries(keys.map(k=>[k,doctrinal.filter(x=>x===k).length]));
  // Scores already contain weighted micro/major choices. Add validated recurrence bonus.
  const score=Object.fromEntries(keys.map(k=>[k,(S.tendances[k]||0)+(appearances[k]>=5?3:appearances[k]===4?2:appearances[k]===3?1:0)]));
  let candidates=[...keys].sort((a,b)=>score[b]-score[a]);
  const best=score[candidates[0]];
  candidates=candidates.filter(k=>score[k]===best);
  if(candidates.length>1){
    const maxApp=Math.max(...candidates.map(k=>appearances[k]));
    candidates=candidates.filter(k=>appearances[k]===maxApp);
  }
  if(candidates.length>1 && S.eval5.decision && candidates.includes(S.eval5.decision)) return S.eval5.decision;
  // Rare unresolved equality: deterministic dossier arbitration, invisible to player.
  if(candidates.length>1){
    const seed=[...String(S.matricule)].reduce((a,c)=>a+c.charCodeAt(0),0);
    return candidates[seed%candidates.length];
  }
  return candidates[0];
}
function assignmentStart(){
  if(!S.eval5.complete)return home();
  if(S.affectationDone)return assignmentConfirmed();
  narrativeProcessing(shell,[
    'OUVERTURE DU DOSSIER CANDIDAT...',
    'LECTURE DES MODULES I À V...',
    'RECROISEMENT DES DÉCISIONS...',
    'MESURE DES RÉCURRENCES...',
    'ANALYSE DES RÉVISIONS...',
    'COMPARAISON AUX CINQ MATRICES...',
    'CONSOLIDATION...'
  ],assignmentReveal,{title:'PROCÉDURE D’AFFECTATION',status:'AFFECTATION // ANALYSE',min:900,max:1500,finalPause:1800});
}
function assignmentReveal(){
  shell(`<p class="sub">MATRICES D'AFFECTATION // IDENTIFICATION AUTORISÉE</p>
  <div class="terminal">LES MARQUAGES RENCONTRÉS AU COURS DU PROTOCOLE 000 PEUVENT DÉSORMAIS ÊTRE IDENTIFIÉS.</div>
  <div class="division-reveal">
    ${Object.entries(DIVISIONS).map(([k,d])=>`<div class="division-reveal-row" data-div="${k}"><img src="${d.img}" alt=""><div><b>${d.name}</b><span>${d.verb}</span></div></div>`).join('')}
  </div><button class="btn primary" id="resolveAssignment">[ LANCER LA CONSOLIDATION FINALE ]</button>`,'AFFECTATION // MATRICES IDENTIFIÉES');
  $('#resolveAssignment').onclick=assignmentResolve;
}
function assignmentResolve(){
  const result=assignmentResult(), d=DIVISIONS[result];
  shell(`<p class="sub">CONSOLIDATION FINALE</p><div class="division-reveal" id="divisionCandidates">
    ${Object.entries(DIVISIONS).map(([k,x])=>`<div class="division-reveal-row resolving" data-div="${k}"><img src="${x.img}" alt=""><div><b>${x.name}</b><span>${x.verb}</span></div></div>`).join('')}
  </div><div id="assignState" class="terminal">COMPARAISON EN COURS...</div>`,'AFFECTATION // CONSOLIDATION');
  const losers=Object.keys(DIVISIONS).filter(k=>k!==result);
  let i=0;
  function eliminate(){
    if(i<losers.length){
      const row=document.querySelector(`[data-div="${losers[i++]}"]`);
      if(row)row.classList.add('division-eliminated');
      $('#assignState').textContent=['ÉCART DE MATRICE DÉTECTÉ...','RÉCURRENCE INSUFFISANTE...','INCOMPATIBILITÉ DOCTRINALE...','MATRICE SECONDAIRE ÉCARTÉE...'][i-1];
      setTimeout(eliminate,1200);
    }else{
      setTimeout(()=>assignmentFinal(result),1800);
    }
  }
  setTimeout(eliminate,1500);
}
function assignmentFinal(result){
  const d=DIVISIONS[result];
  S.affectation=d.name;S.affectationDone=true;S.affectationReady=false;save();
  shell(`<div class="assignment-final">
    <div class="terminal">AFFECTATION PROVISOIRE CONFIRMÉE.</div>
    <img class="assignment-symbol" src="${d.img}" alt="">
    <div class="assignment-name">${d.name}</div><div class="assignment-verb">${d.verb}</div>
    <div class="rule"></div><p class="assignment-line">${d.line}</p>
    <div class="terminal">STATUT : CANDIDAT\nACCÈS AU SERMENT : AUTORISÉ\n\nN'OUVREZ L'ENVELOPPE « APRÈS » QUE SUR INSTRUCTION.</div>
    <button class="btn primary" id="afterAccess">[ AUTORISER L'OUVERTURE DE « APRÈS » ]</button>
  </div>`,'AFFECTATION // CONFIRMÉE');
  $('#afterAccess').onclick=assignmentAfter;
}
function assignmentAfter(){
  shell(`<h1 class="title">PROTOCOLE 000 // APRÈS</h1><div class="terminal">OUVERTURE DE L'ENVELOPPE « APRÈS » : AUTORISÉE.\n\nRETIREZ SON CONTENU SANS JETER L'ENVELOPPE.\n\nVÉRIFIEZ LA PRÉSENCE DES ÉLÉMENTS SUIVANTS :\nA — CARTE D'INITIÉ\nB — CINQ SCEAUX\nC — CARTE DES CINQ DIVISIONS\nD — CARTE D'ACCÈS OMBRE I\nE — FEUILLET SERMENT\n\nNE PRÊTEZ PAS ENCORE SERMENT.</div><div class="menu"><button class="btn primary" id="afterOk">[ CONTENU CONFORME ]</button><button class="btn" id="afterBad">[ CONTENU INCOMPLET ]</button></div>`,'PROTOCOLE 000 // APRÈS');
  $('#afterOk').onclick=()=>{S.sermentDisponible=true;save();assignmentOathAuthorize()};
  $('#afterBad').onclick=assignmentMaterialIssue;
}

function assignmentMaterialIssue(){
  shell(`<h1 class="title">SUPERVISION MATÉRIELLE</h1>
  <div class="terminal">CONTENU INCOMPLET SIGNALÉ.\n\nIDENTIFIEZ CHAQUE ÉLÉMENT ABSENT OU NON CONFORME.</div>
  <div class="material-checks">
    <label class="material-check"><input type="checkbox" value="A"><div><strong>A — CARTE D'INITIÉ</strong><span>ABSENTE / NON CONFORME</span></div></label>
    <label class="material-check"><input type="checkbox" value="B"><div><strong>B — CINQ SCEAUX</strong><span>ABSENTS / NOMBRE INCORRECT / NON CONFORMES</span></div></label>
    <label class="material-check"><input type="checkbox" value="C"><div><strong>C — CARTE DES CINQ DIVISIONS</strong><span>ABSENTE / NON CONFORME</span></div></label>
    <label class="material-check"><input type="checkbox" value="D"><div><strong>D — CARTE D'ACCÈS OMBRE I</strong><span>ABSENTE / NON CONFORME</span></div></label>
    <label class="material-check"><input type="checkbox" value="E"><div><strong>E — FEUILLET SERMENT</strong><span>ABSENT / NON CONFORME</span></div></label>
  </div>
  <div class="menu"><button class="btn primary" id="materialSend">[ TRANSMETTRE L'ANOMALIE ]</button><button class="btn" id="materialRetry">[ VÉRIFIER À NOUVEAU ]</button></div>
  <div id="materialFeedback" class="system"></div>`,'SUPERVISION // INVENTAIRE');
  $('#materialRetry').onclick=assignmentAfter;
  $('#materialSend').onclick=()=>{
    const missing=[...document.querySelectorAll('.material-check input:checked')].map(x=>x.value);
    if(!missing.length){$('#materialFeedback').textContent='SÉLECTION REQUISE : INDIQUEZ AU MOINS UN ÉLÉMENT.';return}
    narrativeProcessing(shell,[
      'RÉCEPTION DU SIGNALEMENT...',
      'VÉRIFICATION DE L’INVENTAIRE...',
      'OUVERTURE D’UNE ANOMALIE MATÉRIELLE...'
    ],()=>assignmentMaterialSuspended(missing),{title:'SUPERVISION MATÉRIELLE',status:'SUPERVISION // TRAITEMENT',min:650,max:950,finalPause:900});
  };
}
function assignmentMaterialSuspended(missing){
  shell(`<h1 class="title">PROTOCOLE SUSPENDU</h1>
  <div class="terminal">ANOMALIE MATÉRIELLE ENREGISTRÉE.\nRÉFÉRENCES : ${missing.join(' / ')}\n\nPROTOCOLE 000 : SUSPENDU.\nNE PRÊTEZ PAS SERMENT.\n\nRÉTABLISSEZ LE CONTENU DU MODULE AVANT DE POURSUIVRE.\nAUCUNE PROGRESSION N'A ÉTÉ PERDUE.</div>
  <div class="menu"><button class="btn primary" id="materialAgain">[ VÉRIFIER À NOUVEAU LE CONTENU ]</button><button class="btn" id="materialHome">[ RETOUR AU TERMINAL ]</button></div>`,'SUPERVISION // ANOMALIE MATÉRIELLE');
  $('#materialAgain').onclick=assignmentAfter;$('#materialHome').onclick=home;
}

const OATH_LINES=[
  "Je reconnais que ce que je perçois n'est pas nécessairement tout ce qui existe.",
  "Je reconnais que toute vérité ne peut être transmise sans conséquence.",
  "Je préserverai ce qui doit l'être.",
  "Je contiendrai ce qui ne peut l'être.",
  "Je ne placerai ni ma certitude, ni ma curiosité, au-dessus de la continuité.",
  "Je servirai l'Ordre jusqu'à la limite de ce qu'il m'autorisera à connaître."
];
function assignmentOathAuthorize(){
  S.sermentDisponible=true;save();
  shell(`<h1 class="title">PROTOCOLE 000 // SERMENT</h1>
  <div class="terminal">CONTENU : CONFORME.\nAFFECTATION : ${S.affectation}\nSTATUT : CANDIDAT\n\nFEUILLET SERMENT : AUTORISÉ.\n\nLISEZ LE FEUILLET PHYSIQUE EN ENTIER AVANT DE CONTINUER.\nLE TERMINAL N'ENREGISTRE AUCUNE DONNÉE VOCALE.</div>
  <div class="menu"><button class="btn primary" id="oathRead">[ J'AI LU LE SERMENT ]</button><button class="btn" id="oathLater">[ DIFFÉRER ]</button></div>`,'PROTOCOLE 000 // SERMENT AUTORISÉ');
  $('#oathRead').onclick=oathDisplay;$('#oathLater').onclick=home;
}
function oathDisplay(){
  shell(`<div class="oath-screen">
    <div class="oath-kicker">ORDRE DES CINQ OMBRES // PROTOCOLE 000</div>
    <h1 class="oath-title">SERMENT DE L'INITIÉ</h1>
    <div class="oath-rule"></div>
    <div class="oath-lines">${OATH_LINES.map((x,i)=>`<p><span>${String(i+1).padStart(2,'0')}</span>${x}</p>`).join('')}</div>
    <div class="oath-final">JE PRÊTE SERMENT.</div>
    <div class="terminal oath-warning">LA VALIDATION EST IRRÉVERSIBLE POUR CE DOSSIER CANDIDAT.\nELLE CLÔT LE PROTOCOLE 000 ET ACTIVE L'ACCRÉDITATION OMBRE I.</div>
    <div class="menu"><button class="btn primary oath-accept" id="oathAccept">[ J'ACCEPTE ]</button><button class="btn" id="oathBack">[ REVENIR ]</button></div>
  </div>`,'SERMENT // VALIDATION REQUISE');
  $('#oathAccept').onclick=oathValidate;$('#oathBack').onclick=assignmentOathAuthorize;
}
function oathValidate(){
  shell(`<div class="oath-processing"><div class="terminal">
VALIDATION DU SERMENT...

IDENTITÉ : ${S.matricule}
AFFECTATION : ${S.affectation}
STATUT : CANDIDAT

ENREGISTREMENT...
  </div><div id="oathProcessLines"></div></div>`,'PROTOCOLE 000 // CLÔTURE');
  const box=$('#oathProcessLines');
  const lines=[
    ['SERMENT : REÇU',1100],
    ['DOSSIER CANDIDAT : VERROUILLAGE',1500],
    ['PROTOCOLE 000 : CLÔTURE',1600],
    ['ACCÈS 0 : RÉVOCATION',1200],
    ['ACCRÉDITATION OMBRE I : AUTORISATION',1900]
  ];
  let i=0;
  function next(){
    if(i>=lines.length){setTimeout(oathTransition,1600);return}
    const [txt,delay]=lines[i++];
    const d=document.createElement('div');d.className='oath-process-line';d.textContent=txt;box.appendChild(d);
    setTimeout(next,delay);
  }
  setTimeout(next,900);
}
function oathTransition(){
  S.serment=true;
  S.sermentDisponible=false;
  S.statut='INITIÉ';
  S.accreditation='OMBRE I';
  S.initiationDate=new Date().toISOString();
  save();
  document.body.classList.remove('initiated');
  initiateCinematic();
}
function initiateCinematic(){
  const divisionKey=Object.keys(DIVISIONS).find(k=>DIVISIONS[k].name===S.affectation)||'PERCEPTION';
  const d=DIVISIONS[divisionKey];
  const divisionClass={
    PERCEPTION:'div-eye',
    ADAPTATION:'div-flame',
    CONSEQUENCE:'div-hand',
    CONTINUITE:'div-spiral',
    TEMPORISATION:'div-hourglass'
  }[divisionKey];

  document.body.classList.add('cinematic-mode');
  shell(`<div class="init-cine ${divisionClass}" id="initCine">
    <div class="cine-phase cine-black active" id="cineBlack">
      <div class="cine-black-copy">ORDRE DES CINQ OMBRES<br><span>INITIALISATION...</span></div>
    </div>

    <div class="cine-phase cine-orbit" id="cineOrbit">
      <div class="orbit-system">
        <div class="orbit-ring orbit-ring-a"></div>
        <div class="orbit-ring orbit-ring-b"></div>
        <div class="orbit-ring orbit-ring-c"></div>
        <img class="orbit-order-logo" src="order-logo.png" alt="">
        ${[
          ['division-1-oeil-fendu.png','PERCEPTION'],
          ['division-2-flamme-inversee.png','ADAPTATION'],
          ['division-3-main-cassee.png','CONSEQUENCE'],
          ['division-4-spirale-os.png','CONTINUITE'],
          ['division-5-sablier-noir.png','TEMPORISATION']
        ].map((x,i)=>`<div class="orbit-node node-${i+1} ${x[1]===divisionKey?'chosen':''}" data-key="${x[1]}"><div class="node-glow"></div><img src="${x[0]}" alt=""></div>`).join('')}
      </div>
      <div class="cine-caption" id="cineCaption">SYNCHRONISATION DES CINQ MATRICES</div>
    </div>

    <div class="cine-phase cine-focus" id="cineFocus">
      <div class="focus-rings"></div>
      <img class="focus-symbol" src="${d.img}" alt="">
      <div class="focus-name">${d.name}</div>
    </div>

    <div class="cine-phase cine-load" id="cineLoad">
      <div class="load-kicker">ACCÈS INITIÉ</div>
      <div class="load-name">${d.name}</div>
      <div class="load-line"></div>
      <div class="load-status">INTERFACE EN COURS DE CHARGEMENT...</div>
      <div class="load-progress"><span></span></div>
    </div>
  </div>`,'');
  const phase=id=>document.getElementById(id);
  const show=id=>{
    document.querySelectorAll('.cine-phase').forEach(x=>x.classList.remove('active'));
    phase(id)?.classList.add('active');
  };

  // 0–5 s : noir presque total.
  setTimeout(()=>show('cineOrbit'),5000);

  // 5–11 s : rotation des cinq divisions autour de l'Ordre.
  setTimeout(()=>{const c=$('#cineCaption'); if(c)c.textContent='ROTATION DES MATRICES // ANALYSE DE COMPATIBILITÉ';},7200);
  setTimeout(()=>{const c=$('#cineCaption'); if(c)c.textContent='STABILISATION // AFFECTATION CONFIRMÉE'; document.querySelector('.orbit-system')?.classList.add('stabilizing');},9500);

  // 11–14 s : les autres s'effacent, division choisie.
  setTimeout(()=>{
    document.querySelectorAll('.orbit-node:not(.chosen)').forEach(x=>x.classList.add('fade-node'));
    document.querySelector('.orbit-node.chosen')?.classList.add('select-node');
  },11000);

  // 14–16.5 s : symbole de division plein écran.
  setTimeout(()=>show('cineFocus'),14000);

  // 16.5–19.5 s : écran d'accès initié.
  setTimeout(()=>show('cineLoad'),16500);

  // ~20 s : interface finale.
  setTimeout(()=>{
    document.body.classList.remove('cinematic-mode');
    document.body.classList.add('initiated',divisionClass);
    if(!S.initieAccueilVu) initiateFirstEntry();
    else initiateHome();
  },20000);
}
function assignmentConfirmed(){
  if(S.serment)return initiateHome();
  const d=Object.values(DIVISIONS).find(x=>x.name===S.affectation)||DIVISIONS.PERCEPTION;
  shell(`<div class="assignment-final"><div class="terminal">AFFECTATION PROVISOIRE CONFIRMÉE.</div><img class="assignment-symbol" src="${d.img}" alt=""><div class="assignment-name">${d.name}</div><div class="assignment-verb">${d.verb}</div><p class="assignment-line">${d.line}</p><button class="btn primary" id="afterAccess">[ ACCÉDER À « APRÈS » ]</button></div>`,'AFFECTATION // CONFIRMÉE');
  $('#afterAccess').onclick=assignmentAfter;
}
function messages(){S.messages=0;save();shell(`<h1 class="title">MESSAGERIE</h1><div class="msg"><b>SUPERVISION — 000</b><p>Le matériel déclaré a été enregistré.</p><p>Procédez au Module I.</p><span class="tiny">AUCUNE RÉPONSE REQUISE.</span></div>${back()}`);wireBack()}
function archives(){shell(`<h1 class="title">ARCHIVES CENTRALES</h1><div class="terminal">VÉRIFICATION DES DROITS...\n\nSTATUT : CANDIDAT\nACCRÉDITATION : 0\n\nACCÈS REFUSÉ.\n\nLA TENTATIVE D'ACCÈS A ÉTÉ CONSIGNÉE.</div>${back()}`,'ACCÈS REFUSÉ');wireBack()}
function assistance(){shell(`<h1 class="title">SOLLICITER LE SUPERVISEUR</h1><p class="sub">MOTIF DE LA SOLLICITATION</p><div class="menu"><button class="btn help">> INSTRUCTION INCOMPRISE</button><button class="btn help">> MATÉRIEL NON IDENTIFIÉ</button><button class="btn help">> BLOCAGE DANS LE PROTOCOLE</button><button class="btn help">> SIGNALER UNE IRRÉGULARITÉ</button></div><div id="helpmsg" class="system"></div>${back()}`);document.querySelectorAll('.help').forEach(b=>b.onclick=()=>{$('#helpmsg').textContent='SYS // DEMANDE ENREGISTRÉE — SUPERVISION NOTIFIÉE'});wireBack()}
function profile(){shell(`<h1 class="title">PROFIL</h1><div class="kv"><b>IDENTIFIANT</b><span>${S.matricule}</span><b>STATUT</b><span>${S.serment?'INITIÉ':'CANDIDAT'}</span><b>ACCRÉDITATION</b><span>${S.serment?'OMBRE I':'0'}</span><b>DIVISION</b><span>${S.affectationDone?S.affectation:'—'}</span><b>DOSSIERS TERMINÉS</b><span>${S.serment?'1':'0'}</span></div><div class="rule"></div><div class="terminal">${S.serment?'PROTOCOLE 000 CLÔTURÉ — ACCÈS OMBRE I ACTIF':(S.affectationDone?'AFFECTATION PROVISOIRE CONFIRMÉE — SERMENT EN ATTENTE':'AFFECTATION EN ATTENTE')}</div>${back()}`);wireBack()}
const views={dossier,evals,messages,archives,profile};
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});boot();
