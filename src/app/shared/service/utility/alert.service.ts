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

  unauthorized(msg: string, callback?: any) {
    Swal.fire({
      title: '401 - Unauthorized',
      html: `<html>${msg}</html>`,
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    })
  }


  success(msg: string, callback?: any) {
    Swal.fire({
      title: 'Success',
      text: msg,
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    })
  }

  info(msg: string, callback?: any) {
    Swal.fire({
      title: 'Info',
      text: msg,
      icon: 'info',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    })
  }

  yesno(msg: string, callback?: any) {
    Swal.fire({
      text: msg,
      icon: 'warning',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    })

  }

}
