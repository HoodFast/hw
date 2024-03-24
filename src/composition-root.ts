import {BlogRepository} from "./repositories/blog.repository";
import {BlogQueryRepository} from "./repositories/blog.query.repository";
import {PostRepository} from "./repositories/post.repository";
import {PostQueryRepository} from "./repositories/post.query.repository";
import {BlogService} from "./services/blog.service";
import {BlogsController} from "./routes/blog-route";

const blogRepo = new BlogRepository()
const blogQueryRepository = new BlogQueryRepository()
const postRepository = new PostRepository()
const postQueryRepository = new PostQueryRepository()
const blogService = new BlogService(blogRepo,blogQueryRepository,postRepository,postQueryRepository)
export const blogsController = new BlogsController(blogService,blogQueryRepository)