import './App.css';
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GroupList from './DataTable/GroupTable';
import Header from './Header/Header';
import Footer from './Footer';
import AboutUs from './About';
import ColorStore from './stores/ColorStore';
import Login from './Login/Login';
import RequireToken from './Login/Auth';
import PendingGroupsTable from './Admin/PendingGroupsTable';

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
            <Route path="/login" element={<Login navigateTo='/admin'/>} />
            <Route path="/admin" element={
                                    <RequireToken navigateTo='/login'>
                                      <PendingGroupsTable />
                                    </RequireToken>
                                      } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default observer(App);
