~(function(){
	const buyNum = utils.selectEle("buy_num");
	const curPriceSum = utils.selectEle("cur_price_sum");
	const oriPriceSum = utils.selectEle("ori_price_sum");
	const curPrice = utils.attr(curPriceSum, "price");
	const oriPrice = utils.attr(oriPriceSum, "price");
	const numPlus = utils.selectEle("num_plus");
	const numMinus = utils.selectEle("num_minus");
	const addCart = utils.selectEle("addCart");
	const commentBtn = utils.selectEle("comment-btn");
	const list = utils.selectEle("list");
	const tabLiAry = utils.selectTag(list, "li");
	const tabAry = utils.children(commentBtn, "div");
	const buyNow = utils.selectEle("buyNow");
	const commentSend = utils.selectEle("comment-send");
	const commentContent = utils.selectEle("comment-content");
	const payAdd = utils.selectEle("pay-add");
	const payUserMoney = utils.selectEle("pay-user-money");

	utils.bindEvent(payAdd, "click", function(){
		let option = {
			type: "get",
			url: "/pay/add",
			async: true,
			success: function(res){
				if(res.status === 1){
					utils.html(payUserMoney, "&yen;" + res.val.toFixed(2));
				};
			},
			data: null
		};
		utils.ajax(option);
	});

	utils.bindEvent(commentSend, "click", function(){
		if(utils.val(commentContent) === ""){
			utils.openTipDialog("评论内容不能为空");
			return;
		};
		let option = {
			type: "post",
			url: "/comment",
			async: true,
			success: function(res){
				utils.openTipDialog(res.msg);
			},
			data: {
				content: utils.val(commentContent),
				bookId: utils.attr(this, "bookId")
			}
		};
		utils.ajax(option);
	});

	utils.openPayWinEvent();
	utils.tipDialogEvent();

	utils.bindEvent(buyNow, "click", function(){
		let username = utils.handleCookie("username");
		if(!username){
			window.open("/login");
			return;
		};
		utils.openPayWin(utils.val(buyNum), utils.html(curPriceSum));
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