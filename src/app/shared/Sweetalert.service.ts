
import Swal from 'sweetalert2/dist/sweetalert2';
import { Injectable } from '@angular/core';
import { ProductService } from '../product/product.service';

@Injectable({providedIn:'root'})
export class SweetalertService {

  constructor(
    private productService:ProductService
  ){}

  notifAlert(title, text, status)
  {
    Swal.fire({
        title:title,
        text: text,
        icon: status
      });
  }
  
  confirmAlert(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this cart !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
      Swal.fire(
        'Deleted!',
        'Your cart has been cancel.',
        'success'
      )
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your cart is safe :)',
        'error'
      )
      }
    })
  }
}