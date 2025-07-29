"use client";

import DashboardTable from '@/components/dashborad/DashboardTable'
import React from 'react'

const dashboard = () => {
  return (
    <main className='max-w-full mx-auto py-8 bg-amber-50'>
        <h2>DashBoard CRUD</h2>
        <DashboardTable />
    </main>
  )
}

export default dashboard