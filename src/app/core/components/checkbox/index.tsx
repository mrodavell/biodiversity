// Import dependencies
import {
    FC,
    MouseEvent,
    ChangeEvent,
    FocusEvent,
    useState,
    useEffect,
} from "react";
import ErrorText from "../errortext";
import classNames from "classnames";

// Define the props type for the CheckBox component
type TCheckBoxProps = {
    value?: string | number;
    checked: boolean;
    id?: string;
    name?: string;
    required?: boolean;
    leftLabel?: string;
    rightLabel?: string;
    labelStyle?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    errorText?: string;
    errorIcon?: boolean;
    variant?: "primary" | "secondary" | "danger" | "default";
    size?: "xs" | "sm" | "md" | "lg";
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Checkbox component props.
 * @param name - The name attribute of the checkbox.
 * @param id - The id attribute of the checkbox.
 * @param value - The value of the checkbox.
 * @param checked - Whether the checkbox is checked. Default is false.
 * @param disabled - Whether the checkbox is disabled. Default is false.
 * @param readOnly - Whether the checkbox is read-only. Default is false.
 * @param required - Whether the checkbox is required. Default is false.
 * @param leftLabel - Label displayed to the left of the checkbox.
 * @param rightLabel - Label displayed to the right of the checkbox.
 * @param labelStyle - Custom styles for the checkbox label.
 * @param className - Additional CSS classes for the checkbox.
 * @param variant - Variant of the checkbox (e.g., "primary", "secondary"). Default is "primary".
 * @param size - Size of the checkbox (e.g., "sm", "md", "lg"). Default is "sm".
 * @param error - Whether the checkbox has an error state. Default is false.
 * @param errorText - Error message to display when there is an error.
 * @param errorIcon - Whether to display an error icon. Default is false.
 * @param onClick - Click event handler for the checkbox. Default is an empty function.
 * @param onChange - Change event handler for the checkbox. Default is an empty function.
 */
const CheckBox: FC<TCheckBoxProps> = ({
    name,
    id,
    value,
    checked = false,
    disabled = false,
    readOnly = false,
    required = false,
    leftLabel,
    rightLabel,
    labelStyle,
    className = "",
    variant = "primary",
    size = "sm",
    error = false,
    errorText,
    errorIcon = false,
    onBlur,
    onClick = () => { },
    onChange = () => { },
}) => {
    // Combine CSS class names for the label and checkbox elements
    const labelClass = classNames(
        "label-text",
        `text-${variant}`,
        { "!text-error": error },
        labelStyle
    );
    const checkBoxClass = classNames(
        "checkbox",
        `checkbox-${size}`,
        `checkbox-${variant}`,
        { "!checkbox-error": error },
        className
    );

    // Declare a state variable `isChecked` to manage the initial checked state of the checkbox
    const [isChecked, setIsChecked] = useState<boolean>(false);

    // Handle the change event for the checkbox
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e); // Call the onChange prop function
        setIsChecked(e.target.checked); // Toggle the checked state
    };

    // useEffect hook to set the initial checked state when the component mounts
    // Set initial state based on the checked prop
    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    // useEffect hook to reset the checked state when the component unmounts
    useEffect(() => {
        return () => {
            setIsChecked(checked); // Reset the state to the initial state
        };
    }, []);
    // Render the checkbox component
    return (
        <div className="form-control">
            <label
                className={`label cursor-pointer checkbox-${variant} justify-start`}
            >
                {
                    leftLabel && <span className={`pr-2 ${labelClass}`}>{leftLabel}</span> // Render the left label if provided
                }
                <input
                    type="checkbox"
                    name={name}
                    id={id}
                    value={value}
                    disabled={disabled}
                    readOnly={readOnly}
                    checked={isChecked}
                    onChange={handleChange}
                    onClick={onClick}
                    className={checkBoxClass}
                    required={required}
                    aria-readonly={readOnly}
                    onBlur={onBlur}
                />
                {
                    rightLabel && (
                        <span className={`pl-2 ${labelClass}`}>{rightLabel}</span>
                    ) // Render the right label if provided
                }
            </label>
            {
                error && <ErrorText text={errorText} withIcon={errorIcon} /> // Render the error text if there's an error
            }
        </div>
    );
};

// Export the CheckBox component as the default export
export default CheckBox;
