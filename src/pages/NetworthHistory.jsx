// react
import { useState, useEffect } from "react";

// utils
import { supabase } from "../utils/supabase";
import { formatCurrency } from "../utils/formatters";

// components
import NavBar from "../components/NavBar";

// hooks
import useUser from "../hooks/useUser";
import Button from "../components/Button";

export default function NetworthHistory() {
    const { user } = useUser();

    /* --- STATE --- */
    const [networthHistory, setNetWorthHistory] = useState([]);

    const [expandedSnapshot, setExpandedSnapshot] = useState(null);
    const [accountHistory, setAccountHistory] = useState([]);

    /* --- EFFECTS --- */
    useEffect(() => {
        document.title = "Net Worth History | Net Worth Tracker";
    }, []);

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

        if (expandedSnapshot === id) {
            setExpandedSnapshot(null);
            setAccountHistory([]);
            return;
        }

        const { data, error } = await supabase
            .from("account_snapshots")
            .select("*")
            .eq("snapshot_id", id)

        if (error) {
            console.log(error);
            return;
        }

        setAccountHistory(data);
        setExpandedSnapshot(id);
    }


    /* --- RENDER --- */
    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <h1>Net Worth History</h1>
                <div className="container-fluid">
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
                                const isExpanded = expandedSnapshot === networth.id;

                                return (
                                    <>
                                        <tr key={networth.id}>
                                            <td>{formatCurrency(networth.networth_total)}</td>
                                            <td>{formatCurrency(networth.asset_total)}</td>
                                            <td>{formatCurrency(networth.liability_total)}</td>
                                            <td>{timestamp.toLocaleDateString()}{" "}{timestamp.toLocaleTimeString()}</td>
                                            <td><Button type="button" className="accordion-btn" onClick={() => getAccountHistory(networth.id)}>{isExpanded ? "Collapse" : "Expand"}</Button></td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="5">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className="green-text">Account</th>
                                                                <th className="green-text">Type</th>
                                                                <th className="green-text">Balance</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {accountHistory.map(account => (
                                                                <tr key={account.id}>
                                                                    <td>{account.account_name}</td>
                                                                    <td>{account.balance_type}</td>
                                                                    <td>
                                                                        {formatCurrency(account.balance)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )

}