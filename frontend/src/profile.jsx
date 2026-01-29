import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("account");
  
  // Handle URL section parameter
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);
  const [formData, setFormData] = useState({
    name: "Saman Perera",
    email: "saman.perera@email.com",
    phone: "+94 77 123 4567",
    dateOfBirth: "1990-05-15",
    address: "123 Main Street, Colombo 03, Sri Lanka",
    notifications: {
      bookingConfirmations: true,
      promotions: true,
      newsletters: false
    },
    language: "English",
    currency: "LKR"
  });

  const savedHotels = [
    { id: 1, name: "Vendol Maliga Edge", location: "Kandy", image: "/images/hotels/pexels-23audiovisual-28909289.jpg", price: "LKR 143,407" },
    { id: 2, name: "Harbour Luxe Suites", location: "Colombo", image: "/images/hotels/pexels-cottonbro-6466216.jpg", price: "LKR 189,000" },
    { id: 3, name: "Tea Estate Manor", location: "Nuwara Eliya", image: "/images/hotels/pexels-quang-nguyen-vinh-222549-29000012.jpg", price: "LKR 132,250" }
  ];

  const recentlyViewed = [
    { id: 4, name: "Sunset Boulevard Hotel", location: "Colombo", image: "/images/hotels/pexels-cottonbro-6466295.jpg", price: "LKR 121,400" },
    { id: 5, name: "Mist Valley Chalets", location: "Ella", image: "/images/hotels/pexels-aasif-pathan-321950386-31222661.jpg", price: "LKR 84,900" }
  ];

  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4532", expiry: "12/26", isDefault: true },
    { id: 2, type: "MasterCard", last4: "8901", expiry: "08/27", isDefault: false }
  ];

  const currentBookings = [
    {
      id: "ST-98341",
      hotel: "Vendol Maliga Edge",
      location: "Kandy",
      checkIn: "2025-12-20",
      checkOut: "2025-12-23",
      status: "Confirmed",
      total: "LKR 432,900"
    }
  ];

  const pastBookings = [
    {
      id: "ST-98211",
      hotel: "Sunset Boulevard Hotel",
      location: "Colombo",
      checkIn: "2025-11-04",
      checkOut: "2025-11-06",
      status: "Completed",
      total: "LKR 242,800"
    }
  ];

  const cancelledBookings = [
    {
      id: "ST-97403",
      hotel: "Tea Estate Manor",
      location: "Nuwara Eliya",
      checkIn: "2025-08-12",
      checkOut: "2025-08-16",
      status: "Cancelled",
      total: "LKR 528,000"
    }
  ];

  const loyaltyData = {
    points: 12450,
    tier: "Gold",
    nextTier: "Platinum",
    pointsToNextTier: 7550,
    benefits: ["10% off bookings", "Free breakfast", "Late checkout", "Room upgrades"]
  };

  const faqs = [
    { q: "How do I modify my booking?", a: "Go to My Bookings, select your reservation, and click 'Modify Booking'." },
    { q: "What is the cancellation policy?", a: "Most bookings can be cancelled up to 24 hours before check-in for a full refund." },
    { q: "How do I earn loyalty points?", a: "You earn 10 points for every LKR 1,000 spent on bookings." },
    { q: "Can I add special requests?", a: "Yes, during checkout or by contacting the hotel directly." }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }));
  };

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  const renderAccount = () => (
    <div className="profile-content">
      <h2>Account Information</h2>
      <p className="section-subtitle">Manage your personal details and profile photo</p>
      
      <div className="profile-photo-section">
        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" alt="Profile" className="profile-photo-large" />
        <button className="secondary-btn">Change Photo</button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
        </div>
        <div className="form-group full-width">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
      </div>

      <button className="primary-btn" onClick={handleSaveProfile}>Save Changes</button>
    </div>
  );

  const renderBookings = () => (
    <div className="profile-content">
      <h2>My Bookings</h2>
      <p className="section-subtitle">View and manage all your reservations</p>

      <div className="bookings-tabs">
        <h3>Current Bookings</h3>
        {currentBookings.length === 0 ? (
          <p className="empty-state">No current bookings</p>
        ) : (
          <div className="bookings-list">
            {currentBookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <h4>{booking.hotel}</h4>
                  <p>{booking.location} • {booking.checkIn} to {booking.checkOut}</p>
                </div>
                <div className="booking-actions-right">
                  <span className="status-badge confirmed">{booking.status}</span>
                  <strong>{booking.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3>Past Bookings</h3>
        {pastBookings.length === 0 ? (
          <p className="empty-state">No past bookings</p>
        ) : (
          <div className="bookings-list">
            {pastBookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <h4>{booking.hotel}</h4>
                  <p>{booking.location} • {booking.checkIn} to {booking.checkOut}</p>
                </div>
                <div className="booking-actions-right">
                  <span className="status-badge completed">{booking.status}</span>
                  <strong>{booking.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3>Cancelled Bookings</h3>
        {cancelledBookings.length === 0 ? (
          <p className="empty-state">No cancelled bookings</p>
        ) : (
          <div className="bookings-list">
            {cancelledBookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <h4>{booking.hotel}</h4>
                  <p>{booking.location} • {booking.checkIn} to {booking.checkOut}</p>
                </div>
                <div className="booking-actions-right">
                  <span className="status-badge cancelled">{booking.status}</span>
                  <strong>{booking.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSavedHotels = () => (
    <div className="profile-content">
      <h2>Saved Hotels</h2>
      <p className="section-subtitle">Your favorite properties and recently viewed</p>

      <h3>Favorites</h3>
      <div className="hotels-grid">
        {savedHotels.map(hotel => (
          <div key={hotel.id} className="hotel-card-mini">
            <img src={hotel.image} alt={hotel.name} />
            <div className="hotel-card-info">
              <h4>{hotel.name}</h4>
              <p>{hotel.location}</p>
              <strong>{hotel.price}</strong>
            </div>
            <button className="icon-btn">♥</button>
          </div>
        ))}
      </div>

      <h3>Recently Viewed</h3>
      <div className="hotels-grid">
        {recentlyViewed.map(hotel => (
          <div key={hotel.id} className="hotel-card-mini">
            <img src={hotel.image} alt={hotel.name} />
            <div className="hotel-card-info">
              <h4>{hotel.name}</h4>
              <p>{hotel.location}</p>
              <strong>{hotel.price}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="profile-content">
      <h2>Payment Methods</h2>
      <p className="section-subtitle">Manage your saved cards and payment options</p>

      <div className="payment-methods-list">
        {paymentMethods.map(card => (
          <div key={card.id} className="payment-card">
            <div className="payment-info">
              <span className="card-type">{card.type}</span>
              <span className="card-number">•••• {card.last4}</span>
              <span className="card-expiry">Expires {card.expiry}</span>
            </div>
            <div className="payment-actions">
              {card.isDefault && <span className="default-badge">Default</span>}
              <button className="link-btn">Edit</button>
              <button className="link-danger">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <button className="secondary-btn">+ Add New Card</button>
    </div>
  );

  const renderSettings = () => (
    <div className="profile-content">
      <h2>Settings</h2>
      <p className="section-subtitle">Update your preferences and security settings</p>

      <div className="settings-section">
        <h3>Email Notifications</h3>
        <div className="settings-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.notifications.bookingConfirmations}
              onChange={() => handleNotificationChange("bookingConfirmations")}
            />
            <span>Booking confirmations and updates</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.notifications.promotions}
              onChange={() => handleNotificationChange("promotions")}
            />
            <span>Special offers and promotions</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.notifications.newsletters}
              onChange={() => handleNotificationChange("newsletters")}
            />
            <span>Travel tips and newsletters</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Language & Currency</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Language</label>
            <select name="language" value={formData.language} onChange={handleInputChange}>
              <option>English</option>
              <option>සිංහල (Sinhala)</option>
              <option>தமிழ் (Tamil)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select name="currency" value={formData.currency} onChange={handleInputChange}>
              <option>LKR - Sri Lankan Rupee</option>
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Security</h3>
        <button className="secondary-btn">Change Password</button>
      </div>

      <button className="primary-btn" onClick={handleSaveProfile}>Save Settings</button>
    </div>
  );

  const renderLoyalty = () => (
    <div className="profile-content">
      <h2>Loyalty & Rewards</h2>
      <p className="section-subtitle">Track your points and member benefits</p>

      <div className="loyalty-card">
        <div className="loyalty-header">
          <h3>{loyaltyData.tier} Member</h3>
          <span className="points-badge">{loyaltyData.points.toLocaleString()} Points</span>
        </div>
        <div className="loyalty-progress">
          <p>Progress to {loyaltyData.nextTier}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNextTier)) * 100}%` }}></div>
          </div>
          <p className="progress-text">{loyaltyData.pointsToNextTier.toLocaleString()} points to {loyaltyData.nextTier}</p>
        </div>
      </div>

      <div className="benefits-section">
        <h3>Your Benefits</h3>
        <div className="benefits-grid">
          {loyaltyData.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="special-offers">
        <h3>Special Offers</h3>
        <div className="offer-card">
          <h4>Winter Getaway Special</h4>
          <p>Save 20% on all bookings in Nuwara Eliya</p>
          <button className="secondary-btn">View Offer</button>
        </div>
        <div className="offer-card">
          <h4>Birthday Bonus</h4>
          <p>Earn double points on your birthday month</p>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="profile-content">
      <h2>Help & Support</h2>
      <p className="section-subtitle">Get answers and contact our team</p>

      <div className="help-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={index} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="contact-section">
        <h3>Contact Support</h3>
        <div className="contact-methods">
          <div className="contact-card">
            <span className="contact-icon">📧</span>
            <h4>Email Us</h4>
            <p>support@smartstays.com</p>
            <p className="contact-meta">Response within 24 hours</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">📞</span>
            <h4>Call Us</h4>
            <p>+94 11 234 5678</p>
            <p className="contact-meta">Mon-Fri, 9am-6pm</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">💬</span>
            <h4>Live Chat</h4>
            <button className="secondary-btn">Start Chat</button>
            <p className="contact-meta">Available now</p>
          </div>
        </div>
      </div>

      <div className="legal-section">
        <h3>Legal & Policies</h3>
        <div className="legal-links">
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Cancellation Policy</a>
        </div>
      </div>
    </div>
  );

  const menuItems = [
    { id: "account", icon: "👤", label: "Account", description: "Personal info & settings" },
    { id: "bookings", icon: "🏨", label: "My Bookings", description: "Current, past & cancelled" },
    { id: "saved", icon: "♥", label: "Saved Hotels", description: "Favorites & recently viewed" },
    { id: "payment", icon: "💳", label: "Payment Methods", description: "Cards & payment options" },
    { id: "settings", icon: "⚙", label: "Settings", description: "Notifications & preferences" },
    { id: "loyalty", icon: "⭐", label: "Loyalty & Rewards", description: "Points & special offers" },
    { id: "help", icon: "❓", label: "Help & Support", description: "FAQs & contact us" }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <nav className="profile-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`profile-nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-text">
                  <span className="nav-label">{item.label}</span>
                  <small>{item.description}</small>
                </div>
              </button>
            ))}
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">⇦</span>
            <div className="nav-text">
              <span className="nav-label">Log Out</span>
              <small>Sign out securely</small>
            </div>
          </button>
        </aside>

        <main className="profile-main">
          {activeSection === "account" && renderAccount()}
          {activeSection === "bookings" && renderBookings()}
          {activeSection === "saved" && renderSavedHotels()}
          {activeSection === "payment" && renderPaymentMethods()}
          {activeSection === "settings" && renderSettings()}
          {activeSection === "loyalty" && renderLoyalty()}
          {activeSection === "help" && renderHelp()}
        </main>
      </div>
    </div>
  );
}

export default Profile;
