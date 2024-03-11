import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export const LOCATIONS : string = "locations";

export enum LocationChangeType {
  ADD,
  REMOVE,
}

export interface LocationChange {
  type: LocationChangeType;
  location: string;
}

@Injectable()
export class LocationService implements OnDestroy {

  private locations: string[] = [];
  private changeNotifier$: ReplaySubject<LocationChange>;

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    this.changeNotifier$ = new ReplaySubject<LocationChange>();
    
    if (locString) {
      this.locations = JSON.parse(locString);
    }

    for (let loc of this.locations) {
      this.changeNotifier$.next({type: LocationChangeType.ADD, location: loc});
    }
  }

  public get changeNotifier() {
    return this.changeNotifier$.asObservable();
  }

  public addLocation(zipcode : string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.changeNotifier$.next({type: LocationChangeType.ADD, location: zipcode});
  }

  public removeLocation(zipcode : string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.changeNotifier$.next({type: LocationChangeType.REMOVE, location: zipcode});
    }
  }

  public ngOnDestroy(): void {
    this.changeNotifier$.complete();
  }
}
