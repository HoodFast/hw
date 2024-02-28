import {config} from 'dotenv'

config()
export const appConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_TYPE: process.env.DB_TYPE as string,
    AC_SECRET: process.env.AC_SECRET as string | '321',
    AC_TIME: process.env.AC_TIME as string | '10s',
    RT_TIME: process.env.AC_TIME as string | '20s',
    RT_SECRET: process.env.RT_SECRET as string | '123',
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string
}