import { Router } from 'express'
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js'
import ticketManager from '../dao/mongo/ticket.service.js'

const router = Router()

router.get('/login', isNotAuthenticated, (req, res) => {
    req.logger.http('Route GET /login')
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    req.logger.http('Route GET /register')
    res.render('register')
})

router.get('/profile', isAuthenticated, (req, res) => {
    req.logger.http('Route GET /profile')
    req.logger.info(req.session.user)
    res.render('profile', { user: req.session.user })
})

router.get('/sendTicket',(req,res)=>{
    req.logger.http('Route GET /sendTicket')
    res.render('ticket',{user : req.session.user})
})


export default router