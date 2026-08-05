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
                color: "#16a34a",
            },
            {
                name: "Liabilities",
                value: Math.abs(latestSnapshot.liability_total),
                color: "#dc2626",
            },
        ]
        : [];

    const renderPercentage = ({percent}) => {
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
            <h1>NET WORTH TRACKER</h1>
            <p>Hello, {firstName}!</p>
            <p>Today is: {today.toLocaleDateString()}</p>

            <p>Net Worth: {formatCurrency(totalNetWorth(accounts))}
            </p>
            <button><Link to="/update-networth">Update Net Worth</Link></button>
            <button><Link to="/networth-history">Net Worth History</Link></button>
            <p>Assets: {formatCurrency(totalBalanceByType(accounts, "asset"))}
            </p><button><Link to="/assets">View details</Link></button>
            <p>Assets: {formatCurrency(totalBalanceByType(accounts, "liability"))}
            </p><button><Link to="/liabilities">View details</Link></button>

            <button onClick={() => console.log(pieData)}>Pie data</button>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>

                    <XAxis
                        dataKey="date"
                    />

                    <YAxis />

                    <Tooltip
                        formatter={(value) =>
                            `$${value.toLocaleString()}`
                        }
                    />

                    <Line
                        type="monotone"
                        dataKey="netWorth"
                        name="Net Worth"
                        strokeWidth={3}
                    />

                </LineChart>
            </ResponsiveContainer>

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

                <Tooltip />

            </PieChart>
        </>
    )
}