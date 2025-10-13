import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <>
    <div className='flex items-center justify-between'>
    <main className=''>
        <SignIn/>
    </main>
    </div>
    
    </>
  )
}

export default SignUpPage
