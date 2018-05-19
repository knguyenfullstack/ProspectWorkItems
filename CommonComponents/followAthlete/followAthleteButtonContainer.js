//Kenny Nguyen
import * as React from 'react';
import { AthletesApi } from "../../../api/Athletes/index";
export class FollowAthleteButton extends React.Component {
    constructor(props) {
        super(props);
        '';
        this.state = {
            /*
            state of label will be handled locally on the button class
            the label will change state on both the componentDidMount() and
            on the click event of the button
            */
            label: true
        };
        this.onSave = this.onSave.bind(this);
    }
    componentDidMount() {
        //on the mounting of the button component we will check if the current user is already following this athlete        
        AthletesApi.GetByFollowedByUserId(this.props.userBaseId)
            .then((response) => {
            if (response.items.length < 1) {
                this.setState({
                    label: false
                });
            }
        });
    }
    onSave() {
        //on click of the button we will pass the id of the athlete on the component
        //the storage proceedure will do two things, add and delete from the rel table
        AthletesApi.PostUserFollowingRel(this.props.userBaseId)
            .then((response => {
            this.setState({
                //on success toggle the state of the label to either "Follow" or "Unfollow"
                label: !this.state.label
            });
        }));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("button", { className: this.props.classNameStyle, onClick: this.onSave }, this.state.label == false ? React.createElement("span", null, "Follow") : React.createElement("span", null, "Unfollow"))));
    }
}
;
//////////////////////////////////////////////////////////////////////////
/*
should look like this
    <FollowAthleteButton
        userBaseId={this.props.userBaseId}
        classNameStyle={"an-btn an-btn-primary an-btn-small"}
    />

*/ 
//# sourceMappingURL=followAthleteButtonContainer.js.map