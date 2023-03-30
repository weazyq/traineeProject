export function distinctBy<T>(array: T[], equals: (a: T, b: T) => boolean): Array<T> {
    let filtered: T[] = []

    array.forEach(e => {
        if (filtered.find(f => equals(e, f)) === undefined)
            filtered.push(e)
    })

    return filtered
}

export function distinct<T>(array: T[]): Array<T> {
    return array.filter((value, index, self) => self.indexOf(value) === index)
}