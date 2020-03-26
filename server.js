'use strict';

var express = require('express');
const {promisify} = require('util');
const shortKey = require('random-key')
const dns = require('dns');
const lookupURL = promisify(dns.lookup);
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var Schema = mongoose.Schema;
var app = express();
var port = process.env.PORT || 3000;


// Middleware
const verifyURL = async (req, res,next) => {
  try{    
  
    const {url} = req.body;

    // Check URL on body
    if(!url) res.json({error: 'No URL'})

    // Check valid URL
    const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    if(!regex.test(url)) res.json({error: "invalid URL"}); 

    // Lookup URL
    await lookupURL(url.replace(/https?:\/\//i,''))

    req.url = url;
    next();  
  }
  catch(error){      
    res.json({error})
  }
  
}


// Apply Middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
//app.use(verifyURL);


// DB Connect + Config
mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true, useNewUrlParser: true });

const urlSchema = new Schema({
  original_url:  { type: String, required: true },
  hash: { type: String, required: true } 
});

const URL = mongoose.model('URL', urlSchema);

// Express Routes

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// GENERATE
app.post("/api/shorturl/new", verifyURL, async (req,res )=>{  
  try{    
    const hash = shortKey.generate(6);
    await URL.create({'original_url':req.url, "hash": hash})
    res.json({'original_url':req.url , "short_url": `${req.protocol}://${req.hostname}api/shorturl/${hash}`}) 
  }
  catch(error){
    res.json({error})
  } 
})

// REDIRECT
app.get("/api/shorturl/:hash", async (req,res )=>{  
  try{        
      const hash = req.params.hash;   
      const urlData = await URL.findOne({"hash": hash})   
      if(!urlData)  res.json({"error": "Invalid link"})
      res.redirect(urlData["original_url"])      
  }
  catch(error){
    res.json({error})
  } 
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});