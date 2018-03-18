import React from 'react'

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(...args) {
      super(...args)
      this.generator = createGenerator()
      const { value, done } = this.generator.next()
      if (!done && value.type === 'RENDER') {
        this.state = {
          node: value.node
        }
      } else {
        this.state = {
          node: null
        }
      }
    }

    componentDidMount() {
      this.stepGenerator()
    }

    stepGenerator() {
      const { value, done } = this.generator.next()
      if (done) {
        this.generator = null
      } else if (value.type === 'RENDER') {
        this.setState({
          node: value.node
        })
      } else if (value.type === 'CALL') {
        // TODO
      }
    }

    render() {
      return this.state.node
    }
  }

  return Runner
}

export default run
