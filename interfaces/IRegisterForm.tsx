import { IRegisterEntity } from "./IRegisterEntity";
import { IKeyValue } from "../IKeyValue";
export interface IRegisterForm {
    registerEntity: IRegisterEntity;
    onChange: (fieldName: any, value: any) => void;
    onBlur: (fieldName: any, value: any) => void;
    onSave: () => void;
    selectedValue: any;
    options: IKeyValue[];
    buttonDisabled?: boolean;
    firstNameErrorMsg?: string;
    middleNameErrorMsg?: string;
    lastNameErrorMsg?: string;
    emailErrorMsg?: string;
    passwordErrorMsg?: string;
    confirmPasswordErrorMsg?: string;
	roleErrorMsg?: string,
	athleteTypeIdErrorMsg?: string,
    postalCodeErrorMsg?: string,
    dateOfBirthErrorMsg?: string,
    genderErrorMsg?: string;
	onDropDownChange: (FieldName: any, value: any) => void;
	sports: IKeyValue[]
}