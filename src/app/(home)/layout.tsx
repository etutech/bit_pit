import AppBar from "@/components/AppBar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <AppBar />
      {children}
    </div>
  )
}

export default HomeLayout
