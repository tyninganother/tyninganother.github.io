---
layout: article
title: 树
mathjax: true
tags: Java tree
key: 2019-01-01
categories:

---

# 树

## 二叉查找树（BST）

## 平衡二叉树（AVL）



# HashMap源码（1.7和1.8）

1. HashMap的原理，内部数据结构？

   数组（ArrayList）：查找比较快;删除和增加比较慢、是一个定长

   链表（LinkedList双向列表）：增删比较快查找比较慢

   jdk1.7使用的数组+链表（数据结构为哈希表）

   jdk1.8在此基础上添加了红黑树

   转化的过程：当链表过长会将链表转成红黑树以实现O（logN）时间复杂度内查找。

2. 1.7版本的HashMap

   1. 内部类Entry {final key ；value ；hash ；Entry next }

   常量：

   1. **DEFAULT_INITIAL_CAPACITY** 初始**数组**的容量 1 << 4; // aka 16  必须是2的n次幂。使用触除法散列发存放数据；问题：为什么是这个数据为什么要”2的n次幂“？有两个原因：
   2. **MAXIMUM_CAPACITY** 1 << 30 存储元素最大个数
   3. **DEFAULT_LOAD_FACTOR** 叫加载因子。扩容的时候用，当存储的数据达到数组的长度*DEFAULT_LOAD_FACTOR的时候就进行扩容，比如 10 * 0.75 个数的时候就进行扩容。
   4. 一共有4个构造函数，其中有三个()(int)(int,float)三个构造函数，这三个构造函数在被调用的时候是不会开辟该HashMap需要存储数据的存储空间。只有在put的时候才会。第四个构造函数是一个HashMap(Map<? extends K, ? extends V> m)，是需要存放参数传进来的Map数据的才会开辟存储空间。
   5.  Key是可以是null的
   6. 哈希表中会有一个普遍的问题，是一个hash冲突问题。
   7. <font color=red>**注意**</font>：1.7和1.8中的常量个数又3变成6
   8. 1.7的HashMap在并发插入的时候会死循环

   tip:HashTable 一个是线程安全一个是线程不安全

3. 讲一下HashMap中put方法过程？

   （1）调key的hashCode()方法计算key的哈希值，然后根据映射关系计算数组下标

   （2）如果hash值冲突，调用equal()方法进一步判断key是否已存在。若key已存在，覆盖key对应的value值；若key不存在，将结点链接到链表中，若链表长度超过阈（TREEIFY_THRESHOLD == 8），就把链表转成红黑树；

   （3）如果hash值不冲突，直接放入数组中，若数据量超过***\*容量\*负载因子\****，需要对原数组进行扩容，每次扩容2倍

4. HashMap中hash函数是怎么实现的？还有哪些hash的实现方式？

5. HashMap怎样解决冲突，讲一下扩容过程，加入一个值在原数组中，现在移动了新数组，位置肯定改变了，那是什么定位到在这个值新数组中的位置？

   - 将新节点加到链表后，  

   - 容量扩充为原来的两倍，然后对每个节点重新计算哈希值。 
   - 这个值只可能在两个地方，一个是原下标的位置，另一种是在下标为 <原下标+原容量> 的位置。

6. 抛开HashMap，hash冲突有哪些解决办法？

   链地址法、开发地址法、再hash法等

7. 针对HashMao中某个Entry链太长，查找的时间复杂度可能达到O(n)，怎么优化

   将链表转化为红黑树，JDK1.8已经实现了



树化 链化



散列要求   必须取模



```java
/**
 * Implements Map.put and related methods
 *
 * @param hash hash for key
 * @param key the key
 * @param value the value to put
 * @param onlyIfAbsent if true, don't change existing value
 * @param evict if false, the table is in creation mode.
 * @return previous value, or null if none
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
  //如果table是空的那么我们就初始化一下他使用resize方法
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
  //查看该hash对应的位置是否被占用如果没有被占用的话就直接赋值
  //n是table的长度b（比如是16），然后n - 1=15 然后hash&15就是16的与运算结果就是0到15的一个位置
  //就是因为2的倍数的&运算和取余运算的结果相同但是&效率高，所以resize方法说的doubles table size就是原因，在这一点上就是为了提到效率
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```



除法散列法 

```java
/**
 * Initializes or doubles table size.  If null, allocates in
 * accord with initial capacity target held in field threshold.
 * Otherwise, because we are using power-of-two expansion, the
 * elements from each bin must either stay at same index, or move
 * with a power of two offset in the new table.
 *
 * @return the table
 */
final Node<K,V>[] resize()
```

resize这个方法做两个事情一个是初始化，或者是扩容table到两倍长度

- 叫”扰动函数“

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

（key.hashCode()) ^ (h >>> 16);这条语句是哈希算法的东西？
```

- 常量值是什么意思？



- 初始化长度为什么是2的n次幂？

  1. 是为了好取余数

  2. 是为了扩容之后元素的移动

     



# Java集合框架（分类和区别）



# 静态内部类













1. 