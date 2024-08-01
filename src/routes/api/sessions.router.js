import { Router } from 'express'
import passport from 'passport'
const router = Router()


router.post('/register', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true
}),(req,res)=>{
    req.logger.info('New User Registered')
    res.send({status:"success",message : "New User Registered"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/login'}),async (req,res)=>{
    req.logger.http('Route POST: /login')
    if(!req.user) {
        req.logger.fatal('Incomplete data')
        return res.status(400).send({status: "error", error: "Incomplete data"})
    }

    try{
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        }
        req.logger.info(req.session.user)
        res.redirect('/products')   
    }catch(error){
        req.logger.error('Authenticate Error')
        res.status(500).send({error:"error",message: error.message})
    }
})

router.get('/github',passport.authenticate('github',{ scope: ['user:email']}), async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user
    res.redirect('/products')
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logger.info('Session end')
        if (err) return res.status(500).send('Error al cerrar sesión')
        res.redirect('/login')
    })
})

router.get('/current', (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' })
        }

        const userDTO = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            role: req.user.role,

        }

        req.session.user = userDTO
        res.status(200).json({ payload: userDTO })
    } catch (error) {
        req.logger.error('Error al obtener el usuario actual')
        res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
});



export default router