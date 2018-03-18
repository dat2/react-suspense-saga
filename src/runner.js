import React from 'react'

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(...args) {
      super(...args)
      this.generator = createGenerator()
      try {
        const { value, done } = this.generator.next()
        if (value.type === 'RENDER') {
          this.state = {
            node: value.node
          }
        } else {
          this.state = {
            node: null
          }
        }
      } catch (e) {}
    }

    render() {
      return this.state.node
    }
  }

  return Runner
}

export default run
