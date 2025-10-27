import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import Films from './pages/Films';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-wrapper">
          <header className="app-header">
            <h1 className="app-title">Home Assignment</h1>
            <nav>
              <ul className="nav-links">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/films">Films</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/films" element={<Films />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
