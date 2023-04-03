import { Box, Card, Chip, Grid, Skeleton } from "@mui/material"
import { ProductCategory } from "../../domain/products/models/productCategory"
import { useInView } from "react-intersection-observer";

interface Props{
    name: string,
    category: ProductCategory,
    description: string,
    price: number,
    issale: boolean
}
export function ProductCard(props: Props){

    const {ref, inView} = useInView({
        threshold: 0.5,
        triggerOnce: true
    })

    return (
        <Grid item xs={3}>
            <Card ref={ref} style={{display: "flex", flexDirection: 'column'}}>
            {
                inView ?
                <img src="https://imgholder.ru/300x200/8493a8/adb9ca&text=PRODUCT&font=kelson" alt="product"/> :
                <Box sx={{width: '100%', height: 200}}>
                    <Skeleton variant="rectangular" style={{height: '100%'}}/>
                </Box>
            }
            
            <Box sx={{p: 2}}>
            <p>{props.name}</p>
                <Chip variant="outlined" 
                label={ProductCategory.getDisplayName(props.category)}
                color="secondary"
                size="small"/>
                <p>{props.description}</p>
            <Box component={"p"} sx={{fontSize: 24}}>{props.price}₽</Box>
            </Box>
            </Card>
        </Grid>
    )
}