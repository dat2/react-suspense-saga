import React from 'react';
import runner from 'react-suspense-saga';
import { call, delay, render } from 'react-suspense-saga/lib/effects';

const Loading = () => <p>Loading...</p>

const Success = ({ data }) => (
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>
)

const Err = (e) => <p>oops something went wrong</p>

const App = runner(function*() {
  yield render(Loading);
  yield delay(2000);
  try {
    const response = yield call(fetch, 'https://httpbin.org/get');
    const data = yield call(() => response.json());
    yield render(Success, { data })
  } catch (error) {
    yield render(Err, { error })
  }
});

export default App
