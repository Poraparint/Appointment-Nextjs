import React from "react";

export default function Footer() {
  return (
    <footer className="bg-pain mt-[40rem] items-center flex justify-between text-white tracking-wide w-full">
      <div>A-Dental</div>
      <div className="upper-footer w-[70%] py-10 gap-[5rem] justify-end flex max-lg:gap-3 ">
        <div>
          <h1 className="font-semibold text-2xl max-lg:text-lg">Menu</h1>
          <ul className="text-sm mt-3 font-light flex flex-col gap-3">
            <li>Home</li>
            <li>Profile</li>
            <li>Add Board</li>
            <li>Add Article</li>
          </ul>
        </div>
        <div>
          <h1 className="font-semibold text-2xl max-lg:text-lg">
            WORKINGS
            <br />
            HOURS
          </h1>
          <ul className="text-sm mt-3 font-light flex flex-col gap-3">
            <li>วันทำการ : จันทร์ - เสาร์</li>
            <li>เวลา : 09:00 - 17:00</li>
          </ul>
        </div>
        <div>
          <h1 className="font-semibold text-2xl max-lg:text-lg">CONTACT US</h1>
          <ul className="text-sm mt-3 font-light flex flex-col gap-3">
            <li>In Process</li>
            <li>In Process</li>
            <li>In Process</li>
          </ul>
        </div>
      </div>
      <hr className="border-[#E4E4E4] border-[1px] mb-5" />
    </footer>
  );
}
