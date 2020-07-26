import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from './product.service';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, find, timeout } from 'rxjs/operators';

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

  constructor(private productService:ProductService) { }

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
        this.productService.getSearchByNameAPI(name)
          .subscribe((responseData) => {
            this.products = [];
            this.products = responseData.data;
          })
      })
  }
  

  onProducts(){
    this.productService.getProductsAPI()
    .subscribe((responseData:any) => {
      this.productService.setProducts(responseData.data);
      this.products = this.productService.getProducts();
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
    this.productService.getSearchBySubCategoriesAPI(sub_category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
      });
  }

  onSearchCategory(category_id){
    this.productService.getSearchByCategoriesAPI(category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
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
    });
  }

  onCancelCart(){
    localStorage.removeItem('arrayCarts');
    this.carts = [];
    this.total_price = 0;
  }

  onPayment(){
    let storageCart = JSON.parse(localStorage.getItem('arrayCarts'));
    storageCart.forEach(item => {
        delete item.name;
        delete item.price;
        delete item.total;
    });

    console.log(storageCart);

    // let requestCart = {
    //   carts:storageCart
    // }

    this.productService.postPayment(storageCart)
      .subscribe((responseData) => {
        console.log(responseData);
      })
  }

  onClearFilter(){
    this.onProducts();
  }
  


}
