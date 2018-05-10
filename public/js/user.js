~(function(){
	let nav = utils.selectEle("nav");
	let navLiAry = utils.selectTag(nav, "li");
	let tabAry = utils.selectClass("tab");
	let passwordReload = utils.selectClass("password_reload");

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