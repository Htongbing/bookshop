~(function(){
	let addCartAry = utils.selectClass("add_cart");
	let flag = false;

	if(utils.handleCookie("username")){
		flag = true;
	};

	addCartAry.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			let id = utils.attr(item, "bookId");
			if(!utils.handleCookie("username")){
				window.open("/login");
				return;
			};
			let option = {
				type: "post",
				url: "/shopping/add",
				async: true,
				success: function(val){
					if(!flag){
						location.reload();
						return;
					};
					if(val.ok === 1){
						utils.updateShopping();
					};
				},
				data: {
					id,
					num: 1 
				}
			};
			utils.ajax(option);
		});
	});
})();