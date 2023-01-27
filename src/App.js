import './App.css';
import axios from 'axios';
import GroupList from './GroupTable';
import Header from './Header';
import { createRef } from 'react';


function App() {
  return (
    <div className="App">
      <Header />
      <GroupList/>
    </div>
  );
}

export default App;
