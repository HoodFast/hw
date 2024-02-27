export type UsersTypeDb = {
    accountData: {
        _passwordHash: string
        login: string,
        email: string,
        createdAt: string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    tokensBlackList: string[]
}
