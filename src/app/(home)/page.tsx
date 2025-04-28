import AppPage from "@/components/AppPage"
import { Metadata } from "next"
import KonvaEditor from "@/components/editor"

export const metadata: Metadata = {
  title: 'Bit Pit',
  description: 'blur blur blur',
}
const HomePage = () => {
  return (
    <AppPage className="p-8">
      <div className="bg-amber-100/40 mx-auto">
        <KonvaEditor />
      </div>
    </AppPage>
  )
}

export default HomePage
