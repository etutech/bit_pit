import Logo from "./ui/Logo"
import ThemeSwitcher from "./ui/ThemeSwitcher"

const AppBar = () => {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-xs sticky top-0 z-50 shadow-sm">
      <Logo path="/" title="Bit Pit" />
      <div className="ml-auto">
        <ThemeSwitcher />
      </div>
    </div>
  )
}

export default AppBar
