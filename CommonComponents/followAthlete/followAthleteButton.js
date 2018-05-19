import * as React from "react";
export const FollowAthleteButton = (props) => {
    return (React.createElement("div", { className: props.divClassName },
        React.createElement("button", { type: "button", className: props.ButtonClassName, onClick: props.onClick, disabled: props.disabled }, props.label)));
};
//# sourceMappingURL=followAthleteButton.js.map