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
						utils.html(item, num);
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
		setStyle
	};
})();