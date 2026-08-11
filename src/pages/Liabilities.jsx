// react
import { useEffect } from "react";

// hooks
import useAccounts from "../hooks/useAccounts";

// components
import NavBar from "../components/NavBar";
import AccountTable from "../components/AccountTable";
import Button from "../components/Button";

// Render
export default function Accounts() {

    /* --- State --- */
    const {
        accounts,
        handleDeleteAccount
    } = useAccounts();

    /* --- Effects --- */
    useEffect(() => {
        document.title = "Liabilities | Net Worth Tracker";
    }, []);

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="horizontal-inline"><h1>Your Accounts</h1><Button type="button" className="green-btn">Add New Account</Button></div>
                <AccountTable type="liability" />
            </div>
        </>
    )
}