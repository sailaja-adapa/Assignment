import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import RegistrationForm from './Registrationform';
import Login from './Login';
import ContactForm from './ContactForm';
import ContactsTable from './ContactsTable';
import LoginDashboard from './LoginDashboard';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard/>} />  
                <Route path="/register" element={<RegistrationForm/>} />  
                <Route path="/login" element={<Login/>} />  
                <Route path="/logindashboard" element={<LoginDashboard/>} />  
                <Route path="/table" element={<ContactsTable/>} />  
                <Route path="/contact" element={<ContactForm/>} />  
            </Routes>
        </Router>
    );
}

export default App;
