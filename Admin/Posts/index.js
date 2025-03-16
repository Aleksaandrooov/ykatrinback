import { prisma } from '../../server.js'
import path from 'path'
import fs from 'fs'

export const PostsPost = async (request, response) => {
  const { name, description, tags: tagsString } = request.body

  const tags = tagsString.split(' ')

  const image = request.files.image // Получаем файл
  const uploadDir = 'images/'

  const fileName = `${Date.now()}${path.extname(image.name)}`
  const filePath = path.join(uploadDir, fileName)
  await image.mv(filePath)

  await prisma.post.create({
    data: {
      title: name,
      description,
      tags,
      imgPanorama: fileName,
    },
  })

  response.status(200).json({ message: 'Успешно добавлен' })
}

export const deletePost = async (req, res) => {
  const { id: idString } = req.params
  const id = Number(idString)

  const post = await prisma.post.findFirst({
    where: {
      id,
    },
  })

  const filePath = path.join('images/', post.imgPanorama)
  fs.unlinkSync(filePath)

  await prisma.post.delete({
    where: {
      id,
    },
  })

  res.status(200).json({ message: 'Успешно удален' })
}
