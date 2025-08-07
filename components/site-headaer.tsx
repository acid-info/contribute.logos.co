import { Typography } from '@acid-info/lsd-react/client/Typography'
import ThemeToggle from './theme-toggle'

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Typography>Header</Typography>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
