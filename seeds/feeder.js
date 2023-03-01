const mongoose = require('mongoose')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1/Yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error"))
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '63fb6035199af7d2d00fc899',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/480x480',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente quasi doloribus laudantium accusamus pariatur officiis error, non eveniet corporis esse delectus laborum architecto vel. Officia quia nam iure rem neque.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
