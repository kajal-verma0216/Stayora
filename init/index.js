const mongoose = require("mongoose");
const listings = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Stayora";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    await initDB();
    await mongoose.connection.close();
}

async function initDB() {
    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    console.log("Data was initialised");
}

main()
    .then(() => {
        console.log("Database seed complete");
    })
    .catch(async (err) => {
        console.log(err);
        await mongoose.connection.close();
        process.exitCode = 1;
    });
