import "reflect-metadata"
import {BlogRepository} from "./repositories/blog.repository";
import {BlogQueryRepository} from "./repositories/blog.query.repository";
import {PostRepository} from "./repositories/post.repository";
import {PostQueryRepository} from "./repositories/post.query.repository";
import {BlogService} from "./services/blog.service";
import {Container} from "inversify";
import {CommentsService} from "./services/comments.service";
import {CommentRepository} from "./repositories/comment.repository";
import {PostService} from "./services/post.service";

// const blogRepo = new BlogRepository()
// const blogQueryRepository = new BlogQueryRepository()
// const postRepository = new PostRepository()
// const postQueryRepository = new PostQueryRepository()
//  const blogService = new BlogService(blogRepo,blogQueryRepository,postRepository,postQueryRepository)
//  export const blogsController = new BlogsController(blogService,blogQueryRepository)



export const container = new Container()
container.bind<BlogRepository>(BlogRepository).to(BlogRepository)
container.bind<BlogQueryRepository>(BlogQueryRepository).to(BlogQueryRepository)
container.bind<BlogService>(BlogService).to(BlogService)

container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<CommentRepository>(CommentRepository).to(CommentRepository)

container.bind<PostService>(PostService).to(PostService)
container.bind<PostRepository>(PostRepository).to(PostRepository)
container.bind<PostQueryRepository>(PostQueryRepository).to(PostQueryRepository)