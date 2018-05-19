import * as React from "react";
import { RegisterPage } from "./";
import * as toastr from "toastr";
import { UserApi } from "../../api/users";
import { AthletesApi } from "../../api/Athletes";
import { IRegisterEntity } from "../../interfaces/register";
import { ModalWindow } from "../../common/components/modal";
import { IError, IKeyValue } from "../../interfaces";
import { browserHistory } from "react-router";
import { Validation } from "../../common/components/Validation";
import { IResendValidation } from "../../interfaces/register/IResendValidation";

//Kenneth Nguyen
interface IRegisterErrors {
	firstName: string,
	middleName: string,
	lastName: string,
	email: string,
	password: string,
	confirmPassword: string,
	role: string,
	postalCode: string,
	dateOfBirth: string,
	gender: string,
	athleteTypeId: string
}
interface IRegisterState {
	registerEntity: IRegisterEntity
	formErrors: IRegisterErrors;
	//set all isvalid as boolean so we can toggle them as true or false based on the current state
	isFormValid: boolean;
	isFirstNameValid: boolean;
	isMiddleNameValid: boolean;
	isLastNameValid: boolean;
	isEmailValid: boolean;
	isPasswordValid: boolean;
	isConfirmPasswordValid: boolean;
	isRoleValid: boolean;
	isPostalCodeValid: boolean;
	isDateOfBirthValid: boolean;
	isGenderValid: boolean;
	isAthleteTypeValid: boolean;
	// declare state to use below and give it type, import IkeyValue[] and set option's type equal to it
	options: IKeyValue[];
	selectedValue: any;
	sports: IKeyValue[];
	showModal: boolean;
	registerSuccess: boolean;
	emailSent: boolean;
	verifiedUser: boolean;

}
const FormErrors: React.StatelessComponent<IRegisterErrors> = (props) => {
	//insert a <p> where the form has the errors prop 
	//see component interface to see where the error message will show
	return (
		<div className="formErrors">
			{Object.keys(props).map((fieldName, i) => {
				if (props[fieldName].length > 0)
					return <p key={i}>{fieldName} {props[fieldName]}</p>
			})}
		</div>
	);
}

export class RegisterContainer extends React.Component<{}, IRegisterState>{
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			selectedValue: 0,
			options: [],//initialize options within the state so we can pass values through it using setState()
			//initialize state to null so it does not over ride the place holder
			//all values can technically be set to null, but some javascript methods like toString() will not work on a null
			registerEntity: {
				firstName: "",
				middleName: "",
				lastName: "",
				email: "",
				password: "",
				confirmPassword: "",
				role: "",
				postalCode: "",
				dateOfBirth: null,
				gender: null,
				athleteTypeId: "0"
			},
			//setting validation values to false
			isFormValid: false,
			isFirstNameValid: false,
			isMiddleNameValid: false,
			isLastNameValid: false,
			isEmailValid: false,
			isPasswordValid: false,
			isConfirmPasswordValid: false,
			isRoleValid: false,
			isPostalCodeValid: false,
			isDateOfBirthValid: false,
			isGenderValid: false,
			isAthleteTypeValid: false,
			formErrors: {
				firstName: "",
				middleName: "",
				lastName: "",
				email: "",
				password: "",
				confirmPassword: "",
				role: "",
				postalCode: "",
				dateOfBirth: null,
				gender: "",
				athleteTypeId: ""
			},
			sports: [],
			registerSuccess: false,
			emailSent: false,
			verifiedUser: false
		};
		this.onFieldChange = this.onFieldChange.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.modalToggle = this.modalToggle.bind(this);
		this.onResend = this.onResend.bind(this);
		this.existsModal = this.existsModal.bind(this);
		this.unverifiedUser = this.unverifiedUser.bind(this);
	}
	private onFieldChange(fieldName: any, fieldValue: any) {
		const nextState = {
			...this.state,
			registerEntity: {
				...this.state.registerEntity,
				[fieldName]: fieldValue
			}
		}
		//if statement for dropdown validation on change to another element
		//will check if the current field is "role" and execute validation for that field
		//since live validation isnt possible since there are not user inputs 
		//set state will set the state on the next fieldchange, therefore
		//we need to manually set the state at the moment of changing the gender radio button
		//
		if (fieldName == "role" || fieldName == "gender" || fieldName == "athleteTypeId") {
			this.setState(nextState, () => { this.validateField(fieldName, fieldValue) });
		} else {
			this.setState(nextState);
		}
	}
	private onBlur(fieldName: any, fieldValue: any) {
		const nextState = {
			...this.state,
			registerEntity: {
				...this.state.registerEntity,
				[fieldName]: fieldValue
			}
		}
		this.setState(nextState, () => { this.validateField(fieldName, fieldValue) });
	};

	public componentDidMount() {
		let sports: IKeyValue[] = [{ key: "0", value: "Select a sport" }];
		AthletesApi.getAthleteTypes()
			.then(response => {
				//console.log(response)
				response.items.map(item =>
					sports.push({ key: item.id.toString(), value: item.typeName })
				)
				this.setState({
					sports: sports
				})
			})
	}

	private validateField(fieldName: any, fieldValue: any) {
		let errorMessage = this.state.formErrors;
		let isFirstNameValid = this.state.isFirstNameValid;
		let isMiddleNameValid = this.state.isMiddleNameValid;
		let isLastNameValid = this.state.isLastNameValid;
		let isEmailValid = this.state.isEmailValid;
		let isPasswordValid = this.state.isPasswordValid;
		let isConfirmPasswordValid = this.state.isConfirmPasswordValid;
		let isPostalCodeValid = this.state.isPostalCodeValid;
		let isGenderValid = this.state.isGenderValid;
		let isRoleValid = this.state.isRoleValid;
		let isAthleteTypeValid = this.state.isAthleteTypeValid;
		let isDateOfBirthValid = this.state.isDateOfBirthValid;
		//switch statement that will take the fieldname from the state and match it to the 
		//case name to execute the propper validation 

		//console.log(fieldName);

		switch (fieldName) {
			case "firstName":
				let firstNameErrMsg: IError = Validation.validateFirstName(fieldValue);
				isFirstNameValid = !firstNameErrMsg.isNotValid;
				errorMessage.firstName = firstNameErrMsg.errMsg;
				break;
			case "middleName":
				let middleNameErrMsg: IError = Validation.validateMiddleName(fieldValue);
				isMiddleNameValid = !middleNameErrMsg.isNotValid;
				errorMessage.middleName = middleNameErrMsg.errMsg;
				break;
			case "lastName":
				let lastNameErrMsg: IError = Validation.validateLastName(fieldValue);
				isLastNameValid = !lastNameErrMsg.isNotValid;
				errorMessage.lastName = lastNameErrMsg.errMsg;
				break;
			case "email":
				let emailErrMsg: IError = Validation.validateEmail(fieldValue);
				isEmailValid = !emailErrMsg.isNotValid;
				errorMessage.email = emailErrMsg.errMsg;
				break;
			case "password":
				let passwordErrMsg: IError = Validation.validatePassword(fieldValue);
				isPasswordValid = !passwordErrMsg.isNotValid;
				errorMessage.password = passwordErrMsg.errMsg;
				break;
			case "confirmPassword":
				if (this.state.registerEntity.confirmPassword == this.state.registerEntity.password) {
					isConfirmPasswordValid = true;
					errorMessage.confirmPassword = ""
				} else {
					isConfirmPasswordValid = false;
					errorMessage.confirmPassword = "Passwords do not match"
				}
				break;
			case "postalCode":
				let postalCodeErrMsg: IError = Validation.validatePostalCode(fieldValue);
				isPostalCodeValid = !postalCodeErrMsg.isNotValid;
				errorMessage.postalCode = postalCodeErrMsg.errMsg;
				break;
			case "gender":
				let genderErrMsg: IError = Validation.validateGender(fieldValue);
				isGenderValid = !genderErrMsg.isNotValid;
				errorMessage.gender = genderErrMsg.errMsg;
				break;
			case "role":
				let roleErrMsg: IError = Validation.validateRole(fieldValue);
				isRoleValid = !roleErrMsg.isNotValid;
				errorMessage.role = roleErrMsg.errMsg;
				break;
			case "athleteTypeId":
				let sportErrMsg: IError = Validation.validateAthleteTypeId(fieldValue);
				isAthleteTypeValid = !sportErrMsg.isNotValid;
				errorMessage.athleteTypeId = sportErrMsg.errMsg;
				break;
			case "dateOfBirth":
				let dateOfBirthErrMsg: IError = Validation.validateDateOfBirth(fieldValue);
				isDateOfBirthValid = !dateOfBirthErrMsg.isNotValid;
				errorMessage.dateOfBirth = dateOfBirthErrMsg.errMsg;
				break;
			default: false;
		}
		this.setState({
			formErrors: errorMessage, isFirstNameValid: isFirstNameValid,
			isMiddleNameValid,
			isLastNameValid: isLastNameValid,
			isEmailValid: isEmailValid,
			isPasswordValid: isPasswordValid,
			isConfirmPasswordValid: isConfirmPasswordValid,
			isPostalCodeValid: isPostalCodeValid,
			isGenderValid: isGenderValid,
			isRoleValid: isRoleValid,
			isAthleteTypeValid: isAthleteTypeValid,
			isDateOfBirthValid: isDateOfBirthValid
		}, this.validateForm);
	}
	private validateForm() {
		this.setState({
			isFormValid: this.state.isFirstNameValid &&
			this.state.isMiddleNameValid &&
			this.state.isLastNameValid &&
			this.state.isEmailValid &&
			this.state.isPasswordValid &&
			this.state.isConfirmPasswordValid &&
			this.state.isPostalCodeValid &&
			this.state.isGenderValid &&
			this.state.isDateOfBirthValid &&
			this.state.isRoleValid
		});
	}
	private onSave() {
		//when onsave funciton is fired the first thing that will execute is a full form validation 
		//to highlight where the user still needs to enter inputs
		//if not then the onBlur will not catch invalid inputs if the 
		//user never clicks on the input forms before reaching the submit button
		Object.keys(this.state.registerEntity).forEach((itm) => {
			this.validateField(itm, this.state.registerEntity[itm]);
		})
		if (this.state.isFormValid == true) {
			//execute the post api call with valid user inputs
			UserApi.registerUser(this.state.registerEntity)
				.then((response) => {
					//console.log(response)
					if (response.item === "success") {
						this.setState({
							registerSuccess: true
						})
					} else if (response.item === "verifieduser") {
						this.setState({
							verifiedUser: true
						})
					} else {
						this.setState({
							registerEntity: {
								...this.state.registerEntity,
								token: response.item
							}
						})
					}
					this.modalToggle();
					// return <Redirect to='/url' />;
				}, (err) => {
					toastr.error("Register Failed");
				})
				.catch((err) => {
					toastr.error("Register Failed");
				});
		}
	}

	private onResend() {
		let resend: IResendValidation = {
			email: this.state.registerEntity.email,
			token: this.state.registerEntity.token
		};
		UserApi.resendValidation(resend)
			.then((response) => {
				//console.log(response)
				this.setState({
					emailSent: true
				})
			}, (err) => {
				toastr.error("Register Failed");
			})
			.catch((err) => {
				toastr.error("Register Failed");
			});
	}

	private modalToggle() {
		//console.log(this.state)
		this.setState({ showModal: !this.state.showModal })
	}

	private successModal() {
		return (
			<div style={{ textAlign: 'center' }}>
				<h4>Thank You For Registering!</h4>
				<br />
				<p>Please check your email for confirmation link.</p>
				<br />
				<div className="tg-description">
					<p>Click Here To <a href="/home/login">Login</a></p>
				</div>
			</div>
		)
	}

	private existsModal() {
		return (
			<div style={{ textAlign: 'center' }}>
				<h4>This user already exists!</h4>
				<br />
				{this.state.verifiedUser ? this.verifiedUser() : this.unverifiedUser()}
			</div>
		)
	}

	private verifiedUser() {
		return (
			<div className="tg-description">
				<p>Click Here To <a href="/home/login">Login</a></p>
			</div>
		)
	}

	private unverifiedUser() {
		return (
			<React.Fragment>
				{!this.state.emailSent ?
					<div className="tg-description">
						<p> Your email needs to be verified. Please click <a href="#" onClick={this.onResend}>here</a> to resend the confirmation email.</p>
					</div>
					:
					<div className="tg-description">
						<p>Email sent! Click Here To <a href="/home/login">Login</a></p>
					</div>
				}
			</React.Fragment>
		)
	}

	public render() {
		return (
			<div>
				<div>
					<RegisterPage
						onBlur={this.onBlur}
						onChange={this.onFieldChange}
						onSave={this.onSave}
						onDropDownChange={this.onFieldChange}
						//buttonDisabled={!this.state.isFormValid}going with onclick validation instead of disabling the button so the user knows what they missed
						registerEntity={this.state.registerEntity}
						options={this.state.options}
						selectedValue={this.state.selectedValue}
						firstNameErrorMsg={this.state.formErrors.firstName}
						middleNameErrorMsg={this.state.formErrors.middleName}
						lastNameErrorMsg={this.state.formErrors.lastName}
						emailErrorMsg={this.state.formErrors.email}
						passwordErrorMsg={this.state.formErrors.password}
						confirmPasswordErrorMsg={this.state.formErrors.confirmPassword}
						genderErrorMsg={this.state.formErrors.gender}
						roleErrorMsg={this.state.formErrors.role}
						athleteTypeIdErrorMsg={this.state.formErrors.athleteTypeId}
						postalCodeErrorMsg={this.state.formErrors.postalCode}
						dateOfBirthErrorMsg={this.state.formErrors.dateOfBirth}
						sports={this.state.sports}
					/>

				</div>
				<ModalWindow showModal={this.state.showModal}
					onClose={this.modalToggle}>
					{this.state.registerSuccess ? this.successModal() : this.existsModal()}
				</ModalWindow>
			</div>
		);
	}
}