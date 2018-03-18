import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { delay, render } from '../effects'

jest.useFakeTimers()

describe('runner', () => {
  const EmptyRender = runner(function*() {})

  const InitialRender = runner(function*() {
    yield render(<div>initial render</div>)
  })

  const MultipleInitialRenders = runner(function*() {
    yield render(<div>initial render</div>)
    yield render(<div>second initial render</div>)
  })

  it('works for empty sagas', () => {
    const wrapper = shallow(<EmptyRender />)
    expect(wrapper).toMatchSnapshot()
  })

  it('works for the initial render', () => {
    const wrapper = shallow(<InitialRender />)
    expect(wrapper).toMatchSnapshot()
  })

  it('works for multiple initial renders', () => {
    const wrapper = shallow(<MultipleInitialRenders />)
    expect(wrapper).toMatchSnapshot()
  })

  const DelayedInitialRender = runner(function*() {
    yield delay(1000)
    yield render(<div>initial render</div>)
  })

  const DelayedMultipleRenders = runner(function*() {
    yield delay(1000)
    yield render(<div>initial render</div>)
    yield delay(1000)
    yield render(<div>second render</div>)
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
