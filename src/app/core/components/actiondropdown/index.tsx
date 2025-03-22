import { BsThreeDots } from "react-icons/bs"
import { IActions } from "../../interfaces/common.interface";

// Define the props type for the ActionDropdown component
type TActionDropdown<T> = {
    label?: string;
    actions?: IActions<T>[];
    rowIndex: number;
    data: T;
}

/**
 * @param actions - Array of action items implementing the IActions interface(default: empty array)
 */
const ActionDropdown = <T,>({ actions = [], rowIndex, data }: TActionDropdown<T>) => {
    return (
        <div className="flex flex-1 justify-center">
            <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm m-1"><div><BsThreeDots /></div></div>
                <ul tabIndex={0} className="dropdown-content z-10 menu bg-slate-100 p-0 min-w-52 hover:cursor-pointer ">
                    {
                        actions.map((value, index) => {
                            return <div key={`action-menu-${index}`} className={`p-1 flex flex-row items-center shadow hover:!bg-${value.color} hover:!text-zinc-300 `} onClick={() => value.event(data, rowIndex)}>
                                {value.icon && <div className="mx-2">{value.icon}</div>}
                                <div>
                                    {value.name}
                                </div>
                            </div>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

// Exporting ActionDropdown component as default
export default ActionDropdown;
