---
layout: article
title: 线程
mathjax: true
tags: Java 线程
key: 2019-01-01
categories:
- Java异常

---

https://www.bilibili.com/video/BV1xK4y1C7aT

https://blog.csdn.net/weixin_37766296/article/details/80404503

# 线程与进程

1. 线程与进程
   1. Java中线程分为两种：用户线程（user Thread）守护线程（Daemon Thread）



# 内存布局

![image-20201117175243623](https://tyninganother.github.io/assets/image-20201117175243623.png)

对象在内存中的布局：

对象分为两种:一种是普通对象；一种是数组对象

普通对象：对象头（markword、类型指针）、实例数据、对齐

markword：记录锁的信息

类型指针：说明这个对象是属于哪个Class的

实例数据：就是对象的成员变量比如int占8个字节等

对齐需要的补充位：整个对象占用的位数，如果不够被8整除的数字的话就用这个位补充，然后筹到可以被8整除。因为对象在内存的读取是根据总线的位数来读取的，

UseCompressedClassPointers 和UseCompressedOops是不一样的。

如果UseCompressedClassPointers压缩指针参数，如果该参数被打开的话，那么类型指针就被压缩到4个字节

UseCompressedClassPointers（jvm参数） 压缩指针，如果是64位的虚拟机的话，一个指针就是64位也就是8个字节，如果开启该字段那么就是将指针压缩到4个字节，不压缩就是8个字节

UseCompressedOops  普通对象指针？



| markword | 类型指针 | 实例数据 | 对齐 |
| -------- | -------- | -------- | ---- |
| 8个字节  | 4个字节  | 0        | -    |

对齐的话是整个markword到对齐字段加起来的长度要被8（就是8个字节）整除

# Synchronized

```java
Object object = new object();
synchronized(object){

}
```

这段代码是锁定对象，然后锁的信息存储在markword中。





# 锁的升级过程

1. new对象的状态->偏向锁->轻量级锁（无锁、自旋锁）->重量级锁
2. new 对象初始化锁的状态，只要后三位就是都是0就是代表着该状态

| 锁状态          | 25bit  | 31bit                  | 1bit   | 4bit     | bit1偏向锁位 | 1bit锁标记位1 | 1bit锁标记位2 |
| --------------- | ------ | ---------------------- | ------ | -------- | ------------ | ------------- | ------------- |
| new对象初始状态 | unused | hashcode（如果有调用） | unused | 分代年龄 | 0            | 0             | 0             |

3. 后三位是1，0，1就是偏向锁

| 锁状态 | 54bit        | 2bit  | bit1偏向锁位 | 1bit锁标记位1 | 1bit锁标记位2 |
| ------ | ------------ | ----- | ------------ | ------------- | ------------- |
| 偏向锁 | 当前线程指针 | Epoch | 1            | 0             | 1             |

注意：jvm开启/关闭偏向锁

- 开启偏向锁：-XX:+UseBiasedLocking -XX:BiasedLockingStartupDelay=0
- 关闭偏向锁：-XX:-UseBiasedLocking

4. 最后升级轻量级锁或者重量级锁的话，用后两位就可以标记就可以了

| 锁状态                   | 64bit | 1bit锁标记位1 | 1bit锁标记位2 |
| ------------------------ | ----- | ------------- | ------------- |
| 轻量级锁（无锁、自旋锁） |       | 0             | 1             |
| 重量级锁                 |       |               |               |
| GC标记信息               |       |               |               |

5. 偏向锁位说明：1代表这是一个偏向锁0代表没有上锁
6. 所升级过程显示偏向锁（锁位1标记然后其中的54位会放当前线程需要加锁的线程的指针的JAVAThread*），如果有锁也需要使用资源的话，那么就升级为轻量级锁（撤销偏向锁，然后两个线程向锁对象上赋值自己的LockRecord指针，如果成功修改成功那么就是锁抢夺成功。这个地方修改锁对象中的62位的存储地址赋值）
7. lockRecord说明





线程和进程的区别：

进程：分配资源的基本单位

线程：程序执行的基本单位



超线程：一个ALU（逻辑单元）对应多个PC和寄存器的组合，执行的时候一个ALU执行其中一个组合，然后根据某种策略切换执行另外一个组合。比如四核八线程。

缓存行（cache line）：一行数据64个字节，CPU计算单元与寄存器想要读取数据，需要从L1找没有就到L2找没有就到L3找，还是没有的话就去内存中找。然后将内存中的数据读到L3然后放在L2然后放在L1。

​	还有就是CPU这个层面，数据一致性的话，是按照缓存行为单位做数据一致性的。如果是多核的话，其中一个核的一个缓存行的数据修改了，那么得通知其他的核去拿去最新的数据得。

​	缓存行对齐，可以使用



markword记录了什么信息呢？除了锁信息还有GC信息

分代年龄有两种默认值：15和6  6是CMS这种垃圾回收算法使用





# 多线程使用的工具

1. 1.继承Thread类，重写run方法（其实Thread类本身也实现了Runnable接口）

   2.实现Runnable接口，重写run方法

   3.实现Callable接口，重写call方法（有返回值）

   4.使用线程池（有返回值）

2. 多线程的使用四种方式

1.Thread继承该类的类可以调用run开始新建立线程,如何使用，run和start方法的区别

2.Runnable实现该类的类可以调用run开始新建立线程,如何使用，run和start方法的区别

3.Callable实现该接口类，重写call方法.使用FutureTask来调用call方法,然后使用Thread方法的start来用。这个可以有call的返回值

4.线程池

# FutureTask疑问解析

FutureTash实现了RunnableFuture，而RunnableFuture实现了Future和Runnable接口

那么搞懂Future接口就可以，Future是获取异步计算结果的

# Join/Fork框架



# JDK线程池的锁

1. 关键字
   1. synchronized
   2. volatile
2. 对于关键字的说明与final关键字的联系
3. 锁对象
   1. ReentrantLock
   2. LockSupport
   3. Condition
   4. Lock
   5. LockSupport
   6. ReadWriteLock
   7. ReentrantReadWriteLock
   8. StampedLock

# JIT just in time及时编译器

将一些热点代码即时编译，编译成机器语言，执行起来就比较快。

# Synchonized实现过程

1. java代码：
2. class moi moni
3. jvm 执行过程中锁升级
4. 在底层的话使用 lock com xchg 指令

# Volatile

1. 保证线程可见性

2. 重排序







# 线程

1. 主分支，main函数入口

2. cpu和内存的速度比例大概是cpu100 -----  1内存

3. 因为cpu和内存的速度的这种不匹配所有可以多线程执行。就引出了线程切换。

4. 线程切换和线程的调度（OS）

   T1和T2两个线程多线程执行，现场保护，切换的时候就是将T1的执行的数据放在CPU的缓存里，等到下次执行的时候将其取出来。

5. 面试题

   1. 单核CPU设定多线程是否有意义？

      有意义，因为一个线程如果在等待其他资源的时候还在占用CPU的话，会造成资源浪费。

   2. 工作线程数是不是设置的越大越好？

      不是，因为有线程切换的开销会比较大。单位时间内，固定CPU场景，如果线程过多的话，每个线程都执行一小会儿然后发生切换，那么最后造成单位时间内切换的资源开销占比会比较多那么响应的执行的效率会变慢。

   3. 工作线程数（线程池中的线程数量）设多少合适？

      - 有一个公式N1=N2 * U * (1+W/C)

      - N1是工作线程数量
      - N2是处理器的喝的数目，可以通过Runtime.getRuntime().availableProcessors()得到
      - U是期望的CPU利用率（该值应该介于0和1之间比如想要利用率达到50%或者80%等）
      - W/C是等待时间和计算时间的比率，等待时间是指线程等待CPU的时间计算时间是指CPU处理一次线程计算的时间（CPU是一会执行该线程一会儿执行其他线程，这里指的是CPU的这么“一会”的时间），这两个值得要进行压测然后统计之后找到一个最合适的值。

      https://www.bilibili.com/video/BV1Si4y1c7AZ?p=2

