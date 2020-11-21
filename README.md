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


