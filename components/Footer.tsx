import React from "react"
import DeployButton from "./deploy-button"

export default function Footer() {
  return (
    
    <footer className='bg-pain mt-[40rem] max-md:hidden items-center flex justify-between text-white tracking-wide w-full'>
      <DeployButton/>
        <div className='upper-footer w-[70%] py-10 gap-[5rem] justify-end flex'>
          <div>
            <h1 className='font-semibold text-2xl'>Menu</h1>
            <ul className='text-sm mt-3 font-light flex flex-col gap-3'>
              <li>Catagory</li>
              <li>Job Board</li>
              <li>Trending</li>
              <li>Become Freelancer</li>
            </ul>
          </div>
          <div>
            <h1 className='font-semibold text-2xl'>WORKINGS<br/>HOURS</h1>
            <ul className='text-sm mt-3 font-light flex flex-col gap-3'>
              <li>วันทำการ : ทุกวัน</li>
              <li>เวลา : 20:30 - 23:30</li>
            </ul>
          </div>
          <div>
            <h1 className='font-semibold text-2xl'>CONTACT US</h1>
            <ul className='text-sm mt-3 font-light flex flex-col gap-3'>
              <li>Catagory</li>
              <li>Job Board</li>
              <li>Trending</li>
            </ul>
          </div>
        </div>
        <hr className='border-[#E4E4E4] border-[1px] mb-5'/>
      </footer>
    
  )
}

