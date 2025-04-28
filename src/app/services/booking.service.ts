import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingResponseDto, CreateBookingRequest } from '../dto/booking.dto';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/bookings';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  // Note: Auth token needs to be added via an interceptor
  createBooking(bookingRequest: CreateBookingRequest): Observable<BookingResponseDto> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<BookingResponseDto>(API_URL, bookingRequest, httpOptions);
  }

  // Get bookings for the current user
  getMyBookings(): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(`${API_URL}/my-bookings`);
  }

  // Cancel a booking
  cancelBooking(bookingId: number): Observable<BookingResponseDto> {
    return this.http.patch<BookingResponseDto>(`${API_URL}/${bookingId}/cancel`, {});
  }

  getAllBookings(): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(API_URL);
  }
}
