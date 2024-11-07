import Image from "next/image";

function Authimg() {
  return (
    <div className="relative max-lg:hidden w-full">
      <Image
        src="/Cat.jpeg"
        alt="Profile"
        width={500} // Add width
        height={300} // Add height
        style={{ objectFit: "cover" }} // Use style for objectFit
      />
    </div>
  );
}

export default Authimg;
