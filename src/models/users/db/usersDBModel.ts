export type UsersTypeDb = {
    accountData: accountDataType
    emailConfirmation: emailConfirmationType
    tokensBlackList: string[]
}


export type accountDataType = {
    _passwordHash: string
    recoveryCode?:string
    login: string,
    email: string,
    createdAt: Date
}
export type emailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}