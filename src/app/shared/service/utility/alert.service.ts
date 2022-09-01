import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  sideBarState: boolean = true;
  constructor() { }

  error(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  success(msg: string) {
    Swal.fire({
      title: 'Success',
      text: msg,
      icon: 'success',
      confirmButtonText: 'Ok'
    })
  }

}
