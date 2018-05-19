//Kenneth Nguyen
import * as React from "react";
import Slider from "react-slick";
import { FeaturedSingleAthlete } from "../athletes/featuredSingleAthlete";
import { AthletesApi } from "../../api/Athletes/index";
import { IFeaturedSingleAthlete } from "../../interfaces/dashboard/";
import { FollowAthleteButton, IFollowAthleteButton } from "../../common/components/followAthlete/followAthleteButtonContainer"
import loadjs from "loadjs";


export interface IFeaturedSingleAthleteState {
    featuredUser: IFeaturedSingleAthlete[];
    label: boolean;
}

export class AthletesNearMe extends React.Component<{}, IFeaturedSingleAthleteState>{
    constructor(props) {
        super(props);
        this.state = {
            featuredUser: [],
            label: false
        }
    }
   
    public componentDidMount() {
        AthletesApi.GetRandomAthletes({
            startZip: 0,
            radius: 200,
            numResults: 10,
            userBaseId: 0
        })
            .then(response => {
                this.setState({
                    featuredUser: response.items
                }, () => loadjs("/content/public/js/player-grid.js"))
            })
   
    }

    private returnSingleAthlete(featuredUser: IFeaturedSingleAthlete) {
        return (
            <div><FeaturedSingleAthlete
                key={featuredUser.key}
                avatarUrl={featuredUser.avatarUrl}
                bgUrl={featuredUser.bgUrl}
                firstName={featuredUser.firstName}
                lastName={featuredUser.lastName}
                nickname={featuredUser.nickname}
                city={featuredUser.city}
                fbUrl={featuredUser.fbUrl}
                twitterUrl={featuredUser.twitterUrl}
                igUrl={featuredUser.igUrl}
                ytUrl={featuredUser.ytUrl}
                userBaseId={featuredUser.userBaseId}
            />
           </div>
        )
    }

    public render() {

        const settings: React.CSSProperties = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 5000,
            autoplay: true,
            adaptiveHeight: true
        }
		return (
			<div>
		
                <Slider {...settings} >
                    {this.state.featuredUser.map((featuredUser, ndx) => { featuredUser.key = ndx; this.returnSingleAthlete(featuredUser) })}
            </Slider>
            </div>
        );
    }
}
//slider documentation 
//go here to add settings as you need them
//simply add the Slider tag where you need it and add
//import Slider from "react-slick";
// 
//https://github.com/akiran/react-slick
//