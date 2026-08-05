// react
import { Link } from "react-router-dom";

// hooks
import useAccounts from "../hooks/useAccounts";

// data
import { accountTypes } from "../constants/accountTypes";

//utils
import { formatCurrency } from "../utils/formatters";
import { totalBalanceByType } from "../utils/calculations";

export default function AccountTable({ type }) {
    const { accounts, handleDeleteAccount } = useAccounts();

    const filteredAccounts = accounts.filter(
        account => account.balance_type === type
    );

    return (
        <>
            <h2>{type === "asset" ? "Assets" : "Liabilities"}</h2>

            <p>
                Total: {formatCurrency(totalBalanceByType(accounts, type))}
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Balance</th>
                        <th>Account Type</th>
                        <th>Account Subtype</th>
                        <th>Last Updated</th>
                        <th>Visit Account</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAccounts.map(account => {

                        const lastUpdated = new Date(account.last_updated);

                        const selectedType = accountTypes.find(
                            type => type.id === account.account_type
                        );

                        const selectedSubtype = selectedType?.subtypes.find(
                            subtype => subtype.id === account.account_subtype
                        );


                        return (
                            <tr key={account.id}>
                                <td>
                                    <Link to={`/account/${account.id}/history`}>
                                        {account.name}
                                    </Link>
                                </td>

                                <td>
                                    {formatCurrency(account.balance)}
                                </td>

                                <td>
                                    {selectedType?.label ?? account.account_type}
                                </td>

                                <td>
                                    {selectedSubtype?.label ?? account.account_subtype}
                                </td>

                                <td>
                                    {lastUpdated.toLocaleDateString()}{" "}
                                    {lastUpdated.toLocaleTimeString()}
                                </td>

                                <td>
                                    {account.url && (
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            to={account.url}
                                        >
                                            Visit
                                        </Link>
                                    )}
                                </td>

                                <td>
                                    <Link to={`/account-form/${account.id}/edit`}>
                                        Edit
                                    </Link>

                                    {" | "}

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAccount(account.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}