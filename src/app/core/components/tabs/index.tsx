// Import necessary modules and types from React and classNames library
import { FC, ReactNode, useState, useEffect } from "react";
import classNames from "classnames";

// Update the type definition to support disabled headers
type TTabHeader = {
    label: string | ReactNode;
    disabled?: boolean;
};

// Define the type for the Tabs component props
type TTabsProps = {
    headers: (string | ReactNode | TTabHeader)[];
    contents: ReactNode[];
    size?: "xs" | "sm" | "md" | "lg";
    type?: "bordered" | "lifted" | "boxed";
    className?: string;
    headerClass?: string;
    contentClass?: string;
    controlTab?: number;
    activeTabClassName?: string;
    inActiveTabClassName?: string;
    onTabChange?: (activeTab: number) => void;
    fullWidthHeader?: boolean;
    currentTab?: number;
};

// Define the Tabs component using the functional component syntax
/**
 * @param type - Optional type for the tab styling (default: "bordered")
 * @param headers - Array of header labels for the tabs
 * @param contents - Array of content for each tab
 * @param size - Optional size with options ("xs" | "sm" | "md" | "lg") for the tabs (default: "lg")
 */
const Tabs: FC<TTabsProps> = ({
    type = "bordered",
    headers,
    contents,
    size = "lg",
    className,
    headerClass,
    contentClass,
    controlTab,
    activeTabClassName = "",
    inActiveTabClassName,
    onTabChange,
    fullWidthHeader = true,
    currentTab
}) => {
    // Check if headers and contents arrays are of the same length and warn if not
    if (headers?.length !== contents?.length) {
        console.warn("Headers and contents should be equal in length");
    }

    // State to keep track of the active tab index, defaulting to the first tab
    const [activeTab, setActiveTab] = useState<number | string>(currentTab ?? 0);
    // Handler to update the active tab index
    const handleActiveTab = (index: number) => {
        setActiveTab(index);
        if (onTabChange) {
            onTabChange?.(index);
        }
    };

    useEffect(() => {
        if (controlTab) {
            setActiveTab(controlTab);
        }
    }, []);

    // Combine class names for the tabs based on the type and size props
    const classes = classNames("tabs", `tabs-${type}`, `tabs-${size}`, className);
    const headerClasses = classNames("text-nowrap", headerClass);
    const contentClasses = classNames(
        "tab-content bg-base-100 border-base-300 p-2",
        contentClass
    );
    const tabActiveClassName = classNames(
        "border-b-2 border-b-blue-500 text-blue-500",
        activeTabClassName
    );

    return (
        <div role="tablist" className={classes}>
            <div className="flex flex-col">
                <div className="flex flex-1 flex-row">
                    {headers.map((value, index) => {
                        const header =
                            typeof value === "object" && value !== null && "label" in value
                                ? value
                                : { label: value, disabled: false };
                        const activeClass =
                            index === activeTab
                                ? `${tabActiveClassName}`
                                : `${inActiveTabClassName}`;
                        return (
                            <div
                                key={`tab-header-${header.label}-${index}`}
                                role="tab"
                                className={classNames(
                                    `tab ${fullWidthHeader ? "grow" : ""
                                    } ${headerClasses} ${activeClass}`,
                                    {
                                        "opacity-50 cursor-not-allowed": header.disabled,
                                        "cursor-pointer": !header.disabled,
                                    }
                                )}
                                onClick={() => !header.disabled && handleActiveTab(index)}
                                aria-label={
                                    typeof header.label === "string" ? header.label : "tabs"
                                }
                                aria-disabled={header.disabled}
                            >
                                {header.label}
                            </div>
                        );
                    })}
                </div>
                {contents.map((values, index) => {
                    return activeTab === index ? (
                        <div
                            key={`tab-content-${index}`}
                            role="tabpanel"
                            className={`${contentClasses} flex flex-1 flex-col`}
                        >
                            {values}
                        </div>
                    ) : (
                        ""
                    );
                })}
            </div>
        </div>
    );
};

export default Tabs;
