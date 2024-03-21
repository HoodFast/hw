// export type BlogDbType = {
//     name:string
//     description:string
//     websiteUrl:string
//     createdAt: string
//     isMembership: boolean
// }


export class BlogDbType {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
    }

}
