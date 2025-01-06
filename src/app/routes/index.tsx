import { createBrowserRouter } from "react-router-dom";
import Landing from "../modules/landing";
import Admin from "../modules/admin";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/admin",
        element: <Admin />
    }
])