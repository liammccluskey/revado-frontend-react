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

    return (
        <PageContainer>
            <Navbar />
            <BodyContainer>
                <Root>
                    <h2>Create a todo</h2>
                    <br />
                    <h2>Todos</h2>
                    <br />
                    <div className='float-container todos-container'>
                        {todos.map(todo => (
                            <TodoItem todo={todo} />
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
`