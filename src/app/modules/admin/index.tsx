import { Fragment } from "react";
import Auth from "../auth";
import Dashboard from "../dashboard";
import { IUser } from "../../core/interfaces/common.interface";

export default function Admin() {

    const authUser = localStorage.getItem('authUser') as unknown as IUser ?? { isLoggedIn: false };

    return <Fragment>
        {authUser?.isLoggedIn === false && <Dashboard />}
        {authUser?.isLoggedIn === true && <Auth />}
    </Fragment>
}