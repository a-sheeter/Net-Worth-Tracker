import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../utils/supabase";
import Button from "../components/Button";

export default function Register() {
    /* --- Effects --- */
    useEffect(() => {
        document.title = "Register | Net Worth Tracker";
    }, []);

    /* --- State --- */
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /* --- Helpers --- */
    function resetForm() {
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
    }

    function resetHelperMessage() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    async function handleRegister(e) {
        e.preventDefault();

        resetHelperMessage();

        //create authenticated user
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        const user = data.user;

        //insert into profiles table 
        if (user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    name,
                    username
                });

            if (profileError) {
                setErrorMessage(profileError.message);
                return;
            }
        }
        resetForm();

        setSuccessMessage("Account created successfully! You can now login.");
    }

    return (
        <div className="center-all">
            <div className="small-max-width">
                <h4 className="text-align-center l-text">Register User</h4>
                <h1 className="green-text text-align-center xl-text">Net Worth<br /> Tracker</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p className="text-align-center">Already have an account? <Link to="/login">Log In</Link></p>
                    <Button type="submit" className="green-btn">Create Account</Button>
                </form>
                <p>{successMessage}</p>
                <p>{errorMessage}</p>
            </div>
        </div>
    )
}