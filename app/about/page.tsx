"use client";

import React from 'react';
import { Users, Target, Award, Heart, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
      name: 'David Park',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our users at the heart of everything we do, ensuring the best experience.',
      color: 'red',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly evolve and adapt to bring you the latest in event technology.',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with bank-level security.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build connections and foster a vibrant community of event enthusiasts.',
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About EventHub</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              We're on a mission to connect people through unforgettable experiences.
              Discover the story behind your favorite event platform.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  EventHub was born from a simple observation: finding and booking great events
                  was unnecessarily complicated. In 2020, our founders set out to change that,
                  creating a platform that makes discovering and attending events effortless.
                </p>
                <p>
                  What started as a small team with big dreams has grown into a thriving platform
                  serving hundreds of thousands of event-goers and organizers worldwide. We've
                  facilitated millions of bookings and helped create countless memorable experiences.
                </p>
                <p>
                  Today, EventHub stands as the premier destination for events across all categories,
                  from intimate workshops to massive festivals. But our mission remains the same:
                  to connect people with experiences that enrich their lives.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To make discovering and attending events accessible to everyone, everywhere.
                We strive to be the bridge between event organizers and attendees, creating
                seamless experiences that bring communities together and create lasting memories.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the world's most trusted event platform, where every person can
                easily discover experiences that match their interests, and every organizer
                has the tools to create successful events that inspire and connect people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at EventHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 bg-${value.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className={`w-10 h-10 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind EventHub
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">EventHub by the Numbers</h2>
              <p className="text-xl text-purple-100">
                Our impact in the events industry
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">500K+</div>
                <div className="text-purple-100">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">5M+</div>
                <div className="text-purple-100">Tickets Sold</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-purple-100">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">99%</div>
                <div className="text-purple-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the EventHub community and discover amazing events happening near you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Browse Events
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
