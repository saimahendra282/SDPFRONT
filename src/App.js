import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import Admin from './components/Dashboards/Admin';
import Peer from './components/Dashboards/Peer';
import User from './components/Dashboards/User';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/admin" element={<Admin></Admin>} ></Route>
        <Route path="/peer" element={<Peer></Peer>} ></Route>
        <Route path="/user" element={<User></User>} ></Route>
      </Routes>
    </Router>
  );
}

export default App;