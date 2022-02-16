import express from 'express'

const app = express()
const port = process.env.port || 3000

app.use(express.json())

app.post('/', (req, res) => {
  res.send(req.body)
})

app.listen(port, () => {
  console.log(`server on ${port}`)
})
