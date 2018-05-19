import * as React from "react";
import { IRegisterForm } from "../../interfaces/register";
import { RegisterForm } from "./";

export const RegisterPage: React.StatelessComponent<IRegisterForm> = (props: IRegisterForm) => {
    return (
        //Kenneth Nguyen
        //register page that is kind of useless unless i am using multiple components at the same time
        <div>
            <RegisterForm
				onBlur={props.onBlur}
				onChange={props.onChange}
				onSave={props.onSave}
				onDropDownChange={props.onDropDownChange}
				buttonDisabled={props.buttonDisabled}
				registerEntity={props.registerEntity}
				options={props.options}
				selectedValue={props.selectedValue}
				firstNameErrorMsg={props.firstNameErrorMsg}
				middleNameErrorMsg={props.middleNameErrorMsg}
				lastNameErrorMsg={props.lastNameErrorMsg}
				emailErrorMsg={props.emailErrorMsg}
				passwordErrorMsg={props.passwordErrorMsg}
				confirmPasswordErrorMsg={props.confirmPasswordErrorMsg}
				genderErrorMsg={props.genderErrorMsg}
				roleErrorMsg={props.roleErrorMsg}
				athleteTypeIdErrorMsg={props.athleteTypeIdErrorMsg}
				postalCodeErrorMsg={props.postalCodeErrorMsg}
				dateOfBirthErrorMsg={props.dateOfBirthErrorMsg}
				sports={props.sports}
            />
        </div>
    );
}

     //<div>
        //    <a href="javascript()" data-toggle="modal" data-target="#tg-register">Register</a>
        //    <RegisterForm />
        //</div>