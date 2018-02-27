let express = require("express"),
	port = 3000,
	path = require("path"),
	app = express(),
	mongoose = require("mongoose"),
	Book = require("./models/book.js"),
	bodyParser = require("body-parser"),
	_ = require("underscore");

mongoose.connect("mongodb://localhost:27017/bookshop");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());
app.set("views", "./views");
app.set("view engine", "pug");
app.listen(port);

console.log("Server created successful and listening for port " + port + ".");

app.get("/", function(req, res){
	res.render("index", {
		title: "首页"
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
	var id = req.params.id;
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