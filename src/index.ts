import { Context, Schema,h} from 'koishi'

export const name = 'moebgm'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) { 
  ctx.command('moebgm <query:text> 返回萌番组的最多前30项索引结果','萌番组索引').alias('萌番组')
  .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-moebgm`)
  .option('page','-p <page:posint> 页数(每页最多30个结果),默认值:1',{fallback:1})
  .example('萌番组 -p 2 魔法少女小圆')
  .action(async ({session,options},query) => {

    session.send(h('quote',{id:session.messageId}) + '请稍等...');
    const {page}  = options,
          url = `https://bangumi.moe/api/v2/torrent/search?query=${query}&p=${page}`;

    ctx.http.get(url)
    .then(result => { 
      const counts: number = parseInt(result['count']); 
      if(counts){ 
        let list = [h('message',`共有${counts}条结果,只返回前30条结果`)]
        for(const items of result['torrents']){ 
          const { title, size, magnet } = items; 
          const code = h('message',title + '——' + magnet + '——' + size);
          list.push(code);
        } 
        session.send(h('message',{forward:true},list));
      }else{ 
        session.send(h('quote',{id:session.messageId}) + '索引的名称无返回结果'); 
      } 
    }) 

  })
}








