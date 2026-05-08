import React, { useContext, useState } from 'react'
import ProductChosen from '../context/ProductChosen';
import { Menu, X } from 'lucide-react';

const Navbar = () => {


    return (
        <nav className='flex items-center justify-between gap-1 p-3 bg-white absolute w-full'>
            <div className='flex items-center gap-1'>
                <img src="/chef.svg" alt="" className='w-[45px]' />
                <h2 className='font-abeezee text-[20px] text-primary-black'>NexResto</h2>
            </div>
        </nav>
    )
}

export default Navbar