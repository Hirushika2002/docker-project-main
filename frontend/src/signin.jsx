import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const socialProviders = [
    { name: "Google", icon: "G", className: "google" },
    { name: "Facebook", icon: "f", className: "facebook" }
];

function SignIn() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [feedback, setFeedback] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFeedback("Checking your details...");
            await axios.post("http://localhost:3000/signin", formData);
            setFeedback("");
            navigate("/#destinations");
        } catch (error) {
            if (error?.response?.status === 401) {
                setFeedback("Invalid email or password. Please try again.");
            } else {
                setFeedback("Unable to reach the server. Try again shortly.");
            }
        }
    };

    return (
        <div className="signin-layout">
            <section className="signin-visual">
                <div className="logo-lockup">
                    <span className="logo-icon">V</span>
                    <span className="logo-word">Vacation</span>
                </div>
                <div className="visual-illustration" aria-hidden="true"></div>
                <p className="visual-quote">
                    “The best things in life are the people we love, the places we’ve been, and the memories we’ve made
                    along the way.”
                </p>
            </section>
            <section className="signin-card">
                <div className="signin-head">
                    <h2>Sign in</h2>
                    <p>User privacy protected with concern</p>
                </div>
                <form onSubmit={handleSubmit} className="signin-form">
                    <label className="input-field">
                        <span>Email</span>
                        <div className="input-shell">
                            <input
                                type="text"
                                name="username"
                                placeholder="your@email.com"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <span className="input-icon" aria-hidden="true">@</span>
                        </div>
                    </label>
                    <label className="input-field">
                        <span>Password</span>
                        <div className="input-shell">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span className="input-icon" aria-hidden="true">●●</span>
                        </div>
                    </label>
                    <button className="signin-btn" type="submit">Log in</button>
                </form>
                {feedback && <p className="signin-feedback">{feedback}</p>}
                <button className="link-btn" type="button">Forgot your password?</button>
                <div className="divider">
                    <span>or</span>
                </div>
                <div className="social-grid">
                    {socialProviders.map(({ name, icon, className }) => (
                        <button key={name} type="button" className={`social-btn ${className}`}>
                            <span aria-hidden="true">{icon}</span>
                            Log in with {name}
                        </button>
                    ))}
                </div>
                <p className="signin-footer">
                    Don’t have an account? <Link to="/signup">Create one</Link>
                </p>
            </section>
        </div>
    );
}

export default SignIn;
