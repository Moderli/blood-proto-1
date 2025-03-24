'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface BloodStock {
  blood_type: string;
  units: number;
  expiring_soon: number;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function Dashboard() {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For now, using mock data
    const mockData = bloodTypes.map((type) => ({
      blood_type: type,
      units: Math.floor(Math.random() * 100) + 20,
      expiring_soon: Math.floor(Math.random() * 10),
    }));
    setBloodStock(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Blood Stock Overview */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bloodStock.map((stock) => (
          <div
            key={stock.blood_type}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {stock.blood_type}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available Units
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stock.units}
                      </div>
                      {stock.expiring_soon > 0 && (
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                          {stock.expiring_soon} expiring soon
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Level Chart */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Blood Stock Levels</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bloodStock}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="blood_type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="units" name="Available Units" fill="#4f46e5" />
                <Bar dataKey="expiring_soon" name="Expiring Soon" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            {bloodStock
              .filter((stock) => stock.units < 30 || stock.expiring_soon > 0)
              .map((stock) => (
                <div
                  key={stock.blood_type}
                  className={`p-4 rounded-md ${
                    stock.units < 30
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {stock.units < 30 ? (
                        <span className="text-red-400">⚠️</span>
                      ) : (
                        <span className="text-yellow-400">⚠️</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        {stock.units < 30
                          ? `Low stock alert: ${stock.blood_type}`
                          : `Expiring units alert: ${stock.blood_type}`}
                      </h3>
                      <div className="mt-2 text-sm">
                        {stock.units < 30
                          ? `Only ${stock.units} units remaining`
                          : `${stock.expiring_soon} units expiring soon`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 