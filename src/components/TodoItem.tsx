import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useTodoContext, type Todo } from '../providers/TodoProvider'

interface Props {
    todo: Todo
}

export const TodoItem = (props: Props) => {
    const {patchTodo, deleteTodo, postSubtask, patchSubtask, deleteSubtask} = useTodoContext()
    const [isEditingTodo, setIsEditingTodo] = useState<boolean>(false)
    const [todoTitle, setTodoTitle] = useState<string>('')
    const [todoDescription, setTodoDescription] = useState<string>('')

    const [isAddingSubtask, setIsAddingSubtask] = useState<boolean>(false)
    const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null)
    const [subtaskDescription, setSubtaskDescription] = useState('')
    const [editingSubtaskDescription, setEditingSubtaskDescription] = useState('')

    useEffect(() => {
        if (isEditingTodo) {
            setTodoTitle(props.todo.title)
            setTodoDescription(props.todo.description)
        }
    }, [isEditingTodo])

    useEffect(() => {
        if (editingSubtaskId != null) {
            const subtask = props.todo.subtasks.find(s => s.id == editingSubtaskId)
            if (subtask) {
                setEditingSubtaskDescription(subtask.description)
            }
        }
    }, [editingSubtaskId])

    // Todos

    const onClickEditTodo = () => setIsEditingTodo(true)

    const onClickCancelEditTodo = () => setIsEditingTodo(false)

    const onClickSaveTodo = async () => {
        await patchTodo({title: todoTitle, description: todoDescription}, props.todo.id)
        setIsEditingTodo(false)
    }

    const onChangeTodoCompleted = async (event: any) => {
        await patchTodo({completed: event.target.checked}, props.todo.id)
    }

    const onClickDeleteTodo = async () => {
        await deleteTodo(props.todo.id)
    }

    // Subtasks

    const onClickCreateSubtask = () => setIsAddingSubtask(true)

    const onClickCancelCreateSubtask = () => setIsAddingSubtask(false)

    const onClickSaveSubtask = async () => {
        await postSubtask({description: subtaskDescription, completed: false}, props.todo.id)
        setIsAddingSubtask(false)
        setEditingSubtaskId(null)
    }

    const onClickEditSubtask = (subtaskId: number) => {
        setEditingSubtaskId(subtaskId)
    }

    const onClickCancelEditSubtask = () => {
        setEditingSubtaskId(null)
    }

    const onClickSaveSubtaskEdits = async () => {
        await patchSubtask({description: editingSubtaskDescription}, editingSubtaskId!)
        setEditingSubtaskId(null)
    }

    const onChangeSubtaskCompleted = async (event: any, subtaskId: number) => {
        await patchSubtask({completed: event.target.checked}, subtaskId)
    }

    const onClickDeleteSubtask = async (subtaskId: number) => {
        await deleteSubtask(subtaskId, props.todo.id)
    }

    return (
        <Root key={props.todo.id}>
            <div className='header-container'>
                <div className='header-left-container'>
                    <input 
                        type='checkbox' 
                        checked={props.todo.completed} 
                        onChange={onChangeTodoCompleted} 
                        style={{marginRight: 10}}
                    />
                    {isEditingTodo ? 
                        <input type='text' value={todoTitle} onChange={e => setTodoTitle(e.target.value)} />
                        : <h4>{props.todo.title}</h4>
                    }
                </div>
                {!isEditingTodo ? 
                    <div className='header-right-container'>
                        <button onClick={onClickEditTodo}>Edit</button>
                        <button onClick={onClickCreateSubtask}>+ Add subtask</button>
                        <button onClick={onClickDeleteTodo}>Delete</button>
                    </div>
                    : <div className='header-right-container'>
                        <button onClick={onClickCancelEditTodo}>Cancel</button>
                        <button onClick={onClickSaveTodo}>Save</button>
                    </div>
                }
            </div>
                {isEditingTodo ? 
                    <textarea 
                        value={todoDescription} 
                        onChange={e => setTodoDescription(e.target.value)}
                        rows={3}
                    ></textarea>
                    : <p>{props.todo.description}</p>
                }
                {isAddingSubtask ? 
                    <div className='float-container add-subtask-container' style={{margin: '10px 0px'}}>
                        <h4 style={{marginBottom: 10}}>Add subtask</h4>
                        <label>Description</label>
                        <input 
                            type='text' 
                            value={subtaskDescription} 
                            onChange={e => setSubtaskDescription(e.target.value)}
                        />
                        <div className='footer' style={{alignSelf: 'flex-end', marginTop: 10}}>
                            <button style={{marginRight: 10}} onClick={onClickCancelCreateSubtask}>Cancel</button>
                            <button onClick={onClickSaveSubtask}>Save</button>
                        </div>
                    </div>
                    : null
                }
                {props.todo.subtasks.length ? 
                    <div className='float-container subtasks-container'>
                        {props.todo.subtasks.map(subtask => (
                            <div className='subtask-container' key={subtask.id}>
                                <div className='subtask-left-container'>
                                    <input
                                        type='checkbox'
                                        checked={subtask.completed}
                                        onChange={e => onChangeSubtaskCompleted(e, subtask.id)}
                                        style={{marginRight: 10}}
                                    />
                                    {subtask.id == editingSubtaskId ?
                                        <input 
                                            type='text' 
                                            value={editingSubtaskDescription}
                                            onChange={e => setEditingSubtaskDescription(e.target.value)}
                                            style={{flex: 1, marginRight: 10}}
                                        />
                                        : <p>{subtask.description}</p>
                                    }
                                </div>
                                {subtask.id == editingSubtaskId ?
                                    <div className='subtask-buttons-container'>
                                        <button onClick={onClickCancelEditSubtask}>Cancel</button>
                                        <button onClick={onClickSaveSubtaskEdits}>Save</button>
                                    </div>
                                    : <div className='subtask-buttons-container'>
                                        <button onClick={() => onClickEditSubtask(subtask.id)}>Edit</button>
                                        <button onClick={() => onClickDeleteSubtask(subtask.id)}>Delete</button>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                    : null
                }
        </Root>
    )
}

const Root = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
    box-sizing: border-box;

    &:last-child {
        border-bottom: none;
    }

    & .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    & .header-left-container,
    & .header-right-container {
        display: flex;
        align-items: center;
    }

    & .header-right-container button {
        margin-right: 10px;
    }

    & .add-subtask-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 15px;
    }

    & .subtasks-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-top: 10px;
    }

    & .subtask-container {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);
    }

    & .subtask-container:last-child {
        border-bottom: none;
    }

    & .subtask-left-container {
        display: flex;
        align-items: center;
        flex: 1;
    }

    & .subtask-buttons-container button:first-child {
        margin-right: 10px;
    }
`   