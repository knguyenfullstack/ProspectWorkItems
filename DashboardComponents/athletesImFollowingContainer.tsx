//Kenneth Nguyen
import * as React from "react";
import { SingleAthletesImFollowing } from "../../components/athletes/singleAthletesImFollowing";
import { IFeaturedSingleAthlete } from "../../interfaces/dashboard/";
import { AthletesApi } from "../../api/athletes/index";
import { IAthleteSearch } from "../../interfaces/athletes"
import { AthletesNearMe } from "./athletesNearMe"

interface IFeaturedSingleAthleteState {
    athleteSearch: IAthleteSearch;//sending
    featuredUser: IFeaturedSingleAthlete[];
    totalPages: number;
    totalAthletesImFollowing: number;
}

export class AthletesImFollowingContainer extends React.Component<{}, IFeaturedSingleAthleteState>{
    constructor(props) {
        super(props);
        this.state = {
            athleteSearch: {
                input: "",
                pageNumber: 1
            },
            totalPages: 1,
            totalAthletesImFollowing: 0,
            featuredUser: []
        }
    }
    public componentDidMount() {
        this.AthletesImFollowingListPerPage()
    }
    // function to GET a paginated list of Athletes I'm Following
    private AthletesImFollowingListPerPage() {
        AthletesApi.GetAllFanInfoByFanPagination(this.state.athleteSearch) //created an api call to GET ALL featuredUser list 
            .then((response) => {
                (response.items.length > 0 ?
                    this.setState({
                        featuredUser: response.items, // set the featuredUser state to the loaded blogs from api call 
                        totalPages: response.items[0].totalPages,
                        totalAthletesImFollowing: response.items[0].totalRecords
                    })
                    :
                    this.setState({
                        featuredUser: response.items, // set the featuredUser state to the loaded blogs from api call 
                        totalPages: 1,
                        totalAthletesImFollowing: 0
                    })
                )

            })
    }
    /////////////////START PAGINATION FUNCTIONS///////
    private getPage(direction: number) { // gets new page 
        let newPage = this.state.athleteSearch.pageNumber + direction; // gets current page and adds or removes 1 
        this.setState({
            athleteSearch: {
                pageNumber: newPage
            }// makes current page the new page loaded 
        }, () => { this.AthletesImFollowingListPerPage() });//fires the get athletesImFollowing function thats already wired to open current page 
    }
    private jumpToPage(pageNumber: number) {
        this.setState({
            athleteSearch: {
                pageNumber: pageNumber
            }// makes current page the new page loaded 

        }, () => { this.AthletesImFollowingListPerPage() });
    }
    //////////////END PAGINATION FUNCTIONS////////////
    ///////////////START SEARCH FUNCTION//////////////
    public onSearchBarChange(event) {
        this.setState({
            athleteSearch: {
                input: event.target.value,
                pageNumber: 1
            }
        }, () => this.onZero());
    }
    private onZero() {
        if (this.state.athleteSearch.input.length >= 3 || this.state.athleteSearch.input.length == 0) {
            this.AthletesImFollowingListPerPage();
        }
    }
    private AthleteSearchOnEnter(event) {
        if (event.key === 'Enter') {
            this.AthletesImFollowingListPerPage()
            event.preventDefault();
        }
    }
    ///////////////END SEARCH FUNCTION///////////////
    private returnSingleAthlete(featuredUser: IFeaturedSingleAthlete, ndx) {
        return (
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
                userBaseId={featuredUser.userBaseId}
            />
        )
    }
    public render() {
        var pagesArray = [];
        const disabled: React.CSSProperties = {
            pointerEvents: 'none'
        };
        const enabled: React.CSSProperties = {}
        const maxPage = this.state.athleteSearch.pageNumber >= this.state.totalPages;
        const minPage = this.state.athleteSearch.pageNumber <= 1;
        const changeColor: React.CSSProperties = {
            background: '#333',
            color: '#ffcc33'
        }
        return (
            <React.Fragment>
                <div style={{ overflow: 'hidden', maxHeight: 'inherti' }}>
                    <div className="an-component-header" >
                        <div className="col-md-5 component-header-right " >
                            <form className="an-form">
                                <div className="an-search-field">
                                    <input
                                        name="searchBar"
                                        className="an-form-control"
                                        type="text"
                                        placeholder="Search..."
                                        onChange={this.onSearchBarChange.bind(this)}
                                        onKeyPress={this.AthleteSearchOnEnter.bind(this)}
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        className="an-btn an-btn-icon"
                                        type="button"
                                        onClick={this.AthletesImFollowingListPerPage.bind(this)}>
                                        <i className="icon-search"></i>
                                    </button>

                                </div>
                            </form>
                        </div>

                        {/**************************************************************START PAGINATION*************************************************************/}
                        <div className="col-md-3 an-pagination-container" style={{ padding: '0px' }}>
                            <ul className="pagination">
                                <li>
                                    <a href="javascript:;" aria-label="Previous" style={minPage ? disabled : enabled}
                                        onClick={(e) => {
                                            this.getPage(-1);
                                            return false;
                                        }} >
                                        <span aria-hidden="true"><i className="ion-chevron-left"></i></span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:;" aria-label="Next" style={maxPage ? disabled : enabled}
                                        onClick={(e) => {
                                            this.getPage(1);
                                            return false;
                                        }} >
                                        <span aria-hidden="true"><i className="ion-chevron-right"></i></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/**************************************************************END PAGINATION*************************************************************/}
                        <div className="col-md-4" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                            <span>Following: {this.state.totalAthletesImFollowing}</span>
                        </div>
                    </div>
                    <div className="an-component-body row">
                        <div className="an-user-lists">
                            <div className="an-lists-body">
                                {this.state.featuredUser.map((featuredUser, ndx) => this.returnSingleAthlete(featuredUser, ndx))}
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ textAlign: "center", width: '100%' }}>
                        <span><strong >{this.state.athleteSearch.pageNumber} of {this.state.totalPages}</strong></span>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
