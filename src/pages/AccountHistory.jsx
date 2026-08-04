import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { supabase } from "../utils/supabase";
import useUser from "../hooks/useUser";
import { formatCurrency } from "../utils/formatters";

import NavBar from "../components/NavBar";


export default function AccountHistory() {

    const { accountId } = useParams();
    const { user } = useUser();

    /* --- State --- */
    const [account, setAccount] = useState(null);
    const [snapshots, setSnapshots] = useState([]);

    /* --- Effects --- */
    useEffect(() => {
        async function getAccountData() {

            if (!user) return;

            //Get account data
            const { data: accountData, error: accountError } = await supabase
                .from("accounts")
                .select("*")
                .eq("id", accountId)
                .eq("user_id", user.id)
                .single();

            if (accountError) {
                console.log(accountError);
                return;
            }

            setAccount(accountData);

            //Get account history
            const { data: snapshotData, error: snapshotError } = await supabase
                .from("account_snapshots")
                .select("*")
                .eq("account_id", accountId)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (snapshotError) {
                console.log(snapshotError);
                return;
            }

            setSnapshots(snapshotData);
        }

        getAccountData();

    }, [user, accountId]);


    /* --- Render --- */
    return (
        <>
        <NavBar/>

            <h1>{account?.name ?? "Account History"}</h1>
            <Link to="/accounts">Back to Accounts</Link>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Balance</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>

                <tbody>
                    {snapshots.map(snapshot => {
                        const timestamp = new Date(snapshot.created_at);
                        return (
                        <tr key={snapshot.id}>
                            <td>
                                {snapshot.account_name}
                            </td>

                            <td>
                                {formatCurrency(snapshot.balance)}
                            </td>

                            <td>
                                {timestamp.toLocaleDateString()}{" "}{timestamp.toLocaleTimeString()}
                            </td>
                        </tr>
                    )
})}
                </tbody>
            </table>
        </>
    )
}