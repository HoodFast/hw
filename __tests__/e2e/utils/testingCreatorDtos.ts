export const testingDtosCreator = {
    createUserDto() {
        return {
            login: "test",
            email: "test@mail.com",
            pass: "1234567788"
        }
    },
    createUserDtos(count: number) {
        const users = []

        for (let i = 0; i <= count; i++) {
            users.push({
                login: `test ${i}`,
                email: `test${i}@mail.com`,
                pass: "1234567788"
            })
        }
        return users
    }
}
