// hooks
import useUser from "../hooks/useUser";


export default function AccountHistory(id) {
    const { user } = useUser();

    /* --- functions --- */
    async function getAccountHistory(id) {

        console.log(id)

        const { data, error } = await supabase
            .from("account_snapshots")
            .select("*")
            .eq("snapshot_id", id)

        if (error) {
            console.log(error);
            return;
        }

        console.log(data)
    }
}