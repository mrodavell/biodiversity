// Importing dependencies
import { MouseEvent } from "react";
import { Watch } from "react-loader-spinner";
import classNames from "classnames";

// Define the type for the LoadingButton component props
type TLoadingButtonProps = {
    type: "submit" | "button";
    name?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "default" | "gradient" | "success";
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    animated?: boolean;
    animatedDisplay?: React.ReactNode;
};

/**
 * LoadingButton component displays a button with optional loading state and variant styles.
 * 
 * @params type: "submit" | "button" - Specifies the type of the button (default: "button").
 * @params onClick?: (event: MouseEvent<HTMLButtonElement>) => void - Click event handler for the button.
 * @params children?: React.ReactNode - Content of the button.
 * @params variant: "primary" | "secondary" | "danger" | "default" | "gradient" | "success" - Variant style for the button (default: "primary").
 * @params className?: string - Additional custom classes for the button.
 * @params isLoading?: boolean - Loading state of the button (default: false).
 * @params outline?: boolean - Whether the button should have an outline style.
 */
const LoadingButton: React.FC<TLoadingButtonProps> = ({
    type = "button",
    name,
    onClick,
    children,
    variant = "primary",
    className,
    isLoading = false,
    disabled = false,
    animated = false,
    animatedDisplay
}) => {

    // Constructing the button's class list using classNames utility.
    const classes = classNames(
        "btn btn-active rounded flex flex-row items-center justify-center w-full text-white", // Default button classes for styling.
        `bg-${variant} hover:bg-${variant}-dark`, // Adding variant-specific class. 
        className // Adding any additional custom classes passed via props.
    );

    return (
        <button
            name={name} // Setting the button name.
            disabled={isLoading || disabled} // Disabling the button if it is in a loading state.
            type={type} // Setting the button type.
            onClick={onClick} // Attaching the onClick handler.
            className={classes} // Applying the constructed class list.
        >
            {/* Rendering the loading spinner if isLoading is true, otherwise rendering the button content. */}
            {isLoading && animated && <Watch height={25} width={25} color="#FFFFFF" />}
            {isLoading && !animated && animatedDisplay}
            {!isLoading && children}
        </button>
    );
};

// Exporting the LoadingButton component as the default export.
export default LoadingButton; 
