// node src/genvoice.js > /tmp/gmv/lines.txt : enumerate every phrase the questions can produce
const fs=require('fs');global.window=global;process.chdir(__dirname+'/..');
eval(fs.readFileSync('data.js','utf8')+fs.readFileSync('skills.js','utf8')+';global.SK=SK;');require('../voice.js');
const phr={};const W=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],T=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
for(let n=0;n<100;n++)phr['n'+n]=n<20?W[n]:T[n/10|0]+(n%10?'-'+W[n%10]:'');
phr.w_thousand='thousand';phr.w_hundred='hundred';phr.w_oh='oh';phr.w_oclock="o'clock";
for(const sk of SK)for(let i=0;i<3000;i++)QV.parts(sk.g().q,phr);
for(const k in phr)console.log(k+'|'+phr[k]);
