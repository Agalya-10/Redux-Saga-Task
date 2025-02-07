import React from 'react';
import { Provider } from 'react-redux';
import LoginForm from './Components/LoginForm';
import store from './Components/store';

const App = () => (
  <Provider store={store}>
    <LoginForm/>
  </Provider>
);

export default App;