import React from 'react'

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(...args) {
      super(...args)
      this.stepGenerator = this.stepGenerator.bind(this)
      this.getNextState = this.getNextState.bind(this)

      this.generator = createGenerator()
      this.state = this.getNextState()
    }

    componentDidMount() {
      this.stepGenerator()
    }

    stepGenerator() {
      this.setState(this.getNextState)
    }

    getNextState(prevState) {
      const { value: effect, done } = this.generator.next()
      if (done) {
        return { done }
      } else if (effect.type === 'RENDER') {
        return {
          done,
          node: effect.node
        }
      } else if (effect.type === 'DELAY') {
        setTimeout(this.stepGenerator, effect.ms)
        return {
          done
        }
      } else {
        return {
          done
        }
      }
    }

    render() {
      return this.state.node
    }
  }

  return Runner
}

export default run
