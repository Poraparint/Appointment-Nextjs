import React from "react";
import Image from "next/image";

function Authimg() {
  return (
    <div className="relative max-lg:hidden w-full">
      <Image
        src="/Cat.jpeg"
        alt="Profile"
        className=""
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
}

export default Authimg;
