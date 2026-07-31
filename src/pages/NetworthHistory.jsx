// react
import { useState, useEffect } from "react";

// utils
import { supabase } from "../utils/supabase";
import { formatCurrency } from "../utils/formatters";

// components
import NavBar from "../components/NavBar";

// hooks
import useUser from "../hooks/useUser";

export default function NetworthHistory() {
    const { user } = useUser();

    /* --- STATE --- */
    const [networthHistory, setNetWorthHistory] = useState([]);


    /* --- EFFECTS --- */
    useEffect(() => {
        if (!user) return;
        getNetworthHistory();
    }, [user]);

    /* --- FUNCTIONS --- */
    async function getNetworthHistory() {

        const { data, error } = await supabase
            .from("networth_snapshots")
            .select("*")
            .eq("user_id", user.id)

        if (error) {
            console.log(error);
            return;
        }

        setNetWorthHistory(data);
    }

    async function getAccountHistory(id) {

        console.log(id)

        const { data, error} = await supabase
            .from("account_snapshots")
            .select("*")
            .eq("snapshot_id", id)

        if (error) {
            console.log(error);
            return;
        }

        console.log(data)
    }


    /* --- RENDER --- */
    return (
        <>
        <NavBar/>
            <table>
                <thead>
                    <tr>
                        <td>Net Worth</td>
                        <td>Assets</td>
                        <td>Liabilities</td>
                        <td>Timestamp</td>
                        <td>Details</td>
                    </tr>
                </thead>
                <tbody>
                    {networthHistory.map(networth => {
                        const timestamp = new Date(networth.created_at);

                        return (
                            <tr key={networth.id}>
                                <td>{formatCurrency(networth.networth_total)}</td>
                                <td>{formatCurrency(networth.asset_total)}</td>
                                <td>{formatCurrency(networth.liability_total)}</td>
                                <td>{timestamp.toLocaleTimeString()}</td>
                                <td><button onClick={() => getAccountHistory(networth.id)}>Expand</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>
    )

}