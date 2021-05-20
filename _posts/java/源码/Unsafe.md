https://www.cnblogs.com/throwable/p/9139947.html

### putOrderedObject

- `public native void putOrderedObject(Object o, long offset, Object x);`

设置o对象中offset偏移地址offset对应的Object型field的值为指定值x。这是一个有序或者有延迟的putObjectVolatile方法，并且不保证值的改变被其他线程立即看到。只有在field被volatile修饰并且期望被修改的时候使用才会生效。类似的方法有`putOrderedInt`和`putOrderedLong`。

