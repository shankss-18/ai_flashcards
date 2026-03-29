import "./App.css"
import Input from "./components/Input/Input";
import Output from "./components/Output/Output.jsx";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Input />} />
      <Route path="/output" element={<Output />} />
    </Routes> 
  );
};

export default App; 