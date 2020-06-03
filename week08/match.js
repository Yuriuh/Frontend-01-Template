function match(element, selector) {
  if (!selector || !element.attributes) {
    return false
  }
  if (selector.charAt(0) == '#') {
    let attr = element.attributes.find((attr) => attr.name == 'id')
    if (attr && attr.value == selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) == '.') {
    let attr = element.attributes.find((attr) => attr.name == 'class')
    if (attr && attr.value == selector.replace('.', '')) {
      return true
    }
  } else {
    if (element.tagName == selector) {
      return true
    }
  }
  return false
}
