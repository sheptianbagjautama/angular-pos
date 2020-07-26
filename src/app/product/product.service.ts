import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';



// export interface ProductResponseData {
//     id:number,
//     name:string,
//     stock:number,
//     original_price:number,
//     discount_price:number,
//     image:string,
//     category_id:number,
//     sub_category_id:number,
//     created_at:string,
//     updated_at:string,
//     category:{
//         id: number,
//         name: string,
//         status: string,
//         created_at: string,
//         updated_at: string
//     },
//     sub_category:{
//         id: number,
//         name: string,
//         category_id:number,
//         status: string,
//         created_at: string,
//         updated_at: string
//     },
// }

@Injectable({providedIn:'root'})
export class ProductService {

    private products:[] = [];
    productsChanged = new Subject<any>();
    constructor(private http:HttpClient) {}

    getProductsAPI(){
        return this.http.get<any>(
            'http://localhost:8000/api/products'
        );
    }

    getSubCategoriesAPI(){
        return this.http.get<any>(
            'http://localhost:8000/api/subcategories'
        );
    }

    getCategoriesAPI(){
        return this.http.get<any>(
            'http://localhost:8000/api/categories'
        );
    }

    getSearchBySubCategoriesAPI(sub_category_id){
        return this.http.get<any>(
            `http://localhost:8000/api/search-subcategory/${sub_category_id}`
        )
    }

    getSearchByCategoriesAPI(category_id){
        return this.http.get<any>(
            `http://localhost:8000/api/search-category/${category_id}`
        )
    }

    getSearchByNameAPI(name){
        if (!name) {
            return this.http.get<any>(
                'http://localhost:8000/api/products'
            );
        }
        return this.http.get<any>(
            `http://localhost:8000/api/search-name/${name}`
        )
    }

    postPayment(requestCart) {
        return this.http.post<any>(
            'http://localhost:8000/api/orders',
            {
                carts:requestCart
            }
        );
    }

    setProducts(products:any){
        this.products = products;
        this.productsChanged.next(this.products.slice());
    }


    getProducts(){
        return this.products.slice();
    }
}