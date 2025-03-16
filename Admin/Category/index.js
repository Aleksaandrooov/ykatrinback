import { prisma } from '../../server.js'

export const CategoryPost = async (req, res) => {
  try {
    const { name, description } = req.body

    await prisma.category.create({
      data: {
        name,
        description,
      },
    })

    res.status(200).json({ message: 'Категория успешно добавлена' })
  } catch (error) {
    res.status(404).json({ message: 'Ошибка 404' })
  }
}

export const CategoryDelete = async (req, res) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        product: true,
      },
    })

    if (category.product.length > 0) {
      return res.status(400).json({ error: true })
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    })

    res.status(200).json({ message: 'Категория успешно удалена' })
  } catch (error) {
    res.status(404).json({ message: 'Ошибка 404' })
  }
}
