// react
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// hooks
import useAccounts from "../hooks/useAccounts";

// components
import NavBar from "../components/NavBar";

// data
import { accountTypes } from "../constants/accountTypes";

//utils
import { formatCurrency } from "../utils/formatters";
import { totalBalanceByType } from "../utils/calculations";
import { supabase } from "../utils/supabase";


export default function UpdateNetworth() {

    /* --- State --- */
    const {
        accounts,
        getAccounts
    } = useAccounts();

    const [successMessage, setSuccessMessage] = useState('');

    const [updatedBalances, setUpdatedBalances] = useState({});

    /* --- Effects --- */
    useEffect(() => {
        document.title = "Update Net Worth | Net Worth Tracker";
    }, []);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 3000);

        return () => clearTimeout(timer);
    }), [successMessage];

    /* --- Handlers --- */
    function handleBalanceChange(accountId, value) {
        setUpdatedBalances(prev => ({
            ...prev,
            [accountId]: value
        }));
    }

    async function updateAccounts(accounts) {
        for (const account of accounts) {
            const { error } = await supabase
                .from("accounts")
                .update({
                    balance: account.balance,
                    last_updated: new Date().toISOString()
                })
                .eq("id", account.id);

            if (error) {
                console.log(error);
                return;
            }
        }
    }

    async function createNetworthSnapshot(accounts) {
        const assetTotal = totalBalanceByType(accounts, "asset");
        const liabilityTotal = totalBalanceByType(accounts, "liability");

        const { data, error } = await supabase
            .from("networth_snapshots")
            .insert({
                asset_total: assetTotal,
                liability_total: liabilityTotal,
                networth_total: assetTotal - liabilityTotal
            })
            .select()
            .single();

        if (error) throw error;

        return data.id;
    }

    async function createAccountSnapshots(accounts, snapshotId) {
        const snapshotRows = accounts.map(account => ({
            snapshot_id: snapshotId,
            account_id: account.id,
            account_name: account.name,
            balance: account.balance,
            balance_type: account.balance_type,
            account_type: account.account_type
        }));

        const { error } = await supabase
            .from("account_snapshots")
            .insert(snapshotRows);

        if (error) throw error;
    }

    async function handleUpdateNetworth(e) {
        e.preventDefault();

        setSuccessMessage('');

        try {
            //Build final account balances
            const snapshotAccounts = accounts.map(account => ({
                ...account,
                balance: Number(updatedBalances[account.id] ?? account.balance)
            }));

            //update current acounts table
            await updateAccounts(snapshotAccounts);

            //create networth snapshot id
            const snapshotId = await createNetworthSnapshot(snapshotAccounts);

            //create account snapshots
            await createAccountSnapshots(snapshotAccounts, snapshotId);

            //refresh UI
            await getAccounts();

            setUpdatedBalances({});
            setSuccessMessage("Your net worth was successfully updated!");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <NavBar />
            <h1>Update Net Worth</h1> <button type="button"><Link to="/">Back to Dashboard</Link></button>
            <form onSubmit={handleUpdateNetworth}>
                <h2>Assets</h2>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Balance</td>
                            <td>Last Updated</td>
                            <td>New Balance</td>
                        </tr>
                    </thead>
                    <tbody>

                        {accounts.map(account => {
                            const lastUpdated = new Date(account.last_updated);

                            if (account.balance_type === "asset") {
                                return (
                                    <tr key={account.id}>
                                        <td>{account.name}</td>
                                        <td>{formatCurrency(account.balance)}</td>
                                        <td>{lastUpdated.toLocaleDateString()}{" "} {lastUpdated.toLocaleTimeString()}</td>
                                        <td><input
                                            type="number"
                                            value={updatedBalances[account.id] ?? account.balance}

                                            onChange={(e) => handleBalanceChange(account.id, e.target.value)}
                                        /></td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>

                <h2>Liabilities</h2>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Balance</td>
                            <td>Last Updated</td>
                            <td>New Balance</td>
                        </tr>
                    </thead>
                    <tbody>

                        {accounts.map(account => {
                            const lastUpdated = new Date(account.last_updated);

                            if (account.balance_type === "liability") {
                                return (
                                    <tr key={account.id}>
                                        <td>{account.name}</td>
                                        <td>{formatCurrency(account.balance)}</td>
                                        <td>{lastUpdated.toLocaleDateString()}{" "} {lastUpdated.toLocaleTimeString()}</td>
                                        <td><input
                                            type="number"
                                            value={updatedBalances[account.id] ?? account.balance}

                                            onChange={(e) => handleBalanceChange(account.id, e.target.value)}
                                        /></td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>

                <button type="submit">Update Net Worth</button>
            </form>
            <p>{successMessage}</p>
        </>
    )
}