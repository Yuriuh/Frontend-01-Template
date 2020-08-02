const css = require('css')

module.exports = function(source, map) {
  const cssObj = css.parse(source)
  const styleSheet = cssObj['stylesheet']
  const fullPath = this.resourcePath.match(/([^/]+).css$/)[1]
  const array = fullPath.split('\\')
  const name = array[array.length - 1]
  console.log('name', name)

  styleSheet.rules.forEach(rule => {
    rule.selectors = rule.selectors.map(s => {
      return s.match(new RegExp(`^.${name}`))
        ? s
        : `${name} ${selector}`
    })
  })

  console.log(css.stringify(cssObj))

  return `
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(css.stringify(cssObj))}
    document.documentElement.appendChild(style)
  `
}