'use strict'

class LoginController {
    async Login({ request, response, auth, view }) {
        // TODO verify all inputs
        const userName = request.input('userName')
        const password = request.input('password')

        console.log(userName, password);
        try {
            //await auth.logout()
            const login = await auth.attempt(userName, password)
            console.log(login)
            if (login) {
                //console.log('entro a home', login);
                //return view.render('/home', {msg : "holis"})
                //return response.route('/', )
                response.route('/')
            }
        } catch (err) {
            console.log(err)
        }
        return view.render('login', { err: "Invalid user name or password" })
    }

    async Logout({ response, auth }) {
        await auth.logout()
        response.route('/')
    }

    async Register({ request, response }) {
        // TODO verify all inputs and check if email or username already exists in db
        const Hash = use('Hash')
        const User = use('App/Models/User')

        var newUser = new User()
        newUser.username = 'admin'
        newUser.password = 'admin'

        var s = await newUser.save() // TODO check if it was created correctly
        console.log(s)
        response.route('/')
    }
}

module.exports = LoginController
