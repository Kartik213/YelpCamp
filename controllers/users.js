const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.userRegister = async(req,res) => {
    try{
        const {username, email, password} = req.body
        const user = new User({username, email})
        const registeredUser = await User.register(user, password)
        //we are only registering the user not logging in to do that we have to use req.login
        req.login(registeredUser, err=>{
            if(err)return next(err)
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })

    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.userLogin = (req,res) => {
    req.flash('success', 'Welcome back!!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.userLogout = (req, res, next) => {
  req.logout( err => {
    if (err) { return next(err); }
    res.redirect("/");
  });
}
