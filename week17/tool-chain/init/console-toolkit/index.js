const tty = require('tty')
const ttys = require('ttys')
const rl = require('readline')

const stdin = ttys.stdin
const stdout = ttys.stdout

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

function getChar() {
  return new Promise(resolve => {
    stdin.on('data', key => {
      resolve(key)
    })
  })
}

function up(n = 1) {
  stdout.write('\033[' + n + 'A')
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B')
}

function left(n = 1) {
  stdout.write('\033[' + n + 'D')
}

function right(n = 1) {
  stdout.write('\033[' + n + 'C')
}

void async function() {
  stdout.write('Which framework would you like to use?\n')
  const answer = await select(['vue', 'react', 'angular'])
  stdout.write('Your selected: ' + answer + '\n')
  process.exit()
}();

async function select(choices) {
  let selected = 0
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]
    if (i === selected) {
      stdout.write('[x]' + choice + '\n')
    } else {
      stdout.write('[ ]' + choice + '\n')
    }
  }
  up(choices.length)
  right()
  while (true) {
    const char = await getChar()
    if (char === '\u0003') {
      process.exit()
    }
    if (char === 'w' && selected > 0) {
      stdout.write(' ')
      left()
      selected -= 1
      up()
      stdout.write('x')
      left()
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ')
      left()
      selected += 1
      down()
      stdout.write('x')
      left()
    }
    if (char === '\r') {
      down(choices.length - selected)
      return choices[selected]
    }
  }
}