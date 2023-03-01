const {campgroundSchema, reviewSchema} = require('./JoiSchemas')
const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        //we have to redirect the user to the route requested after login
        //so we store the requested url in session
        req.session.returnTo = req.originalUrl
        // console.log(req.session.returnTo)
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next)=>{
    // const result = campgroundSchema(req.body)
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        //error.details is an array so we have to map over it and convert it to a string
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isreviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// module.exports.validateReview = (req, res, next)=>{
//     const {error} = reviewSchema.validate(req.body)
//     if(error){
//         //error.details is an array so we have to map over it and convert it to a string
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }else{
//         next()
//     }
// }