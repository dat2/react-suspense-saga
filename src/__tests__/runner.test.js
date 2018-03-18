import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { call, delay, render, takeProps } from '../effects'

async function clearPromises(n) {
  for (let i = 0; i < n; i++) {
    await Promise.resolve()
  }
}

describe('runner', () => {
  it('will render properly', () => {
    const Basic = runner(function*() {
      yield render(<p>initial render</p>)
    })
    const wrapper = shallow(<Basic />)
    expect(wrapper).toMatchSnapshot()
  })

  it('will advance through multiple renders', async () => {
    const MultipleRenders = runner(function*() {
      yield render(<p>initial render</p>)
      yield render(<p>second initial render</p>)
      yield render(<p>third initial render</p>)
    })

    const wrapper = shallow(<MultipleRenders />)
    await clearPromises(2)
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('will pass props to a stateless functional component', () => {
    const Greeting = props => <p>Hello {props.name}</p>

    const GreetingRunner = runner(function*() {
      yield render(Greeting)
    })

    const wrapper = shallow(<GreetingRunner name="nick" />)
    expect(wrapper).toMatchSnapshot()
  })

  it('will pass props to a ES2015 class component', () => {
    class GreetingClass extends React.Component {
      render() {
        return <p>{this.props.name}</p>
      }
    }

    const GreetingRunner = runner(function*() {
      yield render(GreetingClass)
    })

    const wrapper = shallow(<GreetingRunner name="nick" />)
    expect(wrapper).toMatchSnapshot()
  })

  it('will pass props to the takeProps effect', async () => {
    const Greeting = runner(function*() {
      while (true) {
        const { name } = yield takeProps()
        yield render(<p>Hello {name}</p>)
      }
    })

    const wrapper = shallow(<Greeting name="nick" />)
    expect(wrapper).toMatchSnapshot()

    await clearPromises(1)
    wrapper.setProps({ name: 'bob' })
    expect(wrapper).toMatchSnapshot()

    await clearPromises(1)
    wrapper.setProps({ name: 'dole' })
    expect(wrapper).toMatchSnapshot()
  })

  it('will run the call effect properly', async () => {
    const AsyncGreeting = runner(function*() {
      const { name } = yield call(() => Promise.resolve({ name: 'nick' }))
      yield render(<p>Hello { name }</p>)
    })

    const wrapper = shallow(<AsyncGreeting />)
    await clearPromises(2)
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('will handle a rejected call effect properly', async () => {
    const AsyncFailedGreeting = runner(function*() {
      try {
        const { name } = yield call(() => Promise.reject(new Error('nick')))
        yield render(<p>Hello { name }</p>)
      } catch (e) {
        yield render(<p>Oops, something went wrong</p>)
      }
    })

    const wrapper = shallow(<AsyncFailedGreeting />)
    await clearPromises(2)
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })
})
