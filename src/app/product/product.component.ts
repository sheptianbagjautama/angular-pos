import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from './product.service';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, find, timeout } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2';
import { SweetalertService } from '../shared/Sweetalert.service'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('nameSearchInput', { static:true }) nameSearchInput:ElementRef;
  products:any = [];
  subcategories:any = [];
  categories:any = [];
  carts:any = [];
  total_price:number = 0;
  total_qty:number = 0;
  isLoadingPayment:boolean = false;
  isLoadingProduct:boolean = false;

  constructor(
    private productService:ProductService,
    private sweetAlertService:SweetalertService
    ) { }

  ngOnInit(): void { 
    this.onProducts();
    this.onSubCategories();
    this.onCategories();

    let storageCart = JSON.parse(localStorage.getItem('arrayCarts'));
    if (storageCart) {
      this.carts = storageCart;
      this.setTotalPrice();
    }

    fromEvent(this.nameSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event:any) => {
          return event.target.value
        })
        // ,filter(res => res.length > 0)
        ,debounceTime(600)
        ,distinctUntilChanged()
      ).subscribe((name:string) => {
        this.isLoadingProduct = true;
        this.productService.getSearchByNameAPI(name)
          .subscribe((responseData) => {
            this.products = [];
            this.products = responseData.data;
            this.isLoadingProduct = false;
          });
      })
  }
  

  onProducts(){
    this.isLoadingProduct = true;
    this.productService.getProductsAPI()
    .subscribe((responseData:any) => {
      this.productService.setProducts(responseData.data);
      this.products = this.productService.getProducts();
      // if (other) {
      //   this.sweetAlertService.notifAlert('Success','Successfully clear filter !', 'success' );
      // }
      this.isLoadingProduct = false;
    });
  }

  onSubCategories(){
    this.productService.getSubCategoriesAPI()
      .subscribe((responseData:any) => {
        this.subcategories = responseData.data;
      });
      
  }

  onCategories(){
    this.productService.getCategoriesAPI()
      .subscribe((responseData:any) => {
        this.categories = responseData.data;
      });
  }

  onSearchSubCategory(sub_category_id){
    this.isLoadingProduct = true;
    this.productService.getSearchBySubCategoriesAPI(sub_category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
        this.isLoadingProduct = false;
      });
      
  }

  onSearchCategory(category_id){
    this.isLoadingProduct = true;
    this.productService.getSearchByCategoriesAPI(category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
        this.isLoadingProduct = false;
      });
      
  }

  ClearFilter(){
    this.onProducts();
  }

  AddToCart(product:any){

    let requestCart = {
      product_id:product.id,
      name:product.name,
      price:product.discount == null ? product.original_price : product.discount_price,
      total:product.discount == null ? product.original_price : product.discount_price,
      qty:1,

    }

    let arrayCarts = JSON.parse(localStorage.getItem('arrayCarts'));
    if (!arrayCarts) {
      let carts = [requestCart];
      localStorage.setItem('arrayCarts', JSON.stringify(carts));
      this.carts = [];
      this.carts = JSON.parse(localStorage.getItem('arrayCarts'));
      this.setTotalPrice();
    } else {
      arrayCarts.forEach(cart => {
        if (cart.product_id == requestCart.product_id) {
          cart.qty += requestCart.qty;
          cart.total = requestCart.price * cart.qty;
        }
      });

      let findData = arrayCarts.find(cart => cart.product_id == requestCart.product_id);
      if (!findData) {
        arrayCarts.push(requestCart);
      }
      localStorage.setItem('arrayCarts', JSON.stringify(arrayCarts));
      this.carts = [];
      this.carts = JSON.parse(localStorage.getItem('arrayCarts'));
      this.setTotalPrice();
    }
  }

  onPlusMinusCart(cartParams:any, qty, type){
    let arrayCarts = JSON.parse(localStorage.getItem('arrayCarts'));
    let keyDeleteCarts = [];
    arrayCarts.forEach((cart, index) => {
      if (cart.product_id == cartParams.product_id) {
        if (type == 'PLUS') {
          cart.qty += qty;
          cart.total = cartParams.price * cart.qty;
        } else if(type == 'MINUS'){
          cart.qty -= qty;
          cart.total = cartParams.total - cart.price;
          if (cart.qty < 1) {
            keyDeleteCarts.push(index) 
          }
        }
      }
    });

    keyDeleteCarts.forEach( key => {
      arrayCarts.splice(key, 1);
    });

    localStorage.setItem('arrayCarts', JSON.stringify(arrayCarts));
    this.carts = [];
    this.carts = JSON.parse(localStorage.getItem('arrayCarts'));
    this.setTotalPrice();
  }

  onDeleteCart(cartParams:any){
    let arrayCarts = JSON.parse(localStorage.getItem('arrayCarts'));
    // let arrayKeyDeletes = [];
    arrayCarts.forEach((cart, index) => {
      if (cart.product_id == cartParams.product_id) {
        // arrayKeyDeletes.push(cart.product_id);
        arrayCarts.splice(index, 1);
      }
    });

    localStorage.setItem('arrayCarts', JSON.stringify(arrayCarts));
    this.carts = [];
    this.carts = JSON.parse(localStorage.getItem('arrayCarts'));
    this.setTotalPrice();
  }

  onChangeQtyCart(cartParams,event:any){
    let qty = event.target.value;
    let arrayCarts = JSON.parse(localStorage.getItem('arrayCarts'));

    setTimeout(() => {
        // if (qty > 0) {
          console.log('change');
          arrayCarts.forEach(cart => {
            if (cart.product_id == cartParams.product_id) {
              cart.qty = +qty;
              cart.total = cart.price * +qty;
            }
          });
        // } 
        // else {
        //   console.log('not change');
        //   arrayCarts.forEach((cart, index) => {
        //     if (cart.product_id == cartParams.product_id) {
        //       arrayCarts.splice(index,1);
        //     }
        //   });
        // }

        localStorage.setItem('arrayCarts', JSON.stringify(arrayCarts));
        this.carts = [];
        this.carts = JSON.parse(localStorage.getItem('arrayCarts'));
        this.setTotalPrice();
    }, 500);
  }

  setTotalPrice(){
    let storageCart = JSON.parse(localStorage.getItem('arrayCarts'));
    this.total_price = 0;
    storageCart.forEach(item => {
      this.total_price += item.total;
      this.total_qty += item.qty;
    });
  }

  onCancelCart(){
    Swal.fire({
      title: 'Are you sure will cancel this cart ?',
      text: 'You will not be able to recover this cart !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem('arrayCarts');
        this.carts = [];
        this.total_price = 0;

      Swal.fire(
        'Deleted!',
        'Your cart has been deleted.',
        'success'
      )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your cart is safe :)',
        'error'
      )
      }
    });
  }

  onPayment(){
    Swal.fire({
      title: 'Are you sure do payment ?',
      text: 'You will not be able go back !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, do pay!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let storageCart = JSON.parse(localStorage.getItem('arrayCarts'));
        storageCart.forEach(item => {
            delete item.name;
            delete item.price;
            delete item.total;
        });

        this.isLoadingPayment = true;
        this.productService.postPayment(storageCart)
          .subscribe((responseData) => {
            console.log(responseData);
            localStorage.removeItem('arrayCarts');
            this.carts = [];
            this.total_price = 0;

            Swal.fire(
              'Success Pay!',
              'Successfully made a payment.',
              'success'
            )
            this.isLoadingPayment = false;
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order still there :)',
          'error'
        )
        this.isLoadingPayment = false;
      }
    });
    
  }

  onClearFilter(){
    this.onProducts();
  }

  


}
