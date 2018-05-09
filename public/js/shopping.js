~(function(){
	let allSelectAry = utils.selectClass("all_select");
	let selectAry = utils.selectClass("select");
	let allNum = utils.selectEle("all_num");
	let allPrice = utils.selectEle("all_price");
	let plusAry = utils.selectClass("plus");
	let minusAry = utils.selectClass("minus");
	let itemNumInputAry = utils.selectClass("item_num_input");
	let itemDelAry = utils.selectClass("item_del");
	let list = utils.selectEle("list");
	let allDel = utils.selectEle("all_del");

	if(allNum){
		compute();
		
		allSelectAry.forEach((item) => {
			utils.bindEvent(item, "click", function(){
				if(this.className === "all_select"){
					allSelectAry.forEach((item) => {
						item.className = "all_select no-select";
					});
					selectAry.forEach((item) => {
						item.className = "select no-select";
					});
					compute();
					return;
				};
				allSelectAry.forEach((item) => {
					item.className = "all_select";
				});
				selectAry.forEach((item) => {
					item.className = "select";
				});
				compute();
			});
		});

		plusAry.forEach((item) => {
			utils.bindEvent(item, "click", function(){
				let tarInput = this.previousElementSibling;
				if(parseFloat(utils.val(tarInput)) < 20){
					tarInput.value++;
					itemPriceSum(this);
					changeCart(tarInput);
				};
			});
		});

		minusAry.forEach((item) => {
			utils.bindEvent(item, "click", function(){
				let tarInput = this.nextElementSibling;
				if(parseFloat(utils.val(tarInput)) > 1){
					tarInput.value--;
					itemPriceSum(this);
					changeCart(tarInput);
				};
			});
		});

		itemNumInputAry.forEach((item) => {
			utils.bindEvent(item, "keyup", function(){
				if(!/^\d+$/.test(utils.val(this)) && utils.val(this) !== ""){
					utils.val(this, 1);
				};
				if(utils.val(this) > 20){
					utils.val(this, 20);
				};
				if(utils.val(this) === 0){
					utils.val(this, 1);
				};
				if(utils.val(this) !== ""){
					itemPriceSum(this);
					compute();
					changeCart(this);
				};
			});

			utils.bindEvent(item, "blur", function(){
				if(utils.val(this) === ""){
					utils.val(this, 1);
					itemPriceSum(this);
					compute();
					changeCart(this);
				};
			});
		});

		selectAry.forEach((item) => {
			utils.bindEvent(item, "click", function(){
				if(this.className === "select"){
					this.className = "select no-select";
					allSelectAry.forEach((newItem) => {
						newItem.className = "all_select no-select";
					});
					itemPriceSum(this);
					compute();
					return;
				};
				this.className = "select";
				let all = true;
				for(let i = 0, len = selectAry.length; i < len; i++){
					if(selectAry[i].className !== "select"){
						all = false;
						break;
					};
				};
				if(all){
					allSelectAry.forEach((newItem) => {
						newItem.className = "all_select";
					});
				};
				itemPriceSum(this);
				compute();
			});
		});

		itemDelAry.forEach((item) => {
			utils.bindEvent(item, "click", function(){
				let tarLi = this.parentNode.parentNode;
				let id = utils.attr(tarLi, "bookId");
				let option = {
					type: "post",
					url: "/shopping/remove",
					async: true,
					success: function(val){
						if(val.ok === 1){
							let tarSelect = utils.selectClass("select", tarLi)[0];
							selectAry.splice(selectAry.indexOf(tarSelect), 1);
							list.removeChild(tarLi);
							compute();
							utils.updateShopping();
						};
					},
					data: {
						id
					}
				};
				utils.ajax(option);
			});
		});

		utils.bindEvent(allDel, "click", function(){
			let eleAry = [];
			let idAry = [];
			selectAry.forEach((item) => {
				if(item.className === "select"){
					let tarLi = item.parentNode.parentNode;
					let id = utils.attr(tarLi, "bookId");
					eleAry.push(tarLi);
					idAry.push(id);
				};
			});
			if(eleAry.length > 0){
				let option = {
					type: "post",
					url: "/shopping/remove",
					async: true,
					success: function(val){
						if(val.ok === 1){
							eleAry.forEach((item) => {
								let tarSelect = utils.selectClass("select", item)[0];
								selectAry.splice(selectAry.indexOf(tarSelect), 1);
								list.removeChild(item);
							});
							compute();
							utils.updateShopping();
						};
					},
					data: {
						idAry
					}
				};
				utils.ajax(option);
			};
		});
	};

	function compute(){
		let num = 0;
		let price = 0;
		selectAry.forEach((item) => {
			if(item.className === "select"){
				let tarLi = item.parentNode.parentNode;
				let inputVal = utils.selectTag(tarLi, "input")[0].value;
				let itemAllPrice = utils.selectClass("item_all_price", tarLi)[0].innerHTML.slice(1);
				num += parseFloat(inputVal);
				price += parseFloat(itemAllPrice);
			};
		});
		utils.html(allNum, num);
		utils.html(allPrice, "&yen;" + price.toFixed(2));
	};

	function itemPriceSum(item){
		let tarLi = item.parentNode.parentNode;
		let tarInput = utils.selectClass("item_num_input", tarLi)[0];
		let tarPrice = utils.selectClass("item_pri", tarLi)[0].innerHTML.slice(1);
		utils.html(utils.selectClass("item_all_price", tarLi)[0], "&yen;" + (tarInput.value * tarPrice).toFixed(2));
		let tarSelect = utils.selectClass("select", tarLi)[0];
		if(tarSelect.className === "select"){
			compute();
		};
	};

	function changeCart(ele){
		let tarLi = ele.parentNode.parentNode;
		let id = utils.attr(tarLi, "bookId");
		let num = parseFloat(utils.val(ele));
		let option = {
			type: "post",
			url: "/shopping/change",
			async: true,
			success: function(val){
				if(val.ok === 1){
					utils.updateShopping();
				};
			},
			data: {
				id,
				num
			}
		};
		utils.ajax(option);
	};
})();