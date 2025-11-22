import React, { useState } from 'react';
import { Menu, X, Globe, MessageSquare, Users, BarChart3, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const { isAuthenticated, adminUser, logout } = useAdminAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Users },
    { id: 'report', label: 'Report Issue', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'rw' : 'en');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentSection('home');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentSection('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">IjwiRyacu</h1>
              <p className="text-xs text-gray-500">Amplifying Voices</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentSection === item.id
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Info & Logout */}
            {isAuthenticated && adminUser && (
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 rounded-md bg-primary-50">
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-600">Admin</p>
                  <p className="text-sm font-semibold text-gray-900">{adminUser.full_name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'EN' : 'RW'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentSection === item.id
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Mobile Admin Info & Logout */}
            {isAuthenticated && adminUser && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs font-medium text-gray-500">Logged in as:</p>
                  <p className="text-sm font-semibold text-gray-900">{adminUser.full_name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;