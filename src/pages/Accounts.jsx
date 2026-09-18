// react
import { useEffect } from "react";

// components
import NavBar from "../components/NavBar";
import AccountTable from "../components/AccountTable";
import Button from "../components/Button";

// Render
export default function Accounts() {


    /* --- Effects --- */
    useEffect(() => {
        document.title = "Accounts | Net Worth Tracker";
    }, []);

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="horizontal-inline"><h1>Your Accounts</h1><Button type="button" className="green-btn">Add New Account</Button></div>
                <AccountTable type="asset" />
                <AccountTable type="liability" />
            </div>
        </>
    )
}
