# 编程语言通史与 JavaScript 语言设计

## 语言按语法分类

- 非形式语言
  - 中文、英文

- 形式语言（乔姆斯基谱系）
  - 0型 无限制文法
  - 1型 上下文相关文法
  - 2型 上下文无关文法
  - 3型 正则文法

## 产生式（BNF）

- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- * 表示重复多次
- | 表示或
- + 表示至少一次

四则运算
  - 1 + 2 * 3
终结符
  - Number
  - +-*/
非终结符
  - MultiplicativeExpression
  - AddtiveExpression

```
"a"
"b"
<Program>:= "a"+ | "b"+
<Program>:= <Program>"a"+ | <Program>"b"+

abababbbabab

<Number> = "0" | "1" | "2" | ...... | "9"

<DecimalNumber> = "0" | ( ("1" | "2" | ...... | "9") <Number>* )

<MultiplicativeExpression> = <PrimaryExpression> |
<MultiplicativeExpression> "*" <PrimaryExpression> |
<MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> | 
<AdditiveExpression> "+" <MultiplicativeExpression> |
<AdditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> = <AdditiveExpression> |
<LogicalExpression> "||" <AdditiveExpression> |
<LogicalExpression> "&&" <AdditiveExpression>

<PrimaryExpression> = <DecimalNumber> | "(" <LogicExpression> ")"
```

## 通过产生式理解文法

- 0型 无线型文法
  - ?:==?

- 1型 上下文相关文法
  - ?<A>?::=?<B>?

```
eg: 
{
  get a { return 1 },
  get : 1
}
```

- 2型 上下文无关文法
  - <A>::=?

- 3型 正则文法
  - <A>::=<A>?
  - <A>::=?<A> x
  
```
eg: 
<DecimalNumber> = /0|[1-9][0-9]*/
```

## 其他产生式

EBNF ABNF Customized

AdditiveExpression:
  MultiplicativeExpression
  AdditiveExpression + MultiplicativeExpression
  AdditiveExpression - MultiplicativeExpression

## 现代语言的特例

- C++中，* 可能表示乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型

- VB中，< 可能是小于号，也可能是 XML 直接量的开始，取决于当前位置是否可以接受 XML 直接量

- Python中，行首的 tab 符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符 indent 或者 dedent

- JavaScript 中，/ 可能是除号，也可能是正则表达式开头，处理方式类似于 VB，字符串模板中也需要特殊处理 } ，还有自动插入分号规则

## 图灵完备性

- 命令式 --- 图灵机
  - goto
  - if 和 while

- 声明式 --- lambda
  - 递归
  
## 动态与静态

- 动态
  - 在用户的设备 / 在线服务器上
  - 产品实际运行时
  - Runtime

- 静态
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

## 类型系统

- 动态类型系统与静态类型系统

- 强类型与弱类型
  - String + Number
  - String == Boolean

- 复合类型
  - 结构体
  - 函数签名

- 子系统
  - 逆变 / 协变

```
eg:
{
  a: T1
  b: T2
}
(T1, T2) => T3
凡是能用 Array<Parent>的地方，都能用Array<Child>
凡是能用Function<Child>的地方，都能用Function<Parent>
```


## 一般命令式编程语言

- Atom
  - Identifier
  - Literal

- Expression
  - Atom
  - Operator
  - Punctuator

- Statement
  - Expression
  - Keyword
  - Punctuator

- Structure
  - Function
  - Class
  - Process
  - Namespace

- Program
  - Program
  - Module
  - Package
  - Library

# JavaScript 词法, 类型

## 引子

```javascript
// 打印前 128 位数字对应的 UTF-16 代码单元序列创建的字符串
for (let i = 0; i < 128; i++) {
  console.log(String.fromCharCode(i))
}

// 不要使用中文名做变量名
var 厉害 = 1
// 完全等效上面
var \u5389\u5bb3 = 1
```



## Unicode 字符集

- Block 编码组
  - Basic Latin: U+0000 - U+007F
  - CJK: U+4E00 - U+9FFF
  - BMP(基本字符区域): U+0000 - U+FFFF 



## Atom 词

- InputElement
  - WhiteSpace 空白符
    - \<TAB>: 制表符 
    - \<VT>: 纵向制表符
    - \<FF>: Form Feed
    - \<SP>: Space
    - \<NBSP>: No Break Space
  - LineTerminator 换行符
    - \<LF>: Line Feed `\n`
    - \<CR>: Carriage Return `\r`
    - \<LS>
    - \<PS>
  - Comment 注释
  - Token 记号：一切有效的东西
    - Identifier: 标识符，可以以`字符`、`_` 或者 `$` 开头，代码中用来表示变量、函数、或属性的字符序列
      - 变量名 (不可以跟关键字重合)
      - 属性名 (可以跟关键字重合)
    - Punctuator: 符号，如 `>` `=` `<` `}`
    - Literal: 字面量
      - Number
        - 存储 Unit8Array、Float64Array
        - 各种进制的写法
          - 二进制 0b
          - 八进制 0o
          - 十六进制 0x
        - 实践
          - 比较浮点数：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
          - 查看一个数字的二进制: (66).toString(2)
      - String
        - Character 字符
        - Code Point 码点
        - Encoding
          - Unicode
            - UTF-8
            - UTF-16 实际内存中是这种方式
          - Grammer: "" '' ``
      - Boolean
      - Null
      - Undefined
    - Keywords: 比如 `var`、`await` 不能用作变量名，但像 getter 里面的 `get` 是个例外

```javascript
// undefined 在局部作用域值可以被覆盖
void function() {
  var undefined = 3
  console.log(undefined)
}()
```
