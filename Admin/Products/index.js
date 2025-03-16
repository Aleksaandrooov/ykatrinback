import { prisma } from '../../server.js'
import path from 'path'
import fs from 'fs'

export const postProduct = async (request, response) => {
  const { category, title, Calories, description } = request.body

  const image = request.files.image
  const images = Array.isArray(request.files.images) ? request.files.images : [request.files.images]
  const imagesName = []
  const uploadDir = 'images/'

  const fileName = `${Date.now()}${path.extname(image.name)}`
  const filePath = path.join(uploadDir, fileName)
  await image.mv(filePath)

  await images.map(async (obj) => {
    const fileNameImages = `${Date.now()}${path.extname(obj.name)}`
    const filePathImages = path.join(uploadDir, fileNameImages)
    imagesName.push(fileNameImages)
    await obj.mv(filePathImages)
  })

  await prisma.product.create({
    data: {
      title,
      description,
      Calories,
      categoryId: Number(category),
      img: [fileName],
      imgPanorama: imagesName,
    },
  })

  response.status(200).json({ message: 'Успешно добавлен' })
}

export const getProducts = async (_, response) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
    },
  })

  response.status(200).json(products)
}

export const deleteProducts = async (request, response) => {
  const { id } = request.params

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
  })

  if (!product) {
    return response.status(500).json({ error: true })
  }

  product.img.map((obj) => {
    const fileImagePath = path.join('images/', obj)
    fs.unlinkSync(fileImagePath)
  })
  product.imgPanorama.map((obj) => {
    const fileImagePath = path.join('images/', obj)
    fs.unlinkSync(fileImagePath)
  })

  await prisma.product.delete({
    where: {
      id: product.id,
    },
  })

  response.status(200).json({ message: 'Успешно удалено' })
}
