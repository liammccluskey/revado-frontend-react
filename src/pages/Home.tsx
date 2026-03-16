import React from 'react'
import styled from 'styled-components'

import { BodyContainer } from '../components/BodyContainer'
import { PageContainer } from '../components/PageContainer'
import { Navbar } from '../components/Navbar'

export const Home = () => {

    return (
        <PageContainer>
            <Navbar />
            <BodyContainer>
                <Root>

                </Root>
            </BodyContainer>
        </PageContainer>
    )
}

const Root = styled.div`
`