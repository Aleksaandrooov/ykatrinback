import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import router from './routes/index.js'
import fileUpload from 'express-fileupload'

const app = express()
export const prisma = new PrismaClient()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())
app.use('/api', router)
app.use('/images', express.static('images'))

app.get('/api/getCategory', async (_, res) => {
  try {
    const category = await prisma.category.findMany()

    return res.status(200).json(category)
  } catch {
    return res.status(500)
  }
})

app.get('/api/getCategoryAndProduct', async (_, res) => {
  try {
    const category = await prisma.category.findMany({
      include: {
        product: true,
      },
    })
    return res.status(200).json(category)
  } catch {
    return res.status(500)
  }
})

app.get('/api/getPosts', async (_, res) => {
  try {
    const posts = await prisma.post.findMany({})

    return res.status(200).json(posts)
  } catch {
    return res.status(500)
  }
})

const PORT = 4000
app.listen(PORT)
