~(function(){
	const buyNum = utils.selectEle("buy_num");
	const curPriceSum = utils.selectEle("cur_price_sum");
	const oriPriceSum = utils.selectEle("ori_price_sum");
	const curPrice = utils.attr(curPriceSum, "price");
	const oriPrice = utils.attr(oriPriceSum, "price");
	const numPlus = utils.selectEle("num_plus");
	const numMinus = utils.selectEle("num_minus");
	const addCart = utils.selectEle("addCart");
	const comment = utils.selectEle("comment");
	const list = utils.selectEle("list");
	const tabLiAry = utils.selectTag(list, "li");
	const tabAry = utils.children(comment, "div");
	const buyNow = utils.selectEle("buyNow");
	const payDialog = utils.selectEle("pay-dialog");
	const body = document.body;
	const closePayWin = utils.selectEle("close-pay-win");
	const payCancel = utils.selectEle("pay-cancel");
	const payShopNum = utils.selectEle("pay-shop-num");
	const payAllPrice = utils.selectEle("pay-all-price");
	const payUserMoney = utils.selectEle("pay-user-money");
	const payPhone = utils.selectEle("pay-phone");
	const payAddress = utils.selectEle("pay-address");
	const payCom = utils.selectEle("pay-com");

	utils.bindEvent(payCom, "click", function(){
		if(utils.val(payPhone) === "" || utils.val(payAddress) === ""){
			alert("请输入手机号码和收货地址");
			return;
		};
		let reg = /^1[34578]\d{9}$/;
		if(!reg.test(utils.val(payPhone))){
			alert("请输入正确的手机号码");
			return;
		};
	});

	utils.bindEvent(payCancel, "click", function(){
		utils.setStyle(payDialog, "visibility", "hidden");
		utils.setStyle(body, "overflow", "auto");
	});

	utils.bindEvent(closePayWin, "click", function(){
		utils.setStyle(payDialog, "visibility", "hidden");
		utils.setStyle(body, "overflow", "auto");
	});

	utils.bindEvent(buyNow, "click", function(){
		let username = utils.handleCookie("username");
		if(!username){
			window.open("/login");
			return;
		};
		let option = {
			type: "get",
			url: "/user/info",
			async: true,
			success: function(res){
				if(res.status === 1){
					let data = res.data;
					utils.html(payUserMoney, "&yen;" + data.money.toFixed(2));
					utils.val(payPhone, data.telephone);
					utils.val(payAddress, data.address);
					utils.html(payShopNum, utils.val(buyNum));
					utils.html(payAllPrice, utils.html(curPriceSum));
					utils.setStyle(payDialog, "visibility", "visible");
					utils.setStyle(body, "overflow", "hidden");
				};
			},
			data: null
		};
		utils.ajax(option);
	});

	tabLiAry.forEach((item, index) => {
		utils.bindEvent(item, "click", function(){
			tabLiAry.forEach((newItem, newIndex) => {
				newItem.className = "";
				tabAry[newIndex].className = tabAry[newIndex].className.replace(/ active/g, "");
			});
			item.className = "active";
			tabAry[index].className += " active";
		});
	});

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
		let id = utils.attr(this, "bookId");
		if(!username){
			window.open("/login");
			return;
		};
		let option = {
			type: "post",
			url: "/shopping/add",
			async: true,
			success: function(val){
				if(val.ok === 1){
					utils.updateShopping();
				};
			},
			data: {
				id,
				num: parseFloat(utils.val(buyNum))
			}
		};
		utils.ajax(option);
	});

	function sum(){
		utils.html(curPriceSum, "&yen;" + (curPrice * utils.val(buyNum)).toFixed(2));
		utils.html(oriPriceSum, "&yen;" + (oriPrice * utils.val(buyNum)).toFixed(2));
	};
})();