import { Router } from "express"
import CartManager from "../dao/mongo/cart.service.js"

const router = Router()
const manager = new CartManager()

router.get('/carts/:cid', async (req, res) => {
    req.logger.http('Route GET: /carts/:cid')
    const { cid } = req.params
    const cartProducts = await manager.getProductsOfCartById(cid)
    if(cartProducts) {
        req.logger.info('Carrito encontrado')
        res.render('carts',{cartProducts,cid})
    }else {
        req.logger.fatal('Carrito no encontrado -> (Route GET: /carts/:cid)')
        res.status(404).json({'error': 'Cart not found'})
    }
})

router.get('/api/carts/:cid', async (req, res) => {
    req.logger.http('Route GET: /api/carts/:cid')
    const { cid } = req.params
    const cartProducts = await manager.getProductsOfCartById(cid)
    if(cartProducts) {
        req.logger.info('Productos encontrados')
        res.status(200).json({status: "success", payload : cartProducts})
    }else {
        req.logger.fatal('Error -> (Route GET: /api/carts/:cid)')
        res.status(404).json({'error': 'Cart not found'})
    }
})

router.get('/api/carts/:cid/total' ,async(req,res)=>{
    try{
        req.logger.http('Route GET: /api/carts/:cid/total')
        const {cid} = req.params
        const total = await manager.totalAmount(cid)
        res.status(200).json({status: "success", total : total})
    }catch(error){
        req.logger.error('Error -> (Route GET: /api/carts/:cid/total)')
        res.status(500).json({error: `Server error: ${error}` })
    }
})

router.post('/api/carts', async (req, res) => {
    try {
        req.logger.http('Route GET: /api/carts')
        let status = await manager.addCart()
        res.status(status.code).json({status: status.status})
    } catch (error) {
        req.logger.error('Error -> (Route POST: /api/carts)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        req.logger.http('Route POST: /api/carts/:cid/product/:pid')
        const { cid, pid } = req.params
        let status = await manager.addProductToCart(cid, pid)
        res.status(status.code).json({status: status.status})
    } catch (error) {
        req.logger.error('Error -> (Route POST: /api/carts/:cid/product/:pid)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.put('/api/carts/:cid', async (req, res) => {
    try {
        req.logger.http('Route PUT: /api/carts/:cid')
        const { cid } = req.params
        const { products } = req.body
        const status = await manager.updateCart(cid, products)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        req.logger.error('Error -> (Route PUT: /api/carts/:cid)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.put('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        req.logger.http('Route PUT: /api/carts/:cid/product/:pid')
        const { cid, pid } = req.params
        const { quantity } = req.body
        const status = await manager.updateProductQuantity(cid, pid, quantity)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        req.logger.error('Error -> (Route PUT: /api/carts/:cid/product/:pid)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.delete('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        req.logger.http('Route DELETE: /api/carts/:cid/product/:pid')
        const { cid, pid } = req.params
        const status = await manager.removeProductFromCart(cid, pid)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        req.logger.error('Error -> (Route DELETE: /api/carts/:cid/product/:pid)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.delete('/api/carts/:cid', async (req, res) => {
    try {
        req.logger.http('Route DELETE: /api/carts/:cid')
        const { cid } = req.params
        const status = await manager.removeAllProductsFromCart(cid)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        req.logger.error('Error -> (Route DELETE: /api/carts/:cid)')
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

export default router