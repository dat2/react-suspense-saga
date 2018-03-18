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
import runner from 'react-saga'
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

export default runner(greeter)
```

# Demos

# API Documentation

## Call
```js
call(
  func: (...args: Array<any>) => Promise<any>,
  ...args: Array<any>
): Effect
```

This will instruct the runner to return the results of the promise back to the
generator when it `resolve`s or `reject`s.

eg.
```jsx
const AsyncGreeting = runner(function*() {
  yield render(<p>Loading...</p>)
  try {
    const response = yield call(fetch, '/api/user')
    const user = yield call(() => response.json())
    yield render(<p>Hello { user.name }!</p>)
  } catch(e) {
    yield render(<p>Something went wrong 🤔</p>)
  }
})
```

## delay
```js
delay(
  ms: number
): Effect
```

This will instruct the runner to use `setTimeout`.

eg.
```jsx
const MyComponent = runner(function*() {
  yield delay(1000)
  yield render(<p>my component</p>)
})
```

## render
```js
render(
  node: React.Node | React.Component
): Effect
```

This will render a node or a react component.

eg.
```jsx
const Loading = () => <p>Loading...</p>

const MyComponent = runner(function*() {
  yield render(Loading)
  yield render(<p>my component</p>)
})
```

## takeProps
```js
takeProps(): Effect
```

This is a blocking effect, that will not advance the generator until the props
have changed.

You can use this with `redux`, or any component that will change the props like
this:
```js
const AsyncGreeting = runner(function*() {
  while (true) {
    const { loading, name } = yield takeProps()
    if (loading) {
      yield render(<p>Loading...</p>)
    } else {
      yield render(<p>Hello {name}</p>)
    }
  }
})
```
