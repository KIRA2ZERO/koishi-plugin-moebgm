# koishi-plugin-moebgm

[![npm](https://img.shields.io/npm/v/koishi-plugin-moebgm?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-moebgm)

# v2.0版本更新说明：

+ 1.新增按标签搜索功能
+ 2.新增获取萌番组的时间表功能。
+ 3.新增获取萌番组中最新种子功能。
+ 4.优化返回结果（图片+链接）

注：如果要实现实时推送萌番组中的最新种子，可以配合koishi-plugin-schedule插件，在需要推送的频道中使用命令schedule 1m / 1m -- moebgm.update即可）

# 指令：moebgm.search

+ 基本语法：`moebgm.search <query:text>`
+ 别名： `萌番组搜索`
+ 选项: `mode -m 默认为按标签搜索，启用为按标题搜索`
+ 用法：`按照示例输入即可返回萌番组中有海贼王标签种子的索引结果`
+ 注意事项：`标签名一般需要完整番名，否则会搜不到，此时可以使用按标题搜索`
+ 示例：`萌番组搜索 海贼王`

# 指令：moebgm.update

+ 基本语法：`moebgm.update`
+ 别名： `萌番组推送`
+ 用法：`按照示例输入即可推送萌番组中的最新种子`
+ 注意事项：`是否属于最新种子以本地数据库中存在的id号为标准`
+ 示例：`萌番组推送`

# 指令：moebgm.schedule

+ 基本语法：`moebgm.schedule`
+ 别名： `萌番组时间表`
+ 用法：`按照示例输入即可获取萌番组中的番剧放送时间表`
+ 注意事项：`如果返回的图片中出现类似乱码的字符，说明系统需要安装中文字体（moebgm.search也可能会遇到这个问题）`
+ 示例：`萌番组时间表`