'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { checkBloodStockLevels } from '@/lib/notifications';
import BloodScarcitySimulator from '@/components/BloodScarcitySimulator';

interface BloodStock {
  id: string;
  blood_type: string;
  units: number;
  status: string;
  last_updated: string;
}

interface NotificationPreference {
  bloodType: string;
  isActive: boolean;
}

const mockBloodStock: BloodStock[] = [
  { id: '1', blood_type: 'A+', units: 50, status: 'Available', last_updated: '2024-03-20' },
  { id: '2', blood_type: 'A-', units: 30, status: 'Available', last_updated: '2024-03-20' },
  { id: '3', blood_type: 'B+', units: 15, status: 'Low', last_updated: '2024-03-20' },
  { id: '4', blood_type: 'B-', units: 8, status: 'Critical', last_updated: '2024-03-20' },
  { id: '5', blood_type: 'O+', units: 45, status: 'Available', last_updated: '2024-03-20' },
  { id: '6', blood_type: 'O-', units: 12, status: 'Low', last_updated: '2024-03-20' },
  { id: '7', blood_type: 'AB+', units: 25, status: 'Available', last_updated: '2024-03-20' },
  { id: '8', blood_type: 'AB-', units: 10, status: 'Low', last_updated: '2024-03-20' },
];

export default function BloodStockPage() {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>(mockBloodStock);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check blood stock levels periodically
    const interval = setInterval(() => {
      checkBloodStockLevels();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchBloodStock();
  }, []);

  const fetchBloodStock = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_stock')
        .select('*')
        .order('blood_type');

      if (error) throw error;
      setBloodStock(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleNotification = async (bloodType: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const existingPreference = notificationPreferences.find(
        pref => pref.bloodType === bloodType
      );

      const isActive = !existingPreference?.isActive;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          blood_type: bloodType,
          is_active: isActive,
        });

      if (error) throw error;

      setNotificationPreferences(prev =>
        prev.map(pref =>
          pref.bloodType === bloodType
            ? { ...pref, isActive }
            : pref
        )
      );
    } catch (error) {
      console.error('Error updating notification preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blood Stock Management</h1>
        <BloodScarcitySimulator />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bloodStock.map((stock) => (
              <tr key={stock.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stock.blood_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(stock.status)}`}>
                    {stock.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(stock.last_updated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 