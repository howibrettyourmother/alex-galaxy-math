'use strict';
(function(){
var $=function(i){return document.getElementById(i)};
var KEY='alexGalaxyMath.v1';
function fresh(){return{L:3,maxL:3,at:0,streak:0,best:0,total:0,correct:0,blasts:0,back:0,tp:{},recent:[],log:[],badges:[],sessions:[],blitzBest:0,start:3}}
var S;try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}
var F=fresh();for(var k in F)if(S[k]===undefined)S[k]=F[k];
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
// ---------- audio: WebAudio buffers, per-sound cooldown, max 3 voices, same sound cuts itself ----------
var AC=null,BUF={},VO=[],LAST={},CD={tap:70,zap:110,boom:220,miss:400,levelup:800,firework:140,ding:300};
function initAudio(){if(AC)return;var C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();
 Object.keys(CD).forEach(function(n){var x=new XMLHttpRequest();x.open('GET','sfx/'+n+'.mp3');x.responseType='arraybuffer';x.onload=function(){try{AC.decodeAudioData(x.response,function(b){BUF[n]=b},function(){})}catch(e){}};x.send()})}
function unlock(){initAudio();if(AC&&AC.state==='suspended')AC.resume()}
document.addEventListener('touchstart',unlock,{passive:true});document.addEventListener('pointerdown',unlock);
function sfx(n,vol){if(!AC||!BUF[n])return;var now=performance.now();if(LAST[n]&&now-LAST[n]<CD[n])return;LAST[n]=now;
 VO=VO.filter(function(v){if(v.n===n){try{v.s.stop()}catch(e){}return false}return v.end>AC.currentTime});
 while(VO.length>=3){var o=VO.shift();try{o.s.stop()}catch(e){}}
 var s=AC.createBufferSource(),g=AC.createGain();g.gain.value=vol||0.8;s.buffer=BUF[n];s.connect(g);g.connect(AC.destination);s.start();VO.push({n:n,s:s,end:AC.currentTime+BUF[n].duration})}
// ---------- helpers ----------
function lvl(){return Math.floor(S.L)}
function rank(l){var r=RANKS[0][1];RANKS.forEach(function(x){if(l>=x[0])r=x[1]});return r}
function destIdx(l){var i=0;DEST.forEach(function(d,j){if(l>=d.lv)i=j});return i}
function planet(d,sz){var bg=d.bh?'radial-gradient(circle,#000 42%,#ff9a2a 50%,#ffd27a 56%,rgba(255,120,0,.35) 64%,rgba(0,0,0,0) 70%)':
 d.neb?'radial-gradient(circle at 40% 40%,#fff 0,'+d.c1+' 22%,'+d.c2+' 60%,rgba(40,20,120,0) 72%)':
 d.bands?'radial-gradient(circle at 35% 30%,rgba(255,255,255,.35),rgba(0,0,0,0) 45%),repeating-linear-gradient(180deg,'+d.c1+' 0,'+d.c1+' 12%,'+d.c2+' 12%,'+d.c2+' 18%)':
 'radial-gradient(circle at 35% 30%,'+d.c1+','+d.c2+' 75%)';
 var sh=d.glow?'0 0 '+(sz*.35|0)+'px '+d.glow:(d.bh||d.neb?'none':'inset -'+(sz*.12|0)+'px -'+(sz*.1|0)+'px '+(sz*.2|0)+'px rgba(0,0,0,.45)');
 return '<div class="pl" style="width:'+sz+'px;height:'+sz+'px;background:'+bg+';box-shadow:'+sh+'">'+(d.ring?'<div class="ring"></div>':'')+(d.em?'<div class="em" style="font-size:'+(sz*.45|0)+'px">'+d.em+'</div>':'')+'</div>'}
function show(id){$(id).classList.remove('hide')}function hide(id){$(id).classList.add('hide')}
function tap(el,fn){var last=0;function go(e){e.preventDefault();var n=Date.now();if(n-last<250)return;last=n;fn(e)}el.addEventListener('click',go)}
// ---------- topic stats ----------
function T(n){if(!S.tp[n])S.tp[n]={n:0,c:0,last:[],hi:0};return S.tp[n]}
function tStatus(t){if(!t||t.n===0)return'new';var l=t.last.slice(-10),a=l.filter(Boolean).length/l.length;if(t.n>=8&&l.length>=8&&a>=.8)return'mastered';if(l.length>=5&&a<.6)return'struggling';return'working'}
// ---------- adaptive engine ----------
var cur=null,curSk=null,lastSk=null,ease=false,missRow=0,qStart=0,typed='',busy=false,blitz=false,bEnd=0,bScore=0,sess=null;
function pickSkill(){var L=lvl(),pool=SK.filter(function(s){return s.lv<=L});
 if(ease){var e=pool.filter(function(s){return s.lv<=Math.max(1,L-2)});if(e.length)pool=e}
 var w=pool.map(function(s){var d=L-s.lv,x=d<=1?5:d<=3?3:d<=6?1.2:.4;if(tStatus(S.tp[s.tp])==='struggling')x*=1.6;if(s===lastSk)x*=.25;return x});
 var tot=w.reduce(function(a,b){return a+b},0),r=Math.random()*tot;for(var i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i]}return pool[pool.length-1]}
function grade(ok,ms){var s=curSk,t=T(s.tp),before=lvl(),fast=ms<s.t*1000;S.total++;t.n++;t.last.push(ok?1:0);if(t.last.length>20)t.last.shift();
 S.recent.push({ok:ok?1:0,ms:Math.round(ms),lv:s.lv,tp:s.tp,d:Date.now()});if(S.recent.length>100)S.recent.shift();
 if(sess){sess.n++;if(ok)sess.c++;sess.end=lvl()}
 if(ok){S.correct++;t.c++;if(s.lv>t.hi)t.hi=s.lv;S.streak++;if(S.streak>S.best)S.best=S.streak;if(missRow>0){S.back++}missRow=0;ease=false;
  S.L+=0.3+(fast?0.25:0)+(S.streak>=3?0.1:0)}
 else{S.streak=0;missRow++;S.L-=0.45+(missRow>=2?0.3:0);ease=true}
 S.L=Math.max(1,Math.min(24.99,S.L));if(lvl()>S.maxL)S.maxL=lvl();if(sess)sess.end=lvl();
 badgeCheck();save();return lvl()-before}
function newQ(){curSk=pickSkill();lastSk=curSk;cur=curSk.g();typed='';qStart=performance.now();busy=false;renderQ()}
// ---------- question UI ----------
function renderQ(){var c=cur;$('qtop').textContent=curSk.tp+' \u2022 Level '+lvl();var q=$('qtext');q.innerHTML=String(c.q).replace(/\n/g,'<br>');q.className=String(c.q).length>34?'long':'';
 $('qvis').innerHTML=c.vis||'';var pad=$('pad');pad.innerHTML='';hide('fb');$('card').className='';
 if(c.ch){hide('ansBox');c.ch.forEach(function(v){var b=document.createElement('button');b.className='k mc'+(c.em?' em':'');b.textContent=v;tap(b,function(){if(busy)return;sfx('tap',.5);answer(v===String(c.a))});pad.appendChild(b)})}
 else{show('ansBox');$('ansBox').textContent='';['1','2','3','4','5','6','7','8','9','\u232b','0','GO'].forEach(function(v){var b=document.createElement('button');b.className='k'+(v==='GO'?' go':v==='\u232b'?' del':'');b.textContent=v;
  b.addEventListener('pointerdown',function(e){e.preventDefault();if(busy)return;b.classList.add('pr');setTimeout(function(){b.classList.remove('pr')},120);key(v)});pad.appendChild(b)})}}
function key(v){if(v==='GO'){if(!typed)return;answer(parseInt(typed,10)===cur.a);return}sfx('tap',.45);if(v==='\u232b')typed=typed.slice(0,-1);else if(typed.length<5)typed=(typed==='0'?'':typed)+v;$('ansBox').textContent=fmtT(typed)}
function fmtT(t){return t.length>3?fmt(t):t}
document.addEventListener('keydown',function(e){if($('game').classList.contains('hide')||busy||!cur||cur.ch)return;if(/^[0-9]$/.test(e.key))key(e.key);else if(e.key==='Backspace')key('\u232b');else if(e.key==='Enter')key('GO')});
function answer(ok){if(busy)return;busy=true;var ms=performance.now()-qStart,up=grade(ok,ms);
 if(ok){$('card').className='good';FX.shoot();sfx('zap');if(blitz)bScore++;
  var fe=[5,10,15,20,25,30,40,50];if(fe.indexOf(S.streak)>=0){setTimeout(function(){FX.fireworks(S.streak>=10?10:6);sfx('firework');banner(S.streak+' IN A ROW!',S.streak>=10?'SUPERNOVA!':'Hot streak!')},500)}
  if(up>0){setTimeout(function(){sfx('levelup');banner('LEVEL '+lvl()+'!',rank(lvl()));FX.fireworks(4)},S.streak%5===0?1500:400)}
  hud();setTimeout(function(){if(!FX.warping)newQ()},650)}
 else{sfx('miss');FX.enemyShot();hud();var fb=$('fb');show('fb');
  fb.innerHTML='<h2>'+P(['Almost!','So close!','Nice try, pilot!','Shields up!'])+'</h2><p>The answer is <span style="color:#7dffb0">'+(typeof cur.a==='number'?fmt(cur.a):cur.a)+'</span></p><p class="hint">'+(cur.h||'')+'</p><button class="big blue" id="fbGo">Keep flying \u2794</button>';
  tap($('fbGo'),function(){sfx('tap',.5);newQ()})}}
// ---------- HUD / banner ----------
function hud(){$('rank').textContent=rank(lvl())+' \u2022 Lv '+lvl();$('fuel').style.width=(FX.fuel/5*100)+'%';$('streak').textContent='\ud83d\udd25 '+S.streak;$('streak').style.visibility=S.streak>=2?'visible':'hidden'}
var bT=0;function banner(a,b){var el=$('banner');el.innerHTML=a+(b?'<small>'+b+'</small>':'');el.classList.add('on');clearTimeout(bT);bT=setTimeout(function(){el.classList.remove('on')},1800)}
// ---------- badges ----------
function give(id){if(S.badges.indexOf(id)>=0)return;S.badges.push(id);var b=BADGES.filter(function(x){return x[0]===id})[0];setTimeout(function(){banner(b[1]+' '+b[2],'New badge!');sfx('ding')},1100)}
function badgeCheck(){if(S.correct>=1)give('first');if(S.best>=5)give('s5');if(S.best>=10)give('s10');if(S.best>=20)give('s20');
 [5,10,15,20,24].forEach(function(l){if(S.maxL>=l)give('lv'+l)});if(S.blasts>=25)give('blast25');if(S.blasts>=100)give('blast100');if(S.back>=5)give('back5');
 if(S.log.length>=8)give('facts8');if(S.log.length>=DEST.length)give('factsAll');if(S.blitzBest>=15)give('blitz15');
 if(TOPICS.filter(function(t){return tStatus(S.tp[t])==='mastered'}).length>=3)give('master3')}
// ---------- arrivals / fact cards ----------
function logDest(i){var id=DEST[i].id;if(S.log.indexOf(id)<0){S.log.push(id);badgeCheck();save();return true}return false}
function factCard(i,isNew,then){var d=DEST[i];$('factCard').innerHTML=planet(d,140)+'<div><h2>'+d.name+'</h2>'+(d.real?'<span class="tag real">\u2714 Real Fact</span>':'<span class="tag leg">\u2728 Space Legend</span>')+
 (isNew?' <span class="tag" style="background:#7a5a00;color:#ffe9a8">New logbook card!</span>':'')+'<ul>'+d.facts.map(function(f){return'<li>'+f+'</li>'}).join('')+'</ul>'+(d.real?'<div class="src">Source: '+d.src+'</div>':'')+
 '<div class="row" style="justify-content:flex-start"><button class="big green" id="fcGo">'+(then?'Blast off! \ud83d\ude80':'Cool!')+'</button></div></div>';
 show('fact');sfx('ding');tap($('fcGo'),function(){sfx('tap',.5);hide('fact');if(then)then()})}
function onWarpDone(){var tgt=destIdx(lvl());if(tgt>S.at){S.at++;FX.setDest(S.at);var n=logDest(S.at);save();banner('ARRIVED!',DEST[S.at].name);setTimeout(function(){factCard(S.at,n,function(){newQ()})},900)}else{FX.setDest(S.at);newQ()}}
// ---------- screens ----------
function start(b){blitz=b;unlock();hide('title');show('game');show('hud');sess={d:Date.now(),n:0,c:0,startL:lvl(),end:lvl(),blitz:b?1:0};S.sessions.push(sess);if(S.sessions.length>30)S.sessions.shift();
 FX.setDest(S.at);hud();if(b){bEnd=Date.now()+90000;bScore=0;show('timer');tick()}else hide('timer');
 if(S.log.indexOf(DEST[S.at].id)<0){logDest(S.at);factCard(S.at,true,newQ)}else newQ()}
function tick(){if(!blitz)return;var r=Math.max(0,Math.ceil((bEnd-Date.now())/1000));$('timer').textContent='\u23f1 '+r;if(r<=0){endBlitz();return}setTimeout(tick,250)}
function endBlitz(){blitz=false;busy=true;if(bScore>S.blitzBest)S.blitzBest=bScore;badgeCheck();save();hide('timer');FX.fireworks(8);sfx('firework');
 var fb=$('fb');show('fb');fb.innerHTML='<h2>\u26a1 Blitz over!</h2><p>You blasted '+bScore+' problems!</p><p class="hint">Best: '+S.blitzBest+'</p><button class="big green" id="fbGo">Keep exploring</button>';tap($('fbGo'),function(){newQ()})}
function toTitle(){hide('game');hide('hud');show('title');blitz=false;$('tlv').textContent=rank(lvl())+' \u2022 Level '+lvl()+' \u2022 '+DEST[S.at].name}
// map
function openMap(){show('map');var box=$('mapBox'),W=box.clientWidth,H=box.clientHeight,por=H>W,cols=por?2:4,rows=Math.ceil(DEST.length/cols),pts=[];
 var html='';DEST.forEach(function(d,i){var r=Math.floor(i/cols),c=i%cols;if(r%2)c=cols-1-c;var x=(c+.5)/cols*W,y=(r+.5)/rows*H;pts.push(x+','+y);
  var lock=i>destIdx(S.maxL),sz=Math.max(34,Math.min(64,H/rows-34));
  html+='<button class="node'+(lock?' lock':'')+'" data-i="'+i+'" style="left:'+x+'px;top:'+y+'px">'+(i===S.at?'<span class="you">\ud83d\ude80</span>':'')+planet(d,sz)+(lock?'\ud83d\udd12 Lv '+d.lv:d.name)+'</button>'});
 box.innerHTML='<svg viewBox="0 0 '+W+' '+H+'"><polyline points="'+pts.join(' ')+'" fill="none" stroke="rgba(140,180,255,.5)" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/></svg>'+html;
 Array.prototype.forEach.call(box.querySelectorAll('.node'),function(n){tap(n,function(){var i=+n.getAttribute('data-i');sfx('tap',.5);if(i>destIdx(S.maxL)){banner('\ud83d\udd12 Locked','Reach level '+DEST[i].lv+' to fly here!');return}factCard(i,false,null)})})}
function openLog(){show('logbook');$('logList').innerHTML='<p style="color:#b8ccff;margin:0 0 10px">'+S.log.length+' of '+DEST.length+' cards collected</p>'+DEST.map(function(d,i){var got=S.log.indexOf(d.id)>=0;
 return got?'<div class="le">'+planet(d,64)+'<div><b>'+d.name+'</b> '+(d.real?'<span class="tag real">\u2714 Real Fact</span>':'<span class="tag leg">\u2728 Space Legend</span>')+'<br>'+d.facts.join(' ')+'</div></div>':'<div class="le" style="opacity:.4"><div class="pl" style="width:64px;height:64px;background:#222a55;margin-right:14px;text-align:center;line-height:64px;font-size:28px">?</div><div><b>???</b><br>Reach level '+d.lv+' to discover.</div></div>'}).join('')}
function openBadges(){show('badges');$('badgeList').innerHTML=BADGES.map(function(b){return'<div class="bd'+(S.badges.indexOf(b[0])<0?' off':'')+'"><i>'+b[1]+'</i>'+b[2]+'<br><span style="font-weight:500;color:#b8ccff">'+b[3]+'</span></div>'}).join('')}
// ---------- parent view (hold gear 1.5s) ----------
var gT=0,gS=0;function gateDown(e){e.preventDefault();show('gate');gS=Date.now();(function f(){var p=(Date.now()-gS)/1500;$('gateBar').firstChild.style.width=Math.min(100,p*100)+'%';if(p>=1){hide('gate');openParent();return}gT=requestAnimationFrame(f)})()}
function gateUp(){cancelAnimationFrame(gT);hide('gate')}
['gear','gear2'].forEach(function(id){var g=$(id);g.addEventListener('pointerdown',gateDown);g.addEventListener('pointerup',gateUp);g.addEventListener('pointerleave',gateUp);g.addEventListener('pointercancel',gateUp)});
function pct(a){return a.length?Math.round(a.filter(function(x){return x.ok}).length/a.length*100)+'%':'\u2014'}
function openParent(){show('parent');var r20=S.recent.slice(-20),r100=S.recent,avg=r20.length?(r20.reduce(function(a,b){return a+b.ms},0)/r20.length/1000).toFixed(1)+'s':'\u2014';
 var rows=TOPICS.map(function(n){var t=S.tp[n],st=tStatus(t),l=t?t.last.slice(-10):[];return'<tr><td>'+n+'</td><td>'+(t?t.n:0)+'</td><td>'+(l.length?Math.round(l.filter(Boolean).length/l.length*100)+'%':'\u2014')+'</td><td>'+(t&&t.hi?'Lv '+t.hi:'\u2014')+'</td><td>'+({mastered:'\u2705 Mastered',struggling:'\u26a0\ufe0f Needs practice',working:'\ud83d\udd04 Working on it','new':'\u2014 Not yet'})[st]+'</td></tr>'}).join('');
 var ses=S.sessions.slice(-8).reverse().map(function(s){var d=new Date(s.d);return'<tr><td>'+(d.getMonth()+1)+'/'+d.getDate()+' '+d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+(s.blitz?' \u26a1':'')+'</td><td>'+s.n+'</td><td>'+(s.n?Math.round(s.c/s.n*100)+'%':'\u2014')+'</td><td>'+s.startL+' \u2192 '+s.end+'</td></tr>'}).join('');
 var m=TOPICS.filter(function(t){return tStatus(S.tp[t])==='mastered'}),sg=TOPICS.filter(function(t){return tStatus(S.tp[t])==='struggling'});
 $('parentBody').innerHTML='<div><span class="stat">Level now<b>'+lvl()+' <small style="font-size:13px">('+S.L.toFixed(1)+')</small></b></span><span class="stat">Highest level<b>'+S.maxL+'</b></span><span class="stat">Rank<b style="font-size:16px">'+rank(lvl())+'</b></span><span class="stat">Last 20 accuracy<b>'+pct(r20)+'</b></span><span class="stat">Last 100<b>'+pct(r100)+'</b></span><span class="stat">Avg time (last 20)<b>'+avg+'</b></span><span class="stat">Problems total<b>'+S.total+'</b></span><span class="stat">Best streak<b>'+S.best+'</b></span><span class="stat">Blitz best<b>'+S.blitzBest+'</b></span></div>'+
 '<p><b>Mastered:</b> '+(m.join(', ')||'none yet')+'<br><b>Needs practice:</b> '+(sg.join(', ')||'nothing flagged')+'</p>'+
 '<p style="color:#556">Level guide: 1\u20133 facts to 20 \u2022 4\u20139 place value, 2-digit +/\u2212 with regrouping, coins, clocks, skip counting \u2022 10\u201314 3-digit +/\u2212, early \u00d7/\u00f7, fractions, logic \u2022 15\u201319 \u00d7/\u00f7 facts, change, elapsed time, 2-digit\u00d71-digit \u2022 20\u201324 4-digit, remainders, equivalent fractions, order of operations. 1st grade \u2248 levels 1\u20136.</p>'+
 '<h3>Topics</h3><table><tr><th>Topic</th><th>Tries</th><th>Last 10</th><th>Hardest</th><th>Status</th></tr>'+rows+'</table>'+
 '<h3>Recent sessions</h3><table><tr><th>When</th><th>Problems</th><th>Accuracy</th><th>Level</th></tr>'+(ses||'<tr><td colspan=4>None yet</td></tr>')+'</table>'+
 '<h3>Settings</h3><div>Set level: <button class="pb" id="pDn">\u2212</button> <b id="pLv">'+lvl()+'</b> <button class="pb" id="pUp">+</button> <button class="pb red" id="pReset">Reset all progress</button></div><p style="color:#778;font-size:12px">Saved on this device only (localStorage). Adaptation: +level for right answers (more if quick), gentle step back and easier review after a miss. No timers except optional Blitz.</p>';
 function setL(v){S.L=Math.max(1,Math.min(24,v));if(lvl()>S.maxL)S.maxL=lvl();S.at=Math.min(S.at,destIdx(lvl()));if(destIdx(lvl())>S.at)S.at=destIdx(lvl());FX.setDest(S.at);save();openParent();hud()}
 tap($('pDn'),function(){setL(lvl()-1)});tap($('pUp'),function(){setL(lvl()+1)});tap($('pReset'),function(){if(confirm('Reset all of Alex\u2019s progress?')){S=fresh();save();openParent();hud()}})}
// ---------- wire up ----------
tap($('bPlay'),function(){sfx('tap');start(false)});tap($('bBlitz'),function(){sfx('tap');start(true)});
tap($('bMap'),function(){sfx('tap',.5);openMap()});tap($('bLog'),function(){sfx('tap',.5);openLog()});tap($('bBadge'),function(){sfx('tap',.5);openBadges()});
tap($('hMap'),function(){sfx('tap',.5);openMap()});tap($('hLog'),function(){sfx('tap',.5);openLog()});tap($('hBack'),function(){sfx('tap',.5);toTitle()});
Array.prototype.forEach.call(document.querySelectorAll('.x'),function(x){tap(x,function(){sfx('tap',.4);hide(x.getAttribute('data-c'))})});
addEventListener('resize',function(){if(!$('map').classList.contains('hide'))openMap()});
var FX=window.makeFX($('sky'),{onBlast:function(){S.blasts++;badgeCheck();save()},onWarp:onWarpDone,onFuelFull:function(){sfx('levelup',.5);banner('WARP SPEED!','')},sfx:sfx});
FX.setDest(S.at);toTitle();
window.__M={S:function(){return S},grade:function(ok,ms){if(!curSk)curSk=pickSkill();var r=grade(ok,ms);curSk=pickSkill();return{L:S.L,lvl:lvl(),skill:curSk.id,skLv:curSk.lv}},newQ:newQ,cur:function(){return{q:cur.q,a:cur.a,sk:curSk.id,lv:curSk.lv}},answer:answer,openParent:openParent,openMap:openMap,openLog:openLog,openBadges:openBadges,factCard:factCard,start:start,FX:FX,reset:function(){S=fresh();save()}};
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
