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
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`
const BASE_URL = process.env.BASE_URL
const API_SECRET = process.env.API_SECRET 

server.get("/", async (request, reply) => {
  const page = 1
  try {
    const url = `${BASE_URL}movie/popular?api_key=${API_SECRET}&language=fr&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const movies = await fetch(url, options).then((res) => res.json())

    reply.status(200)
    reply.send(movies.results)

    } catch (err) {
    reply.status(500)
    reply.send(err.message)
  }
})

server.get("/:page", async (request, reply) => {
  const page = request.params.page ?? 1
  try {
    const url = `${BASE_URL}movie/popular?api_key=${API_SECRET}&language=fr&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const movies = await fetch(url, options).then((res) => res.json())

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
    const url = `${BASE_URL}movie/top_rated?api_key=${API_SECRET}&language=fr&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const topRatedMovies = await fetch(url, options).then((res) => res.json())

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
    const url = `${BASE_URL}movie/upcoming?api_key=${API_SECRET}&language=fr&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const upComingMovies = await fetch(url, options).then((res) => res.json())
    
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
    const url = `${BASE_URL}movie/${actorId}/credits?api_key=${API_SECRET}&language=fr`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const actors = await fetch(url, options).then((res) => res.json())

    reply.status(200)
    reply.send(actors.cast)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/actor/:id", async (request, reply) => {
  const actorId = request.params.id 
  try {
    const urlActor = `${BASE_URL}person/${actorId}?api_key=${API_SECRET}&language=fr`
    const urlExternalIds = `${BASE_URL}person/${actorId}/external_ids?api_key=${API_SECRET}&language=fr`
    const urlMovieCredits = `${BASE_URL}person/${actorId}/movie_credits?api_key=${API_SECRET}&language=fr`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const actorDetail = await Promise.all(
      [
        fetch(urlActor, options).then((res) => res.json()),
        fetch(urlExternalIds, options).then((res) => res.json()),
        fetch(urlMovieCredits, options).then((res) => res.json()),
      ]
    )

    reply.status(200)
    reply.send(actorDetail)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.get("/similar/:id/:page", async (request, reply) => {
  const movieId = request.params.id
  const page = request.params.page ?? 1
  try {
    const url = `${BASE_URL}movie/${movieId}/similar?api_key=${API_SECRET}&language=fr&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const similarMovies = await fetch(url, options).then((res) => res.json())

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
    const url = `${BASE_URL}movie/${movieId}?api_key=${API_SECRET}&language=fr`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const movie = await fetch(url, options).then((res) => res.json())

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
    const url = `${BASE_URL}search/movie?api_key=${API_SECRET}&language=fr&query=${query}&page=${page}`
    const options = {method: 'GET', headers: {accept: 'application/json'}}
    const searchedMovie = await fetch(url, options).then((res) => res.json())

    reply.status(200)
    reply.send(searchedMovie.results)

  } catch (err) {
   reply.send(err.message)
    reply.status(500)
  }
})

server.listen({host, port}, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`)
})