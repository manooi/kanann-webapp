import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedStateService {
  sideBarState: boolean = true;
  constructor() { }

  toggle(): void {
    this.sideBarState = !this.sideBarState;
  }

  toggleClose(): void {
    this.sideBarState = false;
  }

  toggleOpen(): void {
    this.sideBarState = true;
  }
}
