'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Users, Home, Code2, Github, Linkedin, X, Instagram, Mail} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-slate-950 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/20 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-orange-500/15 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-bl from-amber-400/10 to-orange-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-amber-900/30 bg-gradient-to-r from-orange-950/90 via-amber-950/90 to-orange-950/90 backdrop-blur-xl sticky top-0 shadow-lg shadow-amber-900/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-300 to-orange-300 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/40">
                S
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-200 via-orange-200 to-amber-100 bg-clip-text text-transparent">
                SuraJz
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-amber-300 transition text-amber-100/80 text-sm font-medium">Home</a>
              <a href="#" className="hover:text-amber-300 transition text-amber-100/80 text-sm font-medium">About</a>
              <a href="#" className="hover:text-amber-300 transition text-amber-100/80 text-sm font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-100 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
              Welcome to My Portal
            </h1>
            <p className="text-xl lg:text-2xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed font-light mb-12">
              Professional solutions for job notifications and student feedback management
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => router.push('/job-notifications')}
                className="flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300 hover:from-amber-300 hover:to-orange-200 text-slate-900 font-bold rounded-lg hover:shadow-xl hover:shadow-amber-400/50 transition-all duration-300"
              >
                <Briefcase className="h-5 w-5" />
                Job Notifications
              </button>
              <button
                onClick={() => router.push('/students-feedback')}
                className="flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-indigo-400/50 transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                Student Feedback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-orange-950/40 backdrop-blur-xl border border-amber-800/40 rounded-xl p-8 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-amber-200 flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-amber-300" />
              Job Notifications
            </h3>
            <p className="text-amber-100/90 mb-4">
              Manage and track job notifications from top companies. Get real-time updates about new opportunities.
            </p>
            <ul className="space-y-3 pl-5 mt-4 text-amber-100/90 list-disc list-inside">
              <li>Custom job alerts</li>
              <li>Company profiles</li>
              <li>Application tracking</li>
            </ul>
            <button
              onClick={() => router.push('/job-notifications')}
              className="mt-6 px-6 py-2 border-2 border-amber-400/50 text-amber-200 font-bold rounded-lg hover:bg-amber-500/10 hover:border-amber-300/70 transition-all duration-300"
            >
              Explore Jobs
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-indigo-950/40 backdrop-blur-xl border border-indigo-800/40 rounded-xl p-8 hover:border-indigo-700/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-indigo-200 flex items-center gap-3">
              <Users className="h-6 w-6 text-indigo-300" />
              Student Feedback
            </h3>
            <p className="text-indigo-100/90 mb-4">
              Collect and manage student feedback for courses and campus facilities. Gain valuable insights.
            </p>
            <ul className="space-y-3 pl-5 mt-4 text-indigo-100/90 list-disc list-inside">
              <li>Comprehensive feedback forms</li>
              <li>Analytics dashboard</li>
              <li>Improvement tracking</li>
            </ul>
            <button
              onClick={() => router.push('/students-feedback')}
              className="mt-6 px-6 py-2 border-2 border-indigo-400/50 text-indigo-200 font-bold rounded-lg hover:bg-indigo-500/10 hover:border-indigo-300/70 transition-all duration-300"
            >
              Give Feedback
            </button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 border-t border-amber-900/40 bg-gradient-to-r from-orange-950/80 via-amber-950/80 to-orange-950/80 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-300 to-orange-300 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/40">
                  S
                </div>
                <span className="font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent text-xl">SuraJz</span>
              </div>
              <p className="text-amber-200/70 text-sm font-light leading-relaxed">
                Professional developer creating innovative solutions for web and mobile applications with cutting-edge technologies.
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-amber-300 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-amber-200 transition text-amber-200/70 text-sm font-light">
                    <Home className="h-4 w-4" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-amber-200 transition text-amber-200/70 text-sm font-light">
                    <Briefcase className="h-4 w-4" />
                    Job Notifications
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-amber-200 transition text-amber-200/70 text-sm font-light">
                    <Users className="h-4 w-4" />
                    Student Feedback
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-amber-200 transition text-amber-200/70 text-sm font-light">
                    <Mail className="h-4 w-4" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Social */}
            <div>
              <h4 className="font-bold mb-4 text-amber-300 text-lg">Connect With Me</h4>
              <div className="grid grid-cols-3 gap-3">
                <a href="https://github.com/Suraj1819" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Github className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                <a href="https://www.linkedin.com/in/suraj-kumar-72847b30a/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Linkedin className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                <a href="https://x.com/SuraJzRt" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <X className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                <a href="https://leetcode.com/u/Suraj_1819/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Code2 className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                <a href="https://www.instagram.com/risu2948/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Instagram className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                {/* <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Facebook className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Disc className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a> */}
                {/* <a href="https://www.twitch.tv/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-orange-900/30 border border-amber-800/40 rounded-lg hover:bg-orange-900/50 hover:border-amber-600/60 transition duration-300 flex items-center justify-center group">
                  <Twitch className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition" />
                </a> */}
              </div>
            </div>

            {/* Column 4 - Resources */}
            <div>
              <h4 className="font-bold mb-4 text-amber-300 text-lg">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-amber-200 transition text-amber-200/70 text-sm font-light">Documentation</a></li>
                <li><a href="#" className="hover:text-amber-200 transition text-amber-200/70 text-sm font-light">Tutorials</a></li>
                <li><a href="#" className="hover:text-amber-200 transition text-amber-200/70 text-sm font-light">FAQ</a></li>
                <li><a href="#" className="hover:text-amber-200 transition text-amber-200/70 text-sm font-light">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-900/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-amber-300/60 text-sm font-light">&copy; {new Date().getFullYear()} SuraJz. All rights reserved.</p>
            <p className="text-amber-300/60 text-sm flex items-center gap-1 font-light">
              Made with <span className="text-red-500 text-lg animate-pulse">❤️</span> by <span className="font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">SuraJz</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}