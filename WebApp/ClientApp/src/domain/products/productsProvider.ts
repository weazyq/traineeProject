import { mapToProduct, mapToProducts, Product } from "./models/product";
import { ProductBlank } from "./models/productBlank";
import { Page } from "../page";
import { mapToResult, Result } from "../result";
import { HttpClient } from "../../common/httpClient";

export default class ProductsProvider{
    public static async saveProduct(productBlank: ProductBlank): Promise<Result>{
        const {errors, isSuccess} = await HttpClient.post('/products/save', { body: productBlank })

        const result = mapToResult(errors, isSuccess)

        return result
    }

    public static async getProduct(id: string | null): Promise<Product>{
        const result = await HttpClient.get('/product/get', `id=${id}`)
        
        const product: Product = mapToProduct(result)

        return product
    }

    public static async getProducts(pageNumber: number, countInPage: number, filter: string): Promise<Page<Product>>{

        const query = `pageNumber=${pageNumber}&countInPage=${countInPage}${filter && `&queryString=${filter}`}`

        let {totalRows, values} = await HttpClient.get('/products/get', query)

        return new Page(totalRows, mapToProducts(values))
    }
}