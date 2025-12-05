import { useEffect, useRef, useState } from "react"
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom"

import SignIn from "./signin"
import SignUp from "./signup"
import Home from "./home"
import Dashboard from "./dashboard"

function App() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowProfileMenu(false)
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
              <div className="profile-wrapper" ref={profileRef}>
                <button className="profile-chip" type="button" onClick={() => setShowProfileMenu((prev) => !prev)}>
                  <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" alt="Saman Perera avatar" />
                  <div className="profile-text">
                    <span className="profile-name">Saman P.</span>
                    <span className="profile-label">Explorer</span>
                  </div>
                  <span className="profile-caret" aria-hidden="true">▾</span>
                </button>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <button type="button">
                      <span>≡</span>
                      Account
                    </button>
                    <button type="button">
                      <span>⚙</span>
                      Settings
                    </button>
                    <button type="button" onClick={() => { navigate("/dashboard"); setShowProfileMenu(false); }}>
                      <span>🧳</span>
                      Dashboard
                    </button>
                    <button type="button" className="logout" onClick={handleLogout}>
                      <span>⇦</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <main className="view-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" replace />} />
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
