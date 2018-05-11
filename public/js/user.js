~(function(){
	let nav = utils.selectEle("nav");
	let navLiAry = utils.selectTag(nav, "li");
	let tabAry = utils.selectClass("tab");
	let passwordReload = utils.selectClass("password_reload");
	let newPay = utils.selectEle("new-pay");
	let newRepay = utils.selectEle("new-repay");
	let payChange = utils.selectEle("pay-change");
	let oldPay = utils.selectEle("old-pay");

	utils.tipDialogEvent();

	utils.bindEvent(payChange, "click", function(){
		let oldPass = utils.val(oldPay);
		let newPass = utils.val(newPay);
		if(newPass.length !== 6){
			utils.openTipDialog("请输入6位的支付密码");
			return;
		};
		if(utils.val(newRepay) !== newPass){
			utils.openTipDialog("两次密码输入不一致");
			return;
		};
		let option = {
			type: "post",
			url: "/pay/change",
			async: true,
			success: function(res){
				utils.val(oldPay, "");
				utils.val(newPay, "");
				utils.val(newRepay, "");
				utils.openTipDialog(res.msg);
			},
			data: {
				oldPass,
				newPass
			}
		};
		utils.ajax(option);
	});

	navLiAry.forEach((item, index) => {
		utils.bindEvent(item, "click", function(){
			if(item.className === ""){
				navLiAry.forEach((newitem, newindex) => {
					newitem.className = "";
					tabAry[newindex].className = "tab";
				});
				item.className = "active";
				tabAry[index].className = "tab active";
			};
		});
	});

	passwordReload.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			let tarDiv = this.parentNode.parentNode;
			utils.selectTag(tarDiv, "input").forEach((newitem) => {
				utils.val(newitem, "");
			});
		});
	});
})();