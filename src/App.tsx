import './style/App.css';
import './style/form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormPage from './pages/FormPage';
import TablePage from './pages/TablePage';
import TablePage2 from './pages/TablePage2';
import EmailEditorPage from './pages/EmailEditorPage';

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <div className='row'>
          <Navbar />
        </div>
        <div className='row d-flex justify-content-center'>
          <div className='col-10'>
            <Routes>
              <Route path="/" element= {<FormPage />} />
              <Route path="table" element= {<TablePage />} />
              <Route path="table2" element = {<TablePage2 />} />
              <Route path="email-editor" element = {<EmailEditorPage />} />
            </Routes>
          </div>
        </div>  
      </div>
    </div>
  );
}

export default App;
