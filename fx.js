'use strict';
window.makeFX=function(cv,cb){
var ctx=cv.getContext('2d'),W=0,H=0,DPR=1,stars=[],parts=[],beams=[],rockets=[],t0=performance.now(),shake=0,flash=0,shield=0;
var fx={fuel:0,warping:false},warpT=0,dest=DEST[0],tgt=null,shipX=0,shipY=0,sc={w:0,h:0};
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR|0;cv.height=H*DPR|0;ctx.setTransform(DPR,0,0,DPR,0,0);
 var land=W>=H;sc.w=land?W*0.54:W;sc.h=land?H:H*0.4;sc.top=land?60:54;}
addEventListener('resize',resize);resize();
for(var i=0;i<240;i++)stars.push({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random()*0.9+0.1});
function newTarget(){var k=dest.id==='dino'?'dino':Math.random()<.55?'rock':'ufo';var pts=[];for(var i=0;i<11;i++)pts.push(0.75+Math.random()*0.3);
 tgt={k:k,hp:2,max:2,x:sc.w*1.2,pts:pts,rot:0,hit:0,cr:[[.3,-.2,.18],[-.25,.25,.14],[.05,.35,.1]]}}
fx.setDest=function(i){dest=DEST[i];newTarget()};
function boom(x,y,n,cols,sp){for(var i=0;i<n;i++){var a=Math.random()*6.283,v=(Math.random()*.8+.2)*(sp||6);parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,d:.012+Math.random()*.02,c:cols[i%cols.length],s:2+Math.random()*4})}}
fx.shoot=function(){if(!tgt)newTarget();var tx=tgt.x,ty=sc.top+(sc.h-sc.top)*.5;beams.push({x1:shipX+40,y1:shipY,x2:tx,y2:ty,l:1});tgt.hit=1;tgt.hp--;
 boom(tx,ty,24,['#fff','#ffd76a','#ff8a3d'],5);
 if(tgt.hp<=0){var x=tgt.x;setTimeout(function(){boom(x,ty,90,['#fff','#ffe066','#ff8a3d','#ff3d3d','#b56bff'],9);shake=14;flash=.5;cb.sfx('boom');cb.onBlast();newTarget()},120)}
 fx.fuel++;if(fx.fuel>=5){fx.warping=true;setTimeout(function(){cb.onFuelFull();warpT=1},700);setTimeout(function(){fx.fuel=0;fx.warping=false;warpT=0;cb.onWarp()},2900)}};
fx.enemyShot=function(){if(!tgt)return;beams.push({x1:tgt.x,y1:sc.top+(sc.h-sc.top)*.5,x2:shipX+30,y2:shipY,l:1,e:1});setTimeout(function(){shield=1;shake=6},150)};
fx.fireworks=function(n){for(var i=0;i<n;i++)(function(i){setTimeout(function(){rockets.push({x:W*(.1+Math.random()*.8),y:H,vy:-(H/55)-Math.random()*4,ty:H*(.12+Math.random()*.35),c:['#ff4fd8','#ffd76a','#4dff9a','#29e7ff','#ff6b3d','#b56bff'][i%6]})},i*180)})(i)};
function drawShip(x,y,s,t){ctx.save();ctx.translate(x,y);
 var fl=0.7+Math.sin(t*40)*.2+Math.random()*.15;ctx.fillStyle='rgba(80,200,255,.85)';ctx.beginPath();ctx.moveTo(-s*.55,-s*.12);ctx.lineTo(-s*(.55+.55*fl*(warpT?2:1)),0);ctx.lineTo(-s*.55,s*.12);ctx.fill();
 ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-s*.55,-s*.06);ctx.lineTo(-s*(.55+.3*fl),0);ctx.lineTo(-s*.55,s*.06);ctx.fill();
 ctx.fillStyle='#3a4fb8';ctx.beginPath();ctx.moveTo(-s*.3,-s*.1);ctx.lineTo(-s*.55,-s*.55);ctx.lineTo(-s*.15,-s*.5);ctx.lineTo(s*.2,-s*.1);ctx.fill();ctx.beginPath();ctx.moveTo(-s*.3,s*.1);ctx.lineTo(-s*.55,s*.55);ctx.lineTo(-s*.15,s*.5);ctx.lineTo(s*.2,s*.1);ctx.fill();
 var g=ctx.createLinearGradient(0,-s*.2,0,s*.2);g.addColorStop(0,'#f4f7ff');g.addColorStop(1,'#8a96c8');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(s*.7,0);ctx.quadraticCurveTo(s*.2,-s*.22,-s*.58,-s*.16);ctx.lineTo(-s*.58,s*.16);ctx.quadraticCurveTo(s*.2,s*.22,s*.7,0);ctx.fill();
 ctx.fillStyle='#ff4f4f';ctx.fillRect(-s*.45,-s*.03,s*.6,s*.06);
 ctx.fillStyle='#29e7ff';ctx.beginPath();ctx.ellipse(s*.25,-s*.04,s*.16,s*.08,0,0,6.283);ctx.fill();ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(s*.28,-s*.07,s*.06,s*.025,0,0,6.283);ctx.fill();
 if(shield>0){ctx.strokeStyle='rgba(120,220,255,'+shield+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,s*.8,0,6.283);ctx.stroke();ctx.fillStyle='rgba(120,220,255,'+shield*.2+')';ctx.fill()}
 ctx.restore()}
function drawTarget(T,t){var y=sc.top+(sc.h-sc.top)*.5+Math.sin(t*1.7)*8,s=Math.min(sc.w,sc.h)*.17;ctx.save();ctx.translate(T.x,y);if(T.hit>0){ctx.translate((Math.random()-.5)*10*T.hit,0)}
 if(T.k==='rock'){T.rot+=.01;ctx.rotate(T.rot);ctx.fillStyle=T.hit>.5?'#fff':'#8a7560';ctx.beginPath();T.pts.forEach(function(r,i){var a=i/T.pts.length*6.283;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r*s,Math.sin(a)*r*s)});ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.25)';T.cr.forEach(function(c){ctx.beginPath();ctx.arc(c[0]*s,c[1]*s,c[2]*s,0,6.283);ctx.fill()});ctx.strokeStyle='#5a4630';ctx.lineWidth=3;ctx.stroke()}
 else if(T.k==='ufo'){ctx.fillStyle='rgba(120,255,150,.75)';ctx.beginPath();ctx.ellipse(0,-s*.18,s*.38,s*.35,0,3.1416,6.283);ctx.fill();ctx.font=(s*.45|0)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\ud83d\udc7d',0,-s*.28);
  var g=ctx.createLinearGradient(0,-s*.2,0,s*.25);g.addColorStop(0,'#e8ecf8');g.addColorStop(1,'#5a6488');ctx.fillStyle=T.hit>.5?'#fff':g;ctx.beginPath();ctx.ellipse(0,0,s*.9,s*.25,0,0,6.283);ctx.fill();
  for(var i=0;i<5;i++){ctx.fillStyle=((t*6|0)+i)%2?'#ffd76a':'#ff4fd8';ctx.beginPath();ctx.arc((i-2)*s*.32,s*.05,s*.06,0,6.283);ctx.fill()}}
 else{ctx.scale(-1,1);ctx.font=(s*1.4|0)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\ud83e\udd96',0,0);ctx.font=(s*.6|0)+'px sans-serif';ctx.fillText('\u2604\ufe0f',-s*.2,s*.7)}
 ctx.restore();for(var i=0;i<T.max;i++){ctx.fillStyle=i<T.hp?'#ff4f4f':'rgba(255,255,255,.25)';ctx.fillRect(T.x-T.max*14+i*28,y-s*1.25,22,8)}}
function drawPlanet(t){var r=Math.min(sc.w,sc.h)*.42,x=sc.w*.82,y=sc.h*.98;if(dest.bh){var g=ctx.createRadialGradient(x,y,r*.4,x,y,r*1.3);g.addColorStop(0,'#000');g.addColorStop(.32,'#000');g.addColorStop(.4,'#ffcf7a');g.addColorStop(.5,'rgba(255,120,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*1.3,0,6.283);ctx.fill();return}
 if(dest.neb){for(var i=0;i<4;i++){var gx=sc.w*(.3+.2*i),gy=sc.h*(.3+.15*(i%2)),gg=ctx.createRadialGradient(gx,gy,0,gx,gy,r*1.2);gg.addColorStop(0,i%2?'rgba(255,120,220,.35)':'rgba(120,120,255,.35)');gg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,sc.w,sc.h)}return}
 if(dest.glow){var gl=ctx.createRadialGradient(x,y,r*.8,x,y,r*1.5);gl.addColorStop(0,dest.glow);gl.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=.55;ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,y,r*1.5,0,6.283);ctx.fill();ctx.globalAlpha=1}
 var p=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);p.addColorStop(0,dest.c1);p.addColorStop(1,dest.c2);ctx.fillStyle=p;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();
 if(dest.bands){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.clip();ctx.fillStyle='rgba(150,80,40,.35)';for(var b=-3;b<4;b++)ctx.fillRect(x-r,y+b*r*.25,2*r,r*.08);ctx.fillStyle='rgba(200,60,40,.7)';ctx.beginPath();ctx.ellipse(x-r*.3,y-r*.45,r*.14,r*.08,0,0,6.283);ctx.fill();ctx.restore()}
 if(dest.ring){ctx.strokeStyle='rgba(255,230,170,.7)';ctx.lineWidth=r*.08;ctx.beginPath();ctx.ellipse(x,y,r*1.6,r*.35,-.25,3.3,6.1);ctx.stroke()}
 if(dest.em){ctx.globalAlpha=.9;ctx.font=(r*.5|0)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(dest.em,x-r*.25,y-r*.5);ctx.globalAlpha=1}}
function frame(now){var t=(now-t0)/1000;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#050816';ctx.fillRect(0,0,W,H);
 var sx=0,sy=0;if(shake>0){sx=(Math.random()-.5)*shake;sy=(Math.random()-.5)*shake;shake*=.88;if(shake<.4)shake=0}ctx.save();ctx.translate(sx,sy);
 var cx=sc.w*.5,cy=sc.h*.5;
 for(var i=0;i<stars.length;i++){var s=stars[i];if(warpT){s.z-=.018;if(s.z<=.02){s.z=1;s.x=Math.random()*2-1;s.y=Math.random()*2-1}var k=1/s.z,px=cx+s.x*k*W*.25,py=cy+s.y*k*H*.25,k2=1/(s.z+.06),qx=cx+s.x*k2*W*.25,qy=cy+s.y*k2*H*.25;ctx.strokeStyle='rgba(200,230,255,'+(1-s.z)+')';ctx.lineWidth=2*(1-s.z)+.5;ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(px,py);ctx.stroke()}
  else{s.x-=.0006*s.z*(fx.warping?6:1);if(s.x<-1)s.x+=2;ctx.fillStyle='rgba(255,255,255,'+(s.z*.9)+')';ctx.fillRect((s.x+1)/2*W,(s.y+1)/2*H,s.z*2.2,s.z*2.2)}}
 if(!warpT)drawPlanet(t);
 var ss=Math.min(sc.w,sc.h)*.24;shipX=sc.w*.2+(warpT?Math.sin(t*30)*2:0);shipY=sc.top+(sc.h-sc.top)*.5+Math.sin(t*2)*6;
 if(tgt&&!warpT){var gx=sc.w*.74;tgt.x+=(gx-tgt.x)*.06;if(tgt.hit>0)tgt.hit=Math.max(0,tgt.hit-.06);drawTarget(tgt,t)}
 drawShip(shipX,shipY,ss,t);if(shield>0)shield=Math.max(0,shield-.025);
 for(i=beams.length-1;i>=0;i--){var b=beams[i];ctx.strokeStyle=b.e?'rgba(190,90,255,'+b.l+')':'rgba(80,255,240,'+b.l+')';ctx.lineWidth=8*b.l;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,'+b.l+')';ctx.lineWidth=3*b.l;ctx.stroke();b.l-=.08;if(b.l<=0)beams.splice(i,1)}
 ctx.restore();
 for(i=rockets.length-1;i>=0;i--){var r=rockets[i];r.y+=r.vy;ctx.fillStyle=r.c;ctx.fillRect(r.x-2,r.y,4,10);if(r.y<=r.ty){boom(r.x,r.y,60,[r.c,'#fff',r.c],7);rockets.splice(i,1);if(cb.sfx)cb.sfx('firework',.5)}}
 ctx.globalCompositeOperation='lighter';for(i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy=p.vy*.97+.05;p.l-=p.d;if(p.l<=0){parts.splice(i,1);continue}ctx.globalAlpha=p.l;ctx.fillStyle=p.c;ctx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(parts.length>900)parts.splice(0,parts.length-900);
 if(flash>0){ctx.fillStyle='rgba(255,240,200,'+flash+')';ctx.fillRect(0,0,W,H);flash=Math.max(0,flash-.05)}
 if(warpT){var wg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.6);wg.addColorStop(0,'rgba(120,180,255,.25)');wg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=wg;ctx.fillRect(0,0,W,H)}
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);return fx};
