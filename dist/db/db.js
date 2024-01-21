"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.db = {
    blogs: [
        { id: '1', description: 'йа описание', name: 'Favorite name', websiteUrl: 'web Url' },
        { id: '2', description: 'йа описание', name: 'Best name', websiteUrl: 'web Url' },
    ],
    posts: [
        {
            id: '11',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is girl",
            blogId: "1",
            blogName: 'Favorite name'
        },
        {
            id: '22',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is man",
            blogId: "2",
            blogName: 'Best Name'
        }
    ]
};
