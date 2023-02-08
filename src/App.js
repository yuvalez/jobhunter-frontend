import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupList from './DataTable/GroupTable';
import Header from './Header/Header';
import Footer from './Footer';

const About = () => <div> <h1> About Us </h1></div>

function App() {
  return (
    <Router>
      <div className="App">
        <div className="page-no-footer">
          <Header />
          <Routes>
            <Route path="/" element={<GroupList />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
