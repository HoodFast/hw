import {WithId} from "mongodb";
import {UsersTypeDb} from "../db/usersDBModel";
import {OutputUsersType} from "../output/output.users.models";


export const userMapper = (user: WithId<UsersTypeDb>): OutputUsersType => {

    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}