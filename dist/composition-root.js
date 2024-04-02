"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const blog_repository_1 = require("./repositories/blog.repository");
const blog_query_repository_1 = require("./repositories/blog.query.repository");
const post_repository_1 = require("./repositories/post.repository");
const post_query_repository_1 = require("./repositories/post.query.repository");
const blog_service_1 = require("./services/blog.service");
const inversify_1 = require("inversify");
const comments_service_1 = require("./services/comments.service");
const comment_repository_1 = require("./repositories/comment.repository");
const post_service_1 = require("./services/post.service");
const auth_service_1 = require("./services/auth.service");
const jwt_service_1 = require("./application/jwt.service");
const tokenMeta_repository_1 = require("./repositories/tokenMeta.repository");
const session_repository_1 = require("./repositories/session.repository");
const session_query_repository_1 = require("./repositories/session.query.repository");
const security_service_1 = require("./services/security.service");
// const blogRepo = new BlogRepository()
// const blogQueryRepository = new BlogQueryRepository()
// const postRepository = new PostRepository()
// const postQueryRepository = new PostQueryRepository()
//  const blogService = new BlogService(blogRepo,blogQueryRepository,postRepository,postQueryRepository)
//  export const blogsController = new BlogsController(blogService,blogQueryRepository)
exports.container = new inversify_1.Container();
exports.container.bind(blog_repository_1.BlogRepository).to(blog_repository_1.BlogRepository);
exports.container.bind(blog_query_repository_1.BlogQueryRepository).to(blog_query_repository_1.BlogQueryRepository);
exports.container.bind(blog_service_1.BlogService).to(blog_service_1.BlogService);
exports.container.bind(comments_service_1.CommentsService).to(comments_service_1.CommentsService);
exports.container.bind(comment_repository_1.CommentRepository).to(comment_repository_1.CommentRepository);
exports.container.bind(post_service_1.PostService).to(post_service_1.PostService);
exports.container.bind(post_repository_1.PostRepository).to(post_repository_1.PostRepository);
exports.container.bind(post_query_repository_1.PostQueryRepository).to(post_query_repository_1.PostQueryRepository);
exports.container.bind(session_repository_1.SessionRepository).to(session_repository_1.SessionRepository);
exports.container.bind(session_query_repository_1.SessionQueryRepository).to(session_query_repository_1.SessionQueryRepository);
exports.container.bind(security_service_1.SecurityService).to(security_service_1.SecurityService);
exports.container.bind(tokenMeta_repository_1.TokenMetaRepository).to(tokenMeta_repository_1.TokenMetaRepository);
exports.container.bind(jwt_service_1.JwtService).to(jwt_service_1.JwtService);
exports.container.bind(auth_service_1.AuthService).to(auth_service_1.AuthService);
