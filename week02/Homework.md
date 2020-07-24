# Homework
> 1. 写一个正则表达式，匹配所有 Number 直接量
```
/^(-?[0-9]+)| ([-+]?[0-9]*\.?[0-9]+) | ([01]+) | ([0-7]+\) |(0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2})$/g
```

> 2. 写一个 UTF-8 Encoding 的函数
```
function stringToUTF8(string) {
  let result = ''
  for (let i = 0; i < string.length; i++) {
    const s = string[i]
    const c = s.charCodeAt()
    const n = c.toString(16)
    result += n
  }
  return result
}
```

> 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
```
/[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|(['"])(?:(?!\1).)*?\1/g
```
