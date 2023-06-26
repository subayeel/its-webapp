import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Main/Dashboard";
import PersistLogin from "./pages/Auth/PersistLogin";
import Register from "./pages/Auth/Register";
import Home from "./pages/Main/Home";
import RequireAuth from "./pages/Auth/RequireAuth";
import Unauthorized from "./pages/Auth/Unauthorized";
import AuthLayout from "./pages/Auth/AuthLayout";
import DevDashboard from "./pages/Dev/DevDashboard";

const ROLES = {
  Developer: 2023,
  Manager: 2000,
};
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PersistLogin />}>
            {/* <Route element={<Login />} path="/"></Route> */}
            <Route element={<AuthLayout />} path="/">
              <Route element={<Login />} path="/"></Route>
              <Route element={<Register />} path="/register"></Route>
            </Route>
            <Route element={<Unauthorized />} path="/unauthorized"></Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Manager]} />}>
              <Route element={<Navbar />}>
                <Route element={<Dashboard />} path="/project/:id"></Route>
                <Route element={<Home />} path="/home"></Route>
                <Route element={<Home />} path="/its-webapp"></Route>
              </Route>
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Developer]} />}>
              <Route element={<Navbar />}>
                <Route element={<DevDashboard />} path="/dev"></Route>
                <Route element={<Dashboard />} path="/dev/project/:id"></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
