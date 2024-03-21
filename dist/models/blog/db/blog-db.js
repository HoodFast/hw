"use strict";
// export type BlogDbType = {
//     name:string
//     description:string
//     websiteUrl:string
//     createdAt: string
//     isMembership: boolean
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogDbType = void 0;
class BlogDbType {
    constructor(name, description, websiteUrl, createdAt, isMembership) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
}
exports.BlogDbType = BlogDbType;
