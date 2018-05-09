~(function(){
	var searchClassify = document.getElementById("search_classify");
	var searchClassifyLis = searchClassify.getElementsByTagName("li");
	var classify = document.getElementById("classify");
	var classifyUl = classify.getElementsByTagName("ul")[0];
	var switchPic = document.getElementById("switch_pic");
	var switchCon = switchPic.getElementsByTagName("div")[0];
	var switchImg = switchCon.getElementsByTagName("img");
	var switchLeft = document.getElementById("circle-left");
	var switchRight = document.getElementById("circle-right");
	var switchUl = switchPic.lastElementChild;
	var switchLis = switchUl.getElementsByTagName("li");
	var timer = null;
	var step = 0;
	var ranking = document.getElementById("ranking_list");
	var rankingLis = ranking.getElementsByTagName("ul")[0].getElementsByTagName("li");
	var rankImg = ranking.getElementsByTagName("ul")[0].getElementsByTagName("img");
	var newbookLeft = document.getElementById("newbook_left");
	var newbookRight = document.getElementById("newbook_right");
	var newbooks = document.getElementById("new_books");
	var ulStep = 0;
	var scrollLis = newbooks.parentNode.lastElementChild.getElementsByTagName("li");
	var newbooksUl = newbooks.getElementsByTagName("ul")[0];
	var newbookImg = newbooksUl.getElementsByTagName("img");
	var newbooksUls = newbooks.getElementsByTagName("ul");
	var recommend = document.getElementById("recommend");
	var recommendLis = recommend.getElementsByTagName("ul")[0].getElementsByTagName("li");
	var recommendDivs = recommend.getElementsByTagName("div");
	var like = document.getElementById("like");
	var likeDiv = like.getElementsByTagName("div")[0];
	var likeLis = like.getElementsByTagName("li");

	let firstAry = utils.selectClass("firstClass");

	utils.selectClass("secondClass").forEach((item, index) => {
		utils.selectTag(item, "a").forEach(newitem => {
			utils.bindEvent(newitem, "click", function(){
				let val = "first=" + firstAry[index].innerText + "&second=" + utils.html(newitem);
				utils.searchFun(val);
			});
		});
	});

	searchClassify.addEventListener("mouseenter", function(){
		this.getElementsByTagName("ul")[0].style.display = "block";
	});

	searchClassify.addEventListener("mouseleave", function(){
		this.getElementsByTagName("ul")[0].style.display = "none";
	});

	~(function(){
		for(i = 0; i < searchClassifyLis.length; i++){
			searchClassifyLis[i].onclick = function(){
				searchClassify.getElementsByTagName("ul")[0].style.display = "none";
				searchClassify.getElementsByTagName("span")[0].innerText = this.innerText;
			};
		};
		var ary = new Array();
		for(i = 0; i < classifyUl.childNodes.length; i++){
			if(classifyUl.childNodes[i].tagName && classifyUl.childNodes[i].tagName.toLowerCase() === "li"){
				ary.push(classifyUl.childNodes[i]);
			};
		};
		for(i = 0; i < ary.length; i++){
			ary[i].onmouseenter = function(){
				this.getElementsByClassName("classify_detail")[0].style.display = "block";
				this.getElementsByClassName("space")[0].style.backgroundColor = "#fff";
				this.style.borderColor = "red";
				this.style.backgroundColor = "#fff";
			};
			ary[i].onmouseleave = function(){
				this.getElementsByClassName("classify_detail")[0].style.display = "none";
				this.getElementsByClassName("space")[0].style.backgroundColor = "transparent";
				this.style.borderColor = "transparent";
				this.style.backgroundColor = "transparent";
			};
		};
		switchPic.addEventListener("mouseover", function(){
			window.clearInterval(timer);
			switchLeft.style.display = switchRight.style.display = "block";
		});
		switchPic.addEventListener("mouseout", function(){
			timer = window.setInterval(slidePic, 3000);
			switchLeft.style.display = switchRight.style.display = "none";
		});
		for(i = 0; i < switchLis.length; i++){
			switchLis[i].index = i;
			switchLis[i].onmouseover = function(){
				window.clearInterval(switchImg[step].timer);
				step = this.index === 0 ? switchLis.length - 1 : this.index - 1;
				slidePic();
			};
		};
		switchRight.addEventListener("click", function(){
			window.clearInterval(switchImg[step].timer);
			slidePic();
		});
		switchLeft.addEventListener("click", function(){
			window.clearInterval(switchImg[step].timer);
			step -= 2;
			if(step === -2){
				step = switchImg.length - 2;
			};
			slidePic();
		});
		for(i = 0; i < rankingLis.length; i++){
			rankingLis[i].index = i;
			rankingLis[i].appear = false;
			if(i === 0){
				rankingLis[i].getElementsByTagName("a")[0].style.display = "inline-block";
				var firstDiv = rankingLis[i].getElementsByTagName("div")[0];
				firstDiv.style.width = rankingLis[i].index === rankingLis.length - 1 ? "71px" : "80px";
				firstDiv.style.height = "100px";
				firstDiv.getElementsByTagName("a")[0].style.height = "60px";
				firstDiv.getElementsByTagName("p")[0].style.display = firstDiv.getElementsByTagName("p")[1].style.display = "block";
				rankingLis[i].appear = true;
			};
			rankingLis[i].onmouseover = function(){
				if(!this.appear){
					for(var i = 0; i < rankingLis.length; i++){
						rankingLis[i].getElementsByTagName("a")[0].style.display = "none";
						var elseDiv = rankingLis[i].getElementsByTagName("div")[0];
						elseDiv.style.width = i === rankingLis.length - 1 ? "178px" : "187px";
						elseDiv.style.height = "auto";
						elseDiv.getElementsByTagName("a")[0].style.height = "20px";
						elseDiv.getElementsByTagName("p")[0].style.display = elseDiv.getElementsByTagName("p")[1].style.display = "none";
						rankingLis[i].appear = false;
					};
					this.getElementsByTagName("a")[0].style.display = "inline-block";
					var oDiv = this.getElementsByTagName("div")[0];
					oDiv.style.width = this.index === rankingLis.length - 1 ? "71px" : "80px";
					oDiv.style.height = "100px";
					oDiv.getElementsByTagName("a")[0].style.height = "60px";
					oDiv.getElementsByTagName("p")[0].style.display = oDiv.getElementsByTagName("p")[1].style.display = "block";
					this.appear = true;
				};
			};
			rankingLis[i].getElementsByTagName("a")[0].onmouseover = function(){
				var linkTitle = this.parentNode.getElementsByTagName("a")[1];
				linkTitle.style.textDecoration = "underline";
				linkTitle.style.color = "#d72832";
			};
			rankingLis[i].getElementsByTagName("a")[0].onmouseout = function(){
				var linkTitle = this.parentNode.getElementsByTagName("a")[1];
				linkTitle.style.textDecoration = "none";
				linkTitle.style.color = "#000";
			};
			rankingLis[i].getElementsByTagName("a")[1].onmouseover = function(){
				this.style.textDecoration = "underline";
				this.style.color = "#d72832";
			};
			rankingLis[i].getElementsByTagName("a")[1].onmouseout = function(){
				this.style.textDecoration = "none";
				this.style.color = "#000";
			};
		};
		newbookRight.addEventListener("click", function(){
			window.clearInterval(newbooksUl.timer);
			ulStep++;
			ulStep > scrollLis.length ? ulStep = 1 : null;
			ulStep === 1 ? newbooksUl.style.left = 0 + "px" : null;
			slideBtn(scrollLis, ulStep);
			var scrollStep = (parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) + 705 * ulStep) / 500 * 10;
			newbooksUl.timer = window.setInterval(function(){
				if(parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) <= ulStep * -705 + scrollStep){
					newbooksUl.style.left = ulStep * -705 + "px";
					window.clearInterval(newbooksUl.timer);
					return;
				};
				newbooksUl.style.left = parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) - scrollStep + "px";
			}, 10);
		});
		newbookLeft.addEventListener("click", function(){
			window.clearInterval(newbooksUl.timer);
			ulStep--;
			ulStep < 0 ? ulStep = scrollLis.length - 1 : null;
			ulStep === scrollLis.length - 1 ? newbooksUl.style.left = -705 * scrollLis.length + "px" : null;
			slideBtn(scrollLis, ulStep);
			var scrollStep = (parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) + 705 * ulStep) / 500 * 10;
			newbooksUl.timer = window.setInterval(function(){
				if(parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) >= ulStep * -705 + scrollStep){
					newbooksUl.style.left = ulStep * -705 + "px";
					window.clearInterval(newbooksUl.timer);
					return;
				};
				newbooksUl.style.left = parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) - scrollStep + "px";
			}, 10);
		});
		for(i = 0; i < scrollLis.length; i++){
			scrollLis[i].index = i;
			scrollLis[i].onmouseover = function(){
				if(ulStep !== this.index){
					window.clearInterval(newbooksUl.timer);
					var tempStep = ulStep;
					ulStep = this.index;
					slideBtn(scrollLis, ulStep);
					var scrollStep = (parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) + 705 * ulStep) / 500 * 10;
					if(ulStep > tempStep){
						newbooksUl.timer = window.setInterval(function(){
							if(parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) <= ulStep * -705 + scrollStep){
								newbooksUl.style.left = ulStep * -705 + "px";
								window.clearInterval(newbooksUl.timer);
								return;
							};
							newbooksUl.style.left = parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) - scrollStep + "px";
						}, 10);
					}else{
						newbooksUl.timer = window.setInterval(function(){
							if(parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) >= ulStep * -705 + scrollStep){
								newbooksUl.style.left = ulStep * -705 + "px";
								window.clearInterval(newbooksUl.timer);
								return;
							};
							newbooksUl.style.left = parseFloat(window.getComputedStyle(newbooksUl, null)["left"]) - scrollStep + "px";
						}, 10);
					};
				};
			};
		};
		for(i = 1; i < newbooksUls.length; i++){
			var newbooksLis = newbooksUls[i].getElementsByTagName("li");
			for(var j = 0; j < newbooksLis.length; j++){
				newbooksLis[j].getElementsByTagName("a")[0].onmouseover = function(){
					var linkTitle = this.parentNode.getElementsByTagName("a")[1];
					linkTitle.style.textDecoration = "underline";
					linkTitle.style.color = "#d72832";
				};
				newbooksLis[j].getElementsByTagName("a")[0].onmouseout = function(){
					var linkTitle = this.parentNode.getElementsByTagName("a")[1];
					linkTitle.style.textDecoration = "none";
					linkTitle.style.color = "#000";
				};
				newbooksLis[j].getElementsByTagName("a")[1].onmouseover = function(){
					this.style.textDecoration = "underline";
					this.style.color = "#d72832";
				};
				newbooksLis[j].getElementsByTagName("a")[1].onmouseout = function(){
					this.style.textDecoration = "none";
					this.style.color = "#000";
				};
			};
		};
		for(i = 0; i < recommendLis.length; i++){
			i === 0 ? (recommendLis[i].className = "active", recommendDivs[i].style.display = "block") : null;
			recommendLis[i].index = i;
			recommendLis[i].onmouseover = function(){
				if(this.className !== "active"){
					for(var j = 0; j < recommendDivs.length; j++){
						j === this.index ? (recommendDivs[j].style.display = "block", recommendLis[j].className = "active") : (recommendDivs[j].style.display = "none", recommendLis[j].className = "");
					};
					if(!this.delay){
						delayImg(recommendDivs[this.index].getElementsByTagName("img"), false, true);
						this.delay = true;
					};
				};
			};
		};
		window.onscroll = function(){
			if(!recommend.delay || !like.delay){
				if(recommend.offsetTop + parseFloat(window.getComputedStyle(recommend, null)["paddingTop"]) + recommend.getElementsByTagName("ul")[0].clientHeight <= document.documentElement.scrollTop + document.documentElement.clientHeight){
					for(var i = 0; i < recommendLis.length; i++){
						if(recommendLis[i].className === "active"){
							delayImg(recommendDivs[i].getElementsByTagName("img"), false, true);
							recommendLis[i].delay = true;
							break;
						};
					};
					recommend.delay = true;
				};
				if(like.offsetTop + parseFloat(window.getComputedStyle(like, null)["paddingTop"]) <= document.documentElement.scrollTop + document.documentElement.clientHeight){
					var likeImg = like.getElementsByTagName("img");
					delayImg(likeImg, false, true);
					like.delay = true;
				};
			}else{
				window.onscroll = null;
			};
		};
		for(i = 0; i < recommendDivs.length; i++){
			var recommendDivLis = recommendDivs[i].getElementsByTagName("li");
			for(j = 0; j < recommendDivLis.length; j++){
				recommendDivLis[j].getElementsByTagName("a")[0].onmouseover = function(){
					var linkTitle = this.parentNode.getElementsByTagName("a")[1];
					linkTitle.style.textDecoration = "underline";
					linkTitle.style.color = "#d72832";
				};
				recommendDivLis[j].getElementsByTagName("a")[0].onmouseout = function(){
					var linkTitle = this.parentNode.getElementsByTagName("a")[1];
					linkTitle.style.textDecoration = "none";
					linkTitle.style.color = "#000";
				};
				recommendDivLis[j].getElementsByTagName("a")[1].onmouseover = function(){
					this.style.textDecoration = "underline";
					this.style.color = "#d72832";
				};
				recommendDivLis[j].getElementsByTagName("a")[1].onmouseout = function(){
					this.style.textDecoration = "none";
					this.style.color = "#000";
				};
			};
		};
		for(i = 0; i < likeLis.length; i++){
			likeLis[i].getElementsByTagName("a")[0].onmouseover = function(){
				var linkTitle = this.parentNode.getElementsByTagName("a")[1];
				linkTitle.style.textDecoration = "underline";
				linkTitle.style.color = "#d72832";
			};
			likeLis[i].getElementsByTagName("a")[0].onmouseout = function(){
				var linkTitle = this.parentNode.getElementsByTagName("a")[1];
				linkTitle.style.textDecoration = "none";
				linkTitle.style.color = "#000";
			};
			likeLis[i].getElementsByTagName("a")[1].onmouseover = function(){
				this.style.textDecoration = "underline";
				this.style.color = "#d72832";
			};
			likeLis[i].getElementsByTagName("a")[1].onmouseout = function(){
				this.style.textDecoration = "none";
				this.style.color = "#000";
			};
		};
	})();

	window.setTimeout(function(){
		delayImg(switchImg, true);
		delayImg(rankImg);
		delayImg(newbookImg);
	}, 500);

	timer = window.setInterval(slidePic, 3000);

	function delayImg(imgs, move, fade){
		for(var i = 0; i < imgs.length; i++){
			~(function(i){
				var newImg = new Image();
				newImg.src = imgs[i].getAttribute("trueSrc");
				newImg.onload = function(){
					imgs[i].src = this.src;
					imgs[i].style.display = "block";
					if(move){
						i === 0 ? (imgs[i].parentNode.parentNode.style.zIndex = 1, fadeIn(imgs[i])): null;
					};
					if(fade){
						fadeIn(imgs[i]);
					};
					newImg = null;
				};
			})(i);
		};
	};

	function fadeIn(curEle, callback){
		curEle.timer = window.setInterval(function(){
			if(parseFloat(window.getComputedStyle(curEle, null)["opacity"]) === 1){
				window.clearInterval(curEle.timer);
				if(typeof callback === "function"){
					callback();
				};
				return;
			};
			curEle.style.opacity = parseFloat(window.getComputedStyle(curEle, null)["opacity"]) + 0.01;
		}, 10);
	};

	function slidePic(){
		step++;
		if(step === switchImg.length){
			step = 0;
		};
		slideBtn(switchLis, step);
		for(var i = 0; i < switchImg.length; i++){
			switchImg[i].parentNode.parentNode.style.zIndex = 0;
			i === step ? (switchImg[i].parentNode.parentNode.style.zIndex = 1, fadeIn(switchImg[i], function(){
				for(var i = 0; i < switchImg.length; i++){
					i !== step ? switchImg[i].style.opacity = 0 : null;
				};
			})): null;
		};
	};

	function slideBtn(Lis, count){
		var tempStep = null;
		count === Lis.length ? tempStep = 0 : tempStep = count;
		for(var i = 0; i < Lis.length; i++){
			i === tempStep ? Lis[i].className = "active" : Lis[i].className = "";
		};
	};

})();