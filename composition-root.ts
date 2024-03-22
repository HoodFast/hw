import {BlogRepository} from "./src/repositories/blog.repository";
import {BlogQueryRepository} from "./src/repositories/blog.query.repository";
import {PostRepository} from "./src/repositories/post.repository";
import {PostQueryRepository} from "./src/repositories/post.query.repository";
import {BlogService} from "./src/services/blog.service";
import {BlogsController} from "./src/routes/blog-route";

const blogRepo = new BlogRepository()
const blogQueryRepository = new BlogQueryRepository()
const postRepository = new PostRepository()
const postQueryRepository = new PostQueryRepository()
const blogService = new BlogService(blogRepo,blogQueryRepository,postRepository,postQueryRepository)
export const blogsController = new BlogsController(blogService,blogQueryRepository)