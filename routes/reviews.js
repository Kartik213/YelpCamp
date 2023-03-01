const express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const {validateReview, isLoggedIn, isreviewAuthor} = require('../middleware')

// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
router.post('/', isLoggedIn, catchAsync(reviews.createReview))


router.delete('/:reviewId', isLoggedIn, isreviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router
