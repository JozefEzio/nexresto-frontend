import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Lock } from 'lucide-react';

const AccessDenied = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-8 opacity-50">
                <img src="/chef.svg" alt="NexResto" className="w-8" />
                <h1 className="font-abeezee text-xl font-bold text-primary-black">NexResto</h1>
            </div>

            <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 text-center border border-gray-100 transition-all">
                
                <div className="relative flex justify-center mb-6">
                    <div className="absolute inset-0 bg-red-100 rounded-full scale-150 blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-red-50 p-5 rounded-full">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>

                <h2 className="font-abeezee text-3xl font-bold text-gray-900 mb-3">
                    Access Denied
                </h2>
                <p className="text-gray-500 font-abeezee mb-8 leading-relaxed">
                    Oops! It looks like you don't have the permissions required to view this station. Please contact your manager if you think this is a mistake.
                </p>

                <Link 
                    to="/home" 
                    className="group flex items-center justify-center gap-3 w-full p-4 rounded-2xl font-abeezee text-lg text-white transition-all bg-primary-orange hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Dashboard</span>
                </Link>
            </div>

        </div>
    );
};

export default AccessDenied;