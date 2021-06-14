const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

function intialize (passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if(user == null){
            return done(null, false, {message: 'no user with that email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'password incorrect'})
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'},
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => (
         done(null, await getUserById(id))
    ))
}

module.exports = intialize;