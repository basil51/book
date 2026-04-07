import api from '@/lib/api';

export interface Booking {
  id: number;
  user: {
    name: string;
  };
  service: {
    name: string;
    price: number;
  };
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export async function getRecentBookings(): Promise<Booking[]> {
  try {
        console.log('try to get from back end /bookings/recent')
        const response = await api.get('/bookings/recent');
        console.log('response data', response.data)
        return response.data;
    } catch (error) { 
        console.error('Error fetching recent bookings:', error);
        throw error;
    }
}

export async function getBookingById(id: number): Promise<Booking> {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

export async function createBooking(bookingData: {
  service_id: number;
  scheduled_at: string;
  user_id: number;
  notes?: string;
}): Promise<Booking> {
  const response = await api.post('/bookings', bookingData);
  return response.data;
}

export async function updateBookingStatus(
  id: number,
  status: 'confirmed' | 'cancelled'
): Promise<Booking> {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
}

export async function deleteBooking(id: number): Promise<void> {
  await api.delete(`/bookings/${id}`);
}