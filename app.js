let express = require("express");
let	port = 2222;
let	path = require("path");
let	app = express();
let	mongoose = require("mongoose");
let	Book = require("./models/book.js");
let User = require("./models/user.js");
let Root = require("./models/root.js");
let Consumption = require("./models/consumption.js");
let	bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let mongoStore = require("connect-mongo")(session);
let	_ = require("underscore");
let dbUrl = "mongodb://127.0.0.1:27017/bookshop";

mongoose.connect(dbUrl);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	name: "user",
	secret: "bookshop",
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: "sessions"
	})
}));
app.set("views", "./views");
app.set("view engine", "pug");
app.listen(port);

console.log("Server created successful and listening for port " + port + ".");

app.use(function(req, res, next){
	res.locals.user = req.session.user;
	next();
});

app.get("/", function(req, res){
	if(req.session.user){
		res.cookie("username", req.session.user.username);
	};
	res.render("index", {
		title: "首页"
	});
});

app.get("/admin/login", function(req, res){
	res.render("login", {
		title: "管理员登录"
	});
});

app.get("/logout", function(req, res){
	delete req.session.user;
	delete res.locals.user;
	res.clearCookie("username");
	res.redirect("/");
});

app.get("/user/register", function(req, res){
	let username = req.query.username;
	let result = {
		status: 0,
		msg: "账号已被注册"
	};
	
	User.findOne({
		username: username
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
		if(data){
			res.end(JSON.stringify(result));
			return;
		};
		result = {
			status: 1,
			msg: "可以使用此账号"
		};
		res.end(JSON.stringify(result));
	});
});

app.post("/user/signup", function(req, res){
	let _user = req.body.user;

	User.findOne({
		username: _user.username
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		if(data){
			res.send("用户名已被注册");
			return;
		};
		let user = new User(_user);
		let consumption = new Consumption({
			username: _user.username
		});
		user.save(function(err, data){
			if(err){
				console.log(err);
				return;
			};
			consumption.save(function(err, data){
				if(err){
					console.log(err);
					return;
				};
			});
			res.redirect("/login");
		});
		
	});
});

app.post("/user/signin", function(req, res){
	let user = req.body.user;
	User.findOne({
		username: user.username
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		if(!data){
			res.send("用户不存在");
			return;
		};
		data.comparePassword(user.password, function(err, isMatch){
			if(err){
				console.log(err);
				return;
			};
			if(!isMatch){
				res.send("密码错误");
				return;
			};
			req.session.user = user;
			res.redirect("/");
		});
	});
});

app.post("/shopping/add", function(req, res){
	let str = "";
	let username = req.cookies.username;
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		let data = {
			id: obj.id
		};
		Consumption.findByName(username, function(err, info){
			if(err){
				console.log(err);
				return;
			};
			let shopping = info.shoppingCart;
			let flag = false;
			for(let i = 0, len = shopping.length; i < len; i++){
				if(shopping[i].id === data.id){
					shopping[i].num += obj.num;
					flag = true;
					break;
				};
			};
			if(!flag){
				data.num = obj.num;
				Book.findById(obj.id, function(err, book){
					if(err){
						console.log(err);
						return;
					};
					data.price = book.price;
					data.name = book.name;
					data.img = book.img;
					shopping.push(data);
					Consumption.update({"username": username}, {$set:{"shoppingCart": shopping}}, function(err, data){
						if(err){
							console.log(err);
							return;
						};
						res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
						res.end(JSON.stringify(data));
					});
				});
				return;
			};
			Consumption.update({"username": username}, {$set:{"shoppingCart": shopping}}, function(err, data){
				if(err){
					console.log(err);
					return;
				};
				res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
				res.end(JSON.stringify(data));
			});
		});
		
	});
});

app.get("/shopping/num", function(req, res){
	let username = req.cookies.username;
	let result = {
		status: 1,
		num: 0
	};
	Consumption.findByName(username, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		let shopping = data.shoppingCart;
		shopping.forEach((item) => {
			result.num += item.num;
		});
		res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
		res.end(JSON.stringify(result));
	});
});

app.post("/shopping/change", function(req, res){
	let str = "";
	let username = req.cookies.username;
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		Consumption.update({"username": username, "shoppingCart.id": obj.id}, {$set:{"shoppingCart.$.num": obj.num}}, function(err, data){
			if(err){
				console.log(err);
				return;
			};
			res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
			res.end(JSON.stringify(data));
		});
	});
});

app.get("/book/:id", function(req, res){
	let id = req.params.id;
	Book.findById(id, function(err, book){
		if(err){
			console.log(err);
			return;
		};
		res.render("detail", {
			title: book.name,
			book: book
		});
	});
});

app.get("/list", function(req, res){
	let condition = {};
	let tip = "";
	let bookName = "";
	let params = req.query;
	if(params.search){
		let reg = new RegExp(params.search);
		condition = {
			name: reg
		};
		tip = "搜索";
		bookName = params.search;
	};
	if(params.first){
		condition = {
			"classify.first": params.first
		};
		tip = "分类";
		bookName = params.first;
		if(params.second){
			condition["classify.second"] = params.second;
			bookName = {
				first: params.first,
				second: params.second
			};
		};
	};
	Book.findByCondition(condition, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		res.render("list", {
			title: tip + "列表",
			data: data,
			bookName: bookName
		});
	});
});

app.get("/list/all", function(req, res){
	Book.fetch(function(err, data){
		if(err){
			console.log(err);
			return;
		};
		res.render("list", {
			title: "所有图书",
			data: data
		});
	});
});

app.get("/login", function(req, res){
	res.render("login", {
		title: "登录页"
	});
});

app.get("/register/common", function(req, res){
	res.render("register-common", {
		title: "注册页"
	});
});

app.get("/register/phone", function(req, res){
	res.render("register-phone", {
		title: "注册页"
	});
});

app.get("/register/mail", function(req, res){
	res.render("register-mail", {
		title: "注册页"
	});
});

app.get("/shopping", function(req, res){
	let username = req.cookies.username;
	Consumption.findByName(username, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		res.render("shopping", {
			title: "购物车",
			shopping: data.shoppingCart
		});
	});
});

app.get("/user", function(req, res){
	res.render("user", {
		title: "个人中心"
	});
});

app.get("/admin/book", function(req, res){
	res.render("admin-book", {
		title: "后台录入页",
		book: {
			name: "",
			author: "",
			publish: "",
			pubTime: "",
			price: "",
			oriPrice: "",
			img: "",
			summary: "",
			num: "",
			page: "",
			word: "",
			print: "",
			size: "",
			pager: "",
			package: "",
			suit: "",
			ISBN: "",
			classify: ""
		}
	});
});

app.get("/admin/update/:id", function(req,res){
	let id = req.params.id;
	if(id){
		Book.findById(id, function(err, book){
			if(err){
				console.log(err);
				return;
			};
			res.render("admin-book", {
				title: "后台更新页",
				book: book
			});
		});
	};
});

app.post("/admin/book/new", function(req, res){
	let id = req.body.book._id,
		bookObj = req.body.book,
		_book = "";
	if(id !== ""){
		Book.findById(id, function(err, book){
			if(err){
				console.log(err);
				return;
			};
			_book = _.extend(book, bookObj);
			_book.save(function(err, book){
				if(err){
					console.log(err);
					return;
				};
				res.redirect("/book" + book._id);
			});
		});
		return;
	};
	_book = new Book({
		name: bookObj.name,
		author: bookObj.author,
		publish: bookObj.publish,
		pubTime: bookObj.pubTime,
		price: bookObj.price,
		oriPrice: bookObj.oriPrice,
		img: bookObj.img,
		summary: bookObj.summary,
		num: bookObj.num,
		page: bookObj.page,
		word: bookObj.word,
		print: bookObj.print,
		size: bookObj.size,
		pager: bookObj.pager,
		package: bookObj.package,
		suit: bookObj.suit,
		ISBN: bookObj.ISBN,
		classify: bookObj.classify
	});
	_book.save(function(err, book){
		if(err){
			console.log(err);
			return;
		};
		res.redirect("/book/" + book._id);
	});
});