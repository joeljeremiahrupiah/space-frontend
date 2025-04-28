import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BookingResponseDto } from '../../dto/booking.dto';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {

  bookings$: Observable<BookingResponseDto[]> = of([]);
  isLoading = true;
  error: string | null = null;
  cancelError: string | null = null;
  cancelSuccess: string | null = null;
  cancellingBookingId: number | null = null;

  private bookingService = inject(BookingService);

  constructor() { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = null;
    this.cancelError = null;
    this.cancelSuccess = null;
    this.bookings$ = this.bookingService.getMyBookings();

    this.bookings$.subscribe({
      next: (data) => {
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your bookings. Please try refreshing the page.';
        this.isLoading = false;
      }
    });
  }

  isCancellable(booking: BookingResponseDto): boolean {
    return booking.status === 'CONFIRMED' && new Date(booking.startTime) > new Date();
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    this.cancellingBookingId = bookingId;
    this.cancelError = null;
    this.cancelSuccess = null;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        this.cancellingBookingId = null;
        this.cancelSuccess = `Booking for ${updatedBooking.spaceName} has been cancelled.`;
        this.loadBookings();
        setTimeout(() => this.cancelSuccess = null, 5000);
      },
      error: (err) => {
        this.cancellingBookingId = null;
        if (err.status === 409 || err.status === 400) {
          this.cancelError = err.error || 'Could not cancel this booking (it may have already started or been cancelled).';
        } else if (err.status === 403) {
          this.cancelError = 'You are not authorized to cancel this booking.';
        } else {
          this.cancelError = 'An unexpected error occurred while cancelling the booking.';
        }
        setTimeout(() => this.cancelError = null, 7000);
      }
    });
  }

}
