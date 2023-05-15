import { Provider } from 'react-redux';
import './App.css';
import store from './redux/store';
import React from 'react';
import Home from './compoents/Home';

function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
export default App;
