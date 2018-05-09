~(function(){
	let search = utils.selectEle("search");
	let searchCon = utils.selectEle("search_con");
	let shoppingCartAry = utils.selectClass("shopping_cart");
	let userIndentAry = utils.selectClass("user_indent");

	if(utils.handleCookie("username")){
		utils.updateShopping();
	};

	shoppingCartAry.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			if(!utils.handleCookie("username")){
				window.open("/login");
				return;
			};
			window.open("/shopping");
		});
	});

	userIndentAry.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			if(!utils.handleCookie("username")){
				window.open("/login");
				return;
			};
			window.open("/user");
		});
	});

	utils.bindEvent(search, "click", function(){
		let val = "search=" + utils.val(searchCon);
		utils.searchFun(val);
	});
	utils.bindEvent(searchCon, "keydown", function(e){
		if(e.keyCode === 13){
			let val = "search=" + utils.val(searchCon);
			utils.searchFun(val);
		};
	});
})();