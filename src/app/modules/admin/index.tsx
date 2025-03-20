import { Fragment, useEffect, useState } from "react";
import Auth from "../auth";
import Dashboard from "../dashboard";
import { supabase } from "../../core/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Admin() {

    const [auth, setAuth] = useState<Session | null>(null);

    const getUser = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
            setAuth(data.session);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return <Fragment>
        {auth && <Dashboard />}
        {!auth && <Auth />}
    </Fragment>
}