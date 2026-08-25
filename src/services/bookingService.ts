import { CreateTourBookingRequest, TourBookingResult } from "../types/booking";
import { HotelBookingItem, TourBookingItem } from "../types/bookingList";
import { getWithAuth, postWithAuth } from "./api";

export async function createTourBooking(
  token: string | null,
  payload: CreateTourBookingRequest
): Promise<TourBookingResult> {
  const res = await postWithAuth<TourBookingResult>("/bookings/tours",token,payload as unknown as Record<string, unknown>);
  if (!res.data) throw new Error("Không tạo được booking");
  return res.data;
}

export async function  getTourBookings(token: string | null): Promise<TourBookingItem[]> {
  const res = await getWithAuth<TourBookingItem[]>("/bookings/tours", token);
  console.log(`check res tour`, res);
  return res.data ?? [];
}

export async function getHotelBookings(token: string | null): Promise<HotelBookingItem[]> {
  const res = await getWithAuth<HotelBookingItem[]>("/bookings/hotels", token);
  return res.data ?? [];
}

export async function getTourBookingById(token: string | null, id:string):Promise<TourBookingItem | null> {
  const res = await getWithAuth<TourBookingItem>(`/bookings/tours/${id}`,token);
  return res.data;
}

export async function getHotelBookingById(token: string | null, id:string):Promise<HotelBookingItem | null> {
  const res = await getWithAuth<HotelBookingItem>(`/bookings/hotel/${id}`, token);
  return res.data;
}

export async function cancelTourBooking(token: string | null, id:string):Promise<void> {
  await postWithAuth(`/bookings/tours/${id}/cancel`, token, {});
}

export async function cancelHotelBooking(token: string | null, id:string):Promise<void> {
  await postWithAuth(`/bookings/hotel/${id}/cancel`, token, {});
}