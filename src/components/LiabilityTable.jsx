// react
import { Link } from "react-router-dom";

// hooks
import useAccounts from "../hooks/useAccounts";
import useUser from "../hooks/useUser";

// data
import { accountTypes } from "../constants/accountTypes";

//utils 
import { formatCurrency } from "../utils/formatters";
import { totalBalanceByType } from "../utils/calculations";
import { supabase } from "../utils/supabase";

export default function LiabilityTable() {

    /* --- State --- */
    const {
        accounts,
        handleDeleteAccount
    } = useAccounts();

    const { user } = useUser();

     /* --- functions --- */
     async function getAccountSnapshots(accountId) {

        if (!user) return;

        const {data, error} = await supabase
            .from("account_snapshots")
            .select("*")
            .eq("user_id", user.id)
            .eq("account_id", accountId)

        if (error) {
            console.log(error)
        }

        console.log(data);
     }


    return (
        <>
            <h2>Liabilities</h2>
            <p>Total: {formatCurrency(totalBalanceByType(accounts, "liability"))}</p>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Balance</td>
                        <td>Account Type</td>
                        <td>Account Subtype</td>
                        <td>Last Updated</td>
                        <td>Visit Account</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => {
                        const lastUpdated = new Date(account.last_updated);

                        const selectedType = accountTypes.find(
                            type => type.id === account.account_type
                        );

                        const selectedSubtype = selectedType.subtypes.find(
                            subtype => subtype.id === account.account_subtype
                        );

                        if (account.balance_type === "liability") {
                            return (
                                <tr key={account.id}>
                                    <td><button onClick={() => getAccountSnapshots(account.id)}>{account.name}</button></td>
                                    <td>{formatCurrency(account.balance)}</td>
                                    <td>{selectedType?.label ?? account.account_type}</td>
                                    <td>{selectedSubtype?.label ?? account.account_subtype}</td>
                                    <td>{lastUpdated.toLocaleDateString()}{" "} {lastUpdated.toLocaleTimeString()}</td>
                                    <td><Link target="_blank" to={account.url}>{account.name}</Link></td>
                                    <td><button
                                        type="button"
                                        onClick={() => navigate(`/account-form/${account.id}/edit`)}
                                    >Edit</button> | <button type="button" onClick={() => handleDeleteAccount(account.id)}>Delete</button></td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        </>
    )
}