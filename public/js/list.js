~(function(){
	let addCartAry = utils.selectClass("add_cart");

	addCartAry.forEach((item) => {
		utils.bindEvent(item, "click", function(){
			let username = utils.handleCookie("username");
			let id = utils.attr(item, "bookId");
			if(!username){
				window.open("/login");
				return;
			};
			let option = {
				type: "post",
				url: "/shopping/add",
				async: true,
				success: function(val){
					if(val.status === 1){
						location.reload();
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