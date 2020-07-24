import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products:any = [];
  subcategories:any = [];
  categories:any = [];

  constructor(private productService:ProductService) { }

  ngOnInit(): void {

    this.productService.getProductsAPI()
      .subscribe((responseData:any) => {
        this.productService.setProducts(responseData.data);
        this.products = this.productService.getProducts();
        console.log(this.products);
      });

    this.productService.getSubCategoriesAPI()
      .subscribe((responseData:any) => {
        this.subcategories = responseData.data;
        console.log(this.subcategories);
      });

    this.productService.getCategoriesAPI()
      .subscribe((responseData:any) => {
        this.categories = responseData.data;
        console.log(this.categories);
      });
  }

}
