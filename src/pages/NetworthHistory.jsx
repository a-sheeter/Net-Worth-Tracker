// react
import { Fragment, useState, useEffect } from "react";

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
                                <th>Net Worth</th>
                                <th>Assets</th>
                                <th>Liabilities</th>
                                <th>Timestamp</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {networthHistory.map(networth => {
                                const timestamp = new Date(networth.created_at);
                                const isExpanded = expandedSnapshot === networth.id;

                                return (
                                    <Fragment key={networth.id}>
                                        <tr>
                                            <td className="green-text" data-label="Net Worth">{formatCurrency(networth.networth_total)}</td>
                                            <td data-label="Assets">{formatCurrency(networth.asset_total)}</td>
                                            <td data-label="Liabilities">{formatCurrency(networth.liability_total)}</td>
                                            <td data-label="Timestamp">{timestamp.toLocaleDateString()}{" "}{timestamp.toLocaleTimeString()}</td>
                                            <td data-label="Details"><Button type="button" className="accordion-btn" onClick={() => getAccountHistory(networth.id)}>{isExpanded ? "Collapse" : "Expand"}</Button></td>
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
                                                                <tr>
                                                                    <td data-label="Account">{account.account_name}</td>
                                                                    <td data-label="Type">{account.balance_type}</td>
                                                                    <td data-label="Balance">
                                                                        {formatCurrency(account.balance)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )

}