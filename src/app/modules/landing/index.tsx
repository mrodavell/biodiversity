import { Fragment, useEffect, useState } from "react";
import USTPLogo from '../../../assets/ustp-logo-on-white.png';
import MapComponent from "../../core/components/map";
import { FaChevronCircleLeft, FaChevronCircleRight, FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { campuses } from "../../core/constants/campuses";
import { FaUserLock } from "react-icons/fa6";
import { LatLngExpression } from "leaflet";
import Modal from "../../core/components/modal";
import frog1 from '../../../assets/frogs/bull_frog1.jpeg';
import frog2 from '../../../assets/frogs/bull_frog2.jpeg';
import frog3 from '../../../assets/frogs/bull_frog3.jpeg';
import bioBg from '../../../assets/biodiversity-gif.gif';
import { BiMapPin } from "react-icons/bi";

type TSampleData = {
    coordinates: LatLngExpression;
    popup: string;
}

export default function Landing() {

    const sampleData: TSampleData[] = [
        {
            coordinates: [8.485833, 124.657950],
            popup: 'Crab-eating Frog'
        },
        {
            coordinates: [8.486464, 124.657043],
            popup: 'Banded bullfrog'
        },
        {
            coordinates: [8.487902, 124.656479],
            popup: 'Lesser Grass Blue'
        },
        {
            coordinates: [8.610100, 124.887058],
            popup: 'Metallic Cerulean'
        },
        {
            coordinates: [8.610200, 124.889158],
            popup: 'Brown Pansy'
        },
        {
            coordinates: [8.609300, 124.889278],
            popup: 'Alingatong'
        }
    ]



    const date = new Date();
    const [selectSampleData, setSelectedSampleData] = useState<TSampleData | undefined>(undefined);
    const [selectedCampus, setSelectedCampus] = useState<string>('');
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isShowMap, setIsShowMap] = useState<boolean>(false);
    const toggleShowModal = () => setShowModal(!showModal);
    const [coordinates, setCoordinates] = useState<LatLngExpression>([8.521414, 124.434229]);
    const [zoom, setZoom] = useState<number>(17);
    const toggleShowPanel = () => setShowPanel(!showPanel);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<TSampleData[]>([]);
    const [dropVisible, setDropVisible] = useState<boolean>(false);
    // const [imageModal, setImageModal] = useState<boolean>(false);

    const handleChangeCampus = (index: string) => {
        setIsShowMap(false);
        setTimeout(() => {
            setIsShowMap(true);
        }, 2000)
        const targetIndex = parseInt(index);
        setCoordinates([campuses[targetIndex].coordinates[0], campuses[targetIndex].coordinates[1]]);
        setZoom(campuses[targetIndex].zoom ?? 17);
        setSelectedCampus(index);
    }

    const handleModal = (value: TSampleData) => {
        setShowModal(true);
        setSelectedSampleData(value)
        console.log(value);
    }

    const handleSearch = (value: string) => {
        if (value === "") {
            setDropVisible(false)
        }
        setSearchKeyword(value);
        const filtered = sampleData.filter((item) => item.popup.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered);
    }

    const handleSelectItem = (value: TSampleData) => {
        setSearchKeyword(value.popup)
        setCoordinates(value.coordinates);
        setDropVisible(false);
    }

    // const handleImageModal = () => {
    //     setImageModal(!imageModal);
    // }

    useEffect(() => {
        setTimeout(() => {
            setIsShowMap(true);
        }, 5000)
    }, [])

    return (
        <Fragment>
            {showModal &&
                <Modal title={selectSampleData?.popup} isOpen={showModal} onClose={toggleShowModal} modalContainerClassName="max-w-4xl">
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-row">
                            <span className="text-lg font-semibold">Scientific name: </span><span className="text-lg ml-2">Kaloula pulchra</span>
                        </div>
                        <div className="flex flex-row">
                            <span className="text-lg font-semibold">Habitat: </span><span className="text-lg ml-2">Forest floors, Rice fields</span>
                        </div>
                        <span className="text-lg font-semibold">Description: </span>
                        <p>
                            This medium-sized frog can grow up to 6.8 cm long. It has a deep, narrow head with distinctive folds and warts across the back and head.
                            The snout is pointed and resembles a beak. Its body color ranges from brown or greenish-brown to gray, with darker markings.
                            Both the lips and legs are barred, featuring irregular darker bars. The belly is white and may have some dark spots.
                        </p>
                        <div className="divider"></div>
                        <div className="flex flex-1 flex-row justify-center gap-4">
                            <button>
                                <FaChevronCircleLeft size={20} />
                            </button>
                            <img src={frog1} alt="Bull Frog 1" width={250} height={200} />
                            <img src={frog2} alt="Bull Frog 1" width={250} height={200} />
                            <img src={frog3} alt="Bull Frog 1" width={250} height={200} />
                            <button>
                                <FaChevronCircleRight size={20} />
                            </button>
                        </div>
                    </div>
                </Modal>
            }
            {
                <Modal title={selectSampleData?.popup} isOpen={showModal} onClose={toggleShowModal} modalContainerClassName="max-w-4xl">
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-row">
                            <span className="text-lg font-semibold">Scientific name: </span><span className="text-lg ml-2">Kaloula pulchra</span>
                        </div>
                        <div className="flex flex-row">
                            <span className="text-lg font-semibold">Habitat: </span><span className="text-lg ml-2">Forest floors, Rice fields</span>
                        </div>
                        <span className="text-lg font-semibold">Description: </span>
                        <p>
                            This medium-sized frog can grow up to 6.8 cm long. It has a deep, narrow head with distinctive folds and warts across the back and head.
                            The snout is pointed and resembles a beak. Its body color ranges from brown or greenish-brown to gray, with darker markings.
                            Both the lips and legs are barred, featuring irregular darker bars. The belly is white and may have some dark spots.
                        </p>
                        <div className="divider"></div>
                        <div className="flex flex-1 flex-row justify-center gap-4">
                            <button>
                                <FaChevronCircleLeft size={20} />
                            </button>
                            <img src={frog1} alt="Bull Frog 1" width={250} height={200} />
                            <img src={frog2} alt="Bull Frog 1" width={250} height={200} />
                            <img src={frog3} alt="Bull Frog 1" width={250} height={200} />
                            <button>
                                <FaChevronCircleRight size={20} />
                            </button>
                        </div>
                    </div>
                </Modal>
            }
            {
                !isShowMap && (
                    <div style={{
                        backgroundImage: `url(${bioBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '100vh',
                        width: '100vw'
                    }}>
                        <img src="" alt="" />
                    </div>
                )
            }
            {
                isShowMap && (
                    <div className="flex flex-1 flex-row overflow-x-hidden">
                        <div className="w-full h-screen flex">
                            <div className="z-20 absolute w-full flex flex-row justify-start">
                                {showPanel && (
                                    <aside className="flex flex-col bg-white h-screen w-80 flex-start items-start border-l-2">
                                        <div className="p-2 flex flex-col h-full justify-start items-center gap-2">
                                            <img src={USTPLogo} alt="USTP Logo" className="w-20 h-20 mt-20" />
                                            <p className="p-2 text-sm text-center">University of Science and Technology of Southern Philippines</p>
                                            <p className="text-justify p-2 text-sm">
                                                The USTP Biodiversity web application showcases a rich collection of specimens and exhibits dedicated to the study and conservation of biodiversity. It features detailed descriptions of various species, interactive exhibits, and educational resources that highlight the importance of preserving our natural heritage.
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center w-full px-2 pr-6 text-sm justify-center mb-2">
                                            Links:
                                            <a href="/admin" className="flex items-center text-blue-600 text-sm" target="_blank" rel="noopener noreferrer">
                                                <FaUserLock size={12} className="m-2" />
                                                Admin
                                            </a>
                                            <a href="https://ustp.edu.ph/" className="flex items-center text-blue-600 text-sm" target="_blank" rel="noopener noreferrer">
                                                <FaExternalLinkAlt size={12} className="m-2" />
                                                USTP Website
                                            </a>
                                        </div>
                                        <div className="w-full text-center mb-2 text-xs">
                                            Copyright &copy; {date.getFullYear()} USTP Biodiversity Project
                                        </div>
                                    </aside>
                                )}
                                <div className="flex flex-1 flex-row w-full justify-between py-2">
                                    <div className="flex flex-1 flex-row">
                                        <button className="btn btn-ghost btn-sm mt-2 ml-2" onClick={toggleShowPanel}>
                                            <IoMenu size={30} color="white" />
                                        </button>
                                        <div className="flex flex-1 flex-col opacity-80">
                                            <div className="input input-bordered input-md w-[500px] ml-2 flex flex-row items-center">
                                                <input
                                                    type="search"
                                                    className="input w-full focus-within:border-none"
                                                    placeholder="Search"
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                    value={searchKeyword}
                                                    onFocus={() => setDropVisible(true)}
                                                />
                                                <span><FaSearch /></span>
                                            </div>
                                            {filteredData.length > 0 && dropVisible && (
                                                <ul className="menu w-[500px] bg-base-200 ml-2 shadow-lg">
                                                    {filteredData.map((item, index) => (
                                                        <li key={index} className="hover:bg-base-300">
                                                            <button
                                                                onClick={() => handleSelectItem(item)}
                                                                className="w-full text-left"
                                                            >
                                                                {item.popup}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                    </div>
                                    <div className="flex h-12 flex-row pr-2">
                                        <div className="flex flex-row items-center bg-white px-2 rounded-lg opacity-80">
                                            <BiMapPin color="red" size={20} className="ml-2" />
                                            <span className="mx-2">CAMPUS</span>
                                            <select value={selectedCampus} className="select select-md min-w-52 !focus:border-none" onChange={(e) => handleChangeCampus(e.target.value)}>
                                                <option value="0" disabled>USTP Campuses</option>
                                                {campuses.map((campus, index) => {
                                                    return (
                                                        <option key={index} value={index}>{campus.campus}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <main className="flex flex-1 z-10 overflow-hidden">
                                <MapComponent
                                    zoom={zoom}
                                    coordinates={coordinates}
                                    handleModal={handleModal}
                                />
                            </main>

                        </div>
                    </div>
                )
            }

        </Fragment >
    )
}