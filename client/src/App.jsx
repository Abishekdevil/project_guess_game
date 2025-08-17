import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Login from './components/Login';
import Signup from './components/Signup';
import History from './components/History';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
