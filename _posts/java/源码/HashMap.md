---
layout: article
title: HashMap源码
mathjax: true
tags: Java hashmap 源码
key: 2019-01-01
categories:
  - yuanma

---

# HashMap源码（1.7）

> - **二进制或运算符**（or）：符号为`|`，表示若两个二进制位都为`0`，则结果为`0`，否则为`1`。
> - **二进制与运算符**（and）：符号为`&`，表示若两个二进制位都为1，则结果为1，否则为0。
> - **二进制否运算符**（not）：符号为`~`，表示对一个二进制位取反。
> - **异或运算符**（xor）：符号为`^`，表示若两个二进制位不相同，则结果为1，否则为0。
> - **左移运算符**（left shift）：符号为`<<`，详见下文解释。
> - **右移运算符**（right shift）：符号为`>>`，详见下文解释。
> - **头部补零的右移运算符**（zero filled right shift）：符号为`>>>`

https://www.bilibili.com/video/BV1vE411v7cR?p=4&spm_id_from=pageDriver

1. 底层结构是什么

   底层结构就是一个数组+链表。Entity数组，然后Entity是一个单项链表。

2. 计算插入值对的时候的位置，是先取int = hashCode = key.hashCode,然后hashCode%table.length得到数组的下标。table.length是指数组的长度，然后将新插入的元素的地址放在数组中，顶替之前的链表的头部元素。

3. 知道了下标之后，如果新插入的值计算出来的下标已经被占用，那么就放在数组对应的链表的头部。因为单向链表插入头部是最快的，如果插入非头部的话就需要遍历链表找到next节点的地址。

4. get的过程是：先对key进行定位，int = hashCode = key.hashCode；hashCode%table.length得到下标。

5. 初始化过程

   1. 调用构造方法，然后构造方法初始化两个参数this.loadFactor = loadFactor;负载因子和<font color="red">threshold = initialCapacity;</font>
   2. 数组的初始化：在put方法调用的时候开始进行初始化数组
      1. 首先判断table是否是空数组，如果是空数组的话就调用inflateTable(int toSize)方法进行初始化。toSize这个参数就是我们在new HashMap(size)的时候size的值，是数组的大小，如果使用无参构造函数就使用默认的数组的大小。
         1. inflateTable方法是给table进行赋值使用Entity[size],其中size使用的是threshold，threshold这个值的取值有几种情况，如果是大于等于最大的容量那么就使用最大容量，否则就进行计算，然后判断是否小于1如果小于等于1的话就使用1，否则就找大于threshold这个值的2的幂次方的一个数（比如是7那么这个地方计算出来的就是8）
         2.
         3.

6. 为什么数组的长度必须是2的整数次幂?

7. 多线程共享同一个HashMap的时候，当同时出现扩容的时候，在某种情况下会出现循环链表的情况。等效于死循环。

   扩容的逻辑是将数组中的某一个元组以及元组对应的链表转移到新创建的数组中去。这里就只说数组中一个元组以及这个元组对应的链表数据的移动。

   扩容的实现的话，使用的是两个局部变量来实现的，下边的代码是next变量和e这个变量。然后链表的移动是使用从链表的头部一个一个添加的。

   说这个循环链表问题的前提是在移动的过程中出现了hash冲突也就是两个元素在数组中对应同一个位置。这里假设这一个元素对应的链表的所有的元素在新的数组中都属于同一个位置。

   两个线程中都要做将老数据插入到新创建的空间内。

   下边的代码给出的方式是将老的数组中存放的元素先移动到新空间，然后在移动下一个节点。移动这个“下一个节点”的时候，是将这个节点放在新的数组中，换句话说就是在新数组的元素对应的链表是在这个链表的头部添加新元素的。

   Node 节点使用的Left和Right，Value



   所以基于这种逻辑，首先将想要操作的老数组的元素赋值给e，然后进行移动这个e到新数组中。在赋值的过程中因为使用的是链表的头插法，所以新数组中的那个元素对应的引用空间就作为e的next属性指向的引用空间，也正是因为如此，为了能够移动了e之后，接下来要移动哪一个数据，就使用一个局部变量next记录e的next。然后就这样不同的移动直到移动完成。

   出现循环链表的话，就是多线程的时候，当第一个线程和第二个线程都执行了Entry<K,V> next = e.next;这个代码之后。两个线程对应的局部变量e和next对应的都是同一块内存空间。然后第二个线程处于等待cpu资源。接下来第一个线程执行完成下边的代码将所有的老数据移动到了该线程的新空间之后第二个线程执行下边的操作。为了方便表达，我们记录老的数组的这个链表为A->B->C,然后Entry<K,V> next = e.next执行之后，第一个线程的e=A(e.next=B)，next=B(B.next=C)第二个线程一样。然后按照上方描述在第一个线程执行完下边代码之后再第一个线程申请的空间的链表表示C->B->A，此时第二个线程的e和next就成了e=A(A.next=第一个线程空间的i记为T1对应的空间)，next=B(B.next=A)，然后第二个线程开始执行代码e.next = newTable[i] (第二个线程的newTable[i] 记为T2)，然后e=A(A.next=T2)，next=B(B.next=A)；然后执行newTable[i] = e;就成了T2=A(A.next=T2对应的空间)；然后执行e = next；然后e=B(B.next=A),next=B(B.next=A),T2=A(A.next=T2对应的空间);然后第二次循环，执行Entry<K,V> next = e.next;然后next=A(A.next=T2对应的空间)、e=B(B.next=A)、T2=A(A.next=T2对应的空间),执行e.next = newTable[i];然后e=B(B.next=A)、T2=A(A.next=T2对应的空间)、next=A(A.next=T2对应的空间)；然后执行newTable[i] = e;然后T2=B(B.next=A)，e=B(B.next=A)，这里就会产生B.next=A然后A.next=B。产生了循环链表的情况。

   ```java
   **
    * Transfers all entries from current table to newTable.
    */
   void transfer(Entry[] newTable, boolean rehash) {
       int newCapacity = newTable.length;
       for (Entry<K,V> e : table) {
           while(null != e) {
               Entry<K,V> next = e.next;
               if (rehash) {
                   e.hash = null == e.key ? 0 : hash(e.key);
               }
               int i = indexFor(e.hash, newCapacity);
             //如果是新的数组的话直接复制数组的元素就可以了，可能考虑到每个元素在新的散列位置不同分布所以使用的是一个一个移动的方式
               e.next = newTable[i];
               newTable[i] = e;
               e = next;
           }
       }
   }
   ```

8. 首先确定一下插入元素的数组的位置

   ```java
   int hash = hash(key);
   int i = indexFor(hash, table.length);

   ```

   ```java
   // 这个链接有讲 https://www.zhihu.com/question/20733617
   final int hash(Object k) {
       int h = hashSeed;
       if (0 != h && k instanceof String) {
           return sun.misc.Hashing.stringHash32((String) k);
       }
   		// 这段代码是为了对key的hashCode进行扰动计算，防止不同hashCode的高位不同但低位相同导致的hash冲突。简单点说，就是为了把高位的特征和低位的特征组合起来，降低哈希冲突的概率，也就是说，尽量做到任何一位的变化都能对最终得到的结果产生影响
       h ^= k.hashCode();
       h ^= (h >>> 20) ^ (h >>> 12);
       return h ^ (h >>> 7) ^ (h >>> 4);
   }
   ```

   ```java
   /**
    * Returns index for hash code h.
    */
   static int indexFor(int h, int length) {
       // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
       return h & (length-1);
   }
   ```

![image-20210518192510571](/Users/haining/Documents/mydoc/tyninganother.github.io/assets/images/post/image-20210518192510571.png)

问题：为什么数组容量一定是2的幂次数？原因是为了好计算hash值。其中indexFor这个方法是取值

​	初始化数组

```java
/**
 * Inflates the table.
 */
private void inflateTable(int toSize) {
    // Find a power of 2 >= toSize
  	// 下边这个方法是找见一个小于等于2的幂次方的数 比如 7对应的是8
    int capacity = roundUpToPowerOf2(toSize);

    threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1);
  // 用得到的2的幂次数初始化数组
    table = new Entry[capacity];
  // 用新算出的数组容量计算是否需要改变rehash这个参数所依赖的值
    initHashSeedAsNeeded(capacity);
}
```







<hr>

# CurrentHashMap（jdk1.7）

基于HashMap的具体实现，将原来的数组的进行分组，然后每一个组使用一个新的对象进行映射，然后这些个新的对象组成一个新的数组。这样就实现了ConcurrentHashMap的底层结构。

换种描述来说ConcurrentHashMap的底层是，Segment数组，然后每一个Segment对象的属性有一个HashEnty对象，这个对象就与HashMap的中的Enty的作用是一样的。

```java
static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile HashEntry<K,V> next;

    HashEntry(int hash, K key, V value, HashEntry<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    /**
     * Sets next field with volatile write semantics.  (See above
     * about use of putOrderedObject.)
     */
    final void setNext(HashEntry<K,V> n) {
        UNSAFE.putOrderedObject(this, nextOffset, n);
    }

    // Unsafe mechanics
    static final sun.misc.Unsafe UNSAFE;
    static final long nextOffset;
    static {
        try {
            UNSAFE = sun.misc.Unsafe.getUnsafe();
            Class k = HashEntry.class;
            nextOffset = UNSAFE.objectFieldOffset
                (k.getDeclaredField("next"));
        } catch (Exception e) {
            throw new Error(e);
        }
    }
}
```

要注意Segment是继承ReentrantLock，可以实现锁。

接下来讲解这个基本操作：

1. ConcurrentHashMap构造方法

   1. 确定一个Segment对象中的HashEntry[]的大小cap：通过concurrencyLevel和initialCapacity来计算，initialCapacity是初始化时候要存储的数组的总数量，concurrencyLevel这个是多少个数组组成一个一组来公用一个锁的预估值。下边的代码中就是计算cap方法：

      ```java
      int ssize = 1;
      while (ssize < concurrencyLevel) {
          ssize <<= 1;
      }
      int c = initialCapacity / ssize;
              if (c * ssize < initialCapacity)
                  ++c;
      // MIN_SEGMENT_TABLE_CAPACITY这个参数是指每一组最少几个元素组成一组公用一把锁，默认值是2
      int cap = MIN_SEGMENT_TABLE_CAPACITY;
      while (cap < c) cap <<= 1;
      ```



1. 计算key和value需要放在Segment数组的那个位置

2. 然后算出key和value放在Segment对应的数组的哪一个位置

3. 然后判断计算出来的Segment数组的位置，是否有对应的位置是否有Segment对象，如果没有就使用下边的方法初始化一个。

   ```java
   /**
    * Returns the segment for the given index, creating it and
    * recording in segment table (via CAS) if not already present.
    *
    * @param k the index
    * @return the segment
    */
   @SuppressWarnings("unchecked")
   private Segment<K,V> ensureSegment(int k) {
       final Segment<K,V>[] ss = this.segments;
       long u = (k << SSHIFT) + SBASE; // raw offset
       Segment<K,V> seg;
       if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {
           Segment<K,V> proto = ss[0]; // use segment 0 as prototype
           int cap = proto.table.length;
           float lf = proto.loadFactor;
           int threshold = (int)(cap * lf);
           HashEntry<K,V>[] tab = (HashEntry<K,V>[])new HashEntry[cap];
           if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))
               == null) { // recheck
               Segment<K,V> s = new Segment<K,V>(lf, threshold, tab);
               while ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))
                      == null) {
                   if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))
                       break;
               }
           }
       }
       return seg;
   }
   ```

4. 一个Segment元素对应的enty数组的大小通过初始化方法中进行的









# HashMap源码（1.8）

## 核心参数

## 构造函数

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
static final int tableSizeFor(int cap) {
        int n = cap - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
```

其中tableSizeFor方法就是为了得到一个大于等于2次幂的数最小数

## put方法

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

其中这个hash方法的这种实现主要是为了让key的哈希值的高16位也参与路由运算。

下边开始说putVal的方法：

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
  // Node<K,V>[] tab 应用当前的HashMap的散列表
  // Node<K,V> p 表示当前散列表的元素
  // int n  标示散列表素组的长度
  // int i 表示路由寻址结果
    Node<K,V>[] tab; Node<K,V> p; int n, i;
  // 如果table为空，那么就进行初始化table
  // 延迟初始化，
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
  // 如果新添加的数据的对应的table的位置上没有值那么就新创建节点并放在该table位置上
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
      // 如果table不为空并且添加的元素对应的table的位置上有值那么就走下边的逻辑
        Node<K,V> e; K k;
      // 如果新添加的值在table上有值的话分几种情况
      // 情况一：如果取到的数据是与新添加的数据 hash是一样的并且key的值也是一样的话，那么不作处理
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
      // 判断如果p是树节点的话就进行树的操作
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
  // modCount： 表示散列表被修改的次数，提花Node元素的Value不计数
    ++modCount;
  // 插入新元素，size自增，如果自增达到扩容条件就进行自增
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

```java
/**
 * Tree version of putVal.
 */
final TreeNode<K,V> putTreeVal(HashMap<K,V> map, Node<K,V>[] tab,
                               int h, K k, V v) {
    Class<?> kc = null;
    boolean searched = false;
    TreeNode<K,V> root = (parent != null) ? root() : this;
    for (TreeNode<K,V> p = root;;) {
        int dir, ph; K pk;
        if ((ph = p.hash) > h)
            dir = -1;
        else if (ph < h)
            dir = 1;
        else if ((pk = p.key) == k || (k != null && k.equals(pk)))
            return p;
        else if ((kc == null &&
                  (kc = comparableClassFor(k)) == null) ||
                 (dir = compareComparables(kc, k, pk)) == 0) {
            if (!searched) {
                TreeNode<K,V> q, ch;
                searched = true;
                if (((ch = p.left) != null &&
                     (q = ch.find(h, k, kc)) != null) ||
                    ((ch = p.right) != null &&
                     (q = ch.find(h, k, kc)) != null))
                    return q;
            }
            dir = tieBreakOrder(k, pk);
        }

        TreeNode<K,V> xp = p;
        if ((p = (dir <= 0) ? p.left : p.right) == null) {
            Node<K,V> xpn = xp.next;
            TreeNode<K,V> x = map.newTreeNode(h, k, v, xpn);
            if (dir <= 0)
                xp.left = x;
            else
                xp.right = x;
            xp.next = x;
            x.parent = x.prev = xp;
            if (xpn != null)
                ((TreeNode<K,V>)xpn).prev = x;
            moveRootToFront(tab, balanceInsertion(root, x));
            return null;
        }
    }
}
```



初始化/扩容方法：

为什么要进行扩容？为了解决哈希冲突导致的量化影响查询效率，扩容会缓解该问题。

扩容机制：

​	什么时候扩容？

​		通超过12扩容

​		链表长度超过8，元素大于64扩容

​	扩容是什么？

​		进行扩容时候，使用的rehash方式：每次扩容都是翻倍，与原来计算的(n-1)&hash的结果相比，只是多了一个bit位，所以节点要么就在原来的位置，要么就被分配到“原位置+旧容量”这个位置。如下图：

![image-20210525163532652](/Users/haining/Documents/mydoc/tyninganother.github.io/assets/images/post/image-20210525163532652.png)

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
final Node<K,V>[] resize() {
  // 扩容之前的哈希表
    Node<K,V>[] oldTab = table;
  // oldCap:表示扩容之前的table的数组的长度
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
  // 表示扩容之前的阈值，出发本次扩容的阈值
    int oldThr = threshold;
  // newCap：扩容之后的table的大小 newThr：扩容之后，再次触发扩容的阈值
    int newCap, newThr = 0;
  // 如果table有值，那么就不是初始化情况，这是一次扩容
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
  //
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
              // 如果是单个元素，使用hash&(length-1)计算index然后给新的table的位置
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
              // 是否是树的话
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                  // 低位链表：存放在扩容之后的数组的下标位置，与当前数组的下标的位置一致
                    Node<K,V> loHead = null, loTail = null;
                  // 高位链表：存放再扩容之后的数组的下标位置为当前数组下标位置+扩容之前数组的长度
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

转化成红黑树，首先检查是否超过的边界值如果没有超过就进行扩容，否则转化树，转化树的时候首先将之前的链表弄成弄成一个双向链表的实现，这个双向链表的节点的结构就是红黑树的节点的结构，然后hd.treeify(tab)转化为红黑树：

```java
/**
 * Replaces all linked nodes in bin at index for given hash unless
 * table is too small, in which case resizes instead.
 */
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```









https://www.bilibili.com/video/BV1v54y1B7NS?from=search&seid=12367278185378215279

![image-20210519163838009](/Users/haining/Documents/mydoc/tyninganother.github.io/assets/images/post/image-20210519163838009.png)



![image-20210525143613766](/Users/haining/Documents/mydoc/tyninganother.github.io/assets/images/post/image-20210525143613766.png)

https://www.bilibili.com/video/BV1Qk4y1672n?from=search&seid=12634272663498623818

https://www.bilibili.com/video/BV1Qk4y1672n?from=search&seid=12634272663498623818

https://www.bilibili.com/video/BV1LJ411W7dP?from=search&seid=12634272663498623818

https://www.bilibili.com/video/BV1LJ411W7dP?from=search&seid=12634272663498623818





问题

1.创建table7和8的区别











2.

3.

4.

5.

6. HashMap的原理，内部数据结构？

   数组（ArrayList）：查找比较快;删除和增加比较慢、是一个定长

   链表（LinkedList双向列表）：增删比较快查找比较慢

   jdk1.7使用的数组+链表（数据结构为哈希表）

   jdk1.8在此基础上添加了红黑树

   转化的过程：当链表过长会将链表转成红黑树以实现O（logN）时间复杂度内查找。

7. 1.7版本的HashMap

   1. 内部类Entry {final key ；value ；hash ；Entry next }

   常量：

   1. **DEFAULT_INITIAL_CAPACITY** 初始**数组**的容量 1 << 4; // aka 16  必须是2的n次幂。使用触除法散列发存放数据；问题：为什么是这个数据为什么要”2的n次幂“？有两个原因：
   2. **MAXIMUM_CAPACITY** 1 << 30 存储元素最大个数
   3. **DEFAULT_LOAD_FACTOR** 叫加载因子。扩容的时候用，当存储的数据达到数组的长度*DEFAULT_LOAD_FACTOR的时候就进行扩容，比如 10 * 0.75 个数的时候就进行扩容。
   4. 一共有4个构造函数，其中有三个()(int)(int,float)三个构造函数，这三个构造函数在被调用的时候是不会开辟该HashMap需要存储数据的存储空间。只有在put的时候才会。第四个构造函数是一个HashMap(Map<? extends K, ? extends V> m)，是需要存放参数传进来的Map数据的才会开辟存储空间。
   5. Key是可以是null的
   6. 哈希表中会有一个普遍的问题，是一个hash冲突问题。
   7. <font color=red>**注意**</font>：1.7和1.8中的常量个数又3变成6
   8. 1.7的HashMap在并发插入的时候会死循环

   tip:HashTable 一个是线程安全一个是线程不安全

8. 讲一下HashMap中put方法过程？

   （1）调key的hashCode()方法计算key的哈希值，然后根据映射关系计算数组下标

   （2）如果hash值冲突，调用equal()方法进一步判断key是否已存在。若key已存在，覆盖key对应的value值；若key不存在，将结点链接到链表中，若链表长度超过阈（TREEIFY_THRESHOLD == 8），就把链表转成红黑树；

   （3）如果hash值不冲突，直接放入数组中，若数据量超过***\*容量\*负载因子\****，需要对原数组进行扩容，每次扩容2倍

9. HashMap中hash函数是怎么实现的？还有哪些hash的实现方式？

10. HashMap怎样解决冲突，讲一下扩容过程，加入一个值在原数组中，现在移动了新数组，位置肯定改变了，那是什么定位到在这个值新数组中的位置？

   - 将新节点加到链表后，  

   - 容量扩充为原来的两倍，然后对每个节点重新计算哈希值。
   - 这个值只可能在两个地方，一个是原下标的位置，另一种是在下标为 <原下标+原容量> 的位置。

11. 抛开HashMap，hash冲突有哪些解决办法？

    链地址法、开发地址法、再hash法等

12. 针对HashMao中某个Entry链太长，查找的时间复杂度可能达到O(n)，怎么优化

    将链表转化为红黑树，JDK1.8已经实现了





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
          //onlyIfAbsent 如果等于true不改变已经存在的value
          //evict如果是false那么这个表正在创建中
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
   5. Key是可以是null的
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
