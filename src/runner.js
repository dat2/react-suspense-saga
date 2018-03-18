import React from 'react'

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.stepGenerator = this.stepGenerator.bind(this)
      this.getNextState = this.getNextState.bind(this)

      this.generator = createGenerator()
      this.state = {
        done: false,
        waitingForProps: false,
        stepGenerator: false,
      }
    }

    componentWillMount() {
      this.stepGenerator()
    }

    componentDidMount() {
      this.stepGenerator()
    }

    componentDidUpdate() {
      this.stepGenerator()
    }

    stepGenerator() {
      this.setState(this.getNextState, () => {
        if (this.state.stepGenerator) {
          this.setState({ stepGenerator: false })
          this.stepGenerator()
        }
      })
    }

    getGeneratorArgs(prevState, props) {
      if (prevState.waitingForProps) {
        return props
      }
    }

    getNextState(prevState, props) {
      const { value: effect, done } = this.generator.next(this.getGeneratorArgs(prevState, props))
      if (done) {
        return { done }
      } else if (effect.type === 'RENDER') {
        const node = React.isValidElement(effect.nodeOrComponent) ?
          effect.nodeOrComponent :
          React.createElement(effect.nodeOrComponent, this.props)

        return {
          done,
          waitingForProps: false,
          stepGenerator: true,
          node,
        }
      } else if (effect.type === 'DELAY') {
        setTimeout(this.stepGenerator, effect.ms)
        return {
          done,
          waitingForProps: false,
          stepGenerator: false,
        }
      } else if (effect.type === 'TAKE_PROPS') {
        return {
          done,
          waitingForProps: true,
          stepGenerator: false,
        }
      } else {
        return {
          done,
          waitingForProps: false,
          stepGenerator: false
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
