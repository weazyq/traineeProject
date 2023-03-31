export class Group {
     id: string
     name: string

     constructor(id: string, name: string) {
        this.id = id
        this.name = name
     }
}

export function mapToGroup(data: any): Group{
    return new Group(data.id, data.name)
}

export function mapToGroups(data: any[]): Group[]{
    return data.map(d => mapToGroup(d))
}