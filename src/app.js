import express from "express"
import { allPosts } from "./database"

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
    console.log(allPosts)

    const filteredRecentPosts = allPosts.filter(posts => {
        const createdDay = posts.createdOn.getDate()
        const currentDay = new Date().getDay()
        const availableSince = currentDay - createdDay

        return availableSince < 7
    })

    allPosts.splice(0, 1, ...filteredRecentPosts)

    return [200, allPosts]
}

const getFilteredPostsService = (subway, name) => {
    const filteredPosts = allPosts.filter(post => post.subway === subway && post.name === name)
    return [200, filteredPosts]
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

const getFilteredPostsController = (request, response) => {
    const subway = request.query.subway
    const name = request.query.name

    const [statusCode, filteredPosts] = getFilteredPostsService(subway, name)
    return response.status(statusCode).json(filteredPosts)
}

// Routes

app.post("/posts", createPostController)
app.get("/posts", getRecentPostsController)
app.get("/post", getFilteredPostsController)

app.listen(port, () => console.log(`App is running on localhost:${3000}`))