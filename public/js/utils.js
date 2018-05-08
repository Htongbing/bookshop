let utils = (function(){
	function selectEle(id, tag){
		let ele = document.getElementById(id);
		if(tag){
			ele = ele.getElementsByTagName(tag);
		};
		return ele;
	};

	function selectClass(classname){
		let eles = document.getElementsByClassName(classname);
		eles = Array.prototype.slice.call(eles, "");
		return eles;
	};

	function selectTag(ele, tag){
		let eles = ele.getElementsByTagName(tag);
		eles = Array.prototype.slice.call(eles, "");
		return eles;
	};

	function bindEvent(ele, type, fn){
		ele.addEventListener(type, fn);
		return ele;
	};

	function html(ele, val){
		if(!val){
			return ele.innerHTML;
		};
		ele.innerHTML = val;
		return ele;
	};

	function val(ele, val){
		if(!val){
			return ele.value;
		};
		ele.value = val;
		return ele;
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

	function searchFun(val){
		window.open("/list?" + val);
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
		if(!val){
			return ele.getAttribute(attr);
		};
		ele.setAttribute(attr, val);
		return this;
	};

	return {
		selectEle,
		bindEvent,
		html,
		val,
		ajax,
		searchFun,
		selectClass,
		selectTag,
		handleCookie,
		attr
	};
})();