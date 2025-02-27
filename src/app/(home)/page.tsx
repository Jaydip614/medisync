"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Shield, 
  User, 
  Heart, 
  MoveUp, 
  ArrowRight, 
  BarChart, 
  CalendarClock
} from 'lucide-react';

export default function MedicalLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    setMounted(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-8 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className="transition-all duration-1000 ease-in-out transform"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(2rem)'
            }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              HealthSync<span className="text-blue-600">Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Advanced healthcare management system for modern medical professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Cards Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
          <div className="relative max-w-7xl mx-auto px-4">
            <Card className="absolute left-10 bottom-32 w-40 h-40 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl animate-float">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Heart size={32} className="text-red-500 mb-2" />
                <p className="text-sm font-medium text-center">Patient Vitals Monitoring</p>
              </CardContent>
            </Card>
            <Card className="absolute left-1/3 bottom-16 w-44 h-44 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl animate-float animation-delay-1000">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Calendar size={32} className="text-blue-500 mb-2" />
                <p className="text-sm font-medium text-center">Smart Scheduling System</p>
              </CardContent>
            </Card>
            <Card className="absolute right-1/3 bottom-24 w-48 h-48 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl animate-float animation-delay-2000">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <BarChart size={32} className="text-purple-500 mb-2" />
                <p className="text-sm font-medium text-center">Advanced Analytics Dashboard</p>
              </CardContent>
            </Card>
            <Card className="absolute right-10 bottom-40 w-40 h-40 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl animate-float animation-delay-3000">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Shield size={32} className="text-green-500 mb-2" />
                <p className="text-sm font-medium text-center">Secure Patient Records</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your practice and provide exceptional patient care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Appointment Scheduling",
                description: "AI-powered system optimizes your calendar and reduces no-shows with automated reminders",
                icon: <CalendarClock className="h-10 w-10 text-blue-500" />
              },
              {
                title: "Real-time Patient Monitoring",
                description: "Track vitals and patient progress with comprehensive dashboards and alerts",
                icon: <Heart className="h-10 w-10 text-red-500" />
              },
              {
                title: "Secure Patient Records",
                description: "HIPAA-compliant secure storage with advanced encryption and access controls",
                icon: <Shield className="h-10 w-10 text-green-500" />
              },
              {
                title: "Telemedicine Integration",
                description: "Seamless virtual consultations with integrated video and messaging",
                icon: <User className="h-10 w-10 text-purple-500" />
              },
              {
                title: "Advanced Analytics",
                description: "Gain insights with powerful reporting and predictive analytics",
                icon: <BarChart className="h-10 w-10 text-indigo-500" />
              },
              {
                title: "Billing & Insurance Management",
                description: "Streamline revenue cycle with automated claims processing and payment tracking",
                icon: <Clock className="h-10 w-10 text-teal-500" />
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                <CardHeader>
                  <div className="relative z-10 flex items-center">
                    <div className="mr-4 p-2 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-blue-600 p-0 hover:text-blue-800 hover:bg-transparent group">
                    Learn more 
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Parallax */}
      <section className="py-24 bg-blue-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of medical practices already using HealthSyncPro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "HealthSyncPro transformed our practice. Patient wait times decreased by 40% and staff productivity improved dramatically.",
                author: "Dr. Sarah Johnson",
                role: "Chief of Medicine, Metro Hospital"
              },
              {
                quote: "The analytics dashboard gives me insights I never had before. I can now make data-driven decisions that improve patient outcomes.",
                author: "Dr. Michael Chen",
                role: "Family Physician"
              },
              {
                quote: "Implementation was seamless and the support team is incredible. Our ROI was positive within the first quarter.",
                author: "Amanda Williams",
                role: "Practice Manager, Central Medical Group"
              }
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 text-blue-600">
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                      <path d="M13.5 18H9C9 12.4772 13.4772 8 19 8V12C15.6863 12 13 14.6863 13 18V18ZM31.5 18H27C27 12.4772 31.4772 8 37 8V12C33.6863 12 31 14.6863 31 18V18Z" stroke="currentColor" strokeWidth="4"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your practice?</h2>
              <p className="text-xl text-blue-100 max-w-xl">
                Join over 2,000 healthcare providers who've improved patient care and operational efficiency with HealthSyncPro.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">HealthSync<span className="text-blue-400">Pro</span></h3>
              <p className="text-gray-400">Advanced healthcare management system for modern medical professionals</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Integration</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 HealthSyncPro. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add animated scroll to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1 focus:outline-none ${scrollY > 500 ? 'opacity-100' : 'opacity-0'}`}
      >
        <MoveUp size={24} />
      </button>

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}