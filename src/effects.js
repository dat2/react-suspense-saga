export function call(fn, ...args) {
  return {
    type: 'CALL',
    fn,
    args
  }
}

export function render(node) {
  return {
    type: 'RENDER',
    node
  }
}
