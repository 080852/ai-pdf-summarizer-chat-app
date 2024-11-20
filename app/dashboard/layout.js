import SideBar from './_components/SideBar'

function DashboardLayout({children}) {
  return (
    <div>
        <div>
            <SideBar/>
        </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
