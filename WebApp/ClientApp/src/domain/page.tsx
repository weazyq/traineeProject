export class Page {

    totalRows: number
    values: any[]

    constructor(totalRows: number, values: any[]) {
        this.totalRows = totalRows
        this.values = values
    }
}