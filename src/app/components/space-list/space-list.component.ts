import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { SpaceService, SpaceDto, SpaceSearchCriteria } from '../../services/space.service';
import { AmenityService, AmenityDto } from '../../services/amenity.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './space-list.component.html',
  styleUrls: ['./space-list.component.css']
})
export class SpaceListComponent implements OnInit {

  objectKeys = Object.keys;
  spaces: SpaceDto[] = [];
  allAmenities: AmenityDto[] = [];
  minDateTime: string = '';

  isLoadingSpaces = true;
  isLoadingAmenities = true;
  error: string | null = null;

  searchCriteria: SpaceSearchCriteria = {
    types: [],
    requiredAmenities: []
  };
  amenitySelection: { [key: string]: boolean } = {};
  typeSelection: { [key: string]: boolean } = {
    DESK: false,
    MEETING_ROOM: false,
    PRIVATE_OFFICE: false
  };


  // Inject services
  private spaceService = inject(SpaceService);
  private amenityService = inject(AmenityService);

  constructor() { }

  ngOnInit(): void {
    this.setMinDateTime();
    this.loadInitialData();
    this.loadAmenities();
  }

  setMinDateTime(): void {
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  loadInitialData(): void {
    this.isLoadingSpaces = true;
    this.error = null;
    this.spaceService.searchSpaces({})
      .subscribe({
        next: data => this.handleSpaceResponse(data),
        error: err => this.handleError(err, 'spaces')
      });
  }

  loadAmenities(): void {
    this.isLoadingAmenities = true;
    this.amenityService.getAllAmenities().subscribe({
      next: (data) => {
        this.allAmenities = data;
        this.allAmenities.forEach(a => this.amenitySelection[a.name] = false);
        this.isLoadingAmenities = false;
      },
      error: (err) => {
        this.handleError(err, 'amenities');
        this.isLoadingAmenities = false;
      }
    });
  }


  applyFilters(): void {
    this.isLoadingSpaces = true;
    this.error = null;

    const selectedTypes = Object.keys(this.typeSelection)
      .filter(key => this.typeSelection[key]);
    this.searchCriteria.types = selectedTypes;

    const selectedAmenities = Object.keys(this.amenitySelection)
      .filter(key => this.amenitySelection[key]);
    this.searchCriteria.requiredAmenities = selectedAmenities;

    this.spaceService.searchSpaces(this.searchCriteria)
      .subscribe({
        next: data => this.handleSpaceResponse(data),
        error: err => this.handleError(err, 'spaces')
      });
  }

  private handleSpaceResponse(data: SpaceDto[]): void {
    this.spaces = data;
    this.isLoadingSpaces = false;
  }

  private handleError(err: any, type: 'spaces' | 'amenities'): void {
    this.error = `Failed to load ${type}. Status: ${err.status || 'Unknown'}. Please try again later.`;
    this.isLoadingSpaces = false;
  }
}
