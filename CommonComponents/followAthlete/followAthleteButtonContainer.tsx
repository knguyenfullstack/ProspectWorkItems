//Kenny Nguyen
import * as React from 'react';
import { AthletesApi } from "../../../api/Athletes/index";

//import { FollowAthleteButton, IFollowAthleteButton } from "./followAthleteButton";

export interface IFollowAthleteButton {
    label?: boolean;
    userBaseId?: number;
    classNameStyle?: string;
}


export class FollowAthleteButton extends React.Component<IFollowAthleteButton, IFollowAthleteButton> {
    constructor(props) {
        super(props); ''
        this.state = {
            /*
            state of label will be handled locally on the button class
            the label will change state on both the componentDidMount() and 
            on the click event of the button
            */
            label: true
        }
        this.onSave = this.onSave.bind(this);
    }

    public componentDidMount() {
        //on the mounting of the button component we will check if the current user is already following this athlete        
        AthletesApi.GetByFollowedByUserId(this.props.userBaseId)
            .then((response) => {
                if (response.items.length < 1) {//if on check we return no items then set the state of label to false (unfollow)
                    this.setState({
                        label: false
                    })
                }
            });
    }

    private onSave() {
        //on click of the button we will pass the id of the athlete on the component
        //the storage proceedure will do two things, add and delete from the rel table
        AthletesApi.PostUserFollowingRel(this.props.userBaseId)
            .then((response => {
                this.setState({
                    //on success toggle the state of the label to either "Follow" or "Unfollow"
                    label: !this.state.label
                })
            })
            );
    }
    public render() {

        return (
            <div>
                <button
                    className={this.props.classNameStyle}
                    onClick={this.onSave}>
                    {this.state.label == false ? <span>Follow</span> : <span>Unfollow</span>}
                </button>
            </div>
        );
    }
};
//////////////////////////////////////////////////////////////////////////
/*
should look like this
    <FollowAthleteButton
        userBaseId={this.props.userBaseId}
        classNameStyle={"an-btn an-btn-primary an-btn-small"}
    />

*/