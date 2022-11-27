import express from "express"
import { allPosts } from "./database"
import { recentPosts } from "./database"

const app = express()
app.use(express.json())

const port = 3000

// Services
const createPostService = (params) => {
    const { description, name, subway, location, picture } = params

    const newPost = {
        description,
        name,
        subway,
        location,
        picture,
        createdOn: new Date()
    }
    allPosts.push(newPost)

    return [201, newPost]
}

const getRecentPostsService = () => {
    const filteredRecentPosts = allPosts.filter(posts => {
        const createdDay = posts.createdOn.getDate()
        const currentDay = new Date().getDay()
        const availableSince = currentDay - createdDay

        return availableSince < 7
    })

    recentPosts.splice(0, 1, filteredRecentPosts)

    return [200, ...recentPosts]
}

// Controllers
const createPostController = (request, response) => {
    const [statusCode, createdPost] = createPostService(request.body)
    return response.status(statusCode).json(createdPost)
}

const getRecentPostsController = (request, response) => {
    const [statusCode, recentPosts] = getRecentPostsService()
    return response.status(statusCode).json(recentPosts)
}

// Routes

app.post("/posts", createPostController)
app.get("/posts", getRecentPostsController)

app.listen(port, () => console.log(`App is running on localhost:${3000}`))