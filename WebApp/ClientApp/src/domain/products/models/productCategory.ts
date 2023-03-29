export enum ProductCategory{
    Drink = 1,
    Eat = 2,
    Dish = 3,
    Fish = 4,
    Technical = 5,
}

export namespace ProductCategory{
    export function getDisplayName(category: ProductCategory){
        switch(category){
            case ProductCategory.Dish: return 'Dish'
            case ProductCategory.Drink: return 'Drink'
            case ProductCategory.Eat: return 'Eat'
            case ProductCategory.Fish: return 'Fish'
            case ProductCategory.Technical: return 'Technical'
        }
    }

    export function getAll(): ProductCategory[]{
        return [
        ProductCategory.Drink, 
        ProductCategory.Eat,
        ProductCategory.Dish,
        ProductCategory.Fish, 
        ProductCategory.Technical,
    ]}
}



