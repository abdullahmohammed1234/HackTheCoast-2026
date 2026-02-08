'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  MapPinIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  CubeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  const features = [
    {
      icon: CubeIcon,
      title: 'Sustainable',
      description: 'Give items a second life and reduce waste on campus',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trusted',
      description: 'Verified UBC student community - safe and secure transactions',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: ClockIcon,
      title: 'Convenient',
      description: 'Easy pickup from campus residences and nearby areas',
      gradient: 'from-purple-500 to-violet-600'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Students', icon: UserGroupIcon },
    { value: '200+', label: 'Items Listed', icon: CubeIcon },
    { value: '8', label: 'Residences', icon: MapPinIcon },
    { value: '50kg+', label: 'Waste Saved', icon: GlobeAltIcon }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: SparklesIcon,
      title: 'Sign Up',
      description: 'Create an account with your UBC email to join the community'
    },
    {
      step: 2,
      icon: AcademicCapIcon,
      title: 'Browse & Search',
      description: 'Find items by category, location, or search keywords'
    },
    {
      step: 3,
      icon: CheckBadgeIcon,
      title: 'Connect & Trade',
      description: 'Message sellers and arrange safe meetups on campus'
    }
  ];

  const categories = [
    { name: 'Dorm Essentials', icon: CubeIcon, gradient: 'from-amber-500 to-orange-600' },
    { name: 'Electronics', icon: SparklesIcon, gradient: 'from-blue-500 to-cyan-600' },
    { name: 'Textbooks', icon: AcademicCapIcon, gradient: 'from-purple-500 to-violet-600' },
    { name: 'Furniture', icon: CubeIcon, gradient: 'from-amber-600 to-yellow-600' },
    { name: 'Clothing', icon: SparklesIcon, gradient: 'from-pink-500 to-rose-600' },
    { name: 'Appliances', icon: CubeIcon, gradient: 'from-teal-500 to-emerald-600' },
    { name: 'Sports Gear', icon: SparklesIcon, gradient: 'from-indigo-500 to-blue-600' },
    { name: 'Other', icon: GlobeAltIcon, gradient: 'from-gray-500 to-gray-600' }
  ];

  const residences = ['Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird', 'Place Vanier'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ubc-blue via-ubc-blue to-primary opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo.webp"
                  alt="Exchangify Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Welcome to Exchangify
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              The UBC student marketplace for buying, selling, and trading items. 
              Sustainable. Local. By students, for students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-ubc-blue px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              About Exchangify
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exchangify is a student-powered marketplace designed specifically for the UBC community. 
              We believe in reducing waste, saving money, and building connections between students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-modern p-8 text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is easy - join hundreds of students already trading on campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-ubc-blue to-primary text-white text-3xl font-bold mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ubc-blue/10 mb-4">
                    <item.icon className="h-7 w-7 text-ubc-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                    <ArrowRightIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Browse Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you need from students in your residence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="card-modern p-6 text-center cursor-pointer group hover:border-primary/30">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Campus Residences
            </h2>
            <p className="text-xl text-gray-600">
              Trading made convenient across all UBC residence areas
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {residences.map((residence, index) => (
              <span key={index} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer shadow-sm">
                <MapPinIcon className="h-4 w-4" />
                {residence}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-ubc-blue to-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the UBC community and discover great deals on campus. 
            Sign up today and start saving!
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-ubc-blue px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Free Account
            <CheckBadgeIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.webp"
                  alt="Exchangify Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold ubc-gradient-text">Exchangify</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Exchangify. Built for UBC Students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
