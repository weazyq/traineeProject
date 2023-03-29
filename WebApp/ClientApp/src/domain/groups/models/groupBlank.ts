
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
}