[TOC]

# ![](https://mnote.tingkl.com/file/MBledr3ZNbZCvbhbxIa5KQ.png?h=32) MNote
[MNote官网](https://mnote.tingkl.com)

![](https://mnote.tingkl.com/file/nv3kR4D79S3QQYefoxj3Tw.png)
>pc端

![](https://mnote.tingkl.com/file/qhPZ1Tbisowu2E8A2iCWJA.png)
>移动端

## 为什么写这个项目？

作为一个技术人员，经常的需要去学习新知识，提炼沉淀并分享自己的经验。

所以我急需一款可以方便的书写技术笔记，并且可以随时更新至个人博客的产品。

就目前而已，写作最方便的方式就是通过markdown，可以省去了很多排版的工作，将重心放在知识提炼上。

那我就需要一款云端的markdown笔记博客应用，要足够精简。

试了市面上的几款产品：

1. 首先，纯markdown的书写就毙了一大部分。为什么执着于markdown，因为markdown是写笔记效率最高的方式，我的重点就在于知识经验提炼上，不想被其他的东西分心。
2. 其次，我需要的是一个云端产品，不想因为更换电脑或者电脑故障，就导致以前的笔记不可以用，或者迁移需要耗费额外的精力。
3. 最后，还要可以生成个人博客，在移动端有良好的阅读体验，能够方便的检索或分享我需要的内容。

## 为什么移动端只有检索？

在移动端写作效率是极低的，并不是疼点，所以并没有将精力耗费在不重要的场景。


## 如何搭建
### 安装库

npm install

### 软件依赖
redis elasticsearch mongodb

### 修改fmbt/cf.js

修改为个人的配置即可

## 启动项目

// 本地开发环境

npm start

// pm2启动

pm2 start pm2.json


## 随意切换编辑模式

### 所见即所得

所见即所得模式对不熟悉 Markdown 的用户较为友好，熟悉 Markdown 的话也可以无缝使用。

![](https://mnote.tingkl.com/image/wysiwyg.0695c839ffe9c49d0309b2332fb60182.gif)

### 即时渲染

即时渲染模式对熟悉 Typora 的用户应该不会感到陌生，理论上这是最优雅的 Markdown 编辑方式。

![](https://mnote.tingkl.com/image/ir.cac1ebd8bdc7346de66d94832bd4b031.gif)

### 分屏预览

传统的分屏预览模式适合大屏下的 Markdown 编辑。

![](https://mnote.tingkl.com/image/sv.b9c8af39ccb8d2a991d3e9994783b043.gif)

## 丰富主题样式

### 4种内容主题

![](https://mnote.tingkl.com/file/0NQA8i4rIIaCmxxOh6cBgg.png?w=370)
![](https://mnote.tingkl.com/file/BH8fCgrlbvSm2T4O5YvtwQ.png?w=370")
![](https://mnote.tingkl.com/file/YpXiWGor6OP_V7ckuCONdQ.png)

### 37种代码高亮样式

![](https://mnote.tingkl.com/file/wYc1q889YUw3swNCxZzCAw.png?w=370)
![](https://mnote.tingkl.com/file/Wnf0KAI0jZf3HkRd8zl99g.png?w=370)

### 个性化颜色定制

让界面符合你的feel~

![](https://mnote.tingkl.com/file/8NCUo_bDYy1aN4RHqsqCug.png?w=180)
![](https://mnote.tingkl.com/file/ArZ0Fd7VBXczrWchekzQ2w.png?w=750)

## 核心功能

### 服务级图片缩放

![](https://mnote.tingkl.com/file/3r0JrsFhwHVuICBySXWZHQ.jpeg)

> 原始尺寸 400*300

![](https://mnote.tingkl.com/file/3r0JrsFhwHVuICBySXWZHQ.jpeg?w=200)

> 指定宽度w200px

![](https://mnote.tingkl.com/file/3r0JrsFhwHVuICBySXWZHQ.jpeg?h=100)

> 指定高度h100px

### 一键博客+全文检索

笔记公开为文章，全局大纲导航

![](https://mnote.tingkl.com/file/8Awiu4dhoapQuW31QzBwUQ.png?h=344)

![](https://mnote.tingkl.com/file/Jk3X6xAFRjFZGvQMo1cx9Q.png?w=538)

![](https://mnote.tingkl.com/file/0BOE5aKFAKTOgjvbsuyORA.png?h=344)

![](https://mnote.tingkl.com/file/0caMuYehPJ1ebFJ5eTkyEA.png?w=538)

### 加密分享

![](https://mnote.tingkl.com/file/RhcGlpWNAHgNKN3djF6jkA.png?h=90)

![](https://mnote.tingkl.com/file/ZJKxKJiUDbEDU9xscsh04A.png?h=130)

![](https://mnote.tingkl.com/file/MptL_5bLaSM1saa3z8QWxQ.png)

![](https://mnote.tingkl.com/file/BVL4YDChGQmknkQC1fIGSQ.png?w=240)

![](https://mnote.tingkl.com/file/IdETTN_f7ZJrutGxTdCnCw.png?w=240)

![](https://mnote.tingkl.com/file/YlKJGz-IZ6AqbqVd3ODbWw.png?w=240)

### 导入导出

无缝迁移

![](https://mnote.tingkl.com/file/6dC6n2mvuoKDcu6Qlb9SNA.png?w=240)

![](https://mnote.tingkl.com/file/1QVmMorC4g20SU5HncyITw.png?w=750)

### markdown支持

 所有 CommonMark 语法：分隔线、ATX 标题、Setext 标题、缩进代码块、围栏代码块、HTML 块、链接引用定义、段落、块引用、列表、反斜杠转义、HTML 实体、行级代码、强调、加粗、链接、图片、行级 HTML、硬换行、软换行和纯文本。

所有 GFM 语法：表格、任务列表项、删除线、自动链接、XSS 过滤

常用 Markdown 扩展语法：脚注、ToC、自定义标题 ID

![](https://mnote.tingkl.com/file/TMlMs7iToKZSNwn8KwRutg.png)

### 公式与图表

#### 数学公式

![](https://mnote.tingkl.com/file/0B0VvT9OrWn34WlncYgnjw.png?w=750)

#### 脑图

![](https://mnote.tingkl.com/file/4BF3b0Y1eDezlUqSiv3ehQ.jpeg?w=750)

#### 流程图

![](https://mnote.tingkl.com/file/p77rXXUnHYl9efhzr4727A.jpeg?w=750)

#### 时序图

![](https://mnote.tingkl.com/file/JqDSjNx8oihO_KOLDV514g.jpeg?w=750)

#### 甘特图

![](https://mnote.tingkl.com/file/LaEHLcOMQgbq6E6M1sOomw.jpeg?w=750)

#### EChart

![](https://mnote.tingkl.com/file/TZAqYKruTY2ExI2kgZcqrQ.jpeg?w=750)

#### Graphviz

![](https://mnote.tingkl.com/file/BTlQiTI_bJdoLGQD0wwvHg.jpeg?w=750)

#### 五线谱

![](https://mnote.tingkl.com/file/pCR6z5fiFvNu8_M0eH6XVQ.jpeg?w=750)
