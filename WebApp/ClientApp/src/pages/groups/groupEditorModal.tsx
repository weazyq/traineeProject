import { Add } from "@mui/icons-material"
import { Alert, Autocomplete, Button, Dialog, TextField } from "@mui/material"
import { useState } from "react"
import { Group } from "../../domain/groups/models/group"
import { GroupBlank } from "../../domain/groups/models/groupBlank"
import { ProductGroupsProvider } from "../../domain/products/productGroupsProvider"

interface Props{
    groupId: string | null,
    isOpen: boolean,
    onClose: boolean
}

export function GroupEditorModal(props: Props){
    const [groupBlank, setGroup] = useState<GroupBlank>(GroupBlank.getDefault)
    const [error, setError] = useState<string>('')

    async function saveGroup(){
        const error = await ProductGroupsProvider.saveGroup(groupBlank)

        if(!error){
            setGroup(GroupBlank.getDefault)
            setError('')
            return props.onClose(true)
        }

        setError(error)
    }

    return (
        <Dialog open={props.isOpen}>
            <div style={{ display: "flex", flexDirection: 'column', gap: 20, padding: 20, textAlign: 'center' }}>
                {props.groupId ? <h3>Редактирование группы</h3> : <h2>Добавление группы</h2>}
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
                <TextField size='small' label='Название группы' value={groupBlank.name} onChange={e => setGroup((groupBlank) => ({...groupBlank, name: e.target.value}))}/>
                <Button variant="contained" startIcon={<Add />}>{props.groupId ? 'Сохранить' : 'Создать'}</Button>
            </div>
        </Dialog>
    )
}