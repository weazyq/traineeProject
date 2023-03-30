import { Group } from "./group"

export interface GroupBlank{
    id: string | null,
    name: string | null
}

export namespace GroupBlank{
    export function getDefault(): GroupBlank{
        return {
            id: null,
            name: null
        }
    }

    export function fromGroup(group: Group): GroupBlank{
        return {
            id: group.id,
            name: group.name
        } 
    }
}