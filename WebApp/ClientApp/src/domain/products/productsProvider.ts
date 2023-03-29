import { Http } from "@mui/icons-material";
import { HttpClient } from "../../pages/products/productList";
import { mapToProduct, mapToProducts, Product } from "./models/product";
import { ProductBlank } from "./models/productBlank";
import { Page } from "../page";

export default class ProductsProvider{

    public static async saveProduct(productBlank: ProductBlank): Promise<string | null>{
        const result = await HttpClient.post('/products/save', { body: productBlank })
        
        if(result.isSucces)
            return null

        return result.errors[0]
    }

    public static async getProduct(id: string | null): Promise<Product>{
        const result = await HttpClient.get('/product/get', `id=${id}`)
        
        return result
    }

    public static async getProducts(page: number, countInPage: number, filter: string): Promise<Page>{

        const query = `${page ? `pageNumber=${page}` : ``}${countInPage ? `&countInPage=${countInPage}` : ``}${filter ? `&queryString=${filter}` : ``}`
        
        let {totalRows, values}: Page = await HttpClient.get('/products/get', query)
        values = mapToProducts(values)

        return { totalRows, values}
    }
}