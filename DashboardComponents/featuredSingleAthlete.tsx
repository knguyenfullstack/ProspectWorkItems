//Kenneth Nguyen
import * as React from "react";
import { IFeaturedSingleAthlete } from "../../interfaces/dashboard";
import { FollowAthleteButton, IFollowAthleteButton } from "../../common/components/followAthlete/followAthleteButtonContainer"
import { Key } from "readline";

export interface IFollowAthleteButton {
    label?: boolean;
    userBaseId?: number;
    classNameStyle?: string;
}


export class FeaturedSingleAthlete extends React.Component<IFeaturedSingleAthlete & IFollowAthleteButton, {}> {
    constructor(props) {
        super(props);

    }
    public render() {
        const linkColor: React.CSSProperties = {
            color: '#333'
        }
        return (
            <div className="an-single-user-main-body" key={this.props.key}>
                <div className="an-user-single">
                    <div className="profile-pic-container" style={{ marginBottom: "35px" }}>
                        <div className="profile-pic-blur-bg">
                            <div className="social-info">
                                {this.props.fbUrl ? <a className="facebook" href={"https://wwww.facebook.com/" + this.props.fbUrl}><i className="ion-social-facebook"></i></a> : ""}
                                {this.props.twitterUrl ? <a className="twitter" href={"https://www.twitter.com/" + this.props.twitterUrl}><i className="ion-social-twitter"></i></a> : ""}
                                {this.props.igUrl ? <a className="instagram" href={"https://www.instagram.com/" + this.props.igUrl}><i className="ion-social-instagram"></i></a> : ""}
                            </div>
                            <div className="overlay"></div>
                            <div className="profile-pic-bg"
                                style={{ background: "url('" + (this.props.bgUrl ? this.props.bgUrl : "/assets/img/mma_bg_placeholder.jpg") + "') center center no-repeat", backgroundSize: "cover" }}>
                            </div>
                        </div>
                        <span className="image-container"
                            style={{ background: "url('" + (this.props.avatarUrl ? this.props.avatarUrl : "/assets/img/avatar_placeholder.png") + "') center center no-repeat", backgroundSize: "cover" }}>
                        </span>
                    </div>
                    <div className="profile-details">
                        <h6><a style={linkColor} href={'/member/#/publicprofile/' + this.props.userBaseId}>{this.props.firstName + " " + (this.props.nickname ? this.props.nickname : "") + " " + this.props.lastName}</a></h6>
                        <h6>{this.props.city}</h6>

                    </div>
                </div>
            </div>
        )
    }
}
//<FollowAthleteButton
//    //userBaseId={this.props.userBaseId}
//    classNameStyle={"an-btn an-btn-primary an-btn-small"}
///>
//<div>
//    {props.fbUrl ? <a className="facebook" href={"https://wwww.facebook.com/" + props.fbUrl}><i className="ion-social-facebook"></i></a> : ""}
//    {props.twitterUrl ? <a className="twitter" href={"https://www.twitter.com/" + props.twitterUrl}><i className="ion-social-twitter"></i></a> : ""}
//    {props.igUrl ? <a className="instagram" href={"https://www.instagram.com/" + props.igUrl}><i className="ion-social-instagram"></i></a> : ""}
//    {props.ytUrl ? <a className="an-social-icon snapchat" href={"https://www.youtube.com/" + props.ytUrl}></a> : ""}
//</div>