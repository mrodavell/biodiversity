import { createBrowserRouter } from "react-router-dom";
import Landing from "../modules/landing";
import Admin from "../modules/admin";
import Notfound from "../modules/notfound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/admin",
        element: <Admin />
    },
    {
        path: "*",
        element: <Notfound />
    }
])