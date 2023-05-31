import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../dao/models/usersModel.js';
import { createHash, validatePassword } from '../helpers/bcryptHash.js';


const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // Register
    passport.use( 'register', new LocalStrategy ({
        passReqToCallback:true,
        usernameField:'email'
    }, 
        async ( req, username, password, done ) => {

            const { first_name, last_name, email } = req.body;

            try {
                const user = await userModel.findOne({ email: username }); 
                
                if(user){
                    console.log( 'The user already exists' );
                    return done( null, false );
                }
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    password: createHash(password)
                }

                const result = await userModel.create( newUser );
                return done( null, result );

            } catch ( error ) {
                return done( "Error creating user.", error );
            }
        }
    ));

    passport.serializeUser(( user, done ) => {
        done( null, user._id );
    });
    passport.deserializeUser( async ( id, done ) => {
        const user = await userModel.findById( id );
        done( null, user );
    });


    // Login
    passport.use( 'login', new LocalStrategy({ usernameField: 'email' }, async ( username, password, done ) => {

        try {
           
           const user = await userModel.findOne({ email: username });

            if( !user ){
                console.log( "User doesn't exists" );
                return done( null, false );
            }

            if( !validatePassword( password, user )) return done ( null, false );
            return done( null, user );

        } catch (error) {
            return done( `Error trying to log in: ${ error }` );
        };
    }));


    // Github
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.43d45f71ba57f741',
        clientSecret:'cf59ebcb4407f766f9a4dc25569db956509a8681',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async ( accesToken, refreshToken, profile, done ) => {
        try {
            
            let user = await userModel.findOne({ email: profile._json.email })
            
            if(!user){

                const email = profile._json.email == null ?  profile._json.username : null;

                const newUser = {
                        first_name: profile._json.name,
                        last_name:'',
                        email: profile._json.email,
                        password: '',
                };

                const result = await userModel.create( newUser );
                done( null, result );
                
            }else{
                done( null, user )
            }

        } catch ( error ) {
            return done( error );
        }
    }))

}

export default initializePassport;