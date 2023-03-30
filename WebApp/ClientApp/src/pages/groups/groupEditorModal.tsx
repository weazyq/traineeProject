import { Add } from "@mui/icons-material"
import { Alert, Button, Dialog, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { GroupBlank } from "../../domain/groups/models/groupBlank"
import { ProductGroupsProvider } from "../../domain/products/productGroupsProvider"

interface Props{
    groupId: string | null,
    isOpen: boolean,
    onClose: (isSave: boolean) => void
}

export function GroupEditorModal(props: Props){
    const [groupBlank, setGroupBlank] = useState<GroupBlank>(GroupBlank.getDefault)
    const [error, setError] = useState<string | null>('')

    async function saveGroup(){
        const { errors, isSuccess } = await ProductGroupsProvider.saveGroup(groupBlank)

        if(isSuccess){
            setGroupBlank(GroupBlank.getDefault)
            setError('')
            return props.onClose(true)
        }

        setError(errors[0])
    }

    useEffect(() => {

        async function loadGroup()
        {
            if(props.groupId){
                const group = await ProductGroupsProvider.getProductGroup(props.groupId)
        
                const groupBlank: GroupBlank = GroupBlank.fromGroup(group)
                setGroupBlank(groupBlank)
            }
            
            else{
                setGroupBlank(GroupBlank.getDefault())
            }
        }

        loadGroup()
        
    }, [props.groupId])

    return (
        <Dialog open={props.isOpen} onClose={() => {props.onClose(false)}}>
            <div style={{ display: "flex", flexDirection: 'column', gap: 20, padding: 20, textAlign: 'center' }}>
                {props.groupId ? <h3>Редактирование группы</h3> : <h2>Добавление группы</h2>}
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
                <TextField 
                    size='small'
                    label='Название группы' 
                    value={groupBlank.name} 
                    onChange={e => setGroupBlank((groupBlank) => ({...groupBlank, name: e.target.value}))}
                />
                <Button 
                    variant="contained"
                    startIcon={<Add />} 
                    onClick={() => saveGroup()}>
                        {props.groupId ? 'Сохранить' : 'Создать'}
                </Button>
            </div>
        </Dialog>
    )
}