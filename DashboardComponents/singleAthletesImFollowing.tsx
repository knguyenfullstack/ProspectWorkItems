//Kenneth Nguyen
import * as React from "react";
import { IFeaturedSingleAthlete } from "../../interfaces/dashboard";



export const SingleAthletesImFollowing: React.StatelessComponent<IFeaturedSingleAthlete> = (props: IFeaturedSingleAthlete) => {

    return (
        <React.Fragment>
            <div className="col-md-6">
                <div className="list-user-single onHoverGray">
                    <div className="list-name basis-5">
                        <span> </span>
                    </div>
                    <div className="list-name basis-40">
                        <a href={'/member/#/publicprofile/' + props.userBaseId}>
                            <span className="image" style={{
                                backgroundImage: `url(${props.avatarUrl})`,
                                backgroundSize: 'cover'
                            }}>
                            </span>
                        </a>
                    </div>
                    <div className="list-text basis-55">
                        <strong><a style={{ color: 'black', top: '50%' }} href={'/member/#/publicprofile/' + props.userBaseId}>{props.firstName.charAt(0).toUpperCase() + props.firstName.slice(1)}</a></strong>
                        <br />
                        <strong><a style={{ color: 'black', top: '50%' }} href={'/member/#/publicprofile/' + props.userBaseId}>{props.lastName.charAt(0).toUpperCase() + props.lastName.slice(1)}</a></strong>
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}

