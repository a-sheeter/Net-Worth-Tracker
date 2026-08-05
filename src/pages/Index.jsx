// react
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// hooks
import useAccounts from "../hooks/useAccounts";
import useUser from "../hooks/useUser";

// components
import NavBar from "../components/NavBar";

//utils
import { formatCurrency } from "../utils/formatters";
import { totalBalanceByType, totalNetWorth } from "../utils/calculations";
import { supabase } from "../utils/supabase";

export default function Index() {
    const today = new Date();
    const { user } = useUser();

    /* --- effects --- */
    useEffect(() => {
        getProfile();
    }, [user]);

    /* --- state --- */
    const { accounts, handleDeleteAccount } = useAccounts();
    const [profile, setProfile] = useState(null);
    const [firstName, setFirstName] = useState('');

    /* --- function --- */
    async function getProfile() {
        if (!user) return;

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) {
            console.log(error);
            return;
        }

        setProfile(data);
        setFirstName(data.name.split(" ")[0])
        console.log(data);
    }

    /* --- Render --- */
    return (
        <>
            <NavBar />
            <h1>NET WORTH TRACKER</h1>
            <p>Hello, {firstName}!</p>
            <p>Today is: {today.toLocaleDateString()}</p>

            <p>Net Worth: {formatCurrency(totalNetWorth(accounts))}
            </p>
            <button><Link to="/update-networth">Update Net Worth</Link></button>
            <button><Link to="/networth-history">Net Worth History</Link></button>
            <p>Assets: {formatCurrency(totalBalanceByType(accounts, "asset"))}
            </p><button><Link to="/assets">View details</Link></button>
            <p>Assets: {formatCurrency(totalBalanceByType(accounts, "liability"))}
            </p><button><Link to="/liabilities">View details</Link></button>
        </>
    )
}