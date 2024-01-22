import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/home";
import Register from "./Pages/register";
import Login from "./Pages/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
