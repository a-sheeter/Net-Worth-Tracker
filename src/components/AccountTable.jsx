// react
import { Link } from "react-router-dom";

// hooks
import useAccounts from "../hooks/useAccounts";

// data
import { accountTypes } from "../constants/accountTypes";

//utils
import { formatCurrency } from "../utils/formatters";
import { totalBalanceByType } from "../utils/calculations";
import Button from "./Button";

export default function AccountTable({ type }) {
    const { accounts, handleDeleteAccount } = useAccounts();

    const filteredAccounts = accounts.filter(
        account => account.balance_type === type
    );

    return (
        <div className="container-fluid">
            <h2 className="green-text">{type === "asset" ? "Assets" : "Liabilities"}</h2>

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
                                <td data-label="Name">
                                    <Link to={`/account/${account.id}/history`}>
                                        {account.name}
                                    </Link>
                                </td>

                                <td data-label="Balance">
                                    {formatCurrency(account.balance)}
                                </td>

                                <td data-label="Account Type">
                                    {selectedType?.label ?? account.account_type}
                                </td>

                                <td data-label="Account Subtype">
                                    {selectedSubtype?.label ?? account.account_subtype}
                                </td>

                                <td data-label="Last Updated">
                                    {lastUpdated.toLocaleDateString()}{" "}
                                    {lastUpdated.toLocaleTimeString()}
                                </td>

                                <td data-label="Visit Account">
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

                                <td data-label="Actions">
                                    <div>
                                    <Link to={`/account-form/${account.id}/edit`}>
                                        Edit
                                    </Link>

                                    {" | "}

                                    <Button
                                        type="button"
                                        className="link-btn"
                                        onClick={() => handleDeleteAccount(account.id)}
                                    >
                                        Delete
                                    </Button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}