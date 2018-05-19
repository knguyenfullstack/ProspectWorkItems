import { IError } from "../../interfaces";

const IError = {
    isNotValid: "",
    errMsg: ""
}

const validateFirstName = (firstName: string): IError => {
    if (firstName.length < 1) {
        return { isNotValid: true, errMsg: "Please enter a first name" };
    }
    if (firstName.length > 50) {
        return { isNotValid: true, errMsg: "First name too Long" };
    }
    return { isNotValid: false, errMsg: "" }

}

const validateMiddleName = (MiddleName: string): IError => {
    if (MiddleName.length > 50) {
        return { isNotValid: true, errMsg: "Middle name too Long" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validateLastName = (LastName: string): IError => {
    if (LastName.length < 1) {
        return { isNotValid: true, errMsg: "Please enter a last name" };
    }
    if (LastName.length > 100) {
        return { isNotValid: true, errMsg: "Last name too Long" };
    }
    return { isNotValid: false, errMsg: "" };
}


const validateEmail = (email: string): IError => {
    if (email.length < 0) {
        return { isNotValid: true, errMsg: "Email is too short" };
    }
    else if (email.length > 128) {
        return { isNotValid: true, errMsg: "Email is too long" };
    }
        //regular expression to check if email is in name@email.com format
    else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return { isNotValid: true, errMsg: "Must be a valid email" }
    }
    return { isNotValid: false, errMsg: "" };
}

const validatePassword = (password: string): IError => {
    if (password.length < 8) {
        return { isNotValid: true, errMsg: "Password is too short, must be at least 8 characters long" };
    }
    else if (password.length > 128) {
        return { isNotValid: true, errMsg: "Password is too long, must be 128 characters or less" };
    }
    else if (!/\d/.test(password)) {
        return { isNotValid: true, errMsg: "Password must include a number" };
    }
    else if (!/[a-zA-Z]/.test(password)) {
        return { isNotValid: true, errMsg: "Password must include a letter" };
    }
    else if (!/[!\@\#\$\%\^\&\*\(\)\_\+\-\=]/.test(password)) {
        return { isNotValid: true, errMsg: "Password must contain 1 special character" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validatePostalCode = (postalCode: number): IError => {

    if (postalCode == null || !/^\d{5}$|^\d{5}/.test(postalCode.toString()) || postalCode.toString().length > 5) {
        return { isNotValid: true, errMsg: "Please enter a valid 5 digit US postal code" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validateGender = (gender: string): IError => {
    if (gender == null || gender == "") {
        return { isNotValid: true, errMsg: "Please select a gender" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validateRole = (role: string): IError => {
    if (role == "" || role == "default") {
        return { isNotValid: true, errMsg: "Please choose a role" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validateAthleteTypeId = (type: string): IError => {
	if (type == "0") {
		return { isNotValid: true, errMsg: "Please choose a sport" };
	}
	return { isNotValid: false, errMsg: "" };
}


const validateAvatarUrl = (avatarUrl: string): IError => {

    if (avatarUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (avatarUrl.length > 250) {
        return { isNotValid: true, errMsg: "Avatar Url is too Long" };
    } return { isNotValid: false, errMsg: "" }
}


const validateBgImageUrl = (bgImageUrl: string): IError => {

    if (bgImageUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (bgImageUrl.length > 250) {
        return { isNotValid: true, errMsg: "Background Image Url is too Long" };
    } return { isNotValid: false, errMsg: "" }

}

const validateTypeName = (typeName: string): IError => {
    if (typeName.length < 2) {
        return { isNotValid: true, errMsg: "Please enter a type" };
    } 
    return { isNotValid: false, errMsg: "" };
}

const validateTypeDescription = (typeDescription: string): IError => {
    if (typeDescription.length < 2) {
        return { isNotValid: true, errMsg: "Please enter a description" };
    } 
    return { isNotValid: false, errMsg: "" };
}

const validateStreetAddress = (streetAddress: string): IError => {
    if (streetAddress.length < 2 || streetAddress.length > 150 ) {
        return { isNotValid: true, errMsg: "Please enter a valid street address" };
    }
    return { isNotValid: false, errMsg: "" };
}
const validateDateOfBirth = (dateOfBirth: Date): IError => {
    if (dateOfBirth == null || !dateOfBirth) {
        return { isNotValid: true, errMsg: "Please choose a Date of Birth" };
    }
    return { isNotValid: false, errMsg: "" };
}

const validateNotEmpty = (value): IError => {
	if (value.length < 1) {
		return { isNotValid: true, errMsg: "Please enter a value!" };
	}
	return { isNotValid: false, errMsg: "" };
}

const validateBio = (bio: string): IError => {

    if (bio == null) {
        return { isNotValid: false, errMsg: "" }
    } if (bio.length > 3000) {
        return { isNotValid: true, errMsg: "Bio exceeds 3000 characters"  };
    } return { isNotValid: false, errMsg: "" }
}

const validatePosition = (position: string): IError => {
    if (position == null) {
        return { isNotValid: false, errMsg: "" }
    } if (position.length > 50){
        return { isNotValid: true, errMsg: "Input exceeds 50 characters" };
    }
    return { isNotValid: false, errMsg: "" }
}

const validateNickname = (nickname: string): IError => {
    if (nickname == null) {
        return { isNotValid: false, errMsg: "" }
    } if (nickname.length > 50) {

        return { isNotValid: true, errMsg: "Input exceeds 50 characters" };

    } return {isNotValid: false, errMsg:""}
}

const validateBirthplace=(birthplace: string): IError => {
    if (birthplace == null) {
        return { isNotValid: false, errMsg: "" }
    } if (birthplace.length > 50) {

        return { isNotValid: true, errMsg: "Input exceeds 50 characters" };

    } return { isNotValid: false, errMsg: "" }
}
const validateTeam= (team: string): IError => {
    if (team == null) {
        return { isNotValid: false, errMsg: "" }
    } if (team.length > 50) {

        return { isNotValid: true, errMsg: "Input exceeds 50 characters" };

    } return { isNotValid: false, errMsg: "" }
}

const validateFBUrl = (fbUrl: string): IError => {
    if (fbUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (fbUrl.length > 100) {

        return { isNotValid: true, errMsg: "Input exceeds 100 characters" };

    } return { isNotValid: false, errMsg: "" }
}

const validateTwitterUrl = (twitterUrl: string): IError => {
    if (twitterUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (twitterUrl.length > 100) {

        return { isNotValid: true, errMsg: "Input exceeds 100 characters" };

    } return { isNotValid: false, errMsg: "" }
}

const validateIGUrl = (igUrl: string): IError => {
    if (igUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (igUrl.length > 100) {

        return { isNotValid: true, errMsg: "Input exceeds 100 characters" };

    } return { isNotValid: false, errMsg: "" }
}

const validateYTUrl = (ytUrl: string): IError => {
    if (ytUrl == null) {
        return { isNotValid: false, errMsg: "" }
    } if (ytUrl.length > 100) {

        return { isNotValid: true, errMsg: "Input exceeds 100 characters" };

    } return { isNotValid: false, errMsg: "" }
}



//Use this general validation for any input. Checks if field is empty or not.
const validateInput = (input: string): IError => {
    return (input.length > 0) ? { isNotValid: false, errMsg: "" } : { isNotValid: true, errMsg: "Field cannot by empty." };
}

const validateCurrencyInput = (input: string): IError => {
    return (input.length > 0 && (input !== "0.00" && /^\d+(?:\.\d{0,2})$/.test(input))) ? { isNotValid: false, errMsg: "" } : { isNotValid: true, errMsg: "Please enter valid amount" }
}

const validateSubscriptionTierName = (input: string): IError => {
    return (input.length > 0 && input.length <= 100) ? { isNotValid: false, errMsg: "" } : { isNotValid: true, errMsg: "Field cannot by empty. Name must be between 1-100 charachters long" };
}

const validateSubscriptionTierDescription = (input: string): IError => {
    return (input.length > 0 && input.length <= 1000) ? { isNotValid: false, errMsg: "" } : { isNotValid: true, errMsg: "Field cannot by empty. Description must be between 1-1000 charachters long" };
}

const validateSubscriptionTierType = (dropDownValue: string): IError => {
    return (dropDownValue !== "0") ? { isNotValid: false, errMsg: "" } : { isNotValid: true, errMsg: "Please select a Tier Type" };
}

export const Validation = {
    validateFirstName,
    validateMiddleName,
    validateLastName,
    validateEmail,
    validatePassword,
    validatePostalCode,
    validateGender,
    validateRole,
    validateDateOfBirth,
    validateAvatarUrl,
    validateBgImageUrl,
    validateBio,
    validateTypeDescription,
    validateTypeName,
    validateNotEmpty, 
    validateStreetAddress,
    validatePosition, 
    validateNickname, 
    validateBirthplace, 
    validateTeam, 
    validateFBUrl, 
    validateTwitterUrl, 
    validateIGUrl, 
    validateYTUrl,
    validateInput,
    validateCurrencyInput,
    validateSubscriptionTierName,
    validateSubscriptionTierDescription,
	validateSubscriptionTierType,
	validateAthleteTypeId
}