import React from 'react'
import { shallow } from 'enzyme'

import runner from '../runner'
import { render } from '../effects'

describe('runner', () => {
  describe('render', () => {
    const InitialRenderComponent = runner(function*() {
      yield render(<div>initial render</div>)
    })

    it('works for the initial render', () => {
      const wrapper = shallow(<InitialRenderComponent />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
