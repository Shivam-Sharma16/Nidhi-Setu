import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  MapPin,
  Phone,
  UserCheck,
  X,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGlobalFunds } from '../context/GlobalFundsContext';
import { useNavigate } from 'react-router-dom';
import AccountsModal from '../components/AccountsModal';

// Mock data - would be replaced with actual API calls
const mockUserData = {
  fullName: "Sahil bagga",
  email: "sahilbagga@example.com",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  phoneNumber: "7307973865",
  aadharNumber: "123456789456",
  dateOfBirth: "2005-08-26",
  gender: "Male",
  memberSince: "2025-09-09",
  verification: "Verified",
  address: {
    street: "Jecrc",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302022",
    country: "India"
  },
  enrolledSchemes: [
    {
      id: 1,
      title: "Pradhan Mantri Pension Yojana",
      description: "Monthly pension for senior citizens",
      status: "Active",
      enrollmentDate: "2024-03-15",
      amount: 3000,
      frequency: "Monthly"
    },
    {
      id: 2,
      title: "Direct Benefit Transfer (DBT)",
      description: "Subsidy for LPG connections",
      status: "Active",
      enrollmentDate: "2024-01-10",
      amount: 200,
      frequency: "Quarterly"
    },
    {
      id: 3,
      title: "Farmers Welfare Scheme",
      description: "Financial assistance for farmers",
      status: "Pending",
      enrollmentDate: "2024-05-22",
      amount: 6000,
      frequency: "Yearly"
    }
  ],
  funds: {
    totalReceived: 12800,
    transactions: [
      {
        id: 1,
        scheme: "Pradhan Mantri Pension Yojana",
        amount: 3000,
        date: "2024-08-01",
        status: "Completed"
      },
      {
        id: 2,
        scheme: "Direct Benefit Transfer (DBT)",
        amount: 200,
        date: "2024-07-15",
        status: "Completed"
      },
      {
        id: 3,
        scheme: "Pradhan Mantri Pension Yojana",
        amount: 3000,
        date: "2024-07-01",
        status: "Completed"
      },
      {
        id: 4,
        scheme: "Farmers Welfare Scheme",
        amount: 6000,
        date: "2024-06-20",
        status: "Pending"
      }
    ]
  }
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use global funds context
  const { governmentFunds, transactionHistory, deductFunds, resetFunds, forceReset } = useGlobalFunds();
  
  // Generate pension calendar based on current date
  const generatePensionCalendar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const calendar = {};
    months.forEach((month, index) => {
      if (index < currentMonth) {
        calendar[month] = { status: 'paid', amount: 2000 };
      } else if (index === currentMonth || index === currentMonth + 1) {
        calendar[month] = { status: 'available', amount: 2000 };
      } else {
        calendar[month] = { status: 'pending', amount: 2000 };
      }
    });
    return calendar;
  };

  // Pension calendar state
  const [pensionCalendar, setPensionCalendar] = useState(() => generatePensionCalendar());
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  
  const { user, getUserProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const result = await getUserProfile();
        
        if (result.success) {
          // Transform the user data to match the expected format
          const transformedData = {
            fullName: result.user.name,
            email: result.user.email,
            address: result.user.address,
            aadharNumber: result.user.aadharNumber,
            phoneNumber: result.user.phoneNumber,
            dateOfBirth: result.user.dateOfBirth,
            gender: result.user.gender,
            memberSince: new Date(result.user.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            }),
            // Keep mock data for schemes and funds for now
            enrolledSchemes: mockUserData.enrolledSchemes,
            funds: mockUserData.funds
          };
          setUserData(transformedData);
        } else {
          // If no user data, use mock data for demo purposes
          setUserData(mockUserData);
        }
      } catch (err) {
        // If there's an error, use mock data for demo purposes
        console.error('Error fetching user data:', err);
        setUserData(mockUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getUserProfile]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No User Data</h2>
          <p className="text-gray-600">Unable to load user information.</p>
        </div>
      </div>
    );
  }

  const toggleSchemeDetails = (schemeId) => {
    if (expandedScheme === schemeId) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(schemeId);
    }
  };

  const handlePensionClaim = (month) => {
    if (pensionCalendar[month].status === 'available') {
      // Check if there are sufficient funds
      if (governmentFunds < 2000) {
        setSuccessMessage('Insufficient government funds. Please try again later.');
        setShowSuccessModal(true);
        return;
      }

      // Update pension status to paid
      setPensionCalendar(prev => ({
        ...prev,
        [month]: { ...prev[month], status: 'paid' }
      }));
      
      // Prepare user info for transaction record
      const userInfo = {
        fullName: userData?.fullName || 'Unknown User',
        email: userData?.email || 'N/A',
        aadharNumber: userData?.aadharNumber || 'N/A'
      };
      
      // Deduct 2000 rupees from global government funds and record transaction
      deductFunds(2000, userInfo, month);
      
      // Show success message
      setSuccessMessage(`₹${pensionCalendar[month].amount} pension for ${month} has been credited to your account successfully! ₹2000 deducted from government funds.`);
      setShowSuccessModal(true);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const displayedTransactions = showAllTransactions 
    ? userData.funds.transactions 
    : userData.funds.transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        {/* Government Funds Allotted Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={() => setShowAccountsModal(true)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Government Funds Allotted</h2>
                    <p className="text-blue-100 text-sm">Total allocation for welfare schemes</p>
                    <p className="text-blue-200 text-xs mt-1">Click to view transaction history</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1">₹{governmentFunds.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm">Rupees</div>
                  <button 
                    onClick={forceReset}
                    className="mt-2 px-3 py-1 bg-white bg-opacity-20 text-white text-xs rounded-lg hover:bg-opacity-30 transition-all"
                  >
                    Reset Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pension Calendar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Pension Calendar {new Date().getFullYear()}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(pensionCalendar).map(([month, data]) => (
                <motion.div
                  key={month}
                  whileHover={{ scale: data.status === 'available' ? 1.05 : 1 }}
                  whileTap={{ scale: data.status === 'available' ? 0.95 : 1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    data.status === 'paid' 
                      ? 'bg-red-50 border-red-200 cursor-not-allowed' 
                      : data.status === 'available'
                      ? 'bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 hover:border-green-300'
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  }`}
                  onClick={() => handlePensionClaim(month)}
                >
                  <div className="text-center">
                    <div className={`text-sm font-semibold mb-2 ${
                      data.status === 'paid' 
                        ? 'text-red-600' 
                        : data.status === 'available'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {month}
                    </div>
                    <div className={`text-lg font-bold mb-1 ${
                      data.status === 'paid' 
                        ? 'text-red-700' 
                        : data.status === 'available'
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}>
                      ₹{data.amount}
                    </div>
                    <div className="flex items-center justify-center">
                      {data.status === 'paid' ? (
                        <div className="flex items-center text-red-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Paid</span>
                        </div>
                      ) : data.status === 'available' ? (
                        <div className="flex items-center text-green-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-xs">Click to Claim</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-xs">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
                <span className="text-gray-600">Paid</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
                <span className="text-gray-600">Available to Claim</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
                <span className="text-gray-600">Pending</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 border border-blue-200 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200 opacity-20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-xl flex items-center justify-center">
                      <User className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{userData.fullName}</h2>
                  <p className="text-gray-600 flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {userData.email}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Member Since</span>
                      <span className="font-bold text-gray-800">{userData.memberSince}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Verification</span>
                      <span className="font-bold text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Phone</span>
                      <span className="font-bold text-gray-800 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {userData.phoneNumber}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Aadhar</span>
                      <span className="font-bold text-gray-800 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {userData.aadharNumber ? `****${userData.aadharNumber.slice(-4)}` : '123456789987'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Profile completion indicator */}
                <div className="mt-6 bg-white bg-opacity-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-blue-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Date of Birth</div>
                      <div className="font-semibold">
                        {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Gender</div>
                      <div className="font-semibold">{userData.gender || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-semibold text-sm">
                        {userData.address ? (
                          <>
                            {userData.address.street}<br />
                            {userData.address.city}, {userData.address.state}<br />
                            {userData.address.pincode}, {userData.address.country}
                          </>
                        ) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Funds Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Funds Overview</h2>
                <button 
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="text-blue-600 font-semibold flex items-center"
                >
                  {isDetailsExpanded ? 'Show Less' : 'See More Details'}
                  {isDetailsExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>

              <AnimatePresence>
                {isDetailsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-gray-600 text-sm">Total Received</div>
                        <div className="text-2xl font-bold text-gray-800">₹{userData.funds.totalReceived}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-gray-600 text-sm">This Month</div>
                        <div className="text-2xl font-bold text-gray-800">₹{new Date().getMonth() === 7 ? '3000' : '3200'}</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-gray-600 text-sm">Pending</div>
                        <div className="text-2xl font-bold text-gray-800">₹6000</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  {displayedTransactions.map(transaction => (
                    <motion.div 
                      key={transaction.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${transaction.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {transaction.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{transaction.scheme}</div>
                          <div className="text-sm text-gray-500">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="font-semibold">₹{transaction.amount}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {userData.funds.transactions.length > 3 && (
                <button 
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="text-blue-600 font-semibold flex items-center justify-center w-full mt-4"
                >
                  {showAllTransactions ? 'Show Less' : 'View All Transactions'}
                  <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showAllTransactions ? 'rotate-90' : ''}`} />
                </button>
              )}
            </motion.div>

            {/* Biometric Verification Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white mb-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Biometric Verification</h2>
                    <p className="text-purple-100 text-sm">Secure your account with advanced biometric authentication</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/verification')}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Verification
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>

            {/* Enrolled Schemes */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Enrolled Schemes</h2>
              <div className="grid grid-cols-1 gap-6">
                {userData.enrolledSchemes.map(scheme => (
                  <motion.div 
                    key={scheme.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer"
                    onClick={() => toggleSchemeDetails(scheme.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{scheme.title}</h3>
                        <p className="text-gray-600 mt-1">{scheme.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${scheme.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {scheme.status}
                      </span>
                    </div>

                    <AnimatePresence>
                      {expandedScheme === scheme.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-4"
                        >
                          <div className="pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Enrollment Date</div>
                                <div className="font-medium">{scheme.enrollmentDate}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Amount</div>
                                <div className="font-medium">₹{scheme.amount} {scheme.frequency}</div>
                              </div>
                            </div>
                            <button className="mt-4 text-blue-600 font-semibold flex items-center">
                              View Scheme Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeSuccessModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pension Claimed Successfully!</h3>
                <p className="text-gray-600 mb-6">{successMessage}</p>
                <button
                  onClick={closeSuccessModal}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accounts Modal */}
      <AccountsModal
        isOpen={showAccountsModal}
        onClose={() => setShowAccountsModal(false)}
        transactionHistory={transactionHistory}
        currentFunds={governmentFunds}
      />
    </div>
  );
};

export default Dashboard;