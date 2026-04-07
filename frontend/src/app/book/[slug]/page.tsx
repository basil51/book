'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingPage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [form, setForm] = useState({
    serviceId: '',
    name: '',
    email: '',
    phone: '',
  });
  const [success, setSuccess] = useState(false);

  // Load business and services
  useEffect(() => {
    if (!slug) return;

    axios
      .get(`/api/businesses/public/${slug}`)
      .then((res) => {
        setBusiness(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Load available slots when service/date changes
  useEffect(() => {
    if (!form.serviceId || !selectedDate) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get('/api/bookings/availability', {
          params: {
            businessSlug: slug,
            date: selectedDate.toISOString().split('T')[0],
            serviceId: form.serviceId,
          },
        });
        setSlots(res.data.slots);
      } catch (err) {
        console.error('Failed to fetch slots', err);
        setSlots([]);
      }
    };

    fetchSlots();
  }, [form.serviceId, selectedDate, slug]);

  // Handle form input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit booking
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!selectedTime) return alert('Please select a time slot');

    try {
      await axios.post('/api/bookings/public', {
        slug: String(slug),
        serviceId: Number(form.serviceId),
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        scheduled_at: selectedTime,
      });
      setSuccess(true);
    } catch (err) {
      alert('Booking failed');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!business) return <div className="p-4 text-red-500">Business not found</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{business.name}</h1>

      {success ? (
        <div className="bg-green-100 p-4 text-green-700 rounded">
          ✅ Booking submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service selection */}
          <div>
            <label className="block mb-1">Service:</label>
            <select
              name="serviceId"
              className="w-full border rounded p-2"
              value={form.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {business.services?.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes ?? s.duration_min} min)
                </option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label className="block mb-1">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
                setSelectedTime('');
              }}
              dateFormat="EEEE, dd/MM/yyyy"
              className="w-full border p-2"
            />
          </div>

          {/* Time slot selection */}
          {slots.length > 0 && (
            <div>
              <label className="block mb-1">Available Time Slots:</label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const time = new Date(slot).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`border px-3 py-1 rounded ${
                        selectedTime === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-white hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* User info fields */}
          <div>
            <label className="block mb-1">Name:</label>
            <input
              name="name"
              className="w-full border rounded p-2"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded p-2"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Phone:</label>
            <input
              name="phone"
              className="w-full border rounded p-2"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      )}
    </div>
  );
}
