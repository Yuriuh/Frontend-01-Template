# 有限状态机

- 每一个状态都是一个机器
  - 在每一个机器里，我们可以做计算、存储、输出...
  - 所有的这些机器接受的输入是一致的（参数一致）
  - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是一个纯函数（无副作用）

- 每一个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore）
  - 每个机器根据输入决定下一个状态（Mealy）（常用）

# 使用有限状态机处理字符串

- 在一个字符串中，找到字符 'a'

```javascript
function findA(string) {
  for (const c of string) {
    if (c === 'a') return true
  }
  return false
}
```
- 在一个字符串中，找到字符 'ab'

```javascript
function match(string) {
  let foundA = false
  for (const c of string) {
    if (c === 'a') {
      foundA = true
    } else if (foundA && c === 'b') {
      return true
    } else {
      foundA = false
    }
  }
  return false
}
```

- 在一个字符串中，找到 'abcdef'

```javascript
function match(string) {
  let foundA = false
  let foundB = false
  let foundC = false
  let foundD = false
  let foundE = false
  for (const c of string) {
    if (c === 'a') {
      foundA = true
    }
    else if (foundA && c === 'b') {
      foundB = true
    }
    else if (foundB && c === 'c') {
      foundC = true
    }
    else if (foundC && c === 'd') {
      foundD = true
    }
    else if (foundD && c === 'e') {
      foundE = true
    }
    else if (foundE && c === 'f') {
      return true
    }
    else {
      foundA = false
      foundB = false
      foundC = false
      foundD = false
      foundE = false
    }
  }
  return false
}
```

# JS 中的有限状态机（Mealy）

```javascript
// 每个函数是一个状态
function state(input) { // 函数参数就是输入
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next // 返回值作为下一个状态
}

while (input) {
  // 获取输入
  state = state(input) // 把状态机的返回值作为下一个状态
}
```

- 在一个字符串中，找到 'abcdef' （用 Mealy 状态机改写）

```javascript
function match(string) {
  let state = start
  for (const c of string) {
    state = state(c)
  }
  return state === end
}

function start(char) {
  if (char === 'a') {
    return foundA
  } else {
    return start
  }
}

function end(char) {
  return end
}

function foundA(char) {
  if (char === 'b') {
    return foundB
  } else {
    return start
  }
}

function foundB(char) {
  if (char === 'c') {
    return foundC
  } else {
    return start
  }
}

function foundC(char) {
  if (char === 'd') {
    return foundD
  } else {
    return start
  }
}

function foundD(char) {
  if (char === 'e') {
    return foundE
  } else {
    return start
  }
}

function foundE(char) {
  if (char === 'f') {
    return end
  } else {
    return start
  }
}
```

```javascript
function match(string) {
  let state = start
  for (const c of string) {
    state = state(c)
  }
  return state === end
}

function start(char) {
  if (char === 'a') {
    return foundA
  } else {
    return start
  }
}

function end(char) {
  return end
}

function foundA(char) {
  if (char === 'b') {
    return foundB
  } else {
    return start(char)
  }
}

function foundB(char) {
  if (char === 'c') {
    return end
  } else {
    return start(char)
  }
}
```

- 如何用状态机处理诸如 'abcabx' 这样的字符串？
- 作业：使用状态机完成 'abababx' 的处理
- 可选作业：我们如何用状态机处理完全位置的 pattern？
  - 参考资料：字符串 KMP 算法

```javascript
function match(string) {
  let state = start
  for (const c of string) {
    state = state(c)
  }
  return state === end
}

function start(char) {
  if (char === 'a') {
    return foundA
  } else {
    return start
  }
}

function end(char) {
  return end
}

function foundA(char) {
  if (char === 'b') {
    return foundB
  } else {
    return start(char)
  }
}

function foundB(char) {
  if (char === 'c') {
    return foundC
  } else {
    return start(char)
  }
}

function foundC(char) {
  if (char === 'a') {
    return foundA2
  } else {
    return start(char)
  }
}

function foundA2(char) {
  if (char === 'b') {
    return foundB2
  } else {
    return start(char)
  }
}

function foundB2(char) {
  if (char === 'x') {
    return end
  } else {
    return foundB(char)
  }
}

console.log('abcabcabx', match('abcabcabx'))
```