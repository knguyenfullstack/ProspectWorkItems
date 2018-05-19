import * as React from 'react';

import { IFeaturedSingleAthlete } from "../../interfaces/dashboard/";
import { FeaturedSingleAthlete } from "../../../src/components/athletes/featuredSingleAthlete";
import { CampaignApi } from "../../api/Campaigns/index";

export interface IFeaturedSingleAthleteState {
    featuredUser: IFeaturedSingleAthlete[];
}


export class OwlCarousel extends React.Component<{}, IFeaturedSingleAthleteState> {
    constructor(props) {
        super(props);

    }

    public render() {
        const backgroundColor: React.CSSProperties = {
            backgroundColor: '#f57c00',
            height: '350px'
        }
        return (
            <div className="an-panel-main-info-single color-orange with-shadow slider-info wow fadeIn">
                <div className="owl-carousel default-slider owl-theme">
                    {this.props.children}
                </div>
            </div >

        )
    }

}



