import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { call, delay, render, takeProps } from '../effects'

jest.useFakeTimers()

describe('runner', () => {
  it('will render properly', () => {
    const Basic = runner(function*() {
      yield render(<p>initial render</p>)
    })
    const wrapper = shallow(<Basic />)
    expect(wrapper).toMatchSnapshot()
  })

  it('will advance through multiple renders', () => {
    const MultipleRenders = runner(function*() {
      yield render(<p>initial render</p>)
      yield render(<p>second initial render</p>)
      yield render(<p>third initial render</p>)
    })

    const wrapper = shallow(<MultipleRenders />)
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

  it('will pass props to the takeProps effect', () => {
    const Greeting = runner(function*() {
      while (true) {
        yield render(<p>Hello {(yield takeProps()).name}</p>)
      }
    })

    const wrapper = shallow(<Greeting name="nick" />)
    expect(wrapper).toMatchSnapshot()
    wrapper.setProps({ name: 'bob' })
    expect(wrapper).toMatchSnapshot()
    wrapper.setProps({ name: 'dole' })
    expect(wrapper).toMatchSnapshot()
  })
})
