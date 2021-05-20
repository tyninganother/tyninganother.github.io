---
layout: article
title: Zookeeper
mathjax: true
tags: Java 分布式 Zookeeper
key: 2019-01-01
categories:
- 分布式
---
# 一、 分布式协调系统

Zookeeper属于其中的一种

## ZooKeeper提供了什么功能

文件系统

通知机制



```
git config --local user.name  "another"
git config --local user.email "oncwnuJU67QJyERVlQ9h8rpqIdbg@git.weixin.qq.com"
```

### 文件系统

多层级节点的命名空间，与文件系统不同的是这些节点都可以设置关联的数据，而文件系统中只有文件节点可以存放数据而目录节点不行。

zk在内存中维护了树状结构的目录。

zk不能用于存放大量的数据，每个节点存放数据的上限是1MB

### ZAB协议的原理

是一种原子广播协议

支持崩溃恢复

ZAB协议包含两种模式：崩溃恢复和消息广播

崩溃恢复是说，当zk集群启动或者leader服务器宕机、重启或者网络故障，导致过半的服务器不能与Leader服务器保持正常通信是，所有的服务器就进入崩溃恢复模式。首先选举新的leader服务器，然后集群中的其他服务器与新的leader进行数据同步。当集群中超过半数服务器与该leader服务器完成数据同步后就退出该模式然后进入消息广播模式，leader服务器开始接受客户端的事务请求生成事务提案来进行事务请求处理。

## 四种类型的数据节点

persistent 持久节点 除非手动尚处否则节点一直存在与zk上

ephemeral 临时节点 这种节点的生命周期与客户端会话绑定，一旦客户端会话失效，那么这个客户端创建的所有临时节点都会被移除

persistent_sequential 持久顺序节点  与池姐姐点差不多，只是在持久节点上增加的顺序，节点名后边会追加一个由父节点维护的自增整型数字

ephemeral——sequential



### 2.CAP理论

## 3.安装使用

### 4.Zookeeper组成

1.Znode

2.运行模式

单机模式：standalone mode

复制模式：replicated mode
