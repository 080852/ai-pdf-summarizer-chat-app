import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import UploadPdfDialog from './UploadPdfDialog'

function SideBar() {
  return (
    <div className='shadow-md h-screen p-7 bg-white rounded-lg'>
      <Image src={'/logo.svg'} alt='logo' width={120} height={100} className="mx-auto" />

      <div className='mt-6'>
        <UploadPdfDialog>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            + Upload PDF
          </Button>
        </UploadPdfDialog>
      </div>

      <div className='mt-6'>
        {/* WorkSpace Item */}
        <div className='flex items-center gap-3 p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors'>
          <Layout className='text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-800'>Workspace</h2>
        </div>

        {/* Upgrade Item */}
        <div className='flex items-center gap-3 p-3 mt-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors'>
          <Shield className='text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-800'>Upgrade</h2>
        </div>
      </div>

      <div className='absolute bottom-24 w-[90%]'>
        <Progress value={33} />

        <p className='text-sm mt-1 text-gray-700'>2 out of 3 PDFs uploaded.</p>
        <p className='text-sm text-gray-400 mt-2'>
          Upgrade to upload more PDFs.
        </p>
      </div>
    </div>
  )
}

export default SideBar
