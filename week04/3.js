var set = new Set();
var globalProperties = [
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Array',
  'Date',
  'RegExp',
  'Promise',
  'Proxy',
  'Map',
  'WeakMap',
  'Set',
  'WeakSet',
  'Function',
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Object',
  'Error',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint16Array',
  'Uint32Array',
  'Uint8ClampedArray',
  'Atomics',
  'JSON',
  'Math',
  'Reflect',
];
var queue = [];
var current;

// 遍历出Realm中的的对象名称和对应的对象，存储在queue中
for (const p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p],
  });
}

while (queue.length) {
  // 从队列取出一个对象名
  current = queue.shift();

  // 判断对象是否已被存储过，避免重复保存
  if (set.has(current.object)) {
    continue;
  }

  set.add(current.object);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
  // 由于每个对象中还包含有对象，因此需要继续遍历
  for (const p of Object.getOwnPropertyNames(current.object)) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
    // 判断p是否为current的属性类型并分别存储
    var property = Object.getOwnPropertyDescriptor(current.object, p);

    // 为何要判断property.value instanceof Object？
    if (
      property.hasOwnProperty('value') &&
      ((typeof property.value !== null &&
        typeof property.value === 'function') ||
        typeof property.value === 'object') &&
      property.value instanceof Object
    ) {
      queue.push({
        // 保存当前对象的访问路径
        path: current.path.concat([p]),
        object: property.value,
      });
    }

    // 此处从没有判断为true过？
    if (property.hasOwnProperty('get') && typeof property.get === 'function') {
      queue.push({
        path: current.path.concat([p]),
        object: property.get,
      });
    }

    // 此处从没有判断为true过？
    if (property.hasOwnProperty('set') && typeof property.set === 'function') {
      queue.push({
        path: current.path.concat([p]),
        object: property.set,
      });
    }
  }
}

console.log('set', set);
console.log('set.size', set.size);
