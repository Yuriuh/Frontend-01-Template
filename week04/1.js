// 分步骤分析例题

/* // 1.

new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);
}, 0);

console.log(3); */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
3
1
undefined // 宏任务和微任务的分隔，第1个宏任务的返回结果
2 // 第2个宏任务中的微任务
*/

/* // 2.

new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);
}, 0);

console.log(3),
  function () {
    return this.a;
  }; // function会作为第1个宏任务的返回值，传递给JavaScript引擎 */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
3
1
ƒ () {
  return this.a;
} // 宏任务和微任务的分隔，第1个宏任务的返回值
2 // 第2个宏任务中的微任务 */

/* // 3.

setTimeout(() => {
  console.log('a', this.a); // a 3
  console.log(2);
}, 0);

new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  console.log(1);
  this.a = 3;
});

console.log(3),
  function () {
    return this.a;
  }; // function会作为第1个宏任务的返回值，传递给JavaScript引擎 */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
3
1
ƒ () {
  return this.a;
} // 宏任务和微任务的分隔，第1个宏任务的返回值
a 3 // 第1个宏任务中的微任务先于第2个宏任务运行
2 // 第2个宏任务中的微任务 */

/* // 4.

new Promise((resolve, reject) => {
  console.log(0);
  resolve();
}).then(() => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);

  new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    console.log(3);
  });
}, 0);

console.log(4);
console.log(5); */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
0 // 第1个宏任务的第1个微任务，0、4、5是同步代码
4
5
1 // 第1个宏任务的第2个微任务中的异步代码
undefined // 第1个宏任务的执行结果
// 第2个宏任务
2 // 第2个宏任务的第1个微任务中的异步代码
3 // 第2个宏任务的第2个微任务中的异步代码 */

/* // 5.

async function aFoo() {
  console.log(-3);

  await new Promise((resolve, reject) => {
    console.log(-2);
    resolve();
  });
  console.log(-1);
}

new Promise((resolve, reject) => {
  console.log(0);
  resolve();
}).then(() => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);

  new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    console.log(3);
  });
}, 0);

console.log(4);
console.log(5);
aFoo(); */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
0 // 第1个宏任务的第1个微任务，0、4、5是同步代码
4
5
-3
-2
1 // 第1个宏任务的第2个微任务中的异步代码
-1 // 第1个宏任务的第3个微任务中的异步代码
Promise {<resolved>: undefined} // 第1个宏任务的执行结果
// 第2个宏任务
2 // 第2个宏任务的第1个微任务中的异步代码
3 // 第2个宏任务的第2个微任务中的异步代码 */

/* // 6.

async function aFoo() {
  console.log(-3);

  await new Promise((resolve, reject) => {
    console.log(-2);
    resolve();
  });
  console.log(-1);
}

new Promise((resolve, reject) => {
  console.log(0);
  resolve();
}).then(() => {
  console.log(1);
  new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    console.log(1.5);
  });
});

setTimeout(() => {
  console.log(2);

  new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    console.log(3);
  });
}, 0);

console.log(4);
console.log(5);
aFoo(); */

/* 浏览器控制台输出结果
// 第1个宏任务中的微任务
0 // 第1个宏任务的第1个微任务，0、4、5是同步代码，1入队
4
5
-3  // -1入队
-2
1 // 第1个宏任务的第2个微任务中的异步代码，1.5入队
-1 // 第1个宏任务的第3个微任务中的异步代码
1.5 // 第1个宏任务的第4个微任务中的异步代码
Promise {<resolved>: undefined} // 第1个宏任务的执行结果
// 第2个宏任务
2 // 第2个宏任务的第1个微任务中的异步代码
3 // 第2个宏任务的第2个微任务中的异步代码 */

/* // 7.

setTimeout(() => {
  console.log('cool');
}, 0),
  1 + 1; */

/* 
2 // 第1个宏任务的执行结果
cool // 第2个宏任务中第1个微任务的输出
*/

/* // 8.

new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  console.log('cool');
}),
  1 + 1; */

/* 
cool // 宏任务中第1个微任务的输出
2// 第1个宏任务的执行结果
*/

// 同学问题

/* // 1.

function sleep(duration) {
  return new Promise(function (resolve, reject) {
    console.log('b');
    setTimeout(function () {
      resolve();
      var begin = Date.now();
      while (Date.now() - begin < 1000);
      console.log('d');
    }, duration);
  });
}
console.log('a');
sleep(0).then(() => {
  console.log('c');
}); */

/* 
// 第1个宏任务
a
b // 第1个宏任务中的第1个微任务结束
Promise {<pending>} // 第1个宏任务的执行结果
// 第2个宏任务
d // 第2个宏任务中的第1个微任务
c // 第2个宏任务中的第2个微任务
*/

// 2.

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

/* 
async1 start
async2 // async1 end入队
promise1 // promise2入队，宏任务的第1个微任务执行完毕
async1 end // 宏任务中的第2个微任务
promise2 // 宏任务中的第3个微任务
Promise {<resolved>: undefined} // 宏任务的执行结果
*/
