import { joinArray } from "../../helpers/array";
import { FC } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

type TErrorTextProps = {
    text?: string | string[];
    withIcon?: boolean;
};


const ErrorText: FC<TErrorTextProps> = ({ text = "", withIcon = false }) => {
    return (
        <div className="flex flex-row pl-1 pt-2">
            {withIcon && <FaExclamationTriangle className="text-danger" size={14} />}
            {typeof text === 'string' &&
                <span className="text-xs pl-2 text-red-500">{text}</span>
            }
            {
                typeof text !== 'string' &&
                <span className="text-xs pl-2 text-red-500">{joinArray([...text], ",")}</span>
            }
        </div>
    );
};

export default ErrorText;
