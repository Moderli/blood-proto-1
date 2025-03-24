'use client';

import Link from 'next/link';
import { BeakerIcon, UserGroupIcon, ChartBarIcon, TruckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Blood Stock Management',
    description: 'Track and manage blood inventory levels across different blood types with real-time updates.',
    icon: BeakerIcon,
  },
  {
    name: 'Donation Requests',
    description: 'Handle incoming donation requests and schedule blood donation drives efficiently.',
    icon: UserGroupIcon,
  },
  {
    name: 'Analytics & Reports',
    description: 'Generate comprehensive reports and analyze trends in blood usage and donations.',
    icon: ChartBarIcon,
  },
  {
    name: 'Distribution Tracking',
    description: 'Monitor blood distribution to hospitals and track usage patterns.',
    icon: TruckIcon,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <span className="text-2xl font-bold text-indigo-600">BloodBank</span>
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            <Link
              href="/auth/login"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Blood Bank Management System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A comprehensive solution for managing blood bank operations, tracking inventory, and optimizing distribution to save lives.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your blood bank
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive system provides all the tools you need to efficiently manage blood bank operations and ensure timely delivery to those in need.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/auth/login" className="text-gray-400 hover:text-gray-500">
              Sign in
            </Link>
            <Link href="/auth/signup" className="text-gray-400 hover:text-gray-500">
              Sign up
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2024 Blood Bank Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
