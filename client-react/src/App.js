import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CanvasComponent from './Components/CanvasComponent';
import Base from './Pages/Base';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/draw" element={<CanvasComponent />} />
      </Routes>
    </Router>
  );
}

export default App;