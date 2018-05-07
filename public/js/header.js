~(function(){
	let search = utils.selectEle("search");
	let searchCon = utils.selectEle("search_con");

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