// Import dependencies
import classNames from "classnames";
import { FC, ReactNode } from "react";

// Define the type for the Tooltip component props
type TTooltipProps = {
    text?: string | number;
    children?: ReactNode | ReactNode[];
    position?: "top" | "bottom" | "left" | "right";
    variant?: "primary" | "secondary" | "accent" | "success" | "error" | "info";
    className?: string;
    open?: boolean;
};

/**
 * Tooltip component displays a tooltip with specified text and positioning.
 *
 * @params text - Tooltip text to display
 * @params children - Child elements that trigger the tooltip
 * @params className - Additional class names for styling purposes
 * @params position - Position of the tooltip relative to children
 * @params variant - Variant style for the tooltip
 * @params open - Visibility of the tooltip (default: false)
 */
const Tooltip: FC<TTooltipProps> = ({
    text,
    children,
    className,
    position = "top",
    variant,
    open = false,
}) => {
    // Determine the tooltip variant class if variant is provided
    const tooltipVariant = variant ? `tooltip-${variant}` : "";

    // Combine class names for the tooltip based on position, variant, and additional classes
    const classes = classNames(
        "tooltip",
        `tooltip-${position}`,
        { "tooltip-open": open },
        tooltipVariant,
        className
    );

    return (
        // Render the tooltip with combined class names and tooltip text
        <div className={classes} data-tip={text}>
            {children} {/* Render child elements inside the tooltip */}
        </div>
    );
};

// Export the Tooltip component as the default export
export default Tooltip;
