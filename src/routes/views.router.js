import { Router } from 'express';

import privateAccess from './middlewares/privateAccess.js';
import publicAccess from './middlewares/publicAccess.js';


const router = Router();

router.get( '/register', publicAccess, ( req, res ) => {
    res.render( 'register' );
});

router.get( '/login', publicAccess, ( req, res ) => {
    res.render( 'login' );
});

router.get( '/profile', privateAccess, ( req, res )=>{
    res.render( 'profile',{
        user: req.session.user
    })
})

export default router;