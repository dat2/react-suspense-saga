// @flow
import React from 'react'

function run(saga) {
  class Runner extends React.Component {
    state = {
      node: null
    }

    componentWillMount() {

    }

    render() {
      return this.state.node
    }
  }

  return Runner
}

export default run
