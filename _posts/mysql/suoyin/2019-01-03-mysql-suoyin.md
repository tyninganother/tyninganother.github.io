---
layout: article
title: Mysql索引
mathjax: true
tags: Mysql索引
key: 2019-01-03
categories:
- Mysql
- 索引
---
**前提**：(a,b)组成联合索引，其中在写添加索引sql的时候a1在前，b在后

**问题**：触发联合索引是有条件的：

1. 使用联合索引的全部索引键，可触发索引的使用。
   例如：SELECT E.* FROM E WHERE E.a=1 AND E.b=2
2. 使用联合索引的前缀部分索引键，如“key_part_1 <op>常量”，可触发索引的使用。
   例如：SELECT E.* FROM E WHERE E.a=1
3. 使用部分索引键，但不是联合索引的前缀部分，如“key_part_2 <op>常量”，不可触发索引的使用。
   例如：SELECT E.* FROM E WHERE E.b=1
4. 使用联合索引的全部索引键，但索引键不是AND操作，不可触发索引的使用。
   例如：SELECT E.* FROM E WHERE E.b=2 OR E.a=1

Tip：通过explain测试即可看出效果
