# Overview
A React component that renders the results of an ES2015 generator.

The *suspense* is killing me, so I decided to explore this before React implements
it themselves!

# Getting started

## Install
```
npm i react-saga
```
or
```
yarn add react-saga
```

## Quick Example
```jsx
import run from 'react-saga'
import { call, render } from 'react-saga/effects'

import Api from './Api'

function* greeter() {
  try {
    yield render(
      <p>Loading...</p>
    )
    const user = yield call(Api.fetchUser)
    yield render(
      <p>
        Hello {user.name}!
      </p>
    )
  } catch(e) {
    yield render(
      <p>
        Oh no, something failed!
      </p>
    )
  }
}

export default run(greeter)
```

# Demos

# API Documentation
