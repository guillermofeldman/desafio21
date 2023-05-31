const publicAccess = ( req, res, next ) =>{
    if( req.session.user ) return res.redirect( '/api/products' );
    next();
};

export default publicAccess;