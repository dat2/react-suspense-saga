import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { delay, render, takeProps } from '../effects'

jest.useFakeTimers()

describe('runner', () => {
  describe('renders', () => {
    const EmptyRender = runner(function*() {})

    const SingleRender = runner(function*() {
      yield render(<p>initial render</p>)
    })

    const MultipleRenders = runner(function*() {
      yield render(<p>initial render</p>)
      yield render(<p>second initial render</p>)
      yield render(<p>third initial render</p>)
    })

    it('works for empty sagas', () => {
      const wrapper = shallow(<EmptyRender />)
      expect(wrapper).toMatchSnapshot()
    })

    it('works for single renders', () => {
      const wrapper = shallow(<SingleRender />)
      expect(wrapper).toMatchSnapshot()
    })

    it('works for multiple initial renders', () => {
      const wrapper = shallow(<MultipleRenders />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('delay', () => {
    const DelayedInitialRender = runner(function*() {
      yield delay(1000)
      yield render(<p>initial render</p>)
    })

    const DelayedMultipleRenders = runner(function*() {
      yield delay(1000)
      yield render(<p>initial render</p>)
      yield delay(1000)
      yield render(<p>second render</p>)
    })

    it('works when the initial render is delayed', () => {
      const wrapper = shallow(<DelayedInitialRender />)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
      expect(wrapper).toMatchSnapshot()
    })

    it('works with multiple delayed renders', () => {
      const wrapper = shallow(<DelayedMultipleRenders />)
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('take props', () => {
    const Greeting = runner(function*() {
      while (true) {
        const props = yield takeProps()
        yield render(<p>Hello {props.name}</p>)
      }
    })

    it('works with initial props', () => {
      const wrapper = shallow(<Greeting name="nick" />)
      expect(wrapper).toMatchSnapshot()
    })

    it('works with changing props', () => {
      const wrapper = shallow(<Greeting name="nick" />)
      wrapper.setProps({ name: 'bob' })
      expect(wrapper).toMatchSnapshot()
      wrapper.setProps({ name: 'robert' })
      expect(wrapper).toMatchSnapshot()
    })
  })
})
