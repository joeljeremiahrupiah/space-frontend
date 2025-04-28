import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AmenityDto {
  id: number;
  name: string;
}

const API_URL = 'http://localhost:8081/api/amenities';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {

  constructor(private http: HttpClient) { }

  getAllAmenities(): Observable<AmenityDto[]> {
    return this.http.get<AmenityDto[]>(API_URL);
  }
}
