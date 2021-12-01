---
layout: article
title: 线程池
mathjax: true
tags: Java 线程
key: 2019-01-01
categories:
- Java异常

---

对于线程池来说我需要知道哪些东西我就掌握了线程池，为什么要用线程池？

线程池主要使用来做多线程的管理的，比较线程来说在某种程度上是省资源的**避免增加创建线程和销毁线程的资源损耗**，



重用已有线程，避免线程穿件与销毁的资源损耗。

当需要使用线程执行任务的时候，可以使用已有的线程马上执行任务。可以在一定程度上避免使用线程的东西。





# JDK自带四种线程池

1. newFixedThreadPool

2. newCachedThreadPool
3. newSingleThreadExecutor
4. newScheduledThreadPool

# JDK自带线程池工具

1. Executors

2. ExecutorService

3. ScheduledExecutorService

4. ThreadPoolExecutor

5. 线程池的队列：三种

   a. SynchronousQueue

   b. BlockingQueue : LinkedBlockingQueue  ArrayBlockingQueue

   

# JDK线程池6个核心参数

1. **corePoolSize**
   核心线程数，即线程池始终保持着corePoolSize个线程数。

2. **maximumPoolSize**
   线程池中最多允许创建maximumPoolSize个线程。

3. **keepAliveTime**
   假设corePoolSize是5，maximumPoolSize是6，相当于有1个线程是非核心线程，那么当这个线程空闲了keepAliveTime时间后，将被销毁。

4. **workQueue**
   这是一个阻塞队列，用于存放当前线程来不及处理的任务。

5. **threadFactory**
   创建线程的工厂，为每个线程起一个有意思的名称，方便问题排查。

6. **handler**
   拒绝策略，定义如果阻塞队列被放满了以后，接下来的任务如何处理。

# JDK线程池的拒绝策略

ThreadPoolExecutor 提供四种拒绝后的执行策略：

1. ThreadPoolExecutor.AbortPolicy 拒绝任务并抛出异常

2. ThreadPoolExecutor.DiscardPolicy：表示拒绝任务但不做任何动作
3. ThreadPoolExecutor.CallerRunsPolicy 表示拒绝任务，并在调用者的线程中直接执行该任务
4. ThreadPoolExecutor.DiscardOldestPolicy：表示先丢弃任务队列中的第一个任务，然后把这个任务加进队列

# 线程池都有哪几种工作队列



# 按线程池内部机制，当提交新任务时，有哪些异常要考虑











