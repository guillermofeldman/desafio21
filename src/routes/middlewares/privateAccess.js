const privateAccess = ( req, res, next )=>{
    if( !req.session.user ) return res.redirect( '/api/login' );
    next();
};

export default privateAccess;