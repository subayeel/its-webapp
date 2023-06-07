import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Main/Dashboard";
import PersistLogin from "./pages/Auth/PersistLogin";
import Register from "./pages/Auth/Register";
import Home from "./pages/Main/Home";
import RequireAuth from "./pages/Auth/RequireAuth";
import Unauthorized from "./pages/Auth/Unauthorized";

const ROLES = {
  Candidate: 2001,
  Manager: 5150,
};
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<Login />} path="/login"></Route>
            <Route element={<Register />} path="/register"></Route>
            <Route element={<Unauthorized />} path="/unauthorized"></Route>
            <Route element={<RequireAuth allowedRoles={ROLES.Candidate} />}>
              <Route element={<Navbar />}>
                <Route element={<Dashboard />} path="/project/:id"></Route>
              </Route>
              
              <Route element={<Home />} path="/home"></Route>
              <Route element={<Home />} path="/its-webapp"></Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
