import SpeciesTable from "./components/tables/SpeciesTable";
import logo from '../../../assets/ustp-logo-on-white.png';
import { FaMapMarkedAlt, FaSignOutAlt, FaUniversity } from "react-icons/fa";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../../core/lib/supabase";
import LoadingButton from "../../core/components/loadingbutton";
import Tabs from "../../core/components/tabs";
import { FaDatabase } from "react-icons/fa6";
import CampusesTable from "./components/tables/CampusesTable";
import CampusSpeciesTable from "./components/tables/CampusSpeciesTable";
import { toast } from "react-toastify";

export default function Dashboard() {

    const [loading, setLoading] = useState<boolean>(false);

    const handleUrl = (index: number) => {
        const urls = ['', 'species', 'campuses'];
        window.location.href = `/admin/${urls[index]}`
    }

    const getActiveTab = () => {
        const urls = ['', 'species', 'campuses'];
        return urls.indexOf(window.location.pathname.split('/').pop() ?? "");
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (!error) {
                window.location.href = '/admin';
            }
        } catch (error: unknown) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return <Fragment>
        <div className="flex flex-1 h-full w-full">
            <div className="flex flex-1 flex-row">
                <div className="w-full flex flex-col">
                    <div className="flex flex-row w-full items-center justify-between bg-blue-800 p-2">
                        <div className="flex flex-row items-center">
                            <div className="bg-white rounded-full">
                                <img src={logo} alt="USTP Logo" className="w-10 h-10 m-2" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg text-white pl-4">USTP Biodiversity Project</span>
                                <span className="pl-4 text-sm text-amber-400">Admin Dashboard</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <LoadingButton
                                animated={false}
                                animatedDisplay={<span className="text-white">Logging out...</span>}
                                type="button"
                                isLoading={loading}
                                className="btn btn-ghost !bg-transparent btn-sm ml-2"
                                onClick={handleLogout}
                            >
                                <span className="text-white">Logout</span>
                                <FaSignOutAlt size={20} color="white" />
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="flex flex-1 mt-2 justify-start items-start px-4">
                        <Tabs
                            className="w-full"
                            fullWidthHeader={false}
                            onTabChange={handleUrl}
                            currentTab={getActiveTab()}
                            headers={[
                                <span className="flex flex-row items-center text-sm hover:text-blue-500"><FaMapMarkedAlt className="mr-2" /> Mapping</span>,
                                <span className="flex flex-row items-center text-sm hover:text-blue-500"><FaDatabase className="mr-2" /> Species</span>,
                                <span className="flex flex-row items-center text-sm hover:text-blue-500"><FaUniversity className="mr-2" /> Campuses</span>

                            ]}
                            contents={[
                                <CampusSpeciesTable />,
                                <SpeciesTable />,
                                <CampusesTable />
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fragment>

}