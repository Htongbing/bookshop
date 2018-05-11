let utils = (function(){
	function selectEle(id, tag){
		let ele = document.getElementById(id);
		if(tag){
			ele = ele.getElementsByTagName(tag);
		};
		return ele;
	};

	function selectClass(classname, ele){
		let eles = document.getElementsByClassName(classname);
		if(ele){
			eles = ele.getElementsByClassName(classname);
		};
		eles = Array.prototype.slice.call(eles, "");
		return eles;
	};

	function selectTag(ele, tag){
		let eles = ele.getElementsByTagName(tag);
		eles = Array.prototype.slice.call(eles, "");
		return eles;
	};

	function children(ele, tag){
		let ary = Array.prototype.slice.call(ele.children, "");
		if(tag){
			let newAry = [];
			ary.forEach((item) => {
				if(item.tagName.toLowerCase() === tag.toLowerCase()){
					newAry.push(item);
				};
			});
			return newAry;
		};
		return ary;
	};

	function bindEvent(ele, type, fn){
		ele.addEventListener(type, fn);
		return ele;
	};

	function html(ele, val){
		if(val === undefined){
			return ele.innerHTML;
		};
		ele.innerHTML = val;
		return ele;
	};

	function val(ele, val){
		if(val === undefined){
			return ele.value;
		};
		ele.value = val;
		return ele;
	};

	function searchFun(val){
		window.open("/list?" + val);
	};

	function ajax(option){
		let xhr = new XMLHttpRequest();
		xhr.open(option.type, option.url, option.async);
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(/^2\d{2}$/.test(xhr.status)){
					let val = JSON.parse(xhr.responseText);
					option.success && option.success.call(xhr, val);
				};
			};
		};
		xhr.send(JSON.stringify(option.data));
	};

	function handleCookie(key){
		let str = document.cookie;
		let obj = {};
		if(str){
			let ary = str.split(";");
			ary.forEach((item) => {
				let tarStr = item.replace(/(^\s+)|(\s+$)/g, "");
				let tarAry = tarStr.split("=");
				obj[tarAry[0]] = tarAry[1];
			});
			return obj[key];
		};
		return "";
	};

	function attr(ele, attr, val){
		if(val === undefined){
			return ele.getAttribute(attr);
		};
		ele.setAttribute(attr, val);
		return this;
	};

	function updateShopping(){
		let cartNumAry = selectClass("cart_items_num");
		let option = {
			type: "get",
			url: "/shopping/num",
			async: true,
			success: function(val){
				if(val.status === 1){
					let num = val.num;
					if(num > 99){
						num = "99+";
					};
					cartNumAry.forEach((item) => {
						html(item, num);
					});
				};
			},
			data: null
		};
		ajax(option);
	};

	function setStyle(ele, attr, num){
		ele.style[attr] = num;
		return ele;
	};

	function openPayWin(num, price){
		let option = {
			type: "get",
			url: "/user/info",
			async: true,
			success: function(res){
				if(res.status === 1){
					let data = res.data;
					html(selectEle("pay-user-money"), "&yen;" + data.money.toFixed(2));
					val(selectEle("pay-phone"), data.telephone);
					val(selectEle("pay-address"), data.address);
					html(selectEle("pay-shop-num"), num);
					html(selectEle("pay-all-price"), price);
					setStyle(selectEle("pay-dialog"), "visibility", "visible");
					setStyle(document.body, "overflow", "hidden");
				};
			},
			data: null
		};
		ajax(option);
	};

	function openPayWinEvent(){
		const closePayWin = selectEle("close-pay-win");
		const payCancel = selectEle("pay-cancel");
		const payCom = selectEle("pay-com");
		const payPhone = selectEle("pay-phone");
		const payAddress = selectEle("pay-address");
		const payDialog = selectEle("pay-dialog");
		const body = document.body;
		const passwordDialog = selectEle("password-dialog");
		const passwordCancel = selectEle("password-cancel");
		const payPassword = selectEle("pay-password");
		const passwordCom = selectEle("password-com");
		const tipDialog = selectEle("tip-dialog");
		const tip = selectEle("tip");
		const payShopNum = selectEle("pay-shop-num");
		const payAllPrice= selectEle("pay-all-price");

		bindEvent(payPassword, "keyup", function(){
			if(val(this).length === 6){
				setStyle(passwordCom, "backgroundColor", "red");
				setStyle(passwordCom, "cursor", "pointer");
				passwordCom.onclick = function(){
					comPayFun(val(payPassword), val(payPhone), val(payAddress), parseFloat(html(payShopNum)), parseFloat(html(payAllPrice).slice(1)), attr(payShopNum, "bookId"));
				};
				return;
			};
			setStyle(passwordCom, "backgroundColor", "#ccc");
			setStyle(passwordCom, "cursor", "not-allowed");
			passwordCom.onclick = null;
		});

		bindEvent(payCom, "click", function(){
			if(val(payPhone).replace(/(^\s+)|(\s+$)/g, "") === "" || val(payAddress).replace(/(^\s+)|(\s+$)/g, "") === ""){
				openTipDialog("请输入手机号码和收货地址");
				return;
			};
			let reg = /^1[34578]\d{9}$/;
			if(!reg.test(val(payPhone))){
				openTipDialog("请输入正确的手机号码");
				return;
			};
			setStyle(passwordDialog, "visibility", "visible");
		});

		bindEvent(payCancel, "click", function(){
			setStyle(payDialog, "visibility", "hidden");
			setStyle(body, "overflow", "auto");
		});

		bindEvent(closePayWin, "click", function(){
			setStyle(payDialog, "visibility", "hidden");
			setStyle(body, "overflow", "auto");
		});

		bindEvent(passwordCancel, "click", function(){
			setStyle(passwordDialog, "visibility", "hidden");
		});
	};

	function comPayFun(val, phone, address, num, sumPrice, id){
		let option = {
			type: "post",
			url: "/pay",
			async: true,
			success: function(res){
				if(res.status === 0){
					openTipDialog(res.msg);
					return;
				};
				openTipDialog(res.msg);
				successPay();
			},
			data: {
				payPass: val,
				telephone: phone,
				address: address,
				sumPrice: sumPrice,
				id: id,
				num: num
			}
		};
		ajax(option);
	};

	function tipDialogEvent(){
		const tipDialog = selectEle("tip-dialog");
		const tip = selectEle("tip");
		const closeTipWin = selectEle("close-tip-win");
		const tipCom = selectEle("tip-com");

		tipCom.onclick = function(){
			setStyle(tipDialog, "visibility", "hidden");
		};

		closeTipWin.onclick = function(){
			setStyle(tipDialog, "visibility", "hidden");
		};
	};

	function openTipDialog(msg){
		const tipDialog = selectEle("tip-dialog");
		const tip = selectEle("tip");
		setStyle(tipDialog, "visibility", "visible");
		html(tip, msg);
	};

	function successPay(){
		const payDialog = selectEle("pay-dialog");
		const body = document.body;
		const passwordDialog = selectEle("password-dialog");
		const tipDialog = selectEle("tip-dialog");
		const closeTipWin = selectEle("close-tip-win");
		const tipCom = selectEle("tip-com");
		const payPassword = selectEle("pay-password");

		tipCom.onclick = function(){
			setStyle(tipDialog, "visibility", "hidden");
			setStyle(passwordDialog, "visibility", "hidden");
			setStyle(payDialog, "visibility", "hidden");
			setStyle(body, "overflow", "auto");
			val(payPassword, "");
			tipDialogEvent();
		};

		closeTipWin.onclick = function(){
			setStyle(tipDialog, "visibility", "hidden");
			setStyle(passwordDialog, "visibility", "hidden");
			setStyle(payDialog, "visibility", "hidden");
			setStyle(body, "overflow", "auto");
			val(payPassword, "");
			tipDialogEvent();
		};
	};

	return {
		selectEle,
		bindEvent,
		html,
		val,
		searchFun,
		ajax,
		selectClass,
		selectTag,
		children,
		handleCookie,
		attr,
		updateShopping,
		setStyle,
		openPayWin,
		openPayWinEvent,
		tipDialogEvent,
		openTipDialog
	};
})();