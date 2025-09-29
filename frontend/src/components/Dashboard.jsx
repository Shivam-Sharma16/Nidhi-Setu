import React, { useEffect, useState } from 'react';
import { Shield, Camera, Mic, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [isVisible, setIsVisible] = useState({});

  const stats = [
    {
      title: "Today's Verifications",
      value: `${user.verificationCount}/20`,
      icon: Activity,
      color: user.verificationCount >= 20 ? 'text-red-600' : 'text-blue-600',
      bgColor: user.verificationCount >= 20 ? 'bg-red-100' : 'bg-blue-100',
    },
    {
      title: 'Security Level',
      value: 'Maximum',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Face Recognition',
      value: 'Active',
      icon: Camera,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Voice Analysis',
      value: 'Ready',
      icon: Mic,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentActivity = [
    { type: 'Face Verification', status: 'Success', time: '2 minutes ago' },
    { type: 'Liveness Check', status: 'Success', time: '1 hour ago' },
    { type: 'Voice Verification', status: 'Success', time: '3 hours ago' },
    { type: 'Multi-angle Recognition', status: 'Success', time: '1 day ago' },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10 text-center" data-section="header">
        <h1
          className={`text-4xl font-bold text-gray-800 mb-3 transition-all duration-700 ${
            isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Real-time biometric verification system overview</p>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 ${
          isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        data-section="stats"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all duration-700 ${
            isVisible.system ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          data-section="system"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Face Detection Engine</span>
              </div>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Voice Analysis Module</span>
              </div>
              <span className="text-green-600 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Liveness Detection</span>
              </div>
              <span className="text-green-600 text-sm">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Anti-spoofing System</span>
              </div>
              <span className="text-yellow-500 text-sm">Monitoring</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all duration-700 ${
            isVisible.activity ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          data-section="activity"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-800 text-sm">{activity.type}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm">{activity.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Warning */}
      {user.verificationCount >= 20 && (
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <h4 className="text-yellow-600 font-bold">Daily Limit Warning</h4>
              <p className="text-gray-700">
                You have {20 - user.verificationCount} verification
                {20 - user.verificationCount !== 1 ? 's' : ''} remaining today. The limit will reset at midnight.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
