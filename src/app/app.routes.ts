import { Routes } from '@angular/router';
import { SpaceListComponent } from './components/space-list/space-list.component';
import { BookingComponent } from './components/booking/booking.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';

export const routes: Routes = [
  {
    path: '',
    component: SpaceListComponent,
    title: 'Available Spaces'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'book/:spaceId',
    component: BookingComponent,
    title: 'Book Space'
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    title: 'My Bookings',
    canActivate: [authGuard]
  },
];
