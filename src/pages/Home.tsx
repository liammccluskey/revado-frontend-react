import React from 'react'
import styled from 'styled-components'

import { BodyContainer } from '../components/BodyContainer'
import { PageContainer } from '../components/PageContainer'

export const Home = (props: any) => {

    return (
        <PageContainer>
            <BodyContainer>
                <Root>

                </Root>
            </BodyContainer>
        </PageContainer>
    )
}

const Root = styled.div`
    padding: 20px;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    align-self: center;
`