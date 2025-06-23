import React from 'react'
import Link from 'next/link'

const PaymentNavButton = ({employeeId, job}) => {
  return (
    <div className='mt-4 flex justify-between'>
        <Link href={`/payments/add/${job}/${employeeId}`} className='p-4 border-2 rounded-4xl bg-secondary capitalize font-semibold shadow-lg shadow-gray-500'>
            add new payment
        </Link>
        <Link href={`/payments/history/time-based/${employeeId}`} className='p-4 border-2 rounded-4xl bg-secondary capitalize font-semibold shadow-lg shadow-gray-500'>
            show payment history
        </Link>
    </div>
  )
}

export default PaymentNavButton