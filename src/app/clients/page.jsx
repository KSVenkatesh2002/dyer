import ClientNavButton from '@/app/clients/components/ClientNavButton'
import ClientListPage from '@/app/clients/components/ClientList'
import React from 'react'

const page = () => {
    return (
        <>
            <ClientNavButton />
            <ClientListPage />
        </>
    )
}

export default page