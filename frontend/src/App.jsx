import React from 'react'
import NavBar from './Components/NavBar'
import NavRoutes from './Routes/NavRoutes'
import FooterPage from './Pages/FooterPage'


const App = () => {
  return (
    <div>
    
      {/* Navbar */}
      <NavBar />

      {/* Navbar routes */}
      <NavRoutes />

      {/* Footer  */}
      <FooterPage />
    </div>
  )
}

export default App
