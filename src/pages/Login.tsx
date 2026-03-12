import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { BodyContainer } from '../components/BodyContainer'
import { PageContainer } from '../components/PageContainer'
import { useAuthContext } from '../providers/AuthProvider'
import { Navbar } from '../components/Navbar'

export const Login = () => {
    const {login} = useAuthContext()

    const [loginError, setLoginError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    useEffect(() => {
        setLoginError('')
    }, [email, password])

    const onSubmitForm = async (event: any) => {
        event.preventDefault()
        try {
            await login({email, password})
        } catch (error: any) {
            setLoginError(error.message)
        }
    }

    return (
        <PageContainer>
            <Navbar />
            <BodyContainer>
                <Root className='float-container' onSubmit={onSubmitForm}>
                    <h2 className='title-text'>Login</h2>
                    <label>Email</label>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} required/>
                    <br />
                    <label>Password</label>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    <br />
                    <br />
                    {loginError ? <p className='error-text'>Error: {loginError}</p> : null}
                    <br />
                    <button type='submit' style={{alignSelf: 'flex-end'}} >Login</button>
                </Root>
            </BodyContainer>
        </PageContainer>
    )
}

const Root = styled.form`
    padding: 20px;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    align-self: center;

    & .title-text {
        margin-bottom: 20px;
    }

    & .error-text {
        color: var(--error);
    }
`