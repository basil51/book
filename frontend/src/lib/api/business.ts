import api from '@/lib/api';

interface BusinessStats {
  totalBookings: number
  pendingBookings: number
  totalRevenue: number
  activeStaff: number
}

export async function getBusinessStats(): Promise<BusinessStats> {
  const response = await api.get('/businesses/stats')
  return response.data
}

export async function getRecentBookings() {
  const response = await api.get('/bookings/recent')
  return response.data
}
