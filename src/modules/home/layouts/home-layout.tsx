import React from 'react'
import { HomeNavbar } from '../components/home-navbar'
interface HomeLayoutProps {
    children: React.ReactNode
}
const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <>
            <HomeNavbar />
            <main className='flex min-h-screen w-full'>
                {children}
            </main>
        </>
    )
}

export default HomeLayout