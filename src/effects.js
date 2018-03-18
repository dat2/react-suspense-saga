export function render(nodeOrComponent) {
  return {
    type: 'RENDER',
    nodeOrComponent
  }
}

export function delay(ms) {
  return call(() => new Promise(resolve => setTimeout(resolve, ms)))
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
