let express = require("express");
let	port = 2222;
let	path = require("path");
let	app = express();
let	mongoose = require("mongoose");
let	Book = require("./models/book.js");
let User = require("./models/user.js");
let Adm = require("./models/adm.js");
let Order = require("./models/order.js");
let Consumption = require("./models/consumption.js");
let Comment = require("./models/comment.js");
let	bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let mongoStore = require("connect-mongo")(session);
let	_ = require("underscore");
let dbUrl = "mongodb://127.0.0.1:27017/bookshop";

mongoose.connect(dbUrl);

app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
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

app.get("/pay/add", function(req, res){
	let username = req.cookies.username;
	Consumption.findOne({"username": username}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		let num = data.money + 100;
		Consumption.update({"username": username}, {$set:{"money": num}}, function(err, info){
			if(err){
				console.log(err);
				return;
			};
			let result = {
				status: 1,
				val: num
			};
			res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
			res.end(JSON.stringify(result));
		});
	});
});

app.post("/comment", function(req, res){
	let username = req.cookies.username;
	let str = "";
	let result = {
		status: 0,
		msg: "评论失败"
	};
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		obj.username = username;
		let comment = new Comment(obj);
		comment.save(function(err, data){
			if(err){
				console.log(err);
				return;
			};
			result = {
				status: 1,
				msg: "评论成功"
			};
			res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
			res.end(JSON.stringify(result));
		});
	});
});

app.post("/pay/change", function(req, res){
	let username = req.cookies.username;
	let str = "";
	let result = {
		status: 0,
		msg: "修改失败"
	};
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		Consumption.findOne({"username": username}, function(err, data){
			if(err){
				console.log(err);
				return;
			};
			if(!data.password && obj.oldPass === ""){
				Consumption.updatePassword(username, obj.newPass, function(err, info){
					if(err){
						console.log(err);
						return;
					};
					res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
					if(info.ok === 1){
						result = {
							status: 1,
							msg: "修改成功"
						};
					};
					res.end(JSON.stringify(result));
				});
				return;
			};
			data.comparePassword(obj.oldPass, function(err, isMatch){
				if(err){
					console.log(err);
					return;
				};
				if(!isMatch){
					result = {
						status: 0,
						msg: "旧密码输入错误"
					};
					res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
					res.end(JSON.stringify(result));
					return;
				};
				Consumption.updatePassword(username, obj.newPass, function(err, info){
					if(err){
						console.log(err);
						return;
					};
					res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
					if(info.ok === 1){
						result = {
							status: 1,
							msg: "修改成功"
						};
					};
					res.end(JSON.stringify(result));
				});
			});
		});
	});
});

app.post("/pay", function(req, res){
	let username = req.cookies.username;
	let str = "";
	let result = {
		status: 0,
		msg: "未设置支付密码"
	};
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		Consumption.findOne({"username": username}, function(err, data){
			if(err){
				console.log(err);
				return;
			};
			if(!data.password){
				res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
				res.end(JSON.stringify(result));
				return;
			};
			data.comparePassword(obj.payPass, function(err, isMatch){
				if(err){
					console.log(err);
					return;
				};
				if(!isMatch){
					result = {
						status: 0,
						msg: "支付密码错误"
					};
					res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
					res.end(JSON.stringify(result));
					return;
				};
				if(data.money < obj.sumPrice){
					result = {
						status: 0,
						msg: "余额不足"
					};
					res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
					res.end(JSON.stringify(result));
					return;
				};
				result = {
					status: 1,
					msg: "支付成功"
				};
				res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
				res.end(JSON.stringify(result));
				let tarMoney = data.money - obj.sumPrice;
				Consumption.update({"username": username}, {$set: {"money": tarMoney}}, function(err, info){
					if(err){
						console.log(err);
					};
				});
				User.findOne({"username": username}, function(err, newData){
					if(err){
						console.log(err);
						return;
					};
					if(!newData.telephone){
						User.update({"username": username}, {$set:{"telephone": obj.telephone}}, function(err, info){
							if(err){
								console.log(err);
								return;
							};
						});
					};
					if(!newData.address){
						User.update({"username": username}, {$set:{"address": obj.address}}, function(err, info){
							if(err){
								console.log(err);
								return;
							};
						});
					};
				});
				let order = {
					username: username
				};
				let date = new Date();
				let dateStr = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
				let randomNum = 20 - dateStr.length;
				for(let i = 0; i < randomNum; i++){
					dateStr += Math.floor(Math.random() * 10);
				};
				order.orderNum = dateStr;
				if(typeof obj.id === "string"){
					Book.findOne({"_id": obj.id}, function(err, tarBook){
						if(err){
							console.log(err);
							return;
						};
						let num = tarBook.sale + obj.num;
						Book.update({"_id": obj.id}, {$set:{"sale": num}}, function(err, info){
							if(err){
								console.log(err);
							};
						});
						let detail = {
							id: tarBook._id + "",
							name: tarBook.name,
							num: obj.num,
							sumPrice: obj.sumPrice
						};
						order.detail = detail;
						let orderObj = new Order(order);
						orderObj.save(function(err, info){
							if(err){
								console.log(err);
							};
						});
					});
				}else{
					let nameAry = [];
					let numAry = [];
					let idAry = [];
					for(let key in obj.id){
						numAry.push(obj.id[key]);
						idAry.push(key);
						Book.findOne({"_id": key}, function(err, tarBook){
							if(err){
								console.log(err);
								return;
							};
							let num = tarBook.sale + obj.id[key];
							Book.update({"_id": key}, {$set:{"sale": num}}, function(err, info){
								if(err){
									console.log(err);
								};
							});
						});
					};
					idAry.forEach((newitem, index) => {
						if(index === idAry.length - 1){
							Book.findOne({"_id": newitem}, function(err, tarBook){
								if(err){
									console.log(err);
									return;
								};
								nameAry.push(tarBook.name);
								let detail = {
									id: idAry,
									itemNum: numAry,
									name: nameAry,
									num: obj.num,
									sumPrice: obj.sumPrice
								};
								order.detail = detail;
								let orderObj = new Order(order);
								orderObj.save(function(err, info){
									if(err){
										console.log(err);
									};
									order.detail.id.forEach((item) => {
										Consumption.update({"username": order.username}, {$pull: {"shoppingCart": {"id": item}}}, function(err, data){
											if(err){
												console.log(err);
												return;
											};
										});
									});
								});
							});
						}else{
							Book.findOne({"_id": newitem}, function(err, tarBook){
								if(err){
									console.log(err);
									return;
								};
								nameAry.push(tarBook.name);
							});
						};
						
					});
				};
			});
		});
	});
});

app.get("/", function(req, res){
	if(req.session.user){
		res.cookie("username", req.session.user.username);
	};
	Book.fetchSortPublish(function(err, data){
		if(err){
			console.log(err);
			return;
		};
		let newBook = [];
		let recBook = [];
		for(let i = 0; i < 9; i++){
			newBook.push(data[i]);
		};
		for(let i = 0; i < 12; i++){
			let randomIndex = Math.floor(Math.random() * (data.length - 1));
			recBook.push(data[randomIndex]);
			data.splice(randomIndex, 1);
		};
		Book.fetchSortSale(function(err, newData){
			if(err){
				console.log(err);
				return;
			};
			let rankBook = [];
			let likeBook = [];
			for(let i = 0; i < 10; i++){
				rankBook.push(newData[i]);
			};
			for(let i = 0; i < 12; i++){
				let randomIndex = Math.floor(Math.random() * (newData.length - 1));
				likeBook.push(newData[randomIndex]);
				newData.splice(randomIndex, 1);
			};
			res.render("index", {
				title: "首页",
				newBook,
				recBook,
				rankBook,
				likeBook
			});
		});
	});
});

app.get("/admin/login", function(req, res){
	res.render("login", {
		title: "管理员登录"
	});
});

app.post("/admin/signin", function(req, res){
	let user = req.body.user;
	Adm.findOne({
		admname: user.username
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
			res.cookie("admname", user.username);
			res.redirect("/");
		});
	});
});

app.get("/admin/order", function(req, res){
	if(!req.cookies.admname){
		res.redirect("/");
		return;
	};
	Order.find({}, function(err, orders){
		if(err){
			console.log(err);
			return;
		};
		res.render("order", {
			title: "后台订单列表",
			orders
		});
	});
});

app.post("/order/express", function(req, res){
	let str = "";
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		Order.update({"_id": obj.id}, {$set:{"state":"已发货", "expCom": obj.expCom, "expNum": obj.expNum}}, function(err, data){
			if(err){
				console.log(err);
				return;
			};
			res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
			res.end(JSON.stringify(data));
		});
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
		res.writeHead(200, {"content-type": "application/json;charset=utf-8;"})
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

app.post("/shopping/remove", function(req, res){
	let str = "";
	let username = req.cookies.username;
	req.on("data", function(chunk){
		str += chunk;
	});
	req.on("end", function(){
		let obj = JSON.parse(str);
		if(obj.id){
			Consumption.update({"username": username}, {$pull: {"shoppingCart": {"id": obj.id}}}, function(err, data){
				if(err){
					console.log(err);
					return;
				};
				res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
				res.end(JSON.stringify(data));
			});
			return;
		};
		if(obj.idAry.length > 0){
			obj.idAry.forEach((item, index) => {
				if(index === obj.idAry.length - 1){
					Consumption.update({"username": username}, {$pull: {"shoppingCart": {"id": item}}}, function(err, data){
						if(err){
							console.log(err);
							return;
						};
						res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
						res.end(JSON.stringify(data));
					});
				}else{
					Consumption.update({"username": username}, {$pull: {"shoppingCart": {"id": item}}}, function(err, data){
						if(err){
							console.log(err);
							return;
						};
					});
				};
			});
		};
	});
});

app.get("/user", function(req, res){
	let username = req.cookies.username;
	let obj = {
		username
	};
	User.findOne({"username": username}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		obj.sex = data.sex || "";
		obj.telephone = data.telephone || "";
		obj.address = data.address || "";
		Consumption.findOne({"username": username}, function(err, newData){
			if(err){
				console.log(err);
				return;
			};
			Order.find({"username": username}, function(err, ary){
				if(err){
					console.log(err);
					return;
				};
				obj.money = newData.money;
				obj.detail = ary;
				res.render("user", {
					title: "个人中心",
					data: obj
				});
			});
		});
	});
});

app.get("/user/info", function(req, res){
	let username = req.cookies.username;
	let obj = {
		username
	};
	let result = {
		status: 1,
		data: obj
	};
	User.findOne({"username": username}, function(err, data){
		if(err){
			console.log(err);
			return;
		};
		obj.telephone = data.telephone || "";
		obj.address = data.address || "";
		Consumption.findOne({"username": username}, function(err, newData){
			if(err){
				console.log(err);
				return;
			};
			obj.money = newData.money;
			res.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
			res.end(JSON.stringify(result));
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
		Comment.find({"bookId": id}, function(err, comments){
			if(err){
				console.log(err);
				return;
			};
			res.render("detail", {
				title: book.name,
				book: book,
				comments
			});
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