import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Group } from "../../domain/groups/models/group"
import { useEffect, useState } from "react"
import { Add, Delete, Edit } from "@mui/icons-material"
import { GroupEditorModal } from "./groupEditorModal"
import { ProductGroupsProvider } from "../../domain/products/productGroupsProvider"
import { HttpClient } from "../../common/httpClient"

interface Props {
    groups?: Group[]
    countInPage: number
}

export function GroupList(props: Props){

    const [filter, setFilter] = useState<string>('')
    const [groupId, setGroupId] = useState<string | null>('')
    const [show, setShow] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')
    const [removeGroupId, setRemoveGroupId] = useState<string | null>(null)

    const [groups, setGroups] = useState<Group[]>([])
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)

    const filterChange = (value: string) => {
        setFilter(value)
    }

    async function loadGroups(){
        const {totalRows, values} = await ProductGroupsProvider.getGroupsPage(page, props.countInPage, filter);
        
        let pages = (totalRows % props.countInPage === 0) ? 
        totalRows / props.countInPage : 
        Math.floor(totalRows / props.countInPage) + 1

        setPages(pages)
        setGroups(values)
    }

    useEffect(() => {

        loadGroups()

    }, [filter, page])

    async function removeGroup(id: string) {

        await HttpClient.post('/products/group/remove', {
            query: `id=${id}`
        })
    
        setGroups(groups.filter(group => group.id !== id))
        setAlert('Группа успешно удалена')
        setPage(1)
      }

    async function closeProductEditorModal(isSave: boolean){
        setShow(false)
        setGroupId(null)

        if(!isSave) return
        setAlert('Группа успешно сохранена')
        loadGroups()
    }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <h2>Группы</h2>

      <div style={{display: "flex", width: "100%", flexDirection: "inherit", alignItems: "center", gap: 30}}>
        <div style={{ textAlign: "right", width: "100%"}}>
            <TextField
                label="Поиск группы"
                size="small"
                value={filter}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    filterChange(event.target.value)
                }}
            />
            <Button 
                variant="contained"
                startIcon={<Add/>}
                onClick={() => {setGroupId(null); setShow(true)}}>
                Создать
            </Button>
        </div>
        {alert && (
            <Alert onClose={() => { setAlert('')}}>{alert}</Alert>
        )}
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Группа</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups.map((group: Group, index) => {
                        return (
                        <TableRow key={index}>
                            <TableCell>{group.name}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => {setGroupId(group.id); setShow(true)}}>
                                    <Edit/>    
                                </IconButton>
                                <IconButton onClick={() => setRemoveGroupId(group.id)}>
                                    <Delete/>
                                </IconButton>    
                            </TableCell>    
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Pagination count={pages} onChange={(_, value) => setPage(value)}/>
        
        <GroupEditorModal groupId={groupId} isOpen={show} onClose={closeProductEditorModal}/>

        <Dialog
            open={removeGroupId !== null}
            onClose={() => setRemoveGroupId(null)}>
            <DialogTitle>
            {"Удалить группу?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={async () => {
                await removeGroup(removeGroupId!)
                setRemoveGroupId(null)
            }}>Да</Button>
            <Button onClick={() => setRemoveGroupId(null)} autoFocus>
                Нет
            </Button>
            </DialogActions>
      </Dialog>
      </div>
    </section>
  )
}