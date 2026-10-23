import asyncio,json
from playwright.async_api import async_playwright
U='http://localhost:8766/alex-galaxy-math/'
O='/workspace/hubshots/alexmath-'
async def main():
  async with async_playwright() as p:
    b=await p.webkit.launch()
    for w,h,tag in [(1180,820,'ipad'),(390,844,'iphone')]:
      c=await b.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=(tag=='iphone'));pg=await c.new_page();errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
      await pg.goto(U);await pg.evaluate('__M.reset()');await pg.reload();await pg.wait_for_timeout(800)
      await pg.screenshot(path=O+tag+'-title.png')
      await pg.tap('#bPlay');await pg.wait_for_timeout(700);await pg.screenshot(path=O+tag+'-factcard.png')
      await pg.tap('#fcGo');await pg.wait_for_timeout(1500);await pg.screenshot(path=O+tag+'-play.png')
      # answer 3 correctly via UI
      for i in range(3):
        q=await pg.evaluate('__M.cur()')
        if isinstance(q['a'],int):
          for d in str(q['a']): await pg.tap(f'#pad .k:text-is("{d}")')
          await pg.tap('#pad .k.go')
        else: await pg.locator('#pad .k', has_text=q['a']).first.tap()
        await pg.wait_for_timeout(250 if i<2 else 120)
      await pg.screenshot(path=O+tag+'-blast.png');await pg.wait_for_timeout(800)
      await pg.evaluate('__M.answer(false)');await pg.wait_for_timeout(500);await pg.screenshot(path=O+tag+'-miss.png')
      await pg.tap('#fbGo');
      for i in range(2):
        await pg.wait_for_timeout(700);await pg.evaluate('__M.answer(true)')
      await pg.wait_for_timeout(1300);await pg.screenshot(path=O+tag+'-warp.png');await pg.wait_for_timeout(2500)
      await pg.evaluate('__M.openMap()');await pg.wait_for_timeout(700);await pg.screenshot(path=O+tag+'-map.png');await pg.tap('#map .x')
      await pg.evaluate('__M.openLog()');await pg.wait_for_timeout(700);await pg.screenshot(path=O+tag+'-logbook.png');await pg.tap('#logbook .x')
      await pg.evaluate('__M.openBadges()');await pg.wait_for_timeout(700);await pg.screenshot(path=O+tag+'-badges.png');await pg.tap('#badges .x')
      await pg.evaluate('__M.openParent()');await pg.wait_for_timeout(700);await pg.screenshot(path=O+tag+'-parent.png');await pg.tap('#parent .x')
      # show a high-level question visual
      await pg.evaluate('for(var i=0;i<40;i++)__M.grade(true,1000)');await pg.evaluate('__M.newQ()');await pg.wait_for_timeout(500);await pg.screenshot(path=O+tag+'-highlevel.png')
      print(tag,'errors',errs[:5],'hubHome',await pg.locator('#hubHome').count())
      await c.close()
    # adaptation simulation
    c=await b.new_context();pg=await c.new_page();await pg.goto(U);await pg.evaluate('__M.reset()');await pg.reload()
    r=await pg.evaluate('''()=>{var o=[];for(var i=0;i<45;i++){var x=__M.grade(true,2000);if(i%5==4)o.push(['ok',i+1,x.lvl,x.skill,x.skLv])}
     for(var j=0;j<6;j++){var x=__M.grade(false,9000);o.push(['miss',j+1,x.lvl,x.skill,x.skLv])}
     for(var k=0;k<10;k++){var x=__M.grade(true,20000)}o.push(['slow-ok x10',0,x.lvl]);return o}''')
    for x in r: print(x)
    # skill-level distribution sample at several levels
    d=await pg.evaluate('''()=>{var out={};[3,8,14,20,24].forEach(function(L){var S=__M.S();S.L=L+.5;var lv=[];for(var i=0;i<200;i++){S.L=L+.5;var x=__M.grade(true,99999);lv.push(x.skLv)}out[L]=[Math.min.apply(0,lv),Math.round(lv.reduce((a,b)=>a+b)/lv.length*10)/10,Math.max.apply(0,lv)]});return out}''')
    print('skill lv min/avg/max by player level',d)
    await b.close()
asyncio.run(main())
