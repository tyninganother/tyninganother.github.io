---
layout: article
title: Java基础-运算符
mathjax: true
tags: Java基础 运算符
key: 2019-02-01-1
categories:
- Java
- Java基础
---
# 一、位运算
位运算符用来对二进制位进行操作，包括按位取反（~）、按位与（&）、按位或（|）、异或（^）、右移（>>）、左移（<<）和无符号右移（>>>）。位运算符只能对整数型和字符型数据进行操作。
## 1.取反（~）
- **运算规则**：~1=0； ~0=1；
- **规则说明**：即：对一个二进制数按位取反，即将0变1，1变0。
- **eg**: ~1=0； ~0=1；
## 2. 按位与（&）
- **运算规则**：0&0=0; 0&1=0; 1&0=0; 1&1=1；
- **规则说明**：两位同时为“1，结果才为“1，否则为0。
- **eg**：3&5 即 0000 0011 & 0000 0101 = 0000 0001 因此，3 & 5的值得1。
## 3. 按位或（|）
- **运算规则**：0 | 0=0； 0 | 1=1； 1 | 0=1； 1 | 1=1；
- **规则说明** ：参加运算的两个对象只要有一个为1，其值为1。
- **eg**：3 | 5，即 0000 0011 | 0000 0101 = 0000 0111 因此，3 | 5的值得7。
## 4. 异或（^）
- **运算规则**：0^0=0； 0^1=1； 1^0=1； 1^1=0；

- **规则说明**：参加运算的两个对象，如果两个相应位为“异”（值不同），则该位结果为1，否则为0。
- **eg**：0^0=0； 0^1=1； 1^0=1； 1^1=0；
## 5.左移（<<）
- **运算规则**：按二进制形式把所有的数字向左移动对应的位数，高位移出（舍弃），低位的空位补零。左移时**不管正负**，低位补0.
- **规则说明**：位移后十进制数值变成：24690，刚好是12345的二倍，所以有些人会用左位移运算符代替乘2的操作，但是这并不代表是真的就是乘以2，很多时候，我们可以这样使用，但是一定要知道，位移运算符很多时候可以代替乘2操作，但是这个并不代表两者是一样的。
- **eg**：
  >
      正数：r = 20 << 2
        20的二进制补码：0001 0100
        向左移动两位后：0101 0000
                结果：r = 80
      负数：r = -20 << 2
      -20 的二进制原码：1001 0100
      -20 的二进制反码：1110 1011
      -20 的二进制补码：1110 1100
      左移两位后的补码：1011 0000
                反码：1010 1111
                原码：1101 0000
                结果：r = -80

- **扩展**：如果任意一个十进制的数左位移32位，右边补位32个0，十进制岂不是都是0了？当然不是！！！ 当int 类型的数据进行左移的时候，当左移的位数大于等于32位的时候，位数会先求余数，然后再进行左移，也就是说，如果真的左移32位 12345 << 32 的时候，会先进行 **位数求余数** ，即为 12345<<(32%32) 相当于 12345<< 0 ，所以12345<< 33 的值和12345<<1 是一样的，都是 24690。
## 6. 右移（>>）
- **运算规则**：按二进制形式把所有的数字向右移动对应的位数，低位移出（舍弃）,如果该数为正，则高位补0，若为负数，则高位补1；
- **规则说明**：右移后得到的值为 6172 和int 类型的数据12345除以2取整所得的值一样，所以有些时候也会被用来替代除2操作。另外，*对于超过32位的位移，和左移运算符一样，会先进行* **位数求余数**。
- **eg**：
  >注：以下数据类型默认为byte-8位
      正数：r = 20 >> 2
      20的二进制补码：0001 0100
      向右移动两位后：0000 0101
            结果：r = 5
        负数：r = -20 >> 2
      　　-20 的二进制原码 ：1001 0100
      　　-20 的二进制反码 ：1110 1011
      　　-20 的二进制补码 ：1110 1100
      　　右移两位后的补码：1111 1011
      　　　　　　　　反码：1111 1010
      　　　　　　　　原码：1000 0101
      　　　　　　　　结果：r = -5

## 7. 无符号右移（>>>）
- **规则说明**：也叫逻辑右移，即若该数为正，则高位补0，而若该数为负数，则右移后高位同样补0。
- **eg**：
  
  >正数：　r = 20 >>> 2 的结果与 r = 20 >> 2 相同；
      负数：　r = -20 >>> 2
      注：以下数据类型默认为int 32位
      -20:
      源码：10000000  00000000   00000000   00010100
      反码：11111111  11111111   11111111   11101011
      补码：11111111  11111111   11111111   11101100
      右移：00111111  11111111   11111111   11111011
      结果：r = 1073741819

