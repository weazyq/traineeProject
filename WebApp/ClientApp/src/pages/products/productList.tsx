import React, { useEffect, useRef, useState } from "react"
import { Alert, Button, TextField, Table, TableContainer, TableHead, TableCell, TableRow, Paper, TableBody, Pagination, IconButton, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';
import { Delete, Edit, Add, Close, Check, DashboardOutlined, TableViewOutlined } from '@mui/icons-material';
import { ProductEditorModal } from "./productEditorModal";
import { Product } from "../../domain/products/models/product";
import { ProductCategory } from "../../domain/products/models/productCategory";
import { Group } from "../../domain/groups/models/group";
import { ProductCard } from "./productCard";
import { ProductGroupsProvider } from "../../domain/products/productGroupsProvider";
import ProductsProvider from "../../domain/products/productsProvider";
import { distinct } from "../../common/utils";
import { HttpClient } from "../../common/httpClient";

interface Props {
  products?: Product[]
  countInPage: number
}

export function ProductList(props: Props) {

  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [filter, setFilter] = useState<string>('')
  const [alert, setAlert] = useState<string>()
  const [groups, setGroups] = useState<Group[]>([])

  const [removeProductId, setRemoveProductId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [showMethod, setShowMethod] = useState<string>('table');
  const [loading, setLoading] = useState<boolean>(true)
  
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1
  }

  const callbackFunction = (entries: any) => {
    const[entry] = entries
    setInView(entry.isIntersecting)
  }

  const containerRef = useRef(null)
  const [inView, setInView] = useState(false)

  const handleFilterChange = (value: string) => {
    setPage(1)
    setFilter(value)
  }

  const handleShowMethod = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setProducts([])
    setPage(1)
    if(newAlignment !== null){
      setShowMethod(newAlignment)
    }
  }

  async function removeProduct(id: string) {

    await HttpClient.post('/products/remove', {
      query: `id=${id}`
    })

    setProducts(products.filter(product => product.id !== id))
    setPage(1)
    setAlert('Продукт успешно удалён')
  }

  /*Загрузка подуктов с использованием навигации*/  
  async function loadProducts() {
    const {totalRows, values} = await ProductsProvider.getProducts(page,props.countInPage,filter)
    
    const groupIds = distinct(values.map((value) => value.groupid))

    const groups: Group[] = await ProductGroupsProvider.getProductGroups(groupIds);
    setGroups(groups)

    let pages = (totalRows % props.countInPage === 0) ? 
                totalRows / props.countInPage : 
                Math.floor(totalRows / props.countInPage) + 1

    setPages(pages)
    setProducts(values)
  }
  
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    if (containerRef.current){
      observer.observe(containerRef.current)
    }
    return () => {
      if (containerRef.current)
      {
        observer.unobserve(containerRef.current)
      }
    }
  }, [containerRef, options])

  useEffect(() => {
    if(showMethod === 'table'){
      loadProducts()
      console.log('table load products')
    }
  }, [page,filter,showMethod])

  useEffect(() => {
    if(showMethod === 'cards'){
      if (inView || loading){
        console.log('зашёл в ленивую загрузку')
        console.log(page)
        lazyLoadProducts()
        setLoading(false)
      }
    }  
  }, [filter, inView, showMethod])
  /*=========================================*/

  /*Ленивая загрузка подуктов*/
  async function lazyLoadProducts(){
    if(page <= pages){
      
      const {values} = await ProductsProvider.getProducts(page, props.countInPage,filter)
      const groupIds = distinct(values.map((value) => value.groupid))

      const groups: Group[] = await ProductGroupsProvider.getProductGroups(groupIds);
      setGroups(groups)
  
      setProducts([...products, ...values])
      setPage(page + 1)
    }
  }


  async function closeProductEditorModal(isSave: boolean){
    setShow(false)
    setProductId(null)

    if(!isSave) return
    
      setAlert('Продукт успешно сохранён')
      loadProducts()
  }

  return (
    
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <h2>Продукты</h2>

      <div style={{ display: "flex", width: '100%', flexDirection: 'inherit', alignItems: 'center', gap: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
          <div style={{display: "flex"}}>
                <ToggleButtonGroup
                exclusive
                size="small"
                value={showMethod}
                onChange={handleShowMethod}
                >
                  <ToggleButton value="table">
                    <TableViewOutlined/>
                  </ToggleButton>
                  <ToggleButton value="cards">
                    <DashboardOutlined/>
                  </ToggleButton>
                </ToggleButtonGroup>
                
          </div>
          <div style={{display: "flex"}}>
            <TextField
              label="Поиск продукта"
              size="small"
              value={filter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleFilterChange(event.target.value)
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<Add/>} 
              onClick={() => {setProductId(null); setShow(true)}}>
                Создать
            </Button>
          </div>
        </div>
        {alert && (
          <Alert onClose={() => { setAlert('') }}>{alert}</Alert>
        )}
        {showMethod === 'table' && (
          <>
          <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Продукт</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Группа</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>В продаже</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product: Product, index) => {
                return (<TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{ProductCategory.getDisplayName(product.category)}</TableCell>
                  <TableCell>{groups.find((group) => group.id === product.groupid)?.name ?? ''}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.issale ? <Check /> : <Close />}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => {setProductId(product.id); setShow(true)}}>
                      <Edit/>
                    </IconButton>
                    <IconButton onClick={() => setRemoveProductId(product.id)}>
                      <Delete/>
                    </IconButton>
                    <IconButton/>
                  </TableCell>
                </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={pages} onChange={(_, value) => setPage(value)}/>
        </>
        )}
        {showMethod === 'cards' && (
          <Grid container spacing={3}>
            {products.map((value, index) => 
              <ProductCard {...value} key={index}
            />)}
            <div ref={containerRef}></div>
          </Grid>
        )}
      </div>
      

      <ProductEditorModal productId={productId} isOpen={show} onClose={closeProductEditorModal}  /> 

      <Dialog
        open={removeProductId !== null}
        onClose={() => setRemoveProductId(null)}>
        <DialogTitle  >
          {"Удалить продукт?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={async () => {
            await removeProduct(removeProductId!)
            setRemoveProductId(null)
          }}>Да</Button>
          <Button onClick={() => setRemoveProductId(null)} autoFocus>
            Нет
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}