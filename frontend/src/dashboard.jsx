import { useMemo, useState } from "react";

const sampleBookings = [
  {
    id: "ST-98341",
    hotel: "Vendol Maliga Edge",
    location: "Kandy, Sri Lanka",
    roomType: "Skyline Suite",
    guests: 2,
    nights: 3,
    checkIn: "2025-12-20",
    checkOut: "2025-12-23",
    status: "confirmed",
    total: "LKR 432,900",
    confirmation: "CNF91822",
    specialRequests: "Late check-in, welcome tea",
    paymentMethod: "Card on file"
  },
  {
    id: "ST-98211",
    hotel: "Sunset Boulevard Hotel",
    location: "Colombo, Sri Lanka",
    roomType: "Ocean Loft",
    guests: 1,
    nights: 2,
    checkIn: "2025-11-04",
    checkOut: "2025-11-06",
    status: "completed",
    total: "LKR 242,800",
    confirmation: "CNF90110",
    specialRequests: "Airport transfer",
    paymentMethod: "Pay online"
  },
  {
    id: "ST-97403",
    hotel: "Tea Estate Manor",
    location: "Nuwara Eliya, Sri Lanka",
    roomType: "Garden Villa",
    guests: 4,
    nights: 4,
    checkIn: "2025-08-12",
    checkOut: "2025-08-16",
    status: "cancelled",
    total: "LKR 528,000",
    confirmation: "CNF87102",
    specialRequests: "Connecting rooms",
    paymentMethod: "Cash on arrival"
  }
];

function Dashboard() {
  const [bookings, setBookings] = useState(sampleBookings);
  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => ["confirmed", "reserved"].includes(booking.status));
    const past = bookings.filter((booking) => ["completed", "cancelled"].includes(booking.status));
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      past: past.length
    };
  }, [bookings]);

  const upcomingBookings = bookings.filter((booking) => ["confirmed", "reserved"].includes(booking.status));
  const historyBookings = bookings.filter((booking) => ["completed", "cancelled"].includes(booking.status));

  const handleCancel = (bookingId) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId && booking.status === "confirmed"
          ? { ...booking, status: "cancelled" }
          : booking
      )
    );
  };

  const handleModify = (bookingId) => {
    alert(`Modification flow coming soon for ${bookingId}.`);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Your stays</p>
          <h1>Manage every reservation in one dashboard.</h1>
        </div>
        <button type="button" className="ghost-btn">Download itinerary</button>
      </header>

      <section className="dashboard-stats">
        <article>
          <span>Total bookings</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>Upcoming stays</span>
          <strong>{stats.upcoming}</strong>
        </article>
        <article>
          <span>Past / cancelled</span>
          <strong>{stats.past}</strong>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Upcoming stays</h2>
            <p>Need to change a guest, request an upgrade, or cancel? Do it here.</p>
          </div>
        </div>
        {upcomingBookings.length === 0 ? (
          <p className="dashboard-empty">No upcoming stays yet. Plan your next trip from the home page.</p>
        ) : (
          <div className="booking-grid">
            {upcomingBookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card-head">
                  <div>
                    <p className="booking-hotel">{booking.hotel}</p>
                    <p className="booking-meta">{booking.location}</p>
                  </div>
                  <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="booking-details">
                  <div>
                    <span>Check-in</span>
                    <strong>{booking.checkIn}</strong>
                  </div>
                  <div>
                    <span>Check-out</span>
                    <strong>{booking.checkOut}</strong>
                  </div>
                  <div>
                    <span>Nights</span>
                    <strong>{booking.nights}</strong>
                  </div>
                  <div>
                    <span>Guests</span>
                    <strong>{booking.guests}</strong>
                  </div>
                  <div>
                    <span>Room</span>
                    <strong>{booking.roomType}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{booking.total}</strong>
                  </div>
                </div>
                <div className="booking-footer">
                  <div>
                    <p>Confirmation</p>
                    <strong>{booking.confirmation}</strong>
                  </div>
                  <div className="booking-actions">
                    <button type="button" className="ghost-btn" onClick={() => handleModify(booking.id)}>Modify</button>
                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => handleCancel(booking.id)}
                      disabled={booking.status !== "confirmed"}
                    >
                      Cancel booking
                    </button>
                  </div>
                </div>
                <p className="booking-note">Special requests: {booking.specialRequests || "None"}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Booking history</h2>
            <p>Completed and cancelled stays remain visible for your records.</p>
          </div>
        </div>
        {historyBookings.length === 0 ? (
          <p className="dashboard-empty">No previous stays logged yet.</p>
        ) : (
          <div className="history-list">
            {historyBookings.map((booking) => (
              <article className="history-row" key={booking.id}>
                <div>
                  <p className="booking-hotel">{booking.hotel}</p>
                  <p className="booking-meta">{booking.checkIn} → {booking.checkOut}</p>
                </div>
                <div className="history-meta">
                  <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                  <strong>{booking.total}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
