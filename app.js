let express = require("express");
let	port = 3000;
let	path = require("path");
let	app = express();
let	mongoose = require("mongoose");
let	Book = require("./models/book.js");
let User = require("./models/user.js");
let	bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let	_ = require("underscore");

mongoose.connect("mongodb://localhost:27017/bookshop");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	name: "user",
	secret: "bookshop",
	resave: false,
	saveUninitialized: true
}));
app.set("views", "./views");
app.set("view engine", "pug");
app.listen(port);

console.log("Server created successful and listening for port " + port + ".");

app.get("/", function(req, res){
	console.log(req.session.user);
	res.render("index", {
		title: "首页"
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
			res.redirect("/");
			return;
		};
		let user = new User(_user);
		user.save(function(err, data){
			if(err){
				console.log(err);
				return;
			};
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
	res.render("list", {
		title: "列表页"
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
	res.render("shopping", {
		title: "购物车"
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