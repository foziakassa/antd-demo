import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';
import Dashboard from './components/dashboard'
import ProjectManagement from './components/project-management';

export default function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectManagement />} />

        </Routes>
      
    </Router>
  );
}