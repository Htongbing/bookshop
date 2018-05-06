let utils = (function(){
	function selectEle(id, tag){
		let ele = document.getElementById(id);
		if(tag){
			ele = ele.getElementsByTagName(tag);
		};
		return ele;
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

	return {
		selectEle,
		bindEvent,
		html,
		val
	};
})();