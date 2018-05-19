import * as React from "react";
import loadjs from "loadjs";
import { UserApi } from "./api/Users";
import { Link } from "react-router";
import { INotification } from "./interfaces/";
import { browserHistory } from "react-router";
import { Button } from "./common/components/form/";
import { compose } from "./common/components/utility";

import * as redux from "redux";
import { connect } from "react-redux";
import * as reducers from "./components/redux/reducers";
import { updateInfo, addRoles } from "./components/redux/actions";
import { updateAthleteFollowing } from "./components/redux/actions";
import { publicProfileApi } from "./api/PublicProfile/index";


type ConnectedState = {
    userRoles: reducers.UserRoles
}
const mapStateToProps = (state: reducers.All): ConnectedState => ({
    userRoles: state.userRoles
})

interface IProspectWrapperState {
    notifications: INotification[];

}

export class ProspectWrapper extends React.Component<ConnectedState, IProspectWrapperState> {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }

    }

    public componentWillMount() {
        if (this.props.userRoles.roles.length == 0) {
        } else if (this.props.userRoles.roles.indexOf("Prospect") !== 0) {
            location.href = '/member/';
        }
    }

    public render() {
        return (
            <React.Fragment>
                {this.props.userRoles.roles.indexOf("Prospect") !== -1 ?
                    <div style={{ width: "100%", minHeight: "90vh" }}>
                        {this.props.children}
                    </div> : ""}
            </React.Fragment>
        )
    }
}

export const WrappedProspectWrapper = connect(mapStateToProps)(ProspectWrapper);