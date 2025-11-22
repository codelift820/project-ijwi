import React from 'react';
import { MessageSquare, Users, TrendingUp, MapPin } from 'lucide-react';

interface HeroProps {
  setCurrentSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setCurrentSection }) => {
  const stats = [
    { label: 'Issues Reported', value: '2,847', icon: MessageSquare },
    { label: 'Issues Resolved', value: '2,134', icon: TrendingUp },
    { label: 'Active Communities', value: '186', icon: Users },
    { label: 'Districts Covered', value: '30', icon: MapPin },
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-primary-600">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Amplifying
            <span className="text-primary-600"> Community </span>
            Voices
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            IjwiRyacu connects communities with local authorities, ensuring every voice is heard and every issue finds resolution through transparent governance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <button
              onClick={() => setCurrentSection('report')}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Report an Issue
            </button>
            <button
              onClick={() => setCurrentSection('dashboard')}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-primary-600 hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;