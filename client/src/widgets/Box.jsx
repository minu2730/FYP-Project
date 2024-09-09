import React from 'react'

const Box = ({title,number}) => {
  return (
    <div className="bg-white shadow-md rounded px-8 py-6 w-60 h-40 mx-auto text-center">
       <div className='flex flex-col justify-center align-bottom gap-8'>
       <h2 className='font-extrabold text-[20px]' >{title}</h2>
       <span className='text-[20px] font-medium' >{number}</span>
       </div>
      

    </div>
  )
}

export default Box