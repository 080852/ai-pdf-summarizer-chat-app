import Image from 'next/image'

function SideBar() {
  return (
    <div className='shadow-sm h-screen'>
        <Image src={'/logo.svg'} alt='logo' width={120} height={120} />
    </div>
  )
}

export default SideBar
