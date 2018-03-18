import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { render } from '../effects'

describe('runner', () => {
  describe('render', () => {
    const EmptyRender = runner(function*() { });

    const InitialRender = runner(function*() {
      yield render(<div>initial render</div>)
    })

    const MultipleRenders = runner(function*() {
      yield render(<div>initial render</div>)
      yield render(<div>second render</div>)
    })

    it('works for empty sagas', () => {
      const wrapper = shallow(<EmptyRender />)
      expect(wrapper).toMatchSnapshot()
    })

    it('works for the initial render', () => {
      const wrapper = shallow(<InitialRender />)
      expect(wrapper).toMatchSnapshot()
    })

    it('works for multiple renders', () => {
      const wrapper = shallow(<MultipleRenders />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
