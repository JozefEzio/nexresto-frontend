import { Minus, Plus, Trash } from 'lucide-react'
import React, { useContext, useState } from 'react'
import ProductChosen from '../../../context/ProductChosen'

const TopSection = ({notes,setNotes }) => {
    const { onRemove, productsChosen } = useContext(ProductChosen)
    const [expandedId, setExpandedId] = useState(null)
    
    console.log(notes)
    return (
        <div className="flex-1 overflow-y-auto p-4 h-full min-h-0">
            {productsChosen.length === 0 ?
                (
                    <div className="flex items-center justify-center h-full py-20 ">
                        <p className="text-gray-400 ">No product added yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {productsChosen.map((item, i) => (
                            <>
                                <div  className='py-4 px-5 bg-white rounded-3xl flex items-center justify-between cursor-pointer'>
                                    <div className="flex items-center gap-3" onClick={() => setExpandedId(prev => prev === item.id ? null : item.id)}>
                                        <div className='rounded-[50%] bg-primary-orange px-2.5 py-0.75 text-white text-sm'>{i + 1}</div>
                                        <div className='text-sm'>{item.name} <span className='text-small-gray'>X{item.quantity}</span></div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            {item.price * item.quantity} DH
                                        </div>
                                        <div onClick={() => onRemove(item.id)} className='p-2 bg-red-500 text-white rounded-[50%] cursor-pointer hover:bg-red-400'>
                                            <Trash className='w-5 h-5' />
                                        </div>
                                    </div>
                                </div>
                                {expandedId === item.id && (
                                    <div className="mb-2 border border-blue-300 rounded-xl p-2 bg-white">
                                        <textarea
                                            rows={2}
                                            placeholder="Add notes"
                                            value={notes[item.id] || ''}
                                            onChange={e => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                            className="w-full text-gray-600 resize-none outline-none placeholder-gray-300"
                                        />
                                        <div className="flex justify-end mt-1">
                                            <button
                                                onClick={() => setExpandedId(null)}
                                                className="px-4 py-1 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>


                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default TopSection