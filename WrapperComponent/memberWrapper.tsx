import * as React from "react";
import loadjs from "loadjs";
import { UserApi } from "./api/Users";
import { ChatApi } from "./api/Chats";
import { Link } from "react-router";
import { NotificationContainer } from "./common/components/notificationContainer";
import { INotification } from "./interfaces/";
import { IUserChatRel } from "./interfaces/chats/";
import { browserHistory } from "react-router";
import { Button } from "./common/components/form/";

import * as redux from "redux";
import { connect } from "react-redux";
import * as reducers from "./components/redux/reducers";
import { compose } from "./common/components/utility";
import { updateInfo, addRoles } from "./components/redux/actions";
import { updateAthleteFollowing } from "./components/redux/actions";
import { publicProfileApi } from "./api/PublicProfile/index";


type OwnProps = {
}

type ConnectedState = {
    userInfo: reducers.UserInfo,
    currentPage: reducers.CurrentPage,
    userRoles: reducers.UserRoles
}
const mapStateToProps = (state: reducers.All, ownProps: OwnProps): ConnectedState => ({
    userInfo: state.userInfo,
    currentPage: state.currentPage,
    userRoles: state.userRoles
})

type ConnectedDispatch = {
    updateInfo: (name: string, avatarUrl: string, userBaseId: number) => void;
    addRoles: (roles: string[]) => void;
    updateAthleteFollowing: (athleteUserBaseIds: number[]) => void;
}

const mapDispatchToProps = (dispatch: redux.Dispatch<reducers.All>): ConnectedDispatch => (
    {
        updateInfo: (name: string, avatarUrl: string, userBaseId: number) => {
            dispatch(updateInfo(name, avatarUrl, userBaseId));
        },
        addRoles: (roles: string[]) => {
            dispatch(addRoles(roles));

        },
        updateAthleteFollowing: (athleteUserBaseIds: number[]) => {
            dispatch(updateAthleteFollowing(athleteUserBaseIds));
        }
    })

interface IMemberWrapperState {
    notifications: INotification[];

}

export class MemberWrapper extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, IMemberWrapperState> {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
        this.onNotificationClick = this.onNotificationClick.bind(this);
        this.addNotif = this.addNotif.bind(this);
    }

    public componentDidMount() {
        loadjs("/assets/js/loader.js");
        var chat = $.connection.chatHub;
        chat.client.addNotif = function (name: string, message: string, avatarUrl: string, senderId: number) {
            this.addNotif(name, message, avatarUrl, senderId);
            //console.log("hi");
        }.bind(this);
        $.connection.hub.start();

        let chatIds: number[] = [];
        ChatApi.getCurrentChatProfile()
            .then(response => {
                let x: IUserChatRel = response.item;
                this.props.updateInfo(x.name, x.avatarUrl, x.userBaseId);
                ChatApi.getChatIdsById()
                    .then(response => {
                        chatIds = response.items;
                    });
            })

        UserApi.getUserRoles()
            .then(response => {
                this.props.addRoles(response.items);
                loadjs("/assets/js/scripts.js");
            })
        publicProfileApi.getAthletesByCurrentFollowingUserId()
            .then(response => {

                this.props.updateAthleteFollowing(response.items);
            })

    }

    private addNotif(name: string, message: string, avatarUrl: string, senderId: number) {
        if (this.props.currentPage.page !== "chats") {// && this.props.userInfo.userBaseId !== senderId) {
            let notifications = this.state.notifications;
            let newNot: INotification = {
                imgUrl: avatarUrl,
                text: name + ": " + message
            }
            notifications.push(newNot);
            this.setState({ notifications });
        }
    }

    private onNotificationClick(index: number) {
        let notifications = this.state.notifications;
        notifications.splice(index, 1);
        this.setState({ notifications });
    }

    private onLogout() {
        UserApi.logout()
            .then((response) => {
                //console.log(response)
                location.href = "/public";
            })
            .catch((err) => {
                location.href = "/public";
            });
    }

    public render() {
        const logo: React.CSSProperties = {
            color: '#333'
        }
        const linkColor: React.CSSProperties = {
            color: '#333'
        }
        return (
            <React.Fragment>
                <div className="an-loader-container">
                    <img src="/assets/img/loader.png" alt="" />
                </div>
                <header className="an-header wow fadeInDown">
                    <div className="an-topbar-left-part">
                        <h3 className="an-logo-heading">
                            <img style={{ height: "50px", float: "left" }} src="/content/public/images/prospectLogoBlk.png" alt="Prospect Logo" />
                            <a className="an-logo-link" href="/public" style={{top:"9px"}}>
                                Prospect
								<span style={{ position: "relative", width: "200px" }}>Return to Public Site</span>
							</a>
						</h3>
						<button className="an-btn an-btn-icon toggle-button js-toggle-sidebar">
							<i className="icon-list"></i>
						</button>
					</div>
					<div className="an-topbar-right-part">
						<div className="an-profile-settings">
							<div className="btn-group an-notifications-dropown profile" style={{ display: "flex", alignItems: "center" }}>
								<span className="an-profile-img" style={{
									backgroundImage: "url('" + this.props.userInfo.avatarUrl + "')"
                                }}></span>
                                <span className="an-user-name" style={{ paddingRight: "20px" }}><Link style={linkColor}  to="editprofile">{this.props.userInfo.name}</Link></span>
								<Button label="Logout" className="an-btn an-btn-prospect-transparent" onClick={this.onLogout} style={{ borderRadius: "4px", padding: "6px" }}/>
							</div>
						</div>
					</div>
				</header>

                <div className="an-page-content">
                    <div className="an-sidebar-nav js-sidebar-toggle-with-click">
                        <div className="an-sidebar-nav">
                            <ul className="an-main-nav">

                                <li className="an-nav-item">
                                    <Link to="/">
                                        <i className="icon-home"></i>
                                        <span className="nav-title">Dashboard</span>
                                    </Link>
                                </li>
                                <li className="an-nav-item">
                                    <Link to="/search">
                                        <i className="icon-search"></i>
                                        <span className="nav-title">Search Prospects</span>
                                    </Link>
                                </li>
                                {this.props.userRoles.roles.indexOf("Admin") !== -1 ?
                                    <li className="an-nav-item">
                                        <a className=" js-show-child-nav" href="#">
                                            <i className="icon-setting"></i>
                                            <span className="nav-title">
                                                Admin Settings
												<span className="an-arrow-nav"><i className="icon-arrow-down"></i></span>
                                            </span>
                                        </a>

                                        <ul className="an-child-nav js-open-nav">
                                            <li><Link to="/admin/manageusers">Manage Users</Link></li>
											<li><Link to="/admin/errorLogs">Error Logs</Link></li>
											<li><Link to="/admin/appsetting">App Settings</Link></li>
											<li><Link to="/admin/issuelogs">Issue Logs</Link></li>
											<li><Link to="/admin/refTypeManager">Ref Type Manager</Link></li>
											<li><Link to="/admin/Terms">Edit Terms</Link></li>
											<li><Link to="/admin/Privacy">Edit Privacy Policy</Link></li>
											<li><Link to="/admin/carouselpicker">Modify Carousel</Link></li>

                                        </ul>
                                    </li>
                                    :
                                    ""}
                                {this.props.userRoles.roles.indexOf("Prospect") !== -1 ?
                                    <li className="an-nav-item">
                                        <a className=" js-show-child-nav" href="#">
                                            <i className="icon-setting"></i>
                                            <span className="nav-title">
                                                Prospect Function
											<span className="an-arrow-nav"><i className="icon-arrow-down"></i></span>
                                            </span>
                                        </a>

										<ul className="an-child-nav js-open-nav">
											<li><Link to="/prospect/athleteFanInfo">Fans</Link></li>
											<li><Link to="/prospect/campaignmanager">Make A Campaign</Link></li>
											<li><Link to="/prospect/blogsmanager">Create/Edit Blog</Link></li>
											<li><Link to="/prospect/subscriptionsmanager">Subscription Manager</Link></li>
											<li><Link to="/prospect/eventmanager">Create/Edit Event</Link></li>
                                            <li><Link to="/prospect/MyStatsContainer">My Stats</Link></li>
                                            <li><Link to="/prospect/nutritionPlanFormAndTable">My Nutrition Plans</Link></li>
                                            <li><Link to="/prospect/workoutplan">My Workout Plans</Link></li>
                                            {/*<li><Link to="/prospect/servicesoffered">Create Services</Link></li>*/}
										</ul>
									</li>
									:
									""}

								<li className="an-nav-item">
									<Link className="" to="/editprofile">
										<i className="icon-user"></i>
										<span className="nav-title">Edit Profile</span>
									</Link>
								</li>
								<li className="an-nav-item">
									<Link className="" to="/userblog">
										<i className="icon-book"></i>
										<span className="nav-title">Blogs</span>
									</Link>
								</li>
								<li className="an-nav-item">
									<Link to="/chats">
										<i className="icon-envelop"></i>
										<span className="nav-title">Messages</span>
									</Link>
                                </li>
                                <li className="an-nav-item">
                                    <Link to="/issuelog">
                                        <i className="ion-ios-information"></i>
                                        <span className="nav-title">Issue Logs</span>
                                    </Link>
                                </li>
							</ul>
						</div>
					</div>
					<div style={{ width: "100%", minHeight: "90vh" }}>
						{this.props.children}
					</div>
				</div>
				<NotificationContainer
					notifications={this.state.notifications}
					onNotificationClick={this.onNotificationClick} />
			</React.Fragment>
		)
	}
}

//export const WrappedMemberWrapper = compose(MemberWrapper,
//	connect(mapStateToProps, mapDispatchToProps)
//);

export const WrappedMemberWrapper = connect(mapStateToProps, mapDispatchToProps)(MemberWrapper);