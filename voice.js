'use strict';
// Turns a question into a list of pre-recorded voice clip keys (natural Piper voice, see src/genvoice.js).
(function(G){
var EMN={'\ud83d\ude80':' rocket ','\ud83d\udc7d':' alien ','\u2b50':' star ','\ud83c\udf19':' moon ','\u2604\ufe0f':' comet ','\ud83e\ude90':' planet ','\ud83e\udd96':' T. rex ','\u2708\ufe0f':' jet '};
var ONES=['zero','one','two','three','four','five','six','seven','eight','nine'];
function norm(t){t=t.replace(/(^|\s)\?(?=\s|$)/g,'$1what');Object.keys(EMN).forEach(function(e){t=t.split(e).join(EMN[e])});
 t=t.replace(/\+/g,' plus ').replace(/\u2212/g,' minus ').replace(/\u00d7/g,' times ').replace(/\u00f7/g,' divided by ').replace(/=/g,' equals ').replace(/\u25a2/g,' compared to ')
  .replace(/\u00a2/g,' cents ').replace(/\$/g,' ').replace(/\//g,' over ').replace(/[(),:\u2019']/g,function(c){return c==='\u2019'||c==="'"?"'":' '}).replace(/\bR\s*\?/g,' remainder what ')
  .replace(/\s+/g,' ').trim();
 t=t.replace(/equals\?$/,'equals what').replace(/^[.\s]+/,'').replace(/\bBIGGER\b/,'bigger').replace(/\bR what What is the remainder\?/,'remainder what? What is the remainder?').trim();
 return t.replace(/\s*\?$/,'?')}
function key(p){var h=0;for(var i=0;i<p.length;i++)h=(h*31+p.charCodeAt(i))>>>0;return 'p_'+p.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40)+'_'+(h%100000)}
function num(n,o){if(n<100){o.push('n'+n);return}if(n>=1000){o.push('n'+Math.floor(n/1000),'w_thousand');n%=1000;if(n){num(n,o)}return}
 o.push('n'+Math.floor(n/100),'w_hundred');n%=100;if(n)o.push('n'+n)}
function parts(q,phr){var o=[];String(q).replace('$1 (100\u00a2)','one dollar').replace(/<[^>]+>/g,' ').replace(/\n/g,' ').split(/(\d[\d,]*)/).forEach(function(t,i){
 if(i%2){if(t==='00'){o.push('w_oclock');return}if(/^0\d$/.test(t)){o.push('w_oh','n'+(+t[1]));return}num(+t.replace(/,/g,''),o);return}
 var p=norm(t);if(!p)return;var k=key(p);o.push(k);if(phr)phr[k]=p});return o}
G.QV={parts:parts,norm:norm,ONES:ONES};
})(typeof window!=='undefined'?window:global);
