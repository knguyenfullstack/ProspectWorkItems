import * as React from "react"
import { IAthleteSearch } from "../../../src/interfaces/athletes"
import { IAthleteSearchProps } from "./AthleteSearchContainer"

export const AthleteSearchSingleRow: React.StatelessComponent<IAthleteSearchProps> = (props: IAthleteSearchProps, key: number) => {
    return (
        <div className="list-user-single onHoverGray">
            <div className="list-name basis-10">
                <a href={'/member/#/publicprofile/' + props.userBaseId}>
                    <span className="image" style={{
                        backgroundImage: `url(${props.avatarUrl})`,
                        backgroundSize: 'cover'
                    }}>
                    </span>
                </a>
            </div>
            <div className="list-text basis-10">
                <strong><a style={{ color: 'black' }} href={'/member/#/publicprofile/' + props.userBaseId}>{props.firstName.charAt(0).toUpperCase() + props.firstName.slice(1)}</a></strong>
            </div>
            <div className="list-text basis-20">
                <strong><a style={{ color: 'black' }} href={'/member/#/publicprofile/' + props.userBaseId}>{props.lastName.charAt(0).toUpperCase() + props.lastName.slice(1)}</a></strong>
            </div>
            <div className="list-text basis-20">
                <p>{props.city.charAt(0).toUpperCase() + props.city.slice(1)}</p>
            </div>
            <div className="list-text basis-20">
                <p>{props.typeName}</p>
            </div>
            <div className="list-text basis-10">
                <p>{props.isProfessional.toString() == "true" ? "Yes" : "No"}</p>
            </div>
        </div>
    )
}

