import { Box, Card, Chip, Grid, Skeleton } from "@mui/material"
import { ProductCategory } from "../../domain/products/models/productCategory"
import { Close, Check } from '@mui/icons-material';
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
        threshold: 0,
        triggerOnce: true
    })

    return (
        <Grid xs={3}>
            <Card ref={ref} style={{display: "flex", flexDirection: 'column', margin: 10}}>
            {
                inView ? 
                <img src="https://imgholder.ru/200x200/8493a8/adb9ca&text=IMAGE+HOLDER&font=kelson"/> : 
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
            <Box component={"text"} sx={{fontSize: 24}}>{props.price}₽</Box>
            </Box>
            </Card>
        </Grid>
    )
}