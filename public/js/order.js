~(function(){

	utils.tipDialogEvent();

	let expressAry = utils.selectClass("express");
	let passwordDialog = utils.selectEle("password-dialog");
	let expressCom = utils.selectEle("express-com");
	let expressNum = utils.selectEle("express-num");
	let passwordCom = utils.selectEle("password-com");
	let passwordCancel = utils.selectEle("password-cancel");
	let body = document.body;
	let id = "";

	expressAry.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			id = utils.attr(item, "orderId");
			utils.setStyle(passwordDialog, "visibility", "visible");
			utils.setStyle(body, "overflow", "hidden");
		});
	});

	utils.bindEvent(passwordCancel, "click", function(){
		utils.setStyle(passwordDialog, "visibility", "hidden");
		utils.setStyle(body, "overflow", "auto");
	});

	utils.bindEvent(passwordCom, "click", function(){
		utils.setStyle(passwordDialog, "visibility", "hidden");
		utils.setStyle(body, "overflow", "auto");
		let obj = {
			id: id,
			expCom: utils.val(expressCom),
			expNum: parseFloat(utils.val(expressNum))
		};
		let option = {
			type: "post",
			url: "/order/express",
			async: true,
			success: function(res){
				if(res.ok === 1){
					utils.val(passwordCom, "");
					utils.val(expressNum, "");
					utils.openTipDialog("发货成功");
				};
			},
			data: obj
		};
		utils.ajax(option);
	});
})();