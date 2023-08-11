import { Context,Session,h} from 'koishi'

import * as cheerio from 'cheerio'

import { parseString } from 'xml2js';

import {} from 'koishi-plugin-puppeteer'

export class Moebgm {

    // 属性
    ctx:Context
    session:Session
    
    // 构造函数
    constructor(ctx:Context,session:Session){
      this.ctx = ctx
      this.session = session
      this.ctx.database.get('moebgm_table',{})
      .then( row => {
        if(typeof(row[0]) === "undefined"){
          const local_id_list = []
          ctx.database.create('moebgm_table',{id:local_id_list})
        }
      })
    }
  
    // 萌番组搜索
    async searchByTag(query:string):Promise<void>{
  
      const session = this.session
      // 提交索引
      const page = await this.ctx.puppeteer.page();
      await page.goto('https://bangumi.moe/search/index');
      await sleep(15000)
      const input = await page.$(`#\\30 06`)
      await input.type(query,{delay: 100})
      await page.evaluate(() => {
        // @ts-ignore
        return document.querySelector("#filter-tag-list > div.torrent-search > div:nth-child(3) > button:nth-child(3)").click()
      });
      await sleep(15000)
      // 解析
      let page_text = await page.content();
      const $ = cheerio.load(page_text);
      let counts = $(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > md-toolbar > div`).text().match(/\d+/g)[0];
      if(parseInt(counts)){
        const messageList =[h('message',`共有${counts}条结果,只返回前30条结果`)];
        for(var i=1; i <= parseInt(counts) ;i++){
          const url = `https://bangumi.moe`+ $(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > div > md-list > md-item:nth-child(${i}) > md-item-content > div.md-tile-content > div > div.torrent-title > h3 > small > a`).attr('href');
          if( url === 'https://bangumi.moeundefined' ) break
          const handle = await page.$(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > div > md-list > md-item:nth-child(${i})`);
          const image = await handle.screenshot()
          const message = h('message',h.image(image),url);
          messageList.push(message)
        }
        session.send(h('message',{forward:true},messageList));
      }else{
        session.send(h('quote',{id:this.session.messageId}) + '索引的名称无返回结果'); 
      }
      
    }

    // 萌番组搜索
    async searchByTitle(query:string):Promise<void>{
  
        const session = this.session
        // 提交索引
        const page = await this.ctx.puppeteer.page();
        await page.goto('https://bangumi.moe/search/title');
        await sleep(15000)
        const input = await page.$(`#\\30 05`)
        await input.type(query,{delay: 100})
        await page.evaluate(() => {
          // @ts-ignore
          return document.querySelector("#filter-tag-list > div.torrent-search > div:nth-child(3) > button:nth-child(4)").click()
        });
        await sleep(15000)
        // 解析
        let page_text = await page.content();
        const $ = cheerio.load(page_text);
        let counts = $(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > md-toolbar > div`).text().match(/\d+/g)[0];
        if(parseInt(counts)){
          const messageList =[h('message',`共有${counts}条结果,只返回前30条结果`)];
          for(var i=1; i <= parseInt(counts) ;i++){
            const url = `https://bangumi.moe`+ $(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > div > md-list > md-item:nth-child(${i}) > md-item-content > div.md-tile-content > div > div.torrent-title > h3 > small > a`).attr('href');
            if( url === 'https://bangumi.moeundefined' ) break
            const handle = await page.$(`#main > div.content.ng-scope > md-content > section.compact-torrent-list > div > md-list > md-item:nth-child(${i})`);
            const image = await handle.screenshot()
            const message = h('message',h.image(image),url);
            messageList.push(message)
          }
          session.send(h('message',{forward:true},messageList));
        }else{
          session.send(h('quote',{id:this.session.messageId}) + '索引的名称无返回结果'); 
        }
        
    }

    // 萌番组推送
    async update(){
      const session = this.session;
      const ctx = this.ctx;
      const xml = await ctx.http.get(`https://bangumi.moe/rss/latest`);
      const row = await ctx.database.get('moebgm_table',{}),
            local_id_list = row[0].id;
      parseString(xml, async (err, result) => {
        const items = result['rss']['channel'][0]['item'];
        let new_id_list = [];
        // 解析更新
        for(const item of items){
          const title = item['title'][0],
                link = item['link'][0],
                id = link.match(/torrent\/(.*)$/)[1];
          // 有本地库中不存在的id号则推送
          if(local_id_list.indexOf(id) === -1){
            new_id_list.push(id)
            session.send(`${title}\n链接:${link}`)
            await sleep(3000)
          }    
        }
        // 将推送的id保存至本地库中
        await ctx.database.set("moebgm_table",{},{id:[...local_id_list, ...new_id_list]});    
      });
    }
  
    // 萌番组时间表
    async getSchedule(){
      const today = new Date(),
        dayOfWeek = today.getDay();
      const page = await this.ctx.puppeteer.page();
      await page.goto('https://bangumi.moe/bangumi/list');
      await sleep(10000)
      const data = await page.$(`#main > div.content.ng-scope > md-content > section:nth-child(${dayOfWeek+4})`)
      data.screenshot()
      .then( image => {
        this.session.send(h.image(image))
      })
    }
  
}
  
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}