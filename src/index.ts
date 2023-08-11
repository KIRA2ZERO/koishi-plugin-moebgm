import { Context, Schema } from 'koishi'

import { Moebgm } from './class'

export const name = 'moebgm'

export const using = ['puppeteer'] as const

export interface Config {}

export const usage = `
v2.0版本更新说明：
  1.新增按标签搜索功能
  2.新增获取萌番组的时间表功能。
  3.新增获取萌番组中最新种子功能。
  4.优化返回结果（图片+链接）
（如果要实现实时推送萌番组中的最新种子，可以配合koishi-plugin-schedule插件，在需要推送的频道中使用命令schedule 1m / 1m -- moebgm.update即可）
`

export const Config: Schema<Config> = Schema.object({})

declare module 'koishi' {
  interface Tables {
    moebgm_table: moebgm_table
  }
}

export interface moebgm_table {
  key: number
  id: any
}

export function apply(ctx: Context) { 

  ctx.model.extend('moebgm_table', {
    key:'unsigned',
    id: 'list',
  },{
    primary:'key',
    autoInc: true
  })

  ctx.command('moebgm 萌番组功能集成','萌番组')
  .usage(`使用教程:https://github.com/KIRA2ZERO/koishi-plugin-moebgm`)

  ctx.command('moebgm.search <query:text> 返回萌番组的最多前30项索引结果','萌番组搜索').alias('萌番组搜索')
  .option('mode','-m 默认为按标签搜索，启用为按标题搜索')
  .action(async ({session,options},query) => {
    const moebgm = new Moebgm(ctx,session)
    if( options.mode ){
      moebgm.searchByTitle(query)
    }else{
      moebgm.searchByTag(query)
    }
  })

  ctx.command('moebgm.update 推送萌番组中最新的种子','萌番组推送').alias('萌番组推送')
  .action(async ({session}) => {
    const moebgm = new Moebgm(ctx,session)
    moebgm.update()
  })

  ctx.command('moebgm.schedule 获取萌番组的时间表','萌番组时间表').alias('萌番组时间表')
  .action(async ({session}) => {
    const moebgm = new Moebgm(ctx,session)
    moebgm.getSchedule()
  })

}



