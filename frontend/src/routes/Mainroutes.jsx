import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './../pages/Home';
import Contact from './../pages/Contact';
import Singup from './../pages/Singup';
import About from './../pages/About';
import Login from './../pages/Login';
import NomineeAuth from './../pages/NomineeAuth';
import UnifiedAuth from './../pages/UnifiedAuth';
import NomineeDashboard from './../pages/NomineeDashboard';
import ProtectedRoute from './../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import BiometricVerification from '../components/BiometricVerification';




const Mainroutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/verification' element={<BiometricVerification />} />
            <Route path='/about' element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Singup />} />
            <Route path='/nominee-auth' element={<NomineeAuth />} />
            <Route path='/auth' element={<UnifiedAuth />} />
            <Route path='/dashboard' element={
              <ProtectedRoute allowedUserTypes={['normal']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path='/nominee-dashboard' element={
              <ProtectedRoute allowedUserTypes={['nominee']}>
                <NomineeDashboard />
              </ProtectedRoute>
            } />
            <Route path='*' element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default Mainroutes