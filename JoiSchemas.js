const Joi = require('joi')
/*campground have a structure like:
    campground{
        title: ------,
        location: ---------,
        description: ---------,
        price: ----------,
        image:------
    }*/
module.exports.campgroundSchema = Joi.object({
    //campground is an object and is required
    campground: Joi.object({
        //title has a type of string and is required
        title: Joi.string().required(),
        //price is a number is required and have a min value 0
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()

    }).required(),
    deleteImg: Joi.array()
})

/*
    review:{
        body:-----,
        rating:-----
    }
*/

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string(),
        rating: Joi.number().required().min(1).max(5)
    })
})