import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Main/Dashboard";
import PersistLogin from "./pages/Auth/PersistLogin";
import Register from "./pages/Auth/Register";
import Home from "./pages/Main/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<Login />} path="/login"></Route>
            <Route element={<Register />} path="/register"></Route>

            <Route element={<Navbar></Navbar>}>
              <Route element={<Dashboard />} path="/project/:id"></Route>
              <Route element={<Home />} path="/"></Route>
              <Route element={<Home />} path="/its-webapp"></Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
