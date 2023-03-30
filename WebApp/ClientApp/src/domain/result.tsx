export class Result{
    errors: string[]
    isSuccess: boolean
    /**
     *
     */
    constructor(errors: string[], isSuccess: boolean) {
        this.errors = errors
        this.isSuccess = isSuccess
    }
}

export function mapToResult(errors: string[], isSuccess: boolean): Result{
    return new Result(errors, isSuccess)
}