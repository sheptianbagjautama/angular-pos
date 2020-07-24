import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from './product.service';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private productService:ProductService) { }

  ngOnInit(): void { 
    this.onProducts();
    this.onSubCategories();
    this.onCategories();

    fromEvent(this.nameSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event:any) => {
          return event.target.value
        })
        // ,filter(res => res.length > 0)
        ,debounceTime(800)
        ,distinctUntilChanged()
      ).subscribe((name:string) => {
        this.productService.getSearchByNameAPI(name)
          .subscribe((responseData) => {
            this.products = [];
            this.products = responseData.data;
            console.log(this.products);
          })
      })
  }
  

  onProducts(){
    this.productService.getProductsAPI()
    .subscribe((responseData:any) => {
      this.productService.setProducts(responseData.data);
      this.products = this.productService.getProducts();
      console.log(this.products);
    });
  }

  onSubCategories(){
    this.productService.getSubCategoriesAPI()
      .subscribe((responseData:any) => {
        this.subcategories = responseData.data;
        console.log(this.subcategories);
      });
  }

  onCategories(){
    this.productService.getCategoriesAPI()
      .subscribe((responseData:any) => {
        this.categories = responseData.data;
        console.log(this.categories);
      });
  }

  onSearchSubCategory(sub_category_id){
    this.productService.getSearchBySubCategoriesAPI(sub_category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
        console.log(this.products);
      });
  }

  onSearchCategory(category_id){
    this.productService.getSearchByCategoriesAPI(category_id)
      .subscribe((responseData:any) => {
        this.products = [];
        this.products = responseData.data;
        console.log(this.products);
      });
  }


}
