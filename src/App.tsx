import './style/App.css';
import './style/form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormPage from './pages/FormPage';

function App() {
  return (
    <div className="App">
      <div className="container m-auto">
        <Navbar />
        <div className='form-wrapper'>
          <Routes>
            <Route path="/" element={<FormPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
