export interface CreateBookingRequest {
  spaceId: number;
  startTime: string;
  endTime: string;
}

export interface BookingResponseDto {
  id: number;
  userId: number;
  username: string;
  spaceId: number;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface BookingInitiationResponse {
  bookingId: number;
  pesapalRedirectUrl: string;
}
