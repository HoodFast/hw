"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blog_route_1 = require("./routes/blog-route");
const posts_route_1 = require("./routes/posts-route");
const testing_route_1 = require("./routes/testing-route");
const user_route_1 = require("./routes/user-route");
const auth_route_1 = require("./routes/auth.route");
const comments_route_1 = require("./routes/comments-route");
const security_route_1 = require("./routes/security.route");
const cookieParser = require('cookie-parser');
exports.app = (0, express_1.default)();
// app.set('trust proxy', true)
exports.app.use(express_1.default.json());
exports.app.use(cookieParser('secret key'));
const baseUrl = '/ht_02/api/';
exports.app.use(`${baseUrl}blogs`, blog_route_1.blogRoute);
exports.app.use(`${baseUrl}posts`, posts_route_1.postRoute);
exports.app.use(`${baseUrl}users`, user_route_1.userRoute);
exports.app.use(`${baseUrl}comments`, comments_route_1.commentsRoute);
exports.app.use(`${baseUrl}auth`, auth_route_1.authRoute);
exports.app.use(`${baseUrl}security`, security_route_1.securityRoute);
exports.app.use(`${baseUrl}testing`, testing_route_1.testingRoute);
const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const videos = [
    {
        id: 0,
        title: "123",
        author: "123",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2024-01-02T21:03:04.165Z",
        publicationDate: "2024-01-02T21:03:04.165Z",
        availableResolutions: [
            "P144"
        ]
    }
];
exports.app.get('/', (req, res) => {
    const createdAt = new Date();
    const publicationDate = new Date();
    const newVideo = {
        id: +(new Date()),
        title: "test",
        author: "test",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: ['144']
    };
    const test = { message: 'server is work 4.0 !' };
    res.send(test);
});
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.filter(item => item.id === id);
    if (isNaN(+req.params.id)) {
        res.sendStatus(400);
        return;
    }
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    res.send(...video);
});
const validate = (title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate) => {
    let errors = {
        errorsMessages: []
    };
    if (publicationDate && typeof publicationDate !== 'string') {
        errors.errorsMessages.push({ message: "invalid publicationDate!", field: 'publicationDate' });
    }
    // @ts-ignore
    if (minAgeRestriction && minAgeRestriction > 18 || minAgeRestriction < 1) {
        errors.errorsMessages.push({ message: "invalid minAgeRestriction!", field: 'minAgeRestriction' });
    }
    if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
        errors.errorsMessages.push({ message: "invalid canBeDownloaded!", field: 'canBeDownloaded' });
    }
    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: "invalid title!", field: 'title' });
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: "invalid author!", field: 'author' });
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(item => {
            !AvailableResolutions.includes(item) && errors.errorsMessages.push({
                message: "Invalid availableResolutions!",
                field: "availableResolutions"
            });
        });
    }
    return errors;
};
exports.app.post('/videos', (req, res) => {
    let { title, author, availableResolutions = [] } = req.body;
    const errors = validate(title, author, availableResolutions);
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let video = videos.filter(i => i.id === +req.params.id);
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    let { title, author, availableResolutions = [], canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    const errors = validate(title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate);
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const index = videos.findIndex(i => i.id === +req.params.id);
    videos[index] = Object.assign(Object.assign(Object.assign({}, video[0]), req.body), { id: +req.params.id });
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const video = videos.filter(i => i.id === +req.params.id);
    if (typeof +req.params.id !== 'number') {
        res.sendStatus(400);
        return;
    }
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    const index = videos.findIndex(v => v.id === +req.params.id);
    videos.splice(index, 1);
    res.sendStatus(204);
});
exports.app.delete('/testing/all-data', (req, res) => {
    videos.length = 0;
    res.sendStatus(204);
});
