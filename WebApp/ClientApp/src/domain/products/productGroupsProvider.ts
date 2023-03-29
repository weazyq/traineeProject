import { HttpClient } from "../../pages/products/productList";
import { Group, mapToGroups } from "../groups/models/group";

export class ProductGroupsProvider{

    public static async getGroups(filter: string | null): Promise<Group[]>{
        const query = filter ? `queryString=${filter}` : ``

        const response = await HttpClient.get('/products/groups/get',query)
        return mapToGroups(response)
    }

    public static async getProductGroups(id: string[]): Promise<Group[]>{

        console.log(id)

        const response = await HttpClient.post('/products/groups/post', {
            body: id
        })

        return response
    }
}