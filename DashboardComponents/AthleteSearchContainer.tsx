//Kenneth Nguyen
import * as React from "react"
import { IAthleteSearch } from "../../../src/interfaces/athletes"
import { AthleteSearchSingleRow } from "./AthleteSearchSingleRow"
import { AthletesApi } from "../../api/athletes/index";
import { DropDownList } from "../../common/components/form";

export interface IAthleteSearchProps {
    userBaseId?: number,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    createdDate?: Date,
    city?: string,
    typeName?: string,
    isProfessional?: boolean,
    totalRecords?: number,
    onClick?: () => void,
    key?: number
}
interface IAthleteSearchState {
    athletestate: IAthleteSearchProps;
    athlete: IAthleteSearchProps[];//getting
    athleteSearch: IAthleteSearch;//sending
    allTotalRecords: number;
}

export class AthleteSearch extends React.Component<{}, IAthleteSearchState>{
    constructor(props) {
        super(props);
        this.state = {
            athlete: [],
            athletestate: {
                avatarUrl: "",
                city: "",
                firstName: "",
                lastName: "",
                isProfessional: false,
                totalRecords: 0,
                typeName: "",
                userBaseId: 0
            },
            athleteSearch: {
                input: "",
                columnName: "",
                checked: false,
                pageNumber: 1,
                recordsPerPage: 10
            },
            allTotalRecords: 0

        };
        //binds//
        this.AthleteSearch = this.AthleteSearch.bind(this)
        this.setStateOfColumnName = this.setStateOfColumnName.bind(this)
        this.nextPage = this.nextPage.bind(this);
        this.arrowPage = this.arrowPage.bind(this);
        this.mountfunction = this.mountfunction.bind(this)
        this.onClick = this.onClick.bind(this);
        this.setStateOfRecordsPerPage = this.setStateOfRecordsPerPage.bind(this);
    }
    /*onComponentDidMount
    execute api with 'SearchAll' as the sole parameter to get the first set of results
    map the results 
    */
    private mountfunction() {
        AthletesApi.AthleteSearchAll(this.state.athleteSearch)
            .then((response) => {
                if (response.items.length > 0) {
                    this.setState({
                        athlete: response.items,
                        allTotalRecords: response.items[0].totalRecords
                    })
                } else {
                    this.setState({ athlete: response.items, allTotalRecords: 0 })
                }
            })
    }
    public componentDidMount() {
        this.mountfunction()
    }
    /*private function that will reset all values
    if user clicks on reset button, send an api call with default values to reset the state
    and repopulate the search
    */
    private AthleteSearchListPerPage() {
        AthletesApi.AthleteSearchAll(this.state.athleteSearch)
            .then((response) => {
                this.setState({
                    athlete: response.items // set the featuredUser state to the loaded blogs from api call 
                })
            })
    }
    //////////////////////START SEARCH FUNCTIONS/////////////////////////
    public onSearchBarChange(event) {
        this.setState({
            athleteSearch: {
                input: event.target.value,
                //setting the other values to the current defualt values 
                //or else it will send the state as only input
                columnName: "",
                checked: false,
                pageNumber: 1,
                recordsPerPage: this.state.athleteSearch.recordsPerPage
            }
            //If the search bar reaches zero length after the user removes input
            //this will do a get all again to repulate the first page
            //this function has to be called in a promise or else the state wont update untill the next event
        }, () => this.onzero());
    }

    private onzero() {
        if (this.state.athleteSearch.input.length >= 3 || this.state.athleteSearch.input.length == 0) {
            this.AthleteSearch();
        }
    }
    /*private function to fire onclick/search
        fire api with inputs, all optional, default is 'searchAll'
        store results into this.state.athleteSearchProps[] and map them in the render
        every click of a sort button will send a new api call
        example: clicking the FirstName column with no search parameter will send
        input: "SearchAll",
        columnName: "FirstName",
        checked: "true",
        pageNumber:1
    */
    private AthleteSearch() {
        this.AthleteSearchListPerPage()

    }
    private AthleteSearchOnEnter(event) {
        if (event.key === 'Enter') {
            this.AthleteSearchListPerPage()
            event.preventDefault();
        }
    }

    private setStateOfColumnName(columnNameClicked) {
        const nextState = {
            ...this.state,
            athleteSearch: {
                ...this.state.athleteSearch,
                columnName: columnNameClicked,
                checked: (this.state.athleteSearch.columnName == columnNameClicked ? !this.state.athleteSearch.checked : true),
                pageNumber: 1,
                recordsPerPage: this.state.athleteSearch.recordsPerPage
            }
        }
        this.setState(nextState, () => { this.AthleteSearch() })
    }

    private setStateOfRecordsPerPage(event) {
        const nextState = {
            ...this.state,
            athleteSearch: {
                ...this.state.athleteSearch,
                columnName: this.state.athleteSearch.columnName,
                input: this.state.athleteSearch.input,
                checked: this.state.athleteSearch.checked,
                recordsPerPage: event.target.value,
                pageNumber: 1
            }
        }
        this.setState(nextState, () => { this.AthleteSearch() })
    }

    //////////////////////END SEARCH FUNCTIONS/////////////////////
    ////////////////////PAGINATION FUNCTIONS///////////////////////
    public nextPage(page) {
        this.setState({
            athleteSearch: {
                ...this.state.athleteSearch,
                pageNumber: page
            }
        }, () => this.AthleteSearch())

    }

    public arrowPage(direction) {
        var newPage = this.state.athleteSearch.pageNumber + direction;
        this.nextPage(newPage)
    }

    public onClick() {
        //hardcoded 1 so it will always return the first page of the search
        this.nextPage(1);
    }
    /////////////////END PAGINATION FUNCTIONS/////////////////


    //private function that takes in properties of an object in the athlete[] array state and maps them to this template    
    private returnAthleteSearchSingleRow(athlete: IAthleteSearchProps, ndx) {
        return (
            <AthleteSearchSingleRow
                key={ndx}
                avatarUrl={athlete.avatarUrl}
                firstName={athlete.firstName}
                lastName={athlete.lastName}
                city={athlete.city}
                typeName={athlete.typeName}
                isProfessional={athlete.isProfessional}
                userBaseId={athlete.userBaseId}
            />
        )
    }
    public render() {
        var totalPages = [];
        if (this.state.athleteSearch.input !== "") {
            //this is to change the totalpage count to the search return length
            var pageCount = Math.ceil(this.state.athlete.length / this.state.athleteSearch.recordsPerPage)
        } else {
            //must be changed once the fix on multiple tier subscriptions made
            var pageCount = Math.ceil(this.state.allTotalRecords / this.state.athleteSearch.recordsPerPage)
        }
        //looping through the page count to determine the totalpages needed. Could have done in sql also
        for (var i = 1; i <= pageCount; i++) {
            totalPages.push(i);
        }

        const disabled: React.CSSProperties = {//used to disable the arrow if on first/last page
            pointerEvents: 'none'
        };
        const enabled: React.CSSProperties = {}
        const maxPage = this.state.athleteSearch.pageNumber >= totalPages.length; //used to find the first/last page and place an arrow
        const changeColor: React.CSSProperties = {
            background: '#333',
            color: '#ffcc33'
        }
        return (
            <React.Fragment>
                <div className="an-single-component with-shadow">
                    <div className="an-component-header">
                        <div className="component-header-right">
                            <form className="an-form" action="#">
                                <div className="an-search-field" style={{ padding: "10px" }}>
                                    <input
                                        name="searchBar"
                                        className="an-form-control"
                                        type="text"
                                        placeholder="Search..."
                                        onChange={this.onSearchBarChange.bind(this)}
                                        onKeyPress={this.AthleteSearchOnEnter.bind(this)}
                                        style={{ width: '350px' }}
                                    />
                                    <button
                                        className="an-btn an-btn-icon"
                                        type="button"
                                        onClick={this.AthleteSearch}>
                                        <i style={{ top: "10px", right: "10px", position: "relative" }} className="icon-search" />
                                    </button>
                                </div>
                            </form>
                            <div className="an-default-wrapper">
                                <select name="sort"
                                    style={{ marginTop: '5px' }}
                                    onChange={this.setStateOfRecordsPerPage}
                                    value={this.state.athleteSearch.recordsPerPage}
                                >
                                    <option value="10">Show 10</option>
                                    <option value="25">Show 25</option>
                                    <option value="50">Show 50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="an-component-body">
                        <div className="an-user-lists">
                            <div className="list-title">
                                <h6 className="basis-10"><strong><a style={{ color: 'black' }} >Prospect</a></strong></h6>
                                <h6 className="basis-10"><a onClick={() => this.setStateOfColumnName("FirstName")} style={{ color: 'black' }} >First Name</a></h6>
                                <h6 className="basis-20"><a onClick={() => this.setStateOfColumnName("LastName")} style={{ color: 'black' }} >Last Name</a></h6>
                                <h6 className="basis-20"><a onClick={() => this.setStateOfColumnName("City")} style={{ color: 'black' }} >City</a></h6>{/*maybe set onlick send a parameter to say which column is clicked*/}
                                <h6 className="basis-20"><a onClick={() => this.setStateOfColumnName("TypeName")} style={{ color: 'black' }} >Sport</a></h6>
                                <h6 className="basis-15"><a onClick={() => this.setStateOfColumnName("IsProfessional")} style={{ color: 'black' }} >Professional</a></h6>
                            </div>
                            <div className="an-lists-body an-customScrollbar" style={{ maxHeight: 'max-content' }}>
                                {this.state.athlete.map((athlete, ndx) => this.returnAthleteSearchSingleRow(athlete, ndx))}
                            </div>
                        </div>
                    </div>
                    {/**************************************************************START PAGINATION*************************************************************/}
                    <div className="an-page-container">
                        <div className="an-pagination-container center">
                            <ul className="pagination">
                                <li>
                                    <a href="javascript:;" aria-label="Previous" style={this.state.athleteSearch.pageNumber <= 1 ? disabled : enabled}
                                        onClick={(e) => {
                                            this.arrowPage(-1);
                                            return false;
                                        }} >
                                        <span aria-hidden="true"><i className="ion-chevron-left"></i></span>
                                    </a>
                                </li>
                                {totalPages.map((page, index) => {
                                    return (
                                        <li key={index}>
                                            <a href="javascript:;"
                                                style={page == this.state.athleteSearch.pageNumber ? changeColor : enabled}
                                                onClick={(e) => {
                                                    this.nextPage(page);
                                                    return false;
                                                }} >{page}</a>
                                        </li>
                                    )
                                })}
                                <li>
                                    <a href="javascript:;" aria-label="Next" style={maxPage ? disabled : enabled}
                                        onClick={(e) => {
                                            this.arrowPage(1);
                                            return false;
                                        }} >
                                        <span aria-hidden="true"><i className="ion-chevron-right"></i></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/**************************************************************END PAGINATION*************************************************************/}
                </div>
            </React.Fragment>
        );
    }
}