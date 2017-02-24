var express=require("express")
var mongoose=require("mongoose")
var path=require("path")
var fs=require("fs")
mongoose.Promise=Promise
var dburl="mongodb://localhost/course"
var session=require("express-session")
var mongoStore=require("connect-mongo")(session)

//var bodyParser=require("body-parser")
//var upload=require("multer")({dest:"uploads/"})
//var cookieParser=require("cookie-parser")
//var favicon = require("serve-favicon")

var app=express()
var port=process.env.PORT || 3000

mongoose.connect(dburl)

app.disable("x-powered-by")
app.set("views","./App/views/pages")
app.set("view engine","jade")
app.use(express.static("public"))
app.use(session({
	secret:"movies",
	store: new mongoStore({
		url:dburl,
		collection: "sessions"
	})
}))
require("./config/Middleware")(app)
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended:true}))
//app.use(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "gallery", maxCount: 1 }]))
//app.use(cookieParser())
app.use(function(req,res,next){
	if(req.files){
		console.log("youwenjian")
		var files=req.files
		var oldname=[]
		var type=[]
		oldname.push(files["avatar"][0].filename)
		oldname.push(files["gallery"][0].filename)
		type.push(files["avatar"][0].originalname.split(".")[files["avatar"][0].originalname.split(".").length-1])
		type.push(files["gallery"][0].originalname.split(".")[files["gallery"][0].originalname.split(".").length-1])
		fs.renameSync(__dirname+"/public/uploads/"+oldname[0],__dirname+"/public/picture/"+oldname[0]+"."+type[0])
		fs.renameSync(__dirname+"/public/uploads/"+oldname[1],__dirname+"/public/video/"+oldname[1]+"."+type[1])
		req.files=null
		req.body.source.picture="/picture/"+oldname[0]+"."+type[0]
		req.body.source.filepath="/video/"+oldname[1]+"."+type[1]
	}
	next()
})

//count visitor
/*var Visitor=require('./App/models/visitors.js')
app.use(function(req,res,next){
	if(req.ip.indexOf("127.0.0.1")==-1){
		var _visitor=new Visitor({
			url:req.url,
			ip:req.ip,
			method:req.method
		})
		_visitor.save(function(err,visitor){
			if(err){
				console.log("访问保存出错")
			}
		})
	}
	next()
})*/

/*app.post("/admin/upload",function(req,res){
	console.log(req.body)
	res.end("上传成功")
})*/

var moment=require("moment")
app.locals.moment=moment

require("./config/routes")(app)
app.use("*",function(req,res){
	res.end("404 Not Found")
})
app.listen(port)
console.log("start at "+port)