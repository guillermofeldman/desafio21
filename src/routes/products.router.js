import { Router } from 'express';

import productsModel from '../dao/models/productsModel.js';
import privateAccess from './middlewares/privateAccess.js';


const router = Router();


router.get( '/', privateAccess, async ( req, res ) => {

    const { page = 1, limit = 2, query, sort } = req.query;

    // const products = await productsModel.find().lean();
    // manager.registerLog( 'Products request' );

    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = 
        await productsModel.paginate( {}, {
            limit,
            page,
            query,
            sort,
            lean: true
        });
        console.log(nextPage)

    const products = docs;

    res.render( 'products', {
        products,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    });
});

export default router;