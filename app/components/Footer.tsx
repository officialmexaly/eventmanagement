"use client";

import React from 'react';
import Link from 'next/link';
import { Ticket, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                EventHub
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your premier destination for discovering and booking amazing events. Create unforgettable memories with EventHub.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-purple-400 transition-colors text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-purple-400 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Organizers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="hover:text-purple-400 transition-colors text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors text-sm">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors text-sm">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors text-sm">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Event Street, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">+234 800 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">support@eventhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              {currentYear} EventHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
