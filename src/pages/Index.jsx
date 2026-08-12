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

// charts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import Button from "../components/Button";

export default function Index() {
    const today = new Date();
    const { user } = useUser();

    /* --- effects --- */
    useEffect(() => {
        getProfile();
    }, [user]);

    useEffect(() => {
        async function getSnapshots() {
            const { data, error } = await supabase
                .from("networth_snapshots")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.log(error);
                return;
            }

            setSnapshots(data);
        }
        getSnapshots();
    }, []);


    /* --- hooks --- */
    const { accounts, handleDeleteAccount } = useAccounts();

    /* --- state --- */
    const [profile, setProfile] = useState(null);
    const [firstName, setFirstName] = useState('');

    const [snapshots, setSnapshots] = useState([]);

    /* -- constants --- */
    const chartData = snapshots.map(snapshot => ({
        date: new Date(snapshot.created_at)
            .toLocaleDateString("en-US", {
                month: "short",
                year: "numeric"
            }),
        netWorth: snapshot.networth_total
    }));

    const latestSnapshot = snapshots[snapshots.length - 1];

    const pieData = latestSnapshot
        ? [
            {
                name: "Assets",
                value: latestSnapshot.asset_total,
                color: "#80BC00",
            },
            {
                name: "Liabilities",
                value: Math.abs(latestSnapshot.liability_total),
                color: "#393D43",
            },
        ]
        : [];

    const renderPercentage = ({ percent }) => {
        return `${(percent * 100).toFixed(0)}%`;
    };

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
    }

    /* --- Render --- */
    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="space-between">
                    <h1 className="l-text">Hello, {firstName}!</h1>
                    <p className="strong-text"><span className="green-text">Today is:</span> {today.toLocaleDateString()}</p>
                </div>

                <div className="container-fluid">
                    <div className="grid grid-3">

                        <div className="gray-bg border-radius-5 widget">
                            <div className="horizontal-inline">
                                <h3>Net Worth Value</h3>
                                <Button type="button" className="green-btn"><Link to="/update-networth">Update Net Worth</Link></Button>
                            </div>
                            <h1 className="l-text strong-text">{formatCurrency(totalNetWorth(accounts))}</h1>

                        </div>

                        <div className="gray-bg border-radius-5 widget">
                            <h3>Assets</h3>
                            <h1>{formatCurrency(totalBalanceByType(accounts, "asset"))}</h1>
                            <Link to="/assets">View details</Link>
                        </div>

                        <div className="gray-bg border-radius-5 widget">
                            <h3>Liabilities</h3>
                            <h1>{formatCurrency(totalBalanceByType(accounts, "liability"))}</h1>
                            <Link to="/liabilities">View details</Link>
                        </div>
                    </div>

                    <div className="grid grid-2">
                        <div className="gray-bg border-radius-5">
                            <div className="horizontal-inline title">
                                <div className="green-icon"><svg width="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(0, 0, 0)" d="M296 88C296 74.7 306.7 64 320 64C333.3 64 344 74.7 344 88L344 128L400 128C417.7 128 432 142.3 432 160C432 177.7 417.7 192 400 192L285.1 192C260.2 192 240 212.2 240 237.1C240 259.6 256.5 278.6 278.7 281.8L370.3 294.9C424.1 302.6 464 348.6 464 402.9C464 463.2 415.1 512 354.9 512L344 512L344 552C344 565.3 333.3 576 320 576C306.7 576 296 565.3 296 552L296 512L224 512C206.3 512 192 497.7 192 480C192 462.3 206.3 448 224 448L354.9 448C379.8 448 400 427.8 400 402.9C400 380.4 383.5 361.4 361.3 358.2L269.7 345.1C215.9 337.5 176 291.4 176 237.1C176 176.9 224.9 128 285.1 128L296 128L296 88z" /></svg></div><h2>Net Worth Over Time</h2>
                            </div>
                            <div className="white-bg">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>

                                        <XAxis
                                            dataKey="date"
                                        />

                                        <YAxis
                                            domain={['dataMin - 5000', 'dataMax + 5000']}
                                        />

                                        <Tooltip
                                            formatter={(value) =>
                                                `$${value.toLocaleString()}`
                                            }
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="netWorth"
                                            name="Net Worth"
                                            stroke="black"
                                            strokeWidth={3}
                                        />

                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="gray-bg border-radius-5">
                            <div className="horizontal-inline title">
                                <div className="green-icon"><svg width="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(0, 0, 0)" d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192C576 156.7 547.3 128 512 128L128 128zM320 208C381.9 208 432 258.1 432 320C432 381.9 381.9 432 320 432C258.1 432 208 381.9 208 320C208 258.1 258.1 208 320 208zM128 248L128 200C128 195.6 131.6 192 136 192L184 192C188.4 192 192.1 195.6 191.5 200C187.9 229 164.9 251.9 136 255.5C131.6 256 128 252.4 128 248zM128 392C128 387.6 131.6 383.9 136 384.5C165 388.1 187.9 411.1 191.5 440C192 444.4 188.4 448 184 448L136 448C131.6 448 128 444.4 128 440L128 392zM504 255.5C475 251.9 452.1 228.9 448.5 200C448 195.6 451.6 192 456 192L504 192C508.4 192 512 195.6 512 200L512 248C512 252.4 508.4 256.1 504 255.5zM512 392L512 440C512 444.4 508.4 448 504 448L456 448C451.6 448 447.9 444.4 448.5 440C452.1 411 475.1 388.1 504 384.5C508.4 384 512 387.6 512 392zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" /></svg></div>
                                <h2>Assets vs. Liabilities</h2>
                            </div>

                            <div className="white-bg">
                                <PieChart width={300} height={300}>

                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label={renderPercentage}
                                        labelLine={false}
                                    >

                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={entry.color}
                                            />
                                        ))}

                                    </Pie>

                                    <Tooltip
                                        formatter={(value) =>
                                            `$${value.toLocaleString()}`
                                        }
                                    />
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}