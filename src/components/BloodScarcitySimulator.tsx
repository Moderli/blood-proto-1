'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from '@/lib/supabase';

interface SimulatorState {
  blood_type: string;
  units: number;
  status: string;
}

export default function BloodScarcitySimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    blood_type: 'A+',
    units: 10,
    status: 'LOW',
  });

  const handlePreview = async () => {
    setIsPreviewing(true);
    setError(null);

    try {
      // Get users with matching blood type who have enabled notifications
      const { data: users, error: userError } = await supabase
        .from('user_profiles')
        .select('user_id, blood_group, notification_preferences')
        .eq('blood_group', simulatorState.blood_type)
        .or('notification_preferences->blood_scarcity.eq.true,notification_preferences.is.null');

      if (userError) throw userError;

      setNotificationCount(users?.length || 0);
    } catch (error: any) {
      console.error('Preview error:', error);
      setError(error.message || 'Failed to preview notifications. Please try again later.');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setError(null);
    setSuccess(false);

    try {
      // Update blood stock
      const { error: updateError } = await supabase
        .from('blood_stock')
        .upsert(
          {
            blood_type: simulatorState.blood_type,
            units: simulatorState.units,
            status: simulatorState.status,
            last_updated: new Date().toISOString(),
          },
          {
            onConflict: 'blood_type',
            ignoreDuplicates: false
          }
        );

      if (updateError) throw updateError;

      // Get users with matching blood type who have enabled notifications
      const { data: users, error: userError } = await supabase
        .from('user_profiles')
        .select('user_id, blood_group, notification_preferences')
        .eq('blood_group', simulatorState.blood_type)
        .or('notification_preferences->blood_scarcity.eq.true,notification_preferences.is.null');

      if (userError) throw userError;

      // Send notifications through the API route
      if (users && users.length > 0) {
        try {
          const payload = {
            userIds: users.map(u => u.user_id),
            bloodType: simulatorState.blood_type,
            units: simulatorState.units,
            status: simulatorState.status,
          };

          console.log('Sending request with payload:', payload);

          // Use absolute URL for the API endpoint
          const baseUrl = window.location.origin;
          const response = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          // Log the response status and headers
          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          // Get the response text first
          const responseText = await response.text();
          console.log('Response text:', responseText);

          // If the response is not ok, throw an error with the response text
          if (!response.ok) {
            throw new Error(`Server error: ${response.status} - ${responseText}`);
          }

          // Try to parse as JSON
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error(`Invalid JSON response: ${responseText}`);
          }

          console.log('Email sent successfully:', data);
        } catch (error: any) {
          console.error('Email sending error:', error);
          throw new Error(error.message || 'Failed to send notifications. Please try again later.');
        }
      }

      setSuccess(true);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Simulation error:', error);
      setError(error.message || 'Failed to simulate scarcity. Please try again later.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Simulate Blood Scarcity
      </button>

      <Dialog
        open={isOpen}
        onClose={() => !isSimulating && setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Simulate Blood Scarcity
            </Dialog.Title>

            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                Scarcity simulated successfully! Notifications have been sent.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  value={simulatorState.blood_type}
                  onChange={(e) => setSimulatorState(prev => ({ ...prev, blood_type: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Units Available
                </label>
                <input
                  type="number"
                  value={simulatorState.units}
                  onChange={(e) => setSimulatorState(prev => ({ ...prev, units: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={simulatorState.status}
                  onChange={(e) => setSimulatorState(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {['LOW', 'CRITICAL', 'VERY_LOW'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isPreviewing}
                  className="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isPreviewing ? 'Previewing...' : `Preview (${notificationCount} recipients)`}
                </button>

                <button
                  type="button"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSimulating ? 'Simulating...' : 'Simulate'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => !isSimulating && setIsOpen(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 