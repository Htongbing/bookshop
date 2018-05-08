~(function(){
	const buyNum = utils.selectEle("buy_num");
	const curPriceSum = utils.selectEle("cur_price_sum");
	const oriPriceSum = utils.selectEle("ori_price_sum");
	const curPrice = utils.attr(curPriceSum, "price");
	const oriPrice = utils.attr(oriPriceSum, "price");
	const numPlus = utils.selectEle("num_plus");
	const numMinus = utils.selectEle("num_minus");
	const addCart = utils.selectEle("addCart");

	utils.bindEvent(buyNum, "keyup", function(){
		if(!/^\d+$/.test(utils.val(this)) && utils.val(this) !== ""){
			utils.val(this, 1);
		};
		if(utils.val(this) > 20){
			utils.val(this, 20);
		};
		if(utils.val(this) !== ""){
			sum();
		};
	});

	utils.bindEvent(buyNum, "blur", function(){
		if(utils.val(this) === ""){
			utils.val(this, 1);
			sum();
		};
	});

	utils.bindEvent(numPlus, "click", function(){
		let val = utils.val(buyNum);
		if(val >= 20){
			return;
		};
		utils.val(buyNum, ++val);
		sum();
	});

	utils.bindEvent(numMinus, "click", function(){
		let val = utils.val(buyNum);
		if(val <= 1){
			return;
		};
		utils.val(buyNum, --val);
		sum();
	});

	utils.bindEvent(addCart, "click", function(){
		let username = utils.handleCookie("username");
		if(!username){
			window.open("/login");
			return;
		};
	});

	function sum(){
		utils.html(curPriceSum, "&yen;" + (curPrice * utils.val(buyNum)).toFixed(2));
		utils.html(oriPriceSum, "&yen;" + (oriPrice * utils.val(buyNum)).toFixed(2));
	};
})();