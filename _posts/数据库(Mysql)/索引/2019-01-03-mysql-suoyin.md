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

# 什么是索引

# 索引采取的数据结构

1. 常见的MySQL主要有两种结构：

   Hash索引

   B+ Tree索引

   **Tip**:InnoDB引擎，默认的是B+树

2. 这两种数据结构有什么不同
3. 

# InnoDB搜索引擎

# B+ Tree存储内容

InnoDB的B+ Tree 可能存整行数据或者主键的值

# 聚簇索引和非聚簇索引

1. 定义

2. 在查询数据的区别

3. 回表

4. 覆盖索引

   

# 联合索引、最左前缀匹配



#  MySQL 5.6对索引的优化

1. 一个优化叫做是Index Condition Pushdown Optimization

# 查询优化器

