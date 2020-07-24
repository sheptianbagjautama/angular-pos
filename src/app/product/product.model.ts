export class Product {
    public id: number;
    public name: string;
    public stock: number;
    public original_price: number;
    public discount_price: number;
    public image: string;
    public category_id: number;
    public sub_category_id: number;
    public created_at: string;
    public updated_at: string;
    public category: {
        id: number;
        name: string;
        status: string;
        created_at: string;
        updated_at: string;
    }
    public sub_category: {
        id: number;
        name: string;
        category_id: number;
        status: string;
        created_at: string;
        updated_at: string;
    }

    constructor(
         id: number,
         name: string,
         stock: number,
         original_price: number,
         discount_price: number,
         image: string,
         category_id: number,
         sub_category_id: number,
         created_at: string,
         updated_at: string,
         category: {
            id: number,
            name: string,
            status: string,
            created_at: string,
            updated_at: string,
        },
         sub_category: {
            id: number,
            name: string,
            category_id: number,
            status: string,
            created_at: string,
            updated_at: string,
        }
    ) {
         this.id= id;
     this.name= name;
     this.stock= stock;
     this.original_price= original_price;
     this.discount_price= discount_price;
     this.image= image;
     this.category_id= category_id;
     this.sub_category_id= sub_category_id;
     this.created_at= created_at;
     this.updated_at= updated_at;
     this.category= {
        id= id,
        name = name,
        status= string;
        created_at= string;
        updated_at= string;
    }
     this.sub_category= {
        id= number;
        name= string;
        category_id= number;
        status= string;
        created_at= string;
        updated_at= string;
    }
    }
}