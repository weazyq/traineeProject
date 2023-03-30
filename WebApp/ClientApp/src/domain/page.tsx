export class Page<T> {

    totalRows: number
    values: T[]

    constructor(totalRows: number, values: T[]) {
        this.totalRows = totalRows
        this.values = values
    }
}