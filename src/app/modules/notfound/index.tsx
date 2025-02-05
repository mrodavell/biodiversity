import { FaArrowLeft } from 'react-icons/fa';
import '../../../assets/notfound.css';

export default function Notfound() {
    return (
        <div className='notfound flex items-center justify-center h-screen'>
            <div className="center">
                <div className="error">
                    <div className="number">4</div>
                    <div className="illustration">
                        <div className="circle"></div>
                        <div className="clip">
                            <div className="paper">
                                <div className="face">
                                    <div className="eyes">
                                        <div className="eye eye-left"></div>
                                        <div className="eye eye-right"></div>
                                    </div>
                                    <div className="rosyCheeks rosyCheeks-left"></div>
                                    <div className="rosyCheeks rosyCheeks-right"></div>
                                    <div className="mouth"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="number">4</div>
                </div>

                <div className="text">Oops. The page you're looking for doesn't exist.</div>
                <a className="btn btn-success text-white mt-4" href="/">
                    <FaArrowLeft />
                    Go back
                </a>
            </div>
        </div>
    );
}
