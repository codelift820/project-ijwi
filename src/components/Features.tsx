import React from 'react';
import { MessageSquare, Globe, BarChart3, Shield, Users, Zap } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Multi-Channel Reporting',
      description: 'Report issues via web, SMS, WhatsApp, or USSD - accessible to everyone in the community.',
      color: 'bg-blue-500'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in Kinyarwanda and English, ensuring language is never a barrier to civic engagement.',
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: 'Transparent Tracking',
      description: 'Real-time dashboard showing issue status, resolution progress, and community impact metrics.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security while maintaining transparency in governance.',
      color: 'bg-red-500'
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Built for communities, by communities. Every voice matters in shaping local governance.',
      color: 'bg-yellow-500'
    },
    {
      icon: Zap,
      title: 'Rapid Response',
      description: 'Automated workflows ensure quick acknowledgment and efficient routing to relevant authorities.',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Empowering Communities Through Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            IjwiRyacu bridges the gap between communities and local authorities with modern, accessible tools for transparent governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;