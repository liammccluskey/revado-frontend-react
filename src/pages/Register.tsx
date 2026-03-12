import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { BodyContainer } from '../components/BodyContainer'
import { PageContainer } from '../components/PageContainer'
import { useAuthContext } from '../providers/AuthProvider'
import { Navbar } from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
    const {registerAndLogin} = useAuthContext()
    const navigate = useNavigate()

    const [registerError, setRegisterError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    useEffect(() => {
        setRegisterError('')
    }, [email, name, password])

    const onSubmitForm = async (event: any) => {
        event.preventDefault()
        try {
            await registerAndLogin({email, name, password})
            navigate('/home')
        } catch (error: any) {
            setRegisterError(error.message)
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
                    <label>Name</label>
                    <input type='text' value={name} onChange={e => setName(e.target.value)} required/>
                    <br />
                    <label>Password</label>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    <br />
                    <br />
                    {registerError ? <p className='error-text'>Error: {registerError}</p> : null}
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