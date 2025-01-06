import SpeciesTable from "./components/SpeciesTable";
import logo from '../../../assets/ustp-logo-on-white.png';
import { FaSignOutAlt } from "react-icons/fa";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Modal from "../../core/components/modal";
import NewSpeciesForm from "./components/NewSpeciesForm";

export default function Dashboard() {

    // const authUser = localStorage.getItem('authUser') as unknown as IUser;  
    const [addSpeciesModal, setAddSpeciesModal] = useState<boolean>(false);
    const toggleSpeciesModal = () => setAddSpeciesModal(!addSpeciesModal);

    return <Fragment>
        {
            addSpeciesModal && (
                <Modal title="New Species" isOpen={addSpeciesModal} onClose={toggleSpeciesModal} modalContainerClassName="max-w-7xl">
                    <div>
                        <NewSpeciesForm toggleModal={toggleSpeciesModal} />
                    </div>
                </Modal>
            )
        }
        <div className="flex flex-1 h-full w-full">
            <div className="flex flex-1 flex-row">
                <div className="w-full flex flex-col">
                    <div className="flex flex-row w-full items-center justify-between bg-blue-800 p-2">
                        <div className="flex flex-row items-center">
                            <div className="bg-white rounded-full">
                                <img src={logo} alt="USTP Logo" className="w-12 h-12 m-2" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg text-white pl-4">USTP Biodiversity Project</span>
                                <span className="pl-4 text-sm text-amber-400">Admin Dashboard</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <button className="btn btn-ghost btn-sm ml-2">
                                <span className="text-white">Signout</span>
                                <FaSignOutAlt size={20} color="white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-1 mt-2">
                        <SpeciesTable toggleModal={toggleSpeciesModal} />
                    </div>
                </div>
            </div>
        </div>
    </Fragment>

}