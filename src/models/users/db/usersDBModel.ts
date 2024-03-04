export type UsersTypeDb = {
    accountData: {
        _passwordHash: string
        login: string,
        email: string,
        createdAt: Date
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    tokensBlackList: string[]
}
