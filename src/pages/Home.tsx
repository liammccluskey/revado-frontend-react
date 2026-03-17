import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { BodyContainer } from '../components/BodyContainer'
import { PageContainer } from '../components/PageContainer'
import { Navbar } from '../components/Navbar'
import { useTodoContext } from '../providers/TodoProvider'
import { TodoItem } from '../components/TodoItem'

export const Home = () => {
    const {todos, postTodo, fetchTodos} = useTodoContext()
    const [todoTitle, setTodoTitle] = useState<string>('')
    const [todoDescription, setTodoDescription] = useState<string>('')

    useEffect(() => {
        fetchTodos()
    }, [])

    const onClickCancelCreateTodo = () => {
        setTodoTitle('')
        setTodoDescription('')
    }

    const onSubmitForm = async (e: any) => {
        e.preventDefault()
        const todoRequest = {
            title: todoTitle, 
            description: todoDescription, 
            completed: false
        }
        await postTodo(todoRequest)
        onClickCancelCreateTodo()
    }

    return (
        <PageContainer>
            <Navbar />
            <BodyContainer>
                <Root>
                    <h2>Create a todo</h2>
                    <br />
                    <form className='float-container create-todo-container' onSubmit={onSubmitForm}>
                        <label>Title</label>
                        <input 
                            type='text' 
                            value={todoTitle} 
                            onChange={e => setTodoTitle(e.target.value)} 
                            required
                        />
                        <br />
                        <label>Description</label>
                        <textarea 
                            rows={3} 
                            value={todoDescription} 
                            onChange={e => setTodoDescription(e.target.value)}
                        ></textarea>
                        <br />
                        <button type='submit' style={{alignSelf: 'flex-end'}}>Save</button>
                    </form>
                    <br />
                    <h2>Todos</h2>
                    <br />
                    <div className='float-container todos-container'>
                        {todos.map(todo => (
                            <TodoItem todo={todo} key={todo.id}/>
                        ))}
                    </div>
                </Root>
            </BodyContainer>
        </PageContainer>
    )
}

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    & .todos-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    & .create-todo-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 15px;
    }
`