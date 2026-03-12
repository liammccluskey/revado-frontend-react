import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useAuthContext } from '../providers/AuthProvider'

export const Navbar = () => {
    const {currentUser, logout} = useAuthContext()

    return (
        <Root>
            <h3 className='page-title'>Revado</h3>
            {currentUser ? 
                <button onClick={logout} >Logout</button>
                : <div className='links-container'>
                    <Link to='/login' style={{marginRight: 20}} >Login</Link>
                    <Link to='/register' >Register</Link>
                </div>
                
            }
        </Root>
    )
}

const Root = styled.div`
    background-color: var(--bgc-nav);
    min-height: var(--h-mainheader);
    padding: 0px var(--ps-mainheader);
    width: 100vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .page-title {
        color: var(--tint) !important;
    }

    .links-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
`