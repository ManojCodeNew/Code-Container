import Editor from "./Code/Editor.jsx";
import View from "./Code/View.jsx";
import Login from "./UserAthentication/Login.jsx";
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/codeEditor" element={<Editor />} />
          <Route path="/viewcode" element={<View/>} />

        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
