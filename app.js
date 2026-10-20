const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/Stayora";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
main().then(()=>{
    console.log("Connected to database successfully");
}).catch((err)=>{
    console.log("Error occured",err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index",{alllistings});
});
app.get("/listings",async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index",{alllistings});
});
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
app.post("/listings",async(req,res)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send("Listing not found");
    }
    const listing=await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit",{listing});
});
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send("Listing not found");
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log( deletedListing);
    res.redirect("/listings");
});
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send("Listing not found");
    }
    const listing=await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show",{listing});
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});