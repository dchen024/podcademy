
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Pod from './pod';
import PodID from './podId';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pod" element={<Pod />} />
        <Route path="/pod/:id" element={<PodID />} />
      </Routes>
    </Router>
  );
};

export default App;