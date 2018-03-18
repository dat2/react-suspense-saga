import React from 'react'

const INITIAL = Symbol('INITIAL')
const RENDERING = Symbol('RENDERING')
const WAITING_FOR_PROPS = Symbol('WAITING_FOR_PROPS')
const WAITING_FOR_PROMISE = Symbol('WAITING_FOR_PROMISE')
const DONE = Symbol('DONE')

function run(createGenerator) {
  class Runner extends React.Component {
    constructor(props, context) {
      super(props, context)

      this.generator = createGenerator()
      this.state = {
        state: INITIAL,
        node: null,
      }
    }

    componentDidMount() {
      this.advance(this.generator.next(), this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.state === WAITING_FOR_PROPS) {
        this.advance(this.generator.next(nextProps), nextProps)
      }
    }

    async setStatePromise(state) {
      return new Promise((resolve) => {
        this.setState(state, resolve)
      })
    }

    async advance({ value: effect, done }, props) {
      if (done) {
        this.setState({
          state: DONE
        })
      } else if (effect.type === 'RENDER') {
        const node = React.isValidElement(effect.nodeOrComponent)
          ? React.cloneElement(effect.nodeOrComponent, effect.extraProps)
          : React.createElement(effect.nodeOrComponent, {
            ...props,
            ...effect.extraProps
          })

        await this.setStatePromise({
          state: RENDERING,
          node
        })
        await this.advance(this.generator.next(), props)
      } else if (effect.type === 'TAKE_PROPS') {
        if (this.state.state === INITIAL) {
          await this.advance(this.generator.next(props), props)
        } else {
          this.setState({
            state: WAITING_FOR_PROPS
          })
        }
      } else if (effect.type === 'CALL') {
        await this.setStatePromise({
          state: WAITING_FOR_PROMISE
        })
        try {
          const value = await effect.fn.apply(effect.fn, effect.fn.args)
          await this.advance(this.generator.next(value), props)
        } catch (error) {
          await this.advance(this.generator.throw(error), props)
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
