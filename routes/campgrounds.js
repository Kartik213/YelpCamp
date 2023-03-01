const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campground = require('../controllers/campgrounds')
const {storage} = require('../cloudinaryConfig')
const multer = require('multer')
//dest is the path where the files will be stored
const upload = multer({ storage })

/*we cannot get req.body it will be empty in order to parse multipart form we need a middleware 
we are using Multer for thisMulter adds a body object and a file or files object to the request
object.The body object contains the values of the text fields of the form, the file or files
object contains the files uploaded via the form.*/

router.route('/')
      .get(catchAsync(campground.index))
      .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground))
      // .post(upload.array('image'), (req, res)=>{
      //       console.log(req.body, req.files)
      //       res.send("It worked!!")
      // })

router.get('/new', isLoggedIn ,campground.renderNewForm)

router.route('/:id')
      .get(catchAsync(campground.showCampground))
      .put(isLoggedIn, isAuthor,upload.array('image') ,validateCampground, catchAsync(campground.updateCampground))
      .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

// router.get('/', catchAsync(campground.index))
// router.get('/new', isLoggedIn ,campground.renderNewForm)
// router.post('/', isLoggedIn , validateCampground, catchAsync(campground.createCampground))
// router.get('/:id', catchAsync(campground.showCampground))
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground))
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

module.exports = router
