import { Add } from '@mui/icons-material'
import { Alert, Autocomplete, Button, Dialog, TextField } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Group } from '../../domain/groups/models/group'
import { Product } from '../../domain/products/models/product'
import { ProductBlank } from '../../domain/products/models/productBlank'
import { ProductCategory } from '../../domain/products/models/productCategory'
import { ProductGroupsProvider } from '../../domain/products/productGroupsProvider'
import ProductsProvider from '../../domain/products/productsProvider'

interface Props{
    productId: string | null
    isOpen: boolean
    onClose: (isSave: boolean) => void
}

const ProductEditorModal = (props: Props) => {
    const [error, setError] = useState<string>()
    const [productBlank, setProductBlank] = useState<ProductBlank>(ProductBlank.getDefault)
    const productCategories = useMemo(() => ProductCategory.getAll(), [])
    const [groups, setGroups] = useState<Group[]>([])
    const selectedProductGroup = useMemo(() => groups.find(g => g.id === productBlank.groupId) ?? null, [productBlank.groupId])

    useEffect(() => {
        async function load(){

            if(props.productId){
                const product: Product = await ProductsProvider.getProduct(props.productId)

                const productBlank: ProductBlank = ProductBlank.fromProduct(product)

                setProductBlank(productBlank)
            } 
            
            else
            {
                setProductBlank(ProductBlank.getDefault)
            }
        }

        load()
    }, [props.productId])

    useEffect(() => {

        async function load() {
          const productGroups = await ProductGroupsProvider.getGroups() 
          setGroups(productGroups)
        }
    
        load()
    
      }, [])

      async function saveProduct() {  
        const result = await ProductsProvider.saveProduct(productBlank)
    
        if(result.isSuccess){
            setProductBlank(ProductBlank.getDefault)
            setError('')
            return props.onClose(true)
        }

        setError(result.errors[0])  
      }
    
    return (
        <Dialog open={props.isOpen} onClose={() => props.onClose(false)}>
            <div style={{ display: "flex", flexDirection: 'column', gap: 20, padding: 20, textAlign: 'center' }}>
                {productBlank.id ? <h3>Редактирование продукта</h3> : <h3>Добавление продукта</h3>}
                {error && (
                    <Alert severity='error'>{error}</Alert>
                )}
                <TextField size='small' label='Продукт' value={productBlank.name ?? ''} onChange={e => setProductBlank((productBlank) => ({ ...productBlank, name: e.target.value }))} />
                <Autocomplete
                    size='small'
                    options={productCategories}
                    getOptionLabel={(category) => ProductCategory.getDisplayName(category)}
                    value={productBlank.category}
                    onChange={(_, category) => setProductBlank((productBlank) => ({ ...productBlank, category }))}
                    renderInput={(params) => <TextField {...params} label="Категория"/>}
                />
                <Autocomplete
                    size='small'
                    options={groups}
                    getOptionLabel={(group) => group.name}
                    value={selectedProductGroup}
                    onChange={(_, group) => { setProductBlank((productBlank) => ({ ...productBlank, groupId: group?.id ?? null })) }}
                    renderInput={(params) => <TextField {...params} label="Группа"/>}
                />
                <TextField size='small' label='Описание' value={productBlank.description} onChange={e => setProductBlank((productBlank) => ({ ...productBlank, description: e.target.value }))} />
                <TextField size='small' label='Цена' value={productBlank.price} onChange={e => setProductBlank((productBlank) => ({ ...productBlank, price: +e.target.value }))} />
                <Button variant="contained" startIcon={<Add />} onClick={async () => saveProduct()}>{productBlank.id ? 'Сохранить' : 'Создать'}</Button>
            </div>
        </Dialog>
    )
}

export { ProductEditorModal }