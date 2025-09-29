import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  User, 
  Lock, 
  Mail,
  ArrowRight,
  Zap,
  CheckCircle,
  Globe,
  Database,
  MapPin,
  CreditCard,
  Phone,
  Calendar,
  UserCheck,
  Users,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

const NomineeAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    
    // Signup fields
    name: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    aadharNumber: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    relationWithUser: '',
    userAadharNumber: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, 'nominee');
    
    if (result.success) {
      // Open biometric verification page in new tab
      navigate('/verification');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate Aadhar number format
    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      setError('Aadhar number must be exactly 12 digits');
      return;
    }

    // Validate user Aadhar number format
    if (!/^\d{12}$/.test(formData.userAadharNumber)) {
      setError('User Aadhar number must be exactly 12 digits');
      return;
    }

    // Validate phone number format
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setError('Phone number must be a valid 10-digit Indian mobile number');
      return;
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      setError('Pincode must be exactly 6 digits');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || 
        !formData.address.street || !formData.address.city || 
        !formData.address.state || !formData.address.pincode ||
        !formData.aadharNumber || !formData.phoneNumber || 
        !formData.dateOfBirth || !formData.gender ||
        !formData.relationWithUser || !formData.userAadharNumber) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    // Remove confirmPassword from the data sent to backend
    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData, 'nominee');
    
    if (result.success) {
      // Open biometric verification page in new tab
      navigate('/verification');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      aadharNumber: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      relationWithUser: '',
      userAadharNumber: ''
    });
  };

  const stats = [
    { number: "99.8%", label: "Security Rate", icon: <Shield className="w-5 h-5" /> },
    { number: "45M+", label: "Active Users", icon: <User className="w-5 h-5" /> },
    { number: "24/7", label: "Available", icon: <Globe className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Auth Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          {/* Slider Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Container with Slider Effect */}
          <div className="relative overflow-hidden">
            <div 
              className={`flex transition-transform duration-500 ease-in-out ${
                isLogin ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Login Form */}
              <div className="w-full flex-shrink-0">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Nominee Login
                  </h2>
                  <p className="text-gray-600">
                    Access your nominee account
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Signup Form */}
              <div className="w-full flex-shrink-0">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Nominee Registration
                  </h2>
                  <p className="text-gray-600">
                    Register as a nominee for existing user
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                  {/* Basic Information */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nominee-Specific Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Nominee Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="relationWithUser" className="block text-sm font-medium text-gray-700 mb-2">
                          Relation with User
                        </label>
                        <select
                          id="relationWithUser"
                          name="relationWithUser"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          value={formData.relationWithUser}
                          onChange={handleChange}
                        >
                          <option value="">Select Relation</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="userAadharNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          User's Aadhar Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="userAadharNumber"
                            name="userAadharNumber"
                            type="text"
                            required
                            maxLength="12"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                            placeholder="Enter user's 12-digit Aadhar"
                            value={formData.userAadharNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Aadhar Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="aadharNumber"
                            name="aadharNumber"
                            type="text"
                            required
                            maxLength="12"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                            placeholder="Enter your 12-digit Aadhar"
                            value={formData.aadharNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            required
                            maxLength="10"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                            placeholder="Enter 10-digit mobile number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Address Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          id="address.street"
                          name="address.street"
                          type="text"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter street address"
                          value={formData.address.street}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          id="address.city"
                          name="address.city"
                          type="text"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter city"
                          value={formData.address.city}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          id="address.state"
                          name="address.state"
                          type="text"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter state"
                          value={formData.address.state}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <input
                          id="address.pincode"
                          name="address.pincode"
                          type="text"
                          required
                          maxLength="6"
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter pincode"
                          value={formData.address.pincode}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          id="address.country"
                          name="address.country"
                          type="text"
                          required
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter country"
                          value={formData.address.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Register as Nominee
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Back to Main Auth */}
          <div className="text-center pt-6 border-t border-gray-200 mt-6">
            <p className="text-gray-600 text-sm">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Info Panel */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Nominee Benefits Portal</h3>
              <p className="text-blue-100 leading-relaxed">
                Secure access to government benefits as a nominee with advanced verification systems and fraud prevention.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-700 bg-opacity-50 p-2 rounded-full">
                  <Users className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Nominee Registration</h4>
                  <p className="text-blue-200 text-sm">Register as a nominee for existing users with Aadhar verification</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-700 bg-opacity-50 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Secure Verification</h4>
                  <p className="text-blue-200 text-sm">Advanced security with relation verification and Aadhar matching</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-700 bg-opacity-50 p-2 rounded-full">
                  <Database className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Instant Access</h4>
                  <p className="text-blue-200 text-sm">Quick verification and immediate access to nominee benefits</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-700">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeAuth;
