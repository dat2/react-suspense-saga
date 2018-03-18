export function render(node) {
  return {
    type: 'RENDER',
    node
  }
}

export function delay(ms) {
  return {
    type: 'DELAY',
    ms
  }
}

export function takeProps() {
  return {
    type: 'TAKE_PROPS'
  }
}

export function call(fn, ...args) {
  return {
    type: 'CALL',
    fn,
    args
  }
}
