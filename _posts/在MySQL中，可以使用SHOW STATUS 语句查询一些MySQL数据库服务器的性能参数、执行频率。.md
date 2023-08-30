在MySQL中，可以使用SHOW STATUS 语句查询一些MySQL数据库服务器的性能参数、执行频率。

SHOW STATUS语句语法如下：

一些常用的性能参数如下： •　Connections：连接MySQL服务器的次数。 •　Uptime：MySQL服务器的上

线时间。 •　Slow_queries：慢查询的次数。 •　Innodb_rows_read：Select查询返回的行数 •　

Innodb_rows_inserted：执行INSERT操作插入的行数 •　Innodb_rows_updated：执行UPDATE操作更新的

行数 •　Innodb_rows_deleted：执行DELETE操作删除的行数 •　Com_select：查询操作的次数。 •　

Com_insert：插入操作的次数。对于批量插入的 INSERT 操作，只累加一次。 •　Com_update：更新操作

的次数。 •　Com_delete：删除操作的次数。 





![image-20230817161341750](/Users/haining/Documents/mydoc/tyninganother.github.io/assets/images/post/image-20230817161341750.png)