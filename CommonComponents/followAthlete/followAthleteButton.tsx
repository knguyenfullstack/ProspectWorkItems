import * as React from "react";

export interface IFollowAthleteButton {
    label?: string;
    ButtonClassName?: string;
    onClick: () => void;
    disabled?: boolean;
    IconClassName?: string;
    divClassName?: string;
}

export const FollowAthleteButton: React.StatelessComponent<IFollowAthleteButton> = (props) => {
    return (
        <div className={props.divClassName} >
            <button type="button"
                className={props.ButtonClassName}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.label}
            </button>
        </div>
    );
};
