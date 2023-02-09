import './App.css';
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GroupList from './DataTable/GroupTable';
import Header from './Header/Header';
import Footer from './Footer';
import AboutUs from './About';
import ColorStore from './stores/ColorStore';

function App() {
  const colorStore = useContext(ColorStore);
  const { colorPalette } = colorStore;
  return (
    <Router>
      <div className="App" style={{ backgroundColor: colorPalette.body.background }}>
        <div className="page-no-footer" style={{ backgroundColor: colorPalette.body.background }}>
          <Header />
          <Routes>
            <Route path="/" element={<GroupList />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default observer(App);
