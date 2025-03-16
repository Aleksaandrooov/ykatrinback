import express from 'express'
import { AuthLogin, AuthIsBlocked, AuthCheck } from '../auth/index.js'
import { CategoryDelete, CategoryPost } from '../Admin/Category/index.js'
import { PostsPost, deletePost } from '../Admin/Posts/index.js'
import { postProduct, deleteProducts, getProducts } from '../Admin/Products/index.js'

const router = express.Router()

router.post('/auth/login', AuthLogin)
router.post('/auth/isBlocked', AuthIsBlocked)
router.post('/auth/check', AuthCheck)

router.post('/admin/categoryAdd', CategoryPost)
router.delete('/admin/categoryDelete/:id', CategoryDelete)

router.post('/admin/postsAdd', PostsPost)
router.delete('/admin/postDelete/:id', deletePost)

router.post('/admin/postProduct', postProduct)
router.get('/admin/getProducts', getProducts)
router.delete('/admin/deleteProducts/:id', deleteProducts)

export default router
