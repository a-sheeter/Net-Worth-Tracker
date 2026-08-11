// react
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// hooks
import useUser from "../hooks/useUser";

// components
import NavBar from "../components/NavBar";

// constants
import { accountTypes } from "../constants/accountTypes";

// utils
import { supabase } from "../utils/supabase";
import { formatCurrency } from "../utils/formatters";
import Button from "../components/Button";

export default function AccountForm() {

    // consts
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUser();

    const isEditing = Boolean(id);

    /* --- Effect --- */
    useEffect(() => {
        document.title = "Add Account | Net Worth Tracker";
    }, []);

    useEffect(() => {
        if (isEditing) {
            getAccount();
        }
    }, [id]);

    /* --- State --- */
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState("");
    const [subtypeId, setSubtypeId] = useState("");
    const [url, setUrl] = useState("");
    const [balance, setBalance] = useState("");

    const selectedType = accountTypes.find(
        type => type.id === typeId
    );

    const balanceType = selectedType?.balanceType;

    /* --- Errors --- */
    const [errorMessage, setErrorMessage] = useState("");

    /* --- Form --- */
    function resetForm() {
        setName("");
        setTypeId("");
        setSubtypeId("");
        setUrl("");
        setBalance("");
    }

    /* --- get account --- */
    async function getAccount() {
        const { data, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            return;
        }

        setName(data.name);
        setUrl(data.url);
        setBalance(data.balance);
        setTypeId(data.account_type);
        setSubtypeId(data.account_subtype);
    }

    /* --- Handlers --- */
    async function handleSubmit(e) {
        e.preventDefault();

        setErrorMessage("");

        if (isEditing) {
            const { editError } = await supabase
                .from("accounts")
                .update({
                    name: name,
                    account_type: typeId,
                    account_subtype: subtypeId,
                    url: url,
                    balance_type: balanceType,
                    last_updated: new Date().toISOString()
                })
                .eq("id", id);

            if (editError) {
                setErrorMessage(editError.message);
                return;
            }
        } else {
            const { newError } = await supabase
                .from("accounts")
                .insert([
                    {
                        user_id: user.id,
                        name: name,
                        account_type: typeId,
                        account_subtype: subtypeId,
                        url: url,
                        balance: balance,
                        balance_type: balanceType
                    }
                ]);
            if (newError) {
                setErrorMessage(newError.message);
                return;
            }
        }
        resetForm();

        navigate("/accounts")
    }

    return (
        <>
            <NavBar />
            <div className="center-all">
                <div className="small-max-width">
                <h1 className="text-align-center">{isEditing ? "Edit Account" : "Add Account"}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div>
                    <label htmlFor="account-type">Account Type</label>
                    <select id="account-type" name="account-type" value={typeId} onChange={(e) => {
                        setTypeId(e.target.value); setSubtypeId("");
                    }}>
                        <option value=""></option>
                        {accountTypes.map(type => (
                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.label}
                            </option>
                        ))
                        }
                    </select>
                    </div>
                    <div>
                    <label htmlFor="account-subtype">Account Sub-Type</label>
                    <select id="account-subtype" value={subtypeId} name="account-subtype" onChange={(e) => setSubtypeId(e.target.value)}>
                        <option value=""></option>
                        {selectedType?.subtypes.map(subtype => (
                            <option
                                key={subtype.id}
                                value={subtype.id}
                            >
                                {subtype.label}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label htmlFor="url">Url to login</label>
                    <input
                        id="url"
                        type="text"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    </div>
                    <div>
                    <label htmlFor="balance">Balance</label>
                    {isEditing ? <span>{formatCurrency(balance)}</span> : <input
                        id="balance"
                        type="number"
                        required
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                    />}
                    </div>
                    <Button type="submit" className="green-btn">{isEditing ? "Save Changes" : "Add Account"}</Button>
                </form>
            </div>
        </div >
        </>
    )
}