import './style/App.css';
import './style/form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormPage from './pages/FormPage';
import TablePage from './pages/TablePage';

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <div className='row'>
          <Navbar />
        </div>
        <div className='row d-flex justify-content-center'>
          <div className='col-10 form-wrapper'>
            <Routes>
              <Route path="/" element= {<FormPage />} />
              <Route path="table" element= {<TablePage />} />
            </Routes>
          </div>
        </div>  
      </div>
    </div>
  );
}

export default App;
