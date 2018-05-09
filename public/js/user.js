~(function(){
	let nav = utils.selectEle("nav");
	let navLiAry = utils.selectTag(nav, "li");
	let tabAry = utils.selectClass("tab");

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
})();