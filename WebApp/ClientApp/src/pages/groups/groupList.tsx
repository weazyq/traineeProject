import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Group } from "../../domain/groups/models/group"
import { useEffect, useState } from "react"
import { Add, Delete, Edit } from "@mui/icons-material"
import { HttpClient } from "../products/productList"
import { GroupEditorModal } from "./groupEditorModal"
import { ProductGroupsProvider } from "../../domain/products/productGroupsProvider"

interface Props {
    groups?: Group[]
    countInPage: number
}

export function GroupList(){

    const [filter, setFilter] = useState<string>('')
    const [groupId, setGroupId] = useState<string | null>('')
    const [show, setShow] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')
    const [removeGroupId, setRemoveGroupId] = useState<string | null>(null)
    const [editGroupId, setEditGroupId] = useState<string | null>(null)

    const [groups, setGroups] = useState<Group[]>([])
    const [pages, setPages] = useState<number>(1)

    const filterChange = (value: string) => {
        setFilter(value)
    }

    useEffect(() => {
        async function loadGroups(){
            const groups = await ProductGroupsProvider.getGroups(filter);
            setGroups(groups)
        }

        loadGroups()
    }, [filter])

    async function removeGroup(id: string) {

        await HttpClient.get('/groups/remove', `id=${id}`)
    
        setGroups(groups.filter(group => group.id !== id))
        setAlert('Группа успешно удалена')
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
                                <IconButton onClick={() => setEditGroupId(group.id)}>
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
        <Pagination count={pages} onChange={(_, value) => setPages(value)}/>
        
        <GroupEditorModal groupId={groupId} isOpen={show}/>

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