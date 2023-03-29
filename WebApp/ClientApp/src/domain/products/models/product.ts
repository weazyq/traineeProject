import { ProductCategory } from "./productCategory";

export class Product {
     id: string
     name: string
     category: ProductCategory
     groupid: string
     description: string
     issale: boolean
     price: number

     constructor(id:string, name:string, category: ProductCategory, groupid: string, description: string, issale: boolean, price: number) {
        this.id = id
        this.name = name
        this.category = category
        this.groupid = groupid
        this.description = description
        this.issale = issale
        this.price = price       
     }
}


export function mapToProduct(data: any): Product{
    return new Product(data.id, data.name, data.category, data.groupId, data.description, data.isSale, data.price)
}

export function mapToProducts(data: any[]): Product[]{
    return data.map(d => mapToProduct(d))
}