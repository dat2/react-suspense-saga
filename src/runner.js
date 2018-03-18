import React from 'react'

const INITIAL = Symbol('INITIAL')
const RENDERING = Symbol('RENDERING')
const WAITING_FOR_PROPS = Symbol('WAITING_FOR_PROPS')
const DONE = Symbol('DONE')

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(props, context) {
      super(props, context)

      this.generator = createGenerator()
      this.state = {
        state: INITIAL,
        node: null,
        data: null
      }
    }

    componentWillMount() {
      this.advance(this.generator.next(), this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.state === WAITING_FOR_PROPS) {
        this.advance(this.generator.next(nextProps), nextProps)
      }
    }

    advance({ value: effect, done }, props) {
      if (done) {
        this.setState({
          state: DONE
        })
      } else if (effect.type === 'RENDER') {
        const node = React.isValidElement(effect.nodeOrComponent)
          ? effect.nodeOrComponent
          : React.createElement(effect.nodeOrComponent, props)

        this.setState(
          {
            state: RENDERING,
            node
          },
          () => {
            this.advance(this.generator.next(), props)
          }
        )
      } else if (effect.type === 'TAKE_PROPS') {
        if (this.state.state === INITIAL) {
          this.advance(this.generator.next(props), props)
        } else {
          this.setState({
            state: WAITING_FOR_PROPS
          })
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
