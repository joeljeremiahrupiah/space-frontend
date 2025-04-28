import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AmenityDto {
  id: number;
  name: string;
}

export interface SpaceDto {
  id: number;
  name: string;
  type: string;
  locationDescription: string;
  capacity: number;
  pricePerHour: number;
  openingTime?: string;
  closingTime?: string;
  amenities: AmenityDto[];
  description?: string;
  imageUrl?: string;
}

export interface SpaceSearchCriteria {
  locationKeyword?: string;
  types?: string[];
  minCapacity?: number;
  maxPricePerHour?: number;
  requiredAmenities?: string[];
  desiredStartTime?: string;
  desiredEndTime?: string;
}


const API_URL = 'http://localhost:8081/api/spaces';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(private http: HttpClient) { }

  getAllSpaces(): Observable<SpaceDto[]> {
    return this.http.get<SpaceDto[]>(API_URL);
  }

  getSpaceById(id: number): Observable<SpaceDto> {
    return this.http.get<SpaceDto>(`${API_URL}/${id}`);
  }

  searchSpaces(criteria: SpaceSearchCriteria): Observable<SpaceDto[]> {
    let params = new HttpParams();

    if (criteria.locationKeyword) {
      params = params.set('locationKeyword', criteria.locationKeyword);
    }
    if (criteria.types && criteria.types.length > 0) {
      criteria.types.forEach(type => {
        params = params.append('types', type);
      });
    }
    if (criteria.minCapacity != null) {
      params = params.set('minCapacity', criteria.minCapacity.toString());
    }
    if (criteria.maxPricePerHour != null) {
      params = params.set('maxPricePerHour', criteria.maxPricePerHour.toString());
    }
    if (criteria.requiredAmenities && criteria.requiredAmenities.length > 0) {
      criteria.requiredAmenities.forEach(amenity => {
        params = params.append('requiredAmenities', amenity);
      });
    }
    if (criteria.desiredStartTime) {
      params = params.set('desiredStartTime', criteria.desiredStartTime);
    }
    if (criteria.desiredEndTime) {
      params = params.set('desiredEndTime', criteria.desiredEndTime);
    }

    return this.http.get<SpaceDto[]>(`${API_URL}/search`, { params: params });
  }

}
