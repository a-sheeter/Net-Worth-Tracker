import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../utils/supabase";
import Button from "../components/Button";

export default function Login() {
    /* --- Effect --- */
    useEffect(() => {
        document.title = "Login | Net Worth Tracker"
    }, []);

    /* --- State --- */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    /* --- Helpers --- */
    function resetForm() {
        setEmail("");
        setPassword("");
    }

    async function handleLogin(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setErrorMessage(error.message);
            console.log(error.message);
        } else {
            console.log("Successfully logged in!");
        }

    }

    /* --- Render --- */
    return (
        <div className="center-all">
            <div className="small-max-width">
                <h4 className="text-align-center l-text">Welcome to the</h4>
                <h1 className="green-text text-align-center xl-text">Net Worth<br /> Tracker</h1>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete={email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        autoComplete={password}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-align-center">Don't have an account? <Link to="/register">Register Now</Link></p>
                    <Button type="submit" className="green-btn">Log In</Button>
                </form>
                <p className="error-text">{errorMessage}</p>
            </div>
        </div>
    )
}