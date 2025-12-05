import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const socialProviders = [
  { name: "Google", icon: "G", className: "google" },
  { name: "Facebook", icon: "f", className: "facebook" }
];

const heroImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFeedback("Passwords do not match");
      return;
    }
    try {
      setFeedback("Creating your SmartStays profile...");
      await axios.post("http://localhost:3000/signup", {
        username: formData.email,
        password: formData.password,
      });
      navigate("/#destinations");
    } catch (error) {
      if (error?.response?.status === 409) {
        setFeedback("That email is already registered. Try signing in instead.");
        return;
      }
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-ref-layout">
      <section className="signup-visual-pane">
        <div className="signup-logo">
          <span className="logo-icon">S</span>
          SmartStays
        </div>
        <div className="signup-visual-card">
          <img src={heroImage} alt="Tropical beach at sunrise" />
        </div>
        <p className="signup-quote">
          “The best things in life are the people we love, the places we’ve been, and the memories we’ve made along the
          way.”
        </p>
      </section>
      <section className="signup-form-pane">
        <div className="signup-form-head">
          <h2>Sign up</h2>
          <p>User privacy protected with concern</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-field">
            Full Name
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>
          <label className="signup-field">
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className="signup-field">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label className="signup-field">
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
          <button className="signup-primary" type="submit">Sign Up</button>
        </form>
        {feedback && <p className="signup-feedback">{feedback}</p>}
        <p className="signup-login">Already have an account? <Link to="/signin">Log in</Link></p>
        <div className="signup-divider">Or</div>
        <div className="signup-social">
          {socialProviders.map(({ name, icon, className }) => (
            <button key={name} type="button" className={`social-btn ${className}`}>
              <span aria-hidden="true">{icon}</span>
              Sign up with {name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SignUp;