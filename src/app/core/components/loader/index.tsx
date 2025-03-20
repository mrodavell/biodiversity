import { Hourglass } from "react-loader-spinner";

type LoaderProps = {
    text?: string;
    width?: number;
    height?: number;
};

const Loader: React.FC<LoaderProps> = ({
    text = "Loading...",
    width = 30,
    height = 30
}) => {
    return <div className="flex flex-1 flex-col justify-center items-center">
        <Hourglass colors={["rgb(250 191 35)", "rgb(250 191 35)"]} width={width} height={height} wrapperClass="justify-center" />
        <span className="text-center mt-2">{text}</span>
    </div>
};

export default Loader;
