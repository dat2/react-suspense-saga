# Overview
A React component that renders the results of an ES2015 generator.

The *suspense* is killing me, so I decided to explore this before React implements
it themselves!

# Getting started

## Install
```
npm i react-suspense-saga
```
or
```
yarn add react-suspense-saga
```

## Quick Example
```jsx
import runner from 'react-suspense-saga'
import { call, render } from 'react-suspense-saga/effects'

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

# Examples
- [Async](examples/Async.js)

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
  node: React.Node | React.Component,
  extraProps: Object?
): Effect
```

This will render a node or a react component.

eg.
```jsx
const Loading = () => <p>Loading...</p>

const MyComponent = runner(function*() {
  yield render(Loading) // props for MyComponent will get forwarded to this
  yield render(<p>my component</p>)
  yield render(MyOtherComponent, { name: 'nick' })
})
```

## takeProps
```js
takeProps(): Effect
```

This will hook into the `componentWillReceiveProps` lifecycle method, and block your
saga until the props have changed. It will also receive the initial props on
`componentDidMount`.

eg.
```js
const GreetingWithProps = runner(function*() {
  // Every time the props change, we will re-render
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
