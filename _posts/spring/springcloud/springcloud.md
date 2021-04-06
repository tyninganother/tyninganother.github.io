要知道什么是现在使用的东西



1. 使用spring cloud 搭建一个系统
2. 中间件
3. 传统的SSO
4. Oauth2服务 四种授权模式
5. <img src="springcloud.assets/image-20210406141548674.png" alt="image-20210406141548674" style="zoom:50%;" />

![image-20201130114534127](/Users/haining/Library/Application Support/typora-user-images/image-20201130114534127.png)

![image-20201201140334936](/Users/haining/Library/Application Support/typora-user-images/image-20201201140334936.png)



# 分布式微服务架构体系

https://www.bilibili.com/video/BV18E411x7eT?p=18



![image-20201201190523863](/Users/haining/Library/Application Support/typora-user-images/image-20201201190523863.png)







# 组件说明

## 服务注册中心

Eureka等待总结：







1. 最终的结果就是有什么样子的微服务表。如果不在的话就直接移除，如果有的话就添加到表单中。
2. 注册中心的一个服务

Eureka 不在更新

老技术Zookeeper

还有一个是Consul

阿里巴巴的那个是Nacos，这个推荐使用

	1. 什么是服务治理？主要的目的是为了实现服务调用、负载均衡、容错等，实现服务的注册与发现
	2. 什么是服务注册？
	3. Eureka有两个组件：Eureka-server（各个微服务节点通过配置启动后会在server中进行注册，server的服务注册表中会存储所有注册的服务） Eureka-client（客户端中有一个轮训负载算法的负载均衡器，回想server发送心跳，如果server多个心跳周期没有收到某个节点的心跳信号的话，服务将会被从server中移除）
	4. Eureka 1.X 和2.X的区别：pom的引用不一样了

## 服务调用

一、 Ribbon的讲解：

1. 负债均衡工具
2. 是**客户端**的负载均衡工具
3. 是**软**负债均衡的客户端工具
4. 负债均衡的英文缩写是**LB**

二、一个小问题：负债均衡的分类是集中式和进程式Ribbon和Nginx所说的负债均衡的不同点？

三、Ribbon的说明：会先得得到注册中心中注册的信息服务列表，然后将其缓存到本地的JVM中，然后在客户端本地实现RPC远程调用。

四、Ribbon功能组成：负载均衡 和接口RPC远程调用两个功能

五、Ribbon工作步骤：

	1. 先将注册中心中的信息缓存在本地。
	2. 然后根据用户指定的负债均衡的策略，然后选择一个地址。
	3. 选择一个地址然后进行调用。 

六、负债均衡的策略有：轮询、随机、更具时间响应时间加权。

七、 引入pom包如果使用了新的eureka的升级的的pom引入的话那么就不需要在新的引入了

八、Ribbon的结构： 负载均衡 + RestTemplate

九、RestTemplate工具的熟悉

十、 负债均衡的7种实现（IRule的7中实现）

![image-20210125185409125](/Users/haining/Library/Application Support/typora-user-images/image-20210125185409125.png)



RoundRobinRule：轮询

RandomRule：随机

RetryRule：先按照RoundRobinRule（轮询）策略获取服务，如果获取服务失败则在指定时间内进行重试，如果超出重试的最大时间就放弃轮询顺序选择下一个链接，然后不停的重复这个规则然后直到获取可用的服务；（**如果轮询的时候出现都不可用的服务该如何处理**）

BestAvailableRule：遍历所有服务，先过滤掉由于多次访问故障而处于断路器跳闸状态的服务，然后选择一个并发量最小的服务，如果所有服务的这两个指标的都一样的话就使用RoundRobinRule选择一个。

AvailabilityFilteringRule：会先过滤掉由于多次访问故障而处于断路器状态的服务，还有并发的连接数量超过阈值的服务，然后对剩余的服务列表按照轮询策略进行访问；

WeightedResponseTimeRule：对RoundRobinRule的扩展，先使用RoundRobinRule进行轮询，然后响应速度越快的示例选择全中遇到，越容易被选择

ZoneAvoidanceRule

十一、Ribbon自定义规则 这里边的三个原理需要补充

![image-20210208143336464](/Users/haining/Library/Application Support/typora-user-images/image-20210208143336464.png)





https://www.bilibili.com/video/BV18E411x7eT?p=38









Ribbon 停止更新现在还可以使用

 	1. 是客户端负载均衡工具，提供客户端的负债均衡的算法和服务调用。还可以配置链接超时什么的链接中的一些配置与方法。httpclient的封装，和eureka的配合调用工具等。
 	  	1. 负载均衡（LB）分为两种： **集中式LB；进程内LB**。那么ngix与ribbon的区别：ribbon是本地负载均衡，是进程内LB；ngix是服务器的负载均衡是集中式LB
 	  	2. 最后总结什么是Ribbon？本地负载均衡+restTemplate调用
 	  	3. 软负载均衡的客户端组件，他可以和其他所需请求的客户端结合使用，和eureka结合知识其中的一个实例。
 	2. Ribbon在工作室分为两步
 		1. 第一步先选择EurekaServer，他优先选择在同一个区域内如在较少的server
 		2. 第二部在根据用户指定的策略，在从server渠道的服务注册列表中选择一个地址
 	3. Ribbon提供了多种负载均衡策略：轮训、随机和根据响应时间加权重
 	4. Ribbon在cloud-client新版中被继承。

LoadBalancer 这个也可以用但是出来的时间不长

## 服务调用2

Feign 不要用了

1. Feign是一个声明式的Web服务客户端，说白了就是一个微服务接口与java声明式接口绑定的工具
2. 一个接口被多次调用，所以通常都会针对每个微服务自行分装一些客户端类来包装这些依赖服务的调用。所以feign的实现下，我们只需要创建一个接口并使用注解的方式配置大就可以完成对服务方的接口绑定。
3. Feign内置了Ribbon。使用Feign定义的注解，调用这个接口就能调动注册中心的服务
4. 用在消费方

OpenFeign 社区提供的Feign

1. 是在Feign的基础之上支持了SpringMVC的注解，然后通过动态代理的方式产生实现类，实现类中做负载均衡并调动服务
2. OpenFeign的实现：微服务调用接口+@FeignClient 第一步在需要调用的springboot启动类中添加@EnableFeignClients，然后在service接口中添加@Component和@FeignClient(value = "PAYMENT-SERVER") 其中value是微服务的名字。方法上使用@GetMappingspringMVC的注解，这样就可以使用service中调用了。
3. 消费者调用服务方的服务时候是通过网络服务所以需要考虑链接超时问题。其中OpenFeign默认超时是1秒钟，如果调用的服务接口1秒钟没有返回就会超时报错。如果想要定制这个1秒钟的超时为其他的话就需要在yml中修改配置。以为OpenFeign底层使用的是ribbon来实现负载均衡的所有这个超时配置修改，是修改的是ribbon的超时间配置。在yml中添加ribbon:ReadtimeOut：5000 ConnectTimeOut：5000
4. OpenFeign提供了日志打印功能，可以答应feign请求http的详细情况。日志级别是可以设置的有四种NONE默认不打印日志；BASIC:仅记录请求方法、URL、响应状态码以及执行时间；HEADERS。除了BASIC中定义的信息外还有请求的响应的头信息；FULL:除了HEADERS中定义的信息，还有请求和响应的正文以及元数据。

## 服务降级

Hystrix 不再用了，停止更新了

问题出现的场景：微服务越来越多，微服务的依赖也越来越多。如果在调用链路上的一个或者多个节点出现问题之后，该如何保证服务的正常运行，这个Hystrix框架就是用来解决这种情况的。

一、定义：

​	Hystrix是一个分布式系统的延迟和容错的开源库。在两路中一个依赖出现问题的情况下，不会导致整个服务失败，避免级联故障，以提高分布式系统的弹性

二、能够处理问题的方法：服务熔断和服务降级以及接近实时的监控、限流、隔离

三、第“二”条中的概念

1. 服务降级（fallback）
   1. 如果调用的服务出现异常，向调用方返回一个符合预期的可处理的备选响应（Fallback）
   2. 哪些情况会触发降级呢？
      1. 程序运行异常
      2. 请求超时异常
      3. 服务熔断触发服务降级
      4. 线程池或者信号量打满也会导致服务降级
2. 服务熔断（break）
   1. 先将服务断掉，然后调用服务降级的方法并返回友好提示
   2. 处理过程：服务的降级->进而熔断->恢复调用链路
3. 服务限流（flowlimit）
   1. 如果对于一个服务来说如果一个高并发过来流量拥挤，然后就让这个大流量排队，按照服务能够处理的能力来排队处理

四、产生服务降级的问题，以及如何解决下边三个维度

1. 超时导致服务器变慢-》超时不再等待
2. 出错（调用服务宕机或者程序运行出错）-》要有兜底的逻辑
3. 如果对方服务是ok的但是业务要求调用方需要被调用的服务在有效时间内给出答案如果不行的话需要服务降级处理

五、服务降级的配置

1. 可以使用注解也可以使用类继承，这里直接说注解的使用@HystrixCommand。在微服务的启动类上添加该注解。

https://www.bilibili.com/video/BV18E411x7eT?p=54

2. 降级有两种一种是自己对自己的降级，就是监控自己的一个方法，如果方法报错的话要有一个兜底的处理方法（服务端降级保护）。另外一种就是如果调用其他微服务的时候报错，那么对返回的错误或者等不到的时候就做其他兜底方法处理（客户端降级保护）
3. 自定义和全局的降级处理，在接口类上边直接用一个@defaultProperties 然后定义一个defaultFallback方法。
4. 还可以使用@feiClint中的defaultFallBack类，指定一个实现了interface类，让指定的实现的interface的类，然后重载实现所有方法，并写去处理逻辑

六、服务熔断

![image-20210209151412136](/Users/haining/Library/Application Support/typora-user-images/image-20210209151412136.png)

1. 先关闭服务然后返回提示
2. 断路器 open closed half-open
3. 请求次数是否达到了峰值
4. 涉及到断路器的三个重要参数：快照时间窗、请求总数阈值、错误百分比
5. 断路器关闭的条件：
   1. 当满足一定的阈值的时候
   2. 当失败率达到一定的时候
   3. 达到以上法制断路器将会开启
   4. 当开启的时候所有请求都不会进行转发
   5. 一段时间之后这个时候断路器是搬开状态会让其中一个请求进行转发如果陈宫断路器会关闭如失败，继续开启重复4和5
6. 工作流程需要总结

七、服务限流

1. 在sentinel进行讲解

















1. 服务雪崩问题
   1. “扇出”结构：说的就是多个微服务之间的调用，如果微服务A调用B，B有调用C，C和B有调用其他微服务
   2. 如果扇出来的链路上某个微服务的调用时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃。这个现象叫做雪崩效应
   3. 对于高流量应用来说，单一的后端依赖可能会导致所有服务器上的资源都在几秒内饱和。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其他系统资源紧张，导致整个系统发生更多的级联故障。**这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或者系统**。
   4. 通常当你法相一个模块下的某个实力失败后，这时候这个模块一样还会接受流量，然后这个有问题的模块还调用了其他模块，这样就发生级联故障，或者叫雪崩。
2. Hystrix是一个处理分布式系统**延迟**和**容错**的开元库，在分布式系统里，许多依赖不可避免的会调用失败，比如超市、异常等，Hystrix能够保证在一个依赖出现问题的情况下，不会导致整个服务失败，避免级联故障，以提高分布式系统的弹性。
3. Hystrix就是一个“断路器”，当某个服务单元发生故障之后，通过断路器的故障监控，**向调用方返回一个符合预期的、可处理的备选响应（FallBack），而不是长时间的等待或者跑出调用方无法处理的异常**，这样就保证了调用方的线程不会备长时间、不必要的张勇虫儿避免了故障在分布式系统中的蔓延，乃至雪崩。
4. 

resilience4j 国外推荐使用

Sentinel 国内推荐，阿里巴巴

## 服务网关

![image-20201209170703442](/Users/haining/Library/Application Support/typora-user-images/image-20201209170703442.png)

Zuul 不再维护

1. 

gateway spring自己出的

1. 异步非阻塞模型
2. getway具有如下特点：
   1. 基于spring framkework5，project reactor，spring boot2.0 构建的
   2. 动态路由：能够匹配任何请求属性
   3. 可以对路由指定断言和过滤器
   4. 集成Hystrix的断路器功能
   5. 集成spring cloud 服务发现功能
   6. 易于编写的断言和filter
   7. 请求限流功能
   8. 支持路径重写
3. spring cloud的Finchley正式版本之前都推荐Zuul
   1. Zuul1.x使用的是一个基于阻塞I/O的API 网关
   2. 

一、gateway

1. 基于webflux框架实现 webflux使用的netty
2. 目标提供统一的路由方式且基于Filter链的方式提供了网关基本功能
3. 有什么功能：
   1. 反向代理
   2. 鉴权
   3. 流量控制
   4. 熔断
   5. 日志监控
4. 特性
   1. 动态路由
   2. 可以对路由指定断言和过滤器
   3. 继承Hystrix的断路器功能
   4. 继承String cloud服务发现功能
   5. 已与编写的断言和过滤器
   6. 请求限流功能
   7. 支持路径重写
5. 三个重要的部分：
   1. Route路由
   2. Predicate断言
   3. Filter过滤器
6. 路由映射
   1. 
7. 网关也是一个微服务
8. 如何进行路由配置
   1. 使用yml进行配置
   2. 如果yml配置太多可以使用硬编码配置使用bean



https://www.bilibili.com/video/BV18E411x7eT?p=70&spm_id_from=pageDriver



## 服务配置

config 现在不再使用了

可以使用Nacos

## 服务总线

Bus 现在不用了

携程还有一个appllo也用起来不错

可以使用Nacos



# 微服务问题

1. CAP问题

   1. CAP定理：
             指的是在一个分布式系统中，Consistency（一致性）、 Availability（可用性）、Partition tolerance（分区容错性），三者不可同时获得。

   2. 一致性（C）：在分布式系统中的所有数据备份，在同一时刻是否同样的值。
   3. 可用性（A）：负载过大后，集群整体是否还能响应客户端的读写请求
   4. 
   5. qps(每秒访问量)

2. 

Seata 服务  shardingsphere

https://www.infoq.cn/article/w6wkhscktpa3-qmqi4gr



