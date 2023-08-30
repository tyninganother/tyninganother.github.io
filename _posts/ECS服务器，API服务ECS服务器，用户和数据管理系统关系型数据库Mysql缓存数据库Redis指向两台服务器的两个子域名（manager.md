- ECS服务器，API服务
- ECS服务器，用户和数据管理系统
- 关系型数据库Mysql
- 缓存数据库Redis
- 指向两台服务器的两个子域名（manager.baidu.com;api.baidu.com），或者可以指向两台服务器的两个web context空间(www.baidu.com/api/;www.baidu.com/manager/)
- 两个SLB（负载均衡），这个是在域名和ecs之间，为了之后方便简单横向扩展api服务器和管理系统，与保护ECS的真是ip地址。

- 代码管理，可以信任的远程git仓库。之后api和小程序的代码放在这里。



![image-20230830110408817](../../../../Library/Application%20Support/typora-user-images/image-20230830110408817.png)



- 微信支付平台（https://pay.weixin.qq.com/）申请一个商户号，这个是为了之后的支付功能的微信支付。
- 微信开放平台（https://open.weixin.qq.com/）申请一个开发者账户，为了之后服务号、订阅号、小程序在一个主体下的互联。

![image-20230830110458744](image-20230830110458744.png)



