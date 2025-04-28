import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { SpaceDto, SpaceService } from '../../services/space.service';
import { BookingService } from '../../services/booking.service';
import { CreateBookingRequest } from '../../dto/booking.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit, OnDestroy {

  spaceId: number | null = null;
  space$: Observable<SpaceDto | null> = of(null);
  spaceDetails: SpaceDto | null = null;
  minDateTime: string = '';

  isLoggedIn = false;
  isLoadingSpace = true;
  isBooking = false;
  bookingError: string | null = null;
  bookingSuccess = false;
  isInitiatingPayment = false;

  private document = inject(DOCUMENT);
  private window = this.document.defaultView;

  bookingRequest: CreateBookingRequest = {
    spaceId: 0,
    startTime: '',
    endTime: ''
  };

  // Subscriptions
  private loginStatusSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private spaceSubscription: Subscription | null = null;

  // Inject Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private spaceService = inject(SpaceService);
  private bookingService = inject(BookingService);

  constructor() { }

  ngOnInit(): void {
    this.setMinDateTime();
    // Subscribe to login status changes
    this.loginStatusSubscription = this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
      console.log('BookingComponent - Login Status:', this.isLoggedIn);
    });

    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('spaceId');
        if (id) {
          this.spaceId = +id;
          this.bookingRequest.spaceId = this.spaceId;
          this.isLoadingSpace = true;
          this.bookingError = null;
          this.bookingSuccess = false;
          console.log('BookingComponent - Loading space details for ID:', this.spaceId);
          return this.spaceService.getSpaceById(this.spaceId);
        } else {
          console.error('BookingComponent - No spaceId found in route.');
          this.bookingError = 'Invalid space selected.';
          this.isLoadingSpace = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (spaceData) => {
        if (spaceData) {
          this.spaceDetails = spaceData;
          console.log('BookingComponent - Space details loaded:', this.spaceDetails);
        } else {
          this.bookingError = 'Selected space could not be found.';
        }
        this.isLoadingSpace = false;
      },
      error: (err) => {
        console.error('BookingComponent - Error fetching space details:', err);
        this.bookingError = 'Failed to load space details. Please try again.';
        this.isLoadingSpace = false;
      }
    });
  }

  setMinDateTime(): void {
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  ngOnDestroy(): void {
    this.loginStatusSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
    this.spaceSubscription?.unsubscribe();
  }

  // Method to handle the booking submission
  confirmBooking(): void {
    if (!this.isLoggedIn || !this.spaceId || !this.bookingRequest.startTime || !this.bookingRequest.endTime) {
      this.bookingError = 'Please ensure you are logged in and have selected valid start and end times.';
      return;
    }

    if (new Date(this.bookingRequest.endTime) <= new Date(this.bookingRequest.startTime)) {
      this.bookingError = 'End time must be after start time.';
      return;
    }


    this.isBooking = true;
    this.bookingError = null;
    this.bookingSuccess = false;
    console.log('Attempting to book:', this.bookingRequest);

    this.bookingService.createBooking(this.bookingRequest).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.isBooking = false;
        this.bookingSuccess = true;
        this.bookingError = null;
      },
      error: (err) => {
        console.error('Booking failed:', err);
        this.isBooking = false;
        this.bookingSuccess = false;
        if (err.status === 409) {
          this.bookingError = err.error || 'This time slot is no longer available.';
        } else if (err.status === 400) {
          this.bookingError = err.error || 'Invalid booking request data (e.g., time invalid).';
        } else if (err.error && typeof err.error === 'string') {
          this.bookingError = err.error;
        } else {
          this.bookingError = 'An error occurred while creating the booking. Please try again.';
        }
      }
    });
  }

  // Method to navigate to login, storing return URL
  navigateToLogin(): void {
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
  }

  // Navigate to register page
  navigateToRegister(): void {
    const returnUrl = this.router.url;
    alert('Registration page not implemented yet.');
  }

}
