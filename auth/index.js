import { compare } from 'bcrypt'
import { prisma } from '../server.js'
import jwt from 'jsonwebtoken'

export const AuthLogin = async (req, res) => {
  const { login, password, ip } = req.body

  if (!login || !password || !ip) {
    return res.status(404).json({ message: 'Ошибка | 404' })
  }

  const isCheckIpBlocked = await prisma.ipBlocked.findFirst({
    where: {
      ip,
    },
  })

  const date = new Date()

  if (isCheckIpBlocked) {
    const isDataForChecked = date.getTime() - isCheckIpBlocked.createAt.getTime()
    const ms = 15 * 60 * 1000
    if (isDataForChecked < ms) {
      return res.status(500).json({ message: 'Множество попыток входа, попробуйте позже' })
    } else {
      await prisma.ipBlocked.delete({
        where: {
          id: isCheckIpBlocked.id,
        },
      })
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      login,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'Неверный логин или пароль' })
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Неверный логин или пароль' })
  }

  const token = jwt.sign(
    {
      login: user.login,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )

  res.status(200).json(token)
}

export const AuthIsBlocked = async (req, res) => {
  const { ip } = req.body

  await prisma.ipBlocked.create({
    data: {
      ip,
    },
  })

  res.status(200).json({ message: 'Множество попыток входа, попробуйте позже' })
}

export const AuthCheck = async (req, res) => {
  try {
    const { cookieJWT } = req.body

    const { login } = jwt.verify(cookieJWT, process.env.JWT_SECRET)

    const checkLogin = await prisma.user.findFirst({
      where: {
        login,
      },
    })

    if (!checkLogin) {
      return res.status(404).json({ message: 'Не верный токен' })
    }

    res.status(200).json({ message: 'Токен верный' })
  } catch (e) {
    console.log(e)
    res.status(404).json({ message: 'Не верный токен' })
  }
}
