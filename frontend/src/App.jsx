import { useEffect, useRef, useState } from "react"
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom"

import SignIn from "./signin"
import SignUp from "./signup"
import Home from "./home"
import Dashboard from "./dashboard"
import Profile from "./profile"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate("/", { replace: true })
    setTimeout(() => {
      document.getElementById("live-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 200)
  }

  return (
    <div className="app-shell">
        <header className="site-header">
          <Link to="/" className="logo-mark">SmartStays</Link>
          <nav className="main-nav">
            <a href="/#destinations">Destinations</a>
            <a href="/#live-reviews">Reviews</a>
            {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
          </nav>
          <div className="nav-cta">
            <Link className="ghost-btn ghost-btn--light" to="/signup">Join</Link>
            <Link className="primary-chip" to="/signin">Sign in</Link>
            {isLoggedIn && (
              <button className="profile-chip" type="button" onClick={() => navigate("/profile")}>
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" alt="Saman Perera avatar" />
                <div className="profile-text">
                  <span className="profile-name">Saman P.</span>
                  <span className="profile-label">Explorer</span>
                </div>
              </button>
            )}
          </div>
        </header>
        <main className="view-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" replace />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} SmartStays Collection</span>
          <div className="footer-links">
            <a href="/#" aria-label="Instagram">Instagram</a>
            <a href="/#" aria-label="Pinterest">Pinterest</a>
            <a href="/#" aria-label="Contact">Contact</a>
          </div>
        </footer>
      </div>
  )
}

export default App
