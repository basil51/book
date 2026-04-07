'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Booking {
  id: number;
  service: { name: string; duration_min: number };
  scheduled_at: string;
  status: string;
  notes?: string;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get<Booking[]>('/bookings/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}`, { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch {
      alert('Failed to cancel');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="p-6">Loading your bookings…</div>;

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.scheduled_at) >= now);
  const past     = bookings.filter(b => new Date(b.scheduled_at) < now);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(b => (
                <tr key={b.id} className="border-t">
                  <td className="p-2 border">{b.service.name}</td>
                  <td className="p-2 border">
                    {format(new Date(b.scheduled_at), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="p-2 border capitalize">{b.status}</td>
                  <td className="p-2 border">
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
        {past.length === 0 ? (
          <p>No past appointments.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {past.map(b => (
                <tr key={b.id} className="border-t">
                  <td className="p-2 border">{b.service.name}</td>
                  <td className="p-2 border">
                    {format(new Date(b.scheduled_at), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="p-2 border capitalize">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
