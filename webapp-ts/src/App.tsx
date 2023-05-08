import { Provider } from 'react-redux';
import './App.css';
import {store} from './redux/store';
import Home from './compoents/Home';

const App : React.FC = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
export default App;
