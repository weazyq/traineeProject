import { HttpClient } from "../../pages/products/productList";
import { Group, mapToGroup, mapToGroups } from "../groups/models/group";
import { GroupBlank } from "../groups/models/groupBlank";
import { Page } from "../page";
import { mapToResult, Result } from "../result";

export class ProductGroupsProvider{

    public static async getGroups(): Promise<Group[]>{
        const response = await HttpClient.get('/products/groups/get-by-query')
        return mapToGroups(response)
    }

    public static async getGroupsPage(pageNumber: number, countInPage: number, filter: string | null): Promise<Page<Group>>{
        const query = `pageNumber=${pageNumber}&countInPage=${countInPage}${filter && `&queryString=${filter}`}`

        const { totalRows, values } = await HttpClient.get('/products/groups/get', query)

        return new Page(totalRows, mapToGroups(values)) 
    }

    public static async getProductGroup(id: string | null): Promise<Group>{

        const response = await HttpClient.get('/products/group/get', `id=${id}`)
        const group: Group = mapToGroup(response)

        return group
    }

    public static async getProductGroups(ids: string[]): Promise<Group[]>{

        const response = await HttpClient.post('/products/groups/post', {
            body: ids
        })

        const groups: Group[] = mapToGroups(response)
        return groups
    }

    public static async saveGroup(groupBlank: GroupBlank): Promise<Result>{

        const {errors, isSuccess} = await HttpClient.post('/products/group/save', {
            body: groupBlank
        })

        const result = mapToResult(errors, isSuccess)

        return result
    }
}