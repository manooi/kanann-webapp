import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './api/user.service';

export interface Pages {
  pageId: number,
  pageName: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthCredentialService {
  private page!: Pages[];

  constructor(private userServie: UserService) {
  }

  set setPage(page: Pages[]) {
    this.page = page;
  }

  getPage() {
    if (this.page) {
      return of(this.page);
    }
    else {
      return this.userServie.getUser().pipe(tap((result: Pages[]) => {
        this.page = result;
      }));
    }
  }
}
