// Import dependencies
import { FC, ReactNode, MouseEvent, ChangeEvent, FocusEvent, Fragment, useState, useEffect } from "react";
import ErrorText from "../errortext";
import classNames from "classnames";

// Define the props type for the TextField component
type TTextFieldProps = {
    type?: string;
    name?: string;
    id?: string;
    value?: string | number;
    min?: number;
    max?: number;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "danger" | "default";
    label?: string;
    error?: boolean;
    errorText?: string;
    errorIcon?: boolean;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onChange?: (text: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onMouseOver?: (event: MouseEvent<HTMLElement>) => void;
};

/**
 * TextField component props
 * @params type: The type of the input field (e.g., "text", "password")
 * @params name: The name attribute of the input field
 * @params id: The id attribute of the input field
 * @params value: The current value of the input field
 * @params leftIcon: Icon to display on the left side of the input field
 * @params rightIcon: Icon to display on the right side of the input field
 * @params disabled: Indicates if the input field is disabled
 * @params readOnly: Indicates if the input field is read-only
 * @params required: Indicates if the input field is required
 * @params placeholder: Placeholder text for the input field
 * @params className: Additional CSS class(es) for styling
 * @params error: Indicates if the input field has an error state
 * @params errorText: Error message text to display when error is true
 * @params errorIcon: Indicates if an error icon should be displayed
 * @params size: Size variant of the input field ("sm", "md", "lg")
 * @params variant: Variant style of the input field ("primary", "secondary", etc.)
 * @params label: Label text for the input field
 * @params onClick: Event handler for click events on the input field
 * @params onChange: Event handler for change events on the input field
 * @params onBlur: Event handler for blur events on the input field
 * @params onMouseOver: Event handler for mouse over events on the input field
 */
const TextField: FC<TTextFieldProps> = ({
    type = "text",
    name,
    id,
    value = "",
    max,
    min,
    leftIcon,
    rightIcon,
    disabled = false,
    readOnly = false,
    required = false,
    placeholder = "Type here",
    className = "",
    error = false,
    errorText,
    errorIcon = false,
    size = "md",
    variant = "primary",
    label = "",
    onClick,
    onChange,
    onBlur,
    onMouseOver,
}) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }

        setInputValue(e.target.value);
    };

    useEffect(() => {
        setInputValue(value?.toString() ?? "");
    }, [value]);

    const inputWrapperClass = classNames("flex input input-bordered items-center gap-2 w-full", `input-${size}`, `border-${variant}`, { "!input-error": error }, `input-${variant}`, className);
    const inputClass = classNames("grow border-0 px-0 input !border-transparent focus-within:outline-none", `input-${variant}`, `input-${size}`, rightIcon ? "pr-10 lg:pr-0" : ""); //added a padding right for Icon right

    return (
        <Fragment>
            <label className={inputWrapperClass}>
                {/* {leftIcon && leftIcon}  Render left icon if provided */}
                {leftIcon && <span className="w-auto h-auto">{leftIcon}</span>}
                {label} {/* Render label text if provided */}
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={inputValue}
                    disabled={disabled}
                    placeholder={`${placeholder} ${required ? "*" : ""}`} // Add asterisk (*) for required fields
                    className={inputClass}
                    onClick={onClick}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onMouseOver={onMouseOver}
                    readOnly={readOnly}
                    required={required}
                    max={type === "number" ? max : undefined}
                    min={type === "number" ? min : undefined}
                />
                {rightIcon && <span className="w-auto h-auto">{rightIcon}</span>}
                {/* {rightIcon && rightIcon} Render right icon if provided */}
            </label>
            {/* Render ErrorText component if error is true */}
            {error && <ErrorText text={errorText} withIcon={errorIcon} />}
        </Fragment>
    );
};
// Export TextField component as default
export default TextField;
