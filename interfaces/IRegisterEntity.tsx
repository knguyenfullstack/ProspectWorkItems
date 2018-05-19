export interface IRegisterEntity {
    //entity where the interface is declare, all values going to and from the api/sql database
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
    postalCode: string,
    dateOfBirth: Date,
	gender: string,
	athleteTypeId: string,
	token?: string
}