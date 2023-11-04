import fastify from "fastify"
import helmet from "@fastify/helmet"
import cors from "@fastify/cors"
import dotenv from "dotenv"

const server = fastify({ logger: true })
server.register(helmet)
server.register(cors, {
  origin: "*"
})
dotenv.config()

const port = process.env.PORT && 8080
const BASE_URL = process.env.BASE_URL
const API_SECRET = process.env.API_SECRET 

server.get("/", async (request, reply) => {
  const page = 1
  try {
    const movies = await fetch(`${BASE_URL}popular?api_key=${API_SECRET}&language=fr&page=${page}`).then((res) => res.json())

    reply.status(200)
    reply.send(movies.results)

    } catch (err) {
    reply.status(500)
    reply.send(err.message)
  }
})


server.get("/toprated/:page", async (request, reply) => {
  const page = request.params.page ?? 1
  try {
    const topRatedMovies = await fetch(`${BASE_URL}top_rated?api_key=${API_SECRET}&language=fr&page=${page}`).then((res) => res.json())

    reply.status(200)
    reply.send(topRatedMovies.results)

  } catch (err) {
    reply.status(500)
    reply.send(err.message)
  }
})

server.get("/upcoming/:page", async (request, reply) => {
  const page = request.params.page ?? 1
  try {
    const upComingMovies = await fetch(`${BASE_URL}upcoming?api_key=${API_SECRET}&language=fr&page=${page}`).then((res) => res.json())
    
    reply.status(200)
    reply.send(upComingMovies.results)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/actors/:id", async (request, reply) => {
  const actorId = request.params.id 
  try {
    const actors = await fetch(`${BASE_URL}${actorId}/casts?api_key=${API_SECRET}&language=fr`).then((res) => res.json())

    reply.status(200)
    reply.send(actors.cast)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/similar/:id/:page", async  (request, reply) => {
  const movieId = request.params.id
  const page = request.params.page ?? 1
  try {
    const similarMovies = await fetch(`${BASE_URL}${movieId}/similar?api_key=${API_SECRET}&language=fr&page=${page}`).then((res) => res.json())

    reply.status(200)
    reply.send(similarMovies.results)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/movie/:id", async (request, reply) => {
  const movieId = request.params.id
  try {
    const movie = await fetch(`${BASE_URL}${movieId}?api_key=${API_SECRET}&language=fr`).then((res) => res.json())

    reply.status(200)
    reply.send(movie)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/movie/search/:query/:page", async (request, reply) => {
  const query = request.params.query ?? ""
  const page = request.params.page ?? 1
  try {
    const searchedMovie = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_SECRET}&language=fr&query=${query}&page=${page}`).then((res) => res.json())

    reply.status(200)
    reply.send(searchedMovie.results)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/:page", async (request, reply) => {
  const page = request.params.page ?? 1
  try {
    const movies = await fetch(`${BASE_URL}popular?api_key=${API_SECRET}&language=fr&page=${page}`).then((res) => res.json())

    reply.status(200)
    reply.send(movies.results)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.listen(port, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`)
})