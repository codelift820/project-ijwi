import React from 'react';
import { Users, Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold">IjwiRyacu</h3>
                <p className="text-sm text-gray-300">Amplifying Community Voices</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting communities with local authorities for transparent governance and effective issue resolution across Rwanda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Report Issue</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">View Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Kigali, Rwanda</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">+250 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">info@ijwiryacu.rw</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 IjwiRyacu. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;