const express = require("express")
const app = express()
const { createProxyMiddleware } = require("http-proxy-middleware")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const url = require("url")

const limiter = rateLimit({
    windowMs: 15 *60 *1000,
    max: 100,
})

app.get("/", (req, res) => {
    res.send("This is my proxy server")
})

app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
    const city = url.parse(req.url).query
    createProxyMiddleware({
        target: process.env.BASE_API_URL_CORONA_WORLD,
        changeOrigin: true,
        pathRewrite: {
            [`^/corona-tracker-world-data`]: "",
        },
    }) (req, res, next)
})

app.use("/wether-data", limiter, (req, res, next) => {
    console.log(`Listening on port ${port}`)
    createProxyMiddleware({
        target: "${process.env.BASE_API_URL_WEATHERAPI}${city}&api=no",
        changeOrigin: true,
        pathRewrite: {
            [`^/wether-data`]: "",
        },
    }) (req, res, next)
})

const port = process.env.PORT || 55555

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app
