import Image from "next/image"
import Link from "next/link"


const Footer = () => {
  return (
    <footer className="border-t-2">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row ">
        <Link href={"/"}>
          <Image src={"/assets/images/logo.svg"}
            alt="logo" width={140} height={38} 
          />
        </Link>
        <p>2023 PLANIFY. All Rights Reserved.</p>
      </div>
   </footer>
  )
}

export default Footer