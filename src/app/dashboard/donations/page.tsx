'use client';

import { useState } from 'react';
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Donation {
  id: string;
  donorName: string;
  bloodType: string;
  units: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Rejected';
}

const mockDonations: Donation[] = [
  { id: '1', donorName: 'John Doe', bloodType: 'A+', units: 2, date: '2024-03-20', status: 'Completed' },
  { id: '2', donorName: 'Jane Smith', bloodType: 'O-', units: 1, date: '2024-03-19', status: 'Pending' },
  { id: '3', donorName: 'Mike Johnson', bloodType: 'B+', units: 2, date: '2024-03-18', status: 'Completed' },
  { id: '4', donorName: 'Sarah Williams', bloodType: 'AB+', units: 1, date: '2024-03-17', status: 'Rejected' },
];

export default function DonationsPage() {
  const [donations] = useState<Donation[]>(mockDonations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Blood Donations</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Donation
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {donations.map((donation) => (
            <li key={donation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {donation.donorName}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {donation.bloodType} - {donation.units} units
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Donation Date: {donation.date}
                    </p>
                  </div>
                  {donation.status === 'Pending' && (
                    <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 