import { Product } from "./product";
import { ProductCategory } from "./productCategory";

export interface ProductBlank{
    id: string | null
    name: string | null
    category: ProductCategory| null
    groupId: string | null
    description: string| null
    issale: boolean
    price: number| null 
}


export namespace ProductBlank{

    export function getDefault(): ProductBlank{
        return {
            id: null,
            name: null,
            category: null,
            description: null,
            issale: false,
            price: null,
            groupId: null
        }
    }

    export function fromProduct(product: Product): ProductBlank{
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            issale: product.issale,
            category: product.category,
            groupId: product.groupid,
            price: product.price
        }
    }
}