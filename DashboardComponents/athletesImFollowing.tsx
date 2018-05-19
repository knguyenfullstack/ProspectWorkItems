//Kenneth Nguyen
import * as React from "react";
import { SingleAthletesImFollowing } from "../../components/athletes/singleAthletesImFollowing";
import { IFeaturedSingleAthlete } from "../../interfaces/dashboard/";
import { AthletesApi } from "../../api/athletes/index";

 interface IFeaturedSingleAthleteState {
    featuredUser: IFeaturedSingleAthlete[];
}

export class AthletesImFollowing extends React.Component<{}, IFeaturedSingleAthleteState>{
    constructor(props) {
        super(props);
        this.state = {
            featuredUser: []
        }
    }

    public componentDidMount() {
        AthletesApi.getAllAthleteInfo()
            .then((response) => {
                this.setState({
                    featuredUser: response.items
                })
                //console.log(this.state.featuredUser)
            });
        console.log(this.state.featuredUser)
    }
    private returnSingleAthlete(featuredUser: IFeaturedSingleAthlete, ndx : number) {
        return (
            <div key={ndx}>
                <SingleAthletesImFollowing
                key={ndx}
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
            />
                </div>
        )
    }
    public render() {
        return (
            <React.Fragment>
                {this.state.featuredUser.map((featuredUser, ndx) => this.returnSingleAthlete(featuredUser, ndx))}
			</React.Fragment>
        );
    }
}
