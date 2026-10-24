'use strict';
function R(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function P(a){return a[Math.floor(Math.random()*a.length)]}
function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function mc(ans,wrong){var s=[String(ans)];for(var i=0;i<wrong.length&&s.length<4;i++){var w=String(wrong[i]);if(s.indexOf(w)<0)s.push(w)}return shuf(s)}
function near(a,k){var o=[];for(var d=1;o.length<k&&d<20;d++){if(a+d>=0)o.push(a+d);if(a-d>=0)o.push(a-d)}return shuf(o)}
function hhmm(h,m){return h+':'+(m<10?'0':'')+m}
// ---- visuals ----
function clockSvg(h,m){var s='<svg width="130" height="130" viewBox="-60 -60 120 120"><circle r="56" fill="#f5f7ff" stroke="#4f7dff" stroke-width="5"/>';
 for(var i=1;i<=12;i++){var a=i*Math.PI/6;s+='<text x="'+(44*Math.sin(a)).toFixed(1)+'" y="'+(-44*Math.cos(a)+5).toFixed(1)+'" font-size="13" font-weight="800" text-anchor="middle" fill="#1a2240">'+i+'</text>'}
 var ha=((h%12)+m/60)*30,ma=m*6;
 s+='<line x1="0" y1="0" x2="'+(26*Math.sin(ha*Math.PI/180)).toFixed(1)+'" y2="'+(-26*Math.cos(ha*Math.PI/180)).toFixed(1)+'" stroke="#1a2240" stroke-width="6" stroke-linecap="round"/>';
 s+='<line x1="0" y1="0" x2="'+(40*Math.sin(ma*Math.PI/180)).toFixed(1)+'" y2="'+(-40*Math.cos(ma*Math.PI/180)).toFixed(1)+'" stroke="#e8462a" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="#1a2240"/></svg>';return s}
var COIN={1:['#c8733a','1\u00a2',15],5:['#c9ced8','5\u00a2',18],10:['#dfe3ea','10\u00a2',14],25:['#d6dbe4','25\u00a2',21]};
function coinsSvg(list){var x=0,s='';list.forEach(function(v){var c=COIN[v];s+='<circle cx="'+(x+c[2])+'" cy="24" r="'+c[2]+'" fill="'+c[0]+'" stroke="#555" stroke-width="2"/><text x="'+(x+c[2])+'" y="29" font-size="12" font-weight="800" text-anchor="middle" fill="#222">'+c[1]+'</text>';x+=c[2]*2+5});
 return '<svg width="'+x+'" height="50" viewBox="0 0 '+x+' 50">'+s+'</svg>'}
function pieSvg(n,d){var s='<svg width="96" height="96" viewBox="-50 -50 100 100">';for(var i=0;i<d;i++){var a0=i/d*2*Math.PI-Math.PI/2,a1=(i+1)/d*2*Math.PI-Math.PI/2;
 s+='<path d="M0 0L'+(46*Math.cos(a0)).toFixed(2)+' '+(46*Math.sin(a0)).toFixed(2)+'A46 46 0 0 1 '+(46*Math.cos(a1)).toFixed(2)+' '+(46*Math.sin(a1)).toFixed(2)+'Z" fill="'+(i<n?'#ff9d3c':'#1c2660')+'" stroke="#fff" stroke-width="3"/>'}return s+'</svg>'}
function groups(g,k,e){var s='';for(var i=0;i<g;i++){s+='<div style="display:inline-block;margin:2px 6px;padding:2px 4px;border:2px dashed #6f9bff;border-radius:10px;font-size:18px">'+new Array(k+1).join(e)+'</div>'}return s}
var EM=['\ud83e\ude90','\u2b50','\ud83c\udf19','\ud83d\ude80','\ud83d\udc7d','\u2604\ufe0f'];
// ---- skills: lv = level where it unlocks; t = "fast" target seconds ----
var SK=[
{id:'add10',lv:1,tp:'Addition',t:5,g:function(){var a=R(1,9),b=R(0,10-a);return{q:a+' + '+b+' = ?',a:a+b,h:'Count up '+b+' from '+a+'.'}}},
{id:'sub10',lv:1,tp:'Subtraction',t:5,g:function(){var a=R(3,10),b=R(0,a);return{q:a+' \u2212 '+b+' = ?',a:a-b,h:'Count back '+b+' from '+a+'.'}}},
{id:'add20',lv:2,tp:'Addition',t:6,g:function(){var a=R(6,12),b=R(3,Math.min(9,20-a));return{q:a+' + '+b+' = ?',a:a+b,h:'Make a 10 first: '+a+' + '+(10-a%10)+' = '+(a+10-a%10)+'.'}}},
{id:'miss',lv:3,tp:'Logic',t:8,g:function(){var a=R(2,9),c=R(a+2,18);return{q:a+' + ? = '+c,a:c-a,h:c+' \u2212 '+a+' = '+(c-a)+'.'}}},
{id:'sub20',lv:3,tp:'Subtraction',t:7,g:function(){var c=R(11,19),b=R(2,9);return{q:c+' \u2212 '+b+' = ?',a:c-b,h:'Take '+(c-10)+' to get to 10, then keep going.'}}},
{id:'pv',lv:4,tp:'Place Value',t:7,g:function(){var t=R(2,9),o=R(0,9);return Math.random()<.5?{q:t+' tens and '+o+' ones = ?',a:t*10+o,h:t+' tens is '+t*10+'.'}:{q:'How many tens are in '+(t*10+o)+'?',a:t,h:'The left digit tells the tens.'}}},
{id:'cmp',lv:4,tp:'Place Value',t:7,g:function(){var a=R(10,99),b=Math.random()<.15?a:R(10,99);var r=a>b?'>':a<b?'<':'=';return{q:a+' \u25a2 '+b,ch:['<','=','>'],a:r,h:'Look at the tens first. The alligator mouth eats the bigger number.'}}},
{id:'skip',lv:4,tp:'Skip Counting',t:7,g:function(){var s=P([2,5,10]),st=s*R(0,6);return{q:[st,st+s,st+2*s,st+3*s].join(', ')+', ?',a:st+4*s,h:'Count by '+s+'s.'}}},
{id:'add2',lv:5,tp:'Addition',t:9,g:function(){var a=R(1,8),b=R(1,9-a),c=R(0,8),d=R(0,9-c);return{q:(a*10+c)+' + '+(b*10+d)+' = ?',a:(a+b)*10+c+d,h:'Add the tens, then the ones.'}}},
{id:'time',lv:5,tp:'Time',t:9,g:function(){var h=R(1,12),m=P([0,30]),ans=hhmm(h,m);return{q:'What time is it?',vis:clockSvg(h,m),ch:mc(ans,[hhmm(h,m?0:30),hhmm(h%12+1,m),hhmm(h===1?12:h-1,m?0:30),hhmm((h+5)%12+1,m)]),a:ans,h:'Short hand = hour, long hand = minutes.'}}},
{id:'coins',lv:5,tp:'Money',t:12,g:function(){var l=[],n=R(2,5);for(var i=0;i<n;i++)l.push(P([1,5,10]));l.sort(function(a,b){return b-a});var s=l.reduce(function(a,b){return a+b},0);return{q:'How many cents?',vis:coinsSvg(l),a:s,h:'Start with the biggest coins and count up.'}}},
{id:'sub2',lv:6,tp:'Subtraction',t:9,g:function(){var a=R(3,9),b=R(1,a-1),c=R(2,9),d=R(0,c);return{q:(a*10+c)+' \u2212 '+(b*10+d)+' = ?',a:(a-b)*10+c-d,h:'Subtract ones, then tens.'}}},
{id:'pat',lv:6,tp:'Patterns',t:9,g:function(){var e=shuf(EM.slice()).slice(0,3),k=P(['AB','ABC','AAB','ABB']),seq=[];for(var i=0;i<7;i++)seq.push(e[k.charCodeAt(i%k.length)-65]);var ans=seq.pop();return{q:'What comes next?',vis:'<div style="font-size:34px;letter-spacing:4px">'+seq.join('')+'\u2753</div>',ch:shuf(e.slice()),a:ans,em:1,h:'Find the part that repeats: '+k+'.'}}},
{id:'addR',lv:7,tp:'Addition',t:12,g:function(){var a=R(15,68),b=R(12,89-a);if((a%10)+(b%10)<10)b=Math.min(b+(10-(a%10)-(b%10))+R(0,3),99-a);return{q:a+' + '+b+' = ?',a:a+b,h:'Ones: '+(a%10)+' + '+(b%10)+' = '+(a%10+b%10)+', so carry a ten!'}}},
{id:'word1',lv:7,tp:'Word Problems',t:15,g:function(){var a=R(4,12),b=R(3,9);return P([
 {q:'Your ship has '+a+' lasers. You build '+b+' more. How many lasers now?',a:a+b,h:a+' + '+b},
 {q:'There are '+(a+b)+' asteroids. You blast '+b+'. How many are left?',a:a,h:(a+b)+' \u2212 '+b},
 {q:'Mars has 2 moons. Earth has 1 moon. How many moons is that altogether?',a:3,h:'2 + 1'},
 {q:a+' aliens are on the bridge. '+b+' more beam in. How many aliens?',a:a+b,h:a+' + '+b},
 {q:a+' T. rexes are stomping on Dino Planet. '+b+' more hatch from eggs. How many T. rexes?',a:a+b,h:a+' + '+b},
 {q:(a+b)+' jets fly in a row. '+b+' zoom off to land. How many jets are still flying?',a:a,h:(a+b)+' \u2212 '+b},
 {q:'You blast '+a+' space rocks. Then you blast '+b+' more. KABOOM! How many rocks did you blast?',a:a+b,h:a+' + '+b}])}},
{id:'subR',lv:8,tp:'Subtraction',t:12,g:function(){var a=R(31,95),b=R(12,a-10);if(a%10>=b%10){b=Math.max(11,b-(b%10)+(a%10)+1);if(b%10===0)b--;if(b>=a)b=a-R(5,9)}return{q:a+' \u2212 '+b+' = ?',a:a-b,h:'Not enough ones? Trade 1 ten for 10 ones.'}}},
{id:'money2',lv:8,tp:'Money',t:14,g:function(){var l=[],n=R(3,6);for(var i=0;i<n;i++)l.push(P([1,5,10,25,25]));l.sort(function(a,b){return b-a});var s=l.reduce(function(a,b){return a+b},0);return{q:'How many cents?',vis:coinsSvg(l),a:s,h:'Quarters are 25\u00a2: 25, 50, 75, 100!'}}},
{id:'pv3',lv:9,tp:'Place Value',t:9,g:function(){var h=R(1,9),t=R(1,9),o=R(0,9),n=h*100+t*10+o;return P([{q:'What is the value of the '+t+' in '+n+'?',a:t*10,h:'It is in the tens place.'},{q:h+' hundreds + '+t+' tens + '+o+' ones = ?',a:n,h:'Hundreds, tens, ones: '+h+t+o},{q:'What is 10 more than '+n+'?',a:n+10,h:'Only the tens digit changes.'},{q:'What is 100 less than '+n+'?',a:n-100,h:'Only the hundreds digit changes.'}])}},
{id:'skip34',lv:9,tp:'Skip Counting',t:9,g:function(){var s=P([3,4,25,100]),st=s*R(0,5);return{q:[st,st+s,st+2*s,st+3*s].join(', ')+', ?',a:st+4*s,h:'Count by '+s+'s.'}}},
{id:'time5',lv:10,tp:'Time',t:12,g:function(){var h=R(1,12),m=5*R(1,11),ans=hhmm(h,m);return{q:'What time is it?',vis:clockSvg(h,m),ch:mc(ans,[hhmm(h,(m+5)%60),hhmm(h,(m+55)%60),hhmm(h%12+1,m),hhmm(h,(60-m)%60||5)]),a:ans,h:'Count by 5s around the clock for the long hand.'}}},
{id:'multG',lv:10,tp:'Multiplication',t:10,g:function(){var g=R(2,5),k=P([2,5,10,3]);if(k===10&&g>3)g=3;return{q:g+' groups of '+k+' = ?',vis:groups(g,Math.min(k,10),'\u2b50'),a:g*k,h:'Skip count by '+k+', '+g+' times.'}}},
{id:'frac1',lv:10,tp:'Fractions',t:10,g:function(){var d=P([2,3,4]),n=R(1,d-1),ans=n+'/'+d;return{q:'How much is orange?',vis:pieSvg(n,d),ch:mc(ans,[(d-n)+'/'+d,n+'/'+(d+1),'1/'+n,d+'/'+n,'1/'+(d+2)]),a:ans,h:n+' orange parts out of '+d+' equal parts.'}}},
{id:'space',lv:11,tp:'Word Problems',t:18,g:function(){return P([
 {q:'12 astronauts walked on the Moon. 6 missions landed with 2 moonwalkers each. What is 6 \u00d7 2?',a:12,h:'6 + 6 = 12. Real fact!'},
 {q:'A day on Jupiter is about 10 hours. How many hours are 3 Jupiter days?',a:30,h:'10 + 10 + 10'},
 {q:'Sunlight takes about 8 minutes to reach Earth. How many minutes for a trip there and back?',a:16,h:'8 + 8'},
 {q:'New Horizons flew past Pluto in 2015 and Arrokoth in 2019. How many years apart?',a:4,h:'2019 \u2212 2015'},
 {q:'Mars has 2 moons. How many moons do 4 planets like Mars have?',a:8,h:'2 + 2 + 2 + 2'},
 {q:'A T. rex had 2 short arms. How many arms do 5 T. rexes have?',a:10,h:'2 + 2 + 2 + 2 + 2'},
 {q:'A fighter jet has 2 wings. How many wings do 6 jets have?',a:12,h:'6 \u00d7 2'},
 {q:'Olympus Mons is about 3 times taller than Mount Everest. If Everest were 9 blocks tall, how tall is Olympus Mons?',a:27,h:'9 \u00d7 3'}])}},
{id:'add3',lv:11,tp:'Addition',t:16,g:function(){var a=R(125,689),b=R(108,950-a);return{q:a+' + '+b+' = ?',a:a+b,h:'Ones, then tens, then hundreds. Carry when you get 10+.'}}},
{id:'sub3',lv:12,tp:'Subtraction',t:18,g:function(){var a=R(300,950),b=R(105,a-50);return{q:a+' \u2212 '+b+' = ?',a:a-b,h:'Trade from the next place when you need to.'}}},
{id:'mult5',lv:12,tp:'Multiplication',t:7,g:function(){var a=R(0,5),b=R(1,10);return{q:a+' \u00d7 '+b+' = ?',a:a*b,h:b+' groups of '+a+'.'}}},
{id:'logic1',lv:12,tp:'Logic',t:12,g:function(){var e=P(EM),v=R(2,9);return P([{q:e+' + '+e+' = '+(2*v)+'\nWhat is '+e+'?',a:v,h:'Two of the same that make '+2*v+'.'},{q:e+' + '+(v+3)+' = '+(2*v+3)+'\nWhat is '+e+'?',a:v,h:(2*v+3)+' \u2212 '+(v+3)}])}},
{id:'div1',lv:13,tp:'Division',t:9,g:function(){var b=P([2,5,10]),q=R(1,10);return{q:(b*q)+' \u00f7 '+b+' = ?',a:q,h:'How many '+b+'s make '+b*q+'?'}}},
{id:'fcmp',lv:14,tp:'Fractions',t:10,g:function(){var a=R(2,8),b=R(2,8);while(b===a)b=R(2,8);var ans='1/'+Math.min(a,b);return{q:'Which piece is BIGGER?',ch:shuf(['1/'+a,'1/'+b]),a:ans,h:'Fewer pieces = bigger pieces!'}}},
{id:'mult10',lv:14,tp:'Multiplication',t:7,g:function(){var a=R(2,10),b=R(2,10);return{q:a+' \u00d7 '+b+' = ?',a:a*b,h:a+' groups of '+b+'.'}}},
{id:'word2',lv:15,tp:'Word Problems',t:22,g:function(){var a=R(3,6),b=R(2,5),c=R(2,9);return P([
 {q:a+' ships each carry '+b+' aliens. Then '+c+' more aliens arrive. How many aliens?',a:a*b+c,h:a+' \u00d7 '+b+' = '+a*b+', then + '+c},
 {q:a+' jets each drop '+b+' fireworks. Then '+c+' more go BOOM. How many fireworks?',a:a*b+c,h:a+' \u00d7 '+b+' = '+a*b+', then + '+c},
 {q:'A dino nest has '+b+' eggs. There are '+a+' nests. '+c+' eggs hatch. How many eggs are left?',a:a*b-c,h:a+' \u00d7 '+b+' = '+a*b+', then \u2212 '+c},
 {q:'You had '+(a*b+c)+' fuel cells. You used '+c+', then split the rest into '+a+' equal piles. How many in each pile?',a:b,h:'('+(a*b+c)+' \u2212 '+c+') \u00f7 '+a}])}},
{id:'div10',lv:15,tp:'Division',t:9,g:function(){var b=R(3,10),q=R(2,10);return{q:(b*q)+' \u00f7 '+b+' = ?',a:q,h:'? \u00d7 '+b+' = '+b*q}}},
{id:'change',lv:16,tp:'Money',t:16,g:function(){var p=5*R(3,19);return{q:'You pay $1 (100\u00a2) for a '+p+'\u00a2 space snack. How much change?',a:100-p,h:'Count up from '+p+' to 100.'}}},
{id:'fof',lv:16,tp:'Fractions',t:12,g:function(){var d=P([2,3,4,5]),k=R(2,9);return{q:'1/'+d+' of '+d*k+' = ?',a:k,h:'Split '+d*k+' into '+d+' equal groups.'}}},
{id:'elapsed',lv:17,tp:'Time',t:16,g:function(){var h=R(1,10),m=5*R(0,6),add=5*R(3,10);return P([{q:'Launch at '+hhmm(h,m)+'. Landing at '+hhmm(h,m+add)+'. How many minutes did the flight take?',a:add,h:'Count by 5s from '+hhmm(h,m)+'.'},{q:'A space walk starts at '+h+':00 and lasts 3 hours. What hour does it end?',a:(h+3-1)%12+1,h:'Count 3 hours on the clock.'}])}},
{id:'m2d',lv:18,tp:'Multiplication',t:18,g:function(){var a=R(12,49),b=R(2,6);return{q:a+' \u00d7 '+b+' = ?',a:a*b,h:'('+(a-a%10)+' \u00d7 '+b+') + ('+(a%10)+' \u00d7 '+b+')'}}},
{id:'patM',lv:18,tp:'Patterns',t:14,g:function(){var t=R(0,2),s;if(t===0){var a=R(1,4);s=[a,a*2,a*4,a*8,a*16]}else if(t===1){var b=R(50,99),d=R(3,9);s=[b,b-d,b-2*d,b-3*d,b-4*d]}else{var c=R(1,5);s=[c,c+1,c+3,c+6,c+10]}var ans=s.pop();return{q:s.join(', ')+', ?',a:ans,h:t===0?'Each number doubles.':t===1?'It goes down the same amount each time.':'Add 1, then 2, then 3, then 4\u2026'}}},
{id:'mf',lv:19,tp:'Multiplication',t:12,g:function(){var a=R(3,10),b=R(3,10);return{q:'? \u00d7 '+b+' = '+a*b,a:a,h:a*b+' \u00f7 '+b}}},
{id:'logic2',lv:19,tp:'Logic',t:20,g:function(){var r=R(2,8),u=R(2,8);return{q:'\ud83d\ude80 + \ud83d\ude80 = '+2*r+'\n\ud83d\ude80 + \ud83d\udc7d = '+(r+u)+'\nWhat is \ud83d\udc7d?',a:u,h:'\ud83d\ude80 = '+r+', so \ud83d\udc7d = '+(r+u)+' \u2212 '+r}}},
{id:'add4',lv:20,tp:'Addition',t:20,g:function(){var a=R(1200,6800),b=R(1100,9800-a);return Math.random()<.5?{q:fmt(a)+' + '+fmt(b)+' = ?',a:a+b,h:'Line up the places and carry.'}:{q:fmt(a+b)+' \u2212 '+fmt(b)+' = ?',a:a,h:'Line up the places and trade.'}}},
{id:'divR',lv:21,tp:'Division',t:15,g:function(){var b=R(3,9),q=R(2,9),r=R(1,b-1);return{q:(b*q+r)+' \u00f7 '+b+' = '+q+' R ?\n(What is the remainder?)',a:r,h:q+' \u00d7 '+b+' = '+q*b+', and '+(b*q+r)+' \u2212 '+q*b+' = '+r}}},
{id:'feq',lv:22,tp:'Fractions',t:14,g:function(){var d=P([2,3,4]),k=R(2,4),ans=k+'/'+(d*k);return{q:'Which is the same as 1/'+d+'?',ch:mc(ans,[k+'/'+(d*k+1),'1/'+(d*k),(k+1)+'/'+(d*k),d+'/'+k]),a:ans,h:'Multiply top and bottom by '+k+'.'}}},
{id:'word3',lv:22,tp:'Word Problems',t:25,g:function(){var a=R(3,9),b=R(3,8),c=R(2,4);return P([
 {q:'A star cruiser has '+c+' decks. Each deck has '+b+' rows of '+a+' seats. How many seats?',a:a*b*c,h:c+' \u00d7 '+b+' \u00d7 '+a},
 {q:c+' jet squadrons each have '+b+' jets. Each jet fires '+a+' rockets. How many rockets?',a:a*b*c,h:c+' \u00d7 '+b+' \u00d7 '+a},
 {q:'Proxima\u2019s light takes about 4 years to reach us. How many years for light to go there and back '+c+' times?',a:8*c,h:'4 + 4 = 8 for one round trip, \u00d7 '+c}])}},
{id:'m12',lv:23,tp:'Multiplication',t:12,g:function(){return P([function(){var a=R(11,12),b=R(2,12);return{q:a+' \u00d7 '+b+' = ?',a:a*b,h:'('+b+' \u00d7 10) + ('+b+' \u00d7 '+(a-10)+')'}},function(){var a=R(2,9)*10,b=R(2,9);return{q:a+' \u00d7 '+b+' = ?',a:a*b,h:(a/10)+' \u00d7 '+b+', then add a zero.'}}])()}},
{id:'logic3',lv:24,tp:'Logic',t:20,g:function(){var a=R(2,9),b=R(2,6),c=R(2,6);return P([{q:a+' + '+b+' \u00d7 '+c+' = ?',a:a+b*c,h:'Multiply first! '+b+' \u00d7 '+c+' = '+b*c},{q:a+' \u00d7 ('+b+' + '+c+') = ?',a:a*(b+c),h:'Parentheses first: '+(b+c)},{q:(b*c+a)+' \u2212 '+b+' \u00d7 '+c+' = ?',a:a,h:'Multiply first.'}])}}
];
