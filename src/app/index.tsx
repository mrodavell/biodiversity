
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react";


export default function App() {
  return <>
    <RouterProvider future={{ v7_startTransition: true }} router={router} />
    <Analytics />
    <ToastContainer />
  </>
} 
