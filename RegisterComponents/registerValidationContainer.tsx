import * as React from "react";
import { UserApi } from "../../api/users/";


export interface IRegisterValidationEntity {
    token: string

}

export interface IRegisterState {
    RegisterValidationEntity: IRegisterValidationEntity;
}

export class RegisterValidationContainer extends React.Component<any, IRegisterState>{
    constructor(props) {
        super(props);
        this.state = {
            RegisterValidationEntity: {
                token: props.routeParams.Token
            }
        }
    }
    public componentDidMount(this) {

        //this.setState(this.state.RegisterValidationEntity.guid, this.props.routeParams.guid)

        UserApi.ValidateEmail(this.state.RegisterValidationEntity)
            .then((response) => {
                console.log(response)

            })
            .catch((err) => {
                console.log("error token invalid")
            })
    }


    public render() {
        return (
            <div className="tg-description">
                <strong>Thank you for registering!</strong>
                <p>Click here to <a href="/home/login">Login</a></p>
            </div>
        );
    }
}
