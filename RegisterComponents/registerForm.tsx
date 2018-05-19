import * as React from "react";
import { Link } from "react-router";
import { IRegisterEntity, IRegisterForm } from "../../interfaces/register";
import { IKeyValue } from "../../interfaces";
import { Button, Input, Password, DropDownList, RadioButtonList } from "../../common/components/form";
//Kenneth Nguyen
export const RegisterForm: React.StatelessComponent<IRegisterForm> = (props: IRegisterForm) => {
	return (
		<div className="tg-modal-content">
			<div className="tg-formarea">
				<div className="tg-border-heading">
					<h3>Signup</h3>
				</div>
				<form className="tg-registerform" method="post">
					<fieldset>
						<Input label="First Name"
							type="text"
							error={props.firstNameErrorMsg}
							name="firstName"
							value={props.registerEntity.firstName}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="First Name" />
						<Input label="Middle Name"
							type="text"
							error={props.middleNameErrorMsg}
							name="middleName"
							value={props.registerEntity.middleName}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="Middle Name" />
						<Input label="Last Name"
							type="text"
							error={props.lastNameErrorMsg}
							name="lastName"
							value={props.registerEntity.lastName}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="Last Name" />
						<Input label="Email"
							type="email"
							error={props.emailErrorMsg}
							name="email"
							value={props.registerEntity.email}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="Email" />
						<Input type="password"
							label="Password"
							error={props.passwordErrorMsg}
							name="password"
							value={props.registerEntity.password}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="Password" />
						<Input type="password"
							label="Confirm Password"
							error={props.confirmPasswordErrorMsg}
							name="confirmPassword"
							value={props.registerEntity.confirmPassword}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="Confirm Password" />
						<div className="row">
							<div className="col-sm-6 col-md-6">
								<DropDownList
									onChange={props.onDropDownChange} //onChange of the dropdown (selecting a dropdown) fire off the onDropDownChange which will recored the event.target.key && event.target.value and send that back so we can post the selection with an AJAX call
									//maping the result of the selected value to the register entity who's input name is "role"
									selectedValue={props.registerEntity.role} //pipeline to pass through selected value
									label="Role"
									name="role"//since the name is role, the Idropdown will map the value from the value of the api call to the selectedValue={props.registerEntity.role}
									error={props.roleErrorMsg}
									options={[//hard coded options for a short list of radio buttons
										{ key: "default", value: "Select One" },
										{ key: "Fan", value: "Fan" },
										{ key: "Prospect", value: "Prospect" },
										{ key: "Third Party", value: "Third Party" }
									]}
								/>
							</div>
							<div className="col-sm-5 col-md-5 col-md-offset-1 col-sm-offset-1">
								{props.registerEntity.role === "Prospect" ?
									<DropDownList
										onChange={props.onDropDownChange} //onChange of the dropdown (selecting a dropdown) fire off the onDropDownChange which will recored the event.target.key && event.target.value and send that back so we can post the selection with an AJAX call
										//maping the result of the selected value to the register entity who's input name is "role"
										selectedValue={props.registerEntity.athleteTypeId} //pipeline to pass through selected value
										label="Sport"
										name="athleteTypeId"//since the name is role, the Idropdown will map the value from the value of the api call to the selectedValue={props.registerEntity.role}
										error={props.athleteTypeIdErrorMsg}
										options={props.sports}
									/>
									:
									""}
							</div>
						</div>
						<Input type="number"
							label="Postal / Zip Code"
							error={props.postalCodeErrorMsg}
							name="postalCode"
							value={props.registerEntity.postalCode}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="5 Digit" />
						<Input type="date"
							label="Date Of Birth"
							error={props.dateOfBirthErrorMsg}
							name="dateOfBirth"
							value={props.registerEntity.dateOfBirth ? props.registerEntity.dateOfBirth : ""}
							onChange={props.onChange}
							onBlur={props.onBlur}
							placeholder="DateOfBirth"
						/>
						<RadioButtonList
							name="gender"
							label="Gender"
							error={props.genderErrorMsg}
							onChange={props.onChange}
							selectedValue={props.registerEntity.gender}
							options={[//hard coded options for a short list of radio buttons
								{ key: "M", value: "Male" },
								{ key: "F", value: "Female" },
								{ key: "O", value: "Other" }
							]}
						/>
						<Button
							className="tg-btn tg-btn-lg"
							onClick={props.onSave}
							disabled={props.buttonDisabled}
							label="Register Now" />
						<p>Already have an account? <a href="/home/login">Login</a></p>
					</fieldset>
				</form>
			</div>
			<div className="tg-logintype">
				<div className="tg-border-heading">
					<h3>Signup with</h3>
				</div>
				<ul>
					<li className="tg-facebook"><a href="#">facebook</a></li>
					<li className="tg-twitter"><a href="#">twitter</a></li>
					<li className="tg-googleplus"><a href="#">google+</a></li>
					<li className="tg-linkedin"><a href="#">linkedin</a></li>
				</ul>
			</div>
		</div>
	)
};
