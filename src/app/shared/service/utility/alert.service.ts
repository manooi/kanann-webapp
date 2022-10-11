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
      html: `<html>${msg}</html>`,
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  success(msg: string, callback?:any) {
    Swal.fire({
      title: 'Success',
      text: msg,
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result)=> {
      if(result.isConfirmed) {
        callback();
      }
    })
  }

  info(msg: string) {
    Swal.fire({
      title: 'Info',
      text: msg,
      icon: 'info',
      confirmButtonText: 'Ok'
    })
  }

}
