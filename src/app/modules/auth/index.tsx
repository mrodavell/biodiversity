import { Fragment, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FiEyeOff } from "react-icons/fi";
import bgImage from '../../../assets/biodiversity-gif.gif';
import logo from '../../../assets/ustp-logo-on-white.png';

export default function Auth() {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center h-screen" style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
                <div className="bg-white opacity-100 p-4 rounded-md">
                    <div className="flex flex-col items-center justify-center mt-6">
                        <img src={logo} alt="USTP Logo" className="w-20 h-20 mb-6" />
                        <h1 className="text-3xl font-bold">USTP Biodiversity</h1>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 border-[1px] p-4 rounded-md mt-6 w-96 ">
                        <form className="flex flex-col gap-4 w-full">
                            <input type="text" className="input input-bordered input-md w-full" placeholder="Username" required />
                            <div className="flex flex-1 input input-bordered input-md w-full p-0">
                                <input type={showPassword ? 'text' : 'password'} className="input input-md w-full" placeholder="Password" />
                                <button className="btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEye /> : <FiEyeOff />}
                                </button>
                            </div>
                            <button className="btn btn-primary w-full">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}