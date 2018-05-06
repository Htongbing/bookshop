~(function(){
	let classifyFirst = utils.selectEle("book_detail_classifyOne_first");
	let classifySecond = utils.selectEle("book_detail_classifyOne_second");
	let lockFlag = "";

	let classify = {
		"网络文学": [
			"男频",
			"女频",
			"玄幻奇幻",
			"现代都市",
			"武侠仙侠",
			"现代言情",
			"穿越重生",
			"古装言情"
		],
		"小说": [
			"侦探/悬疑/推理",
			"玄幻/惊悚",
			"影视/娱乐",
			"爱情/情感",
			"武侠小说",
			"外国小说"
		],
		"文艺": [
			"传记",
			"随笔",
			"文学作品集",
			"纪实文学",
			"艺术",
			"摄影",
			"文学评论与鉴赏"
		],
		"经管": [
			"成功/励志",
			"管理",
			"投资理财",
			"经济"
		],
		"社科": [
			"历史",
			"心理学",
			"哲学",
			"政治/军事",
			"社会科学",
			"古籍",
			"法律"
		],
		"生活": [
			"亲子/家教",
			"育儿/早教",
			"两性关系",
			"孕产/胎教",
			"保健/养生",
			"旅游/地图",
			"烹饪/美食",
			"时尚/美妆",
			"手工/DIY",
			"家庭/家居"
		],
		"教育/科技": [
			"考试",
			"外语",
			"中小学教辅",
			"工具书",
			"科普读物",
			"计算机/网络",
			"自然科学"
		],
		"童书/进口书": [
			"儿童文学",
			"启蒙读物",
			"成长/益智",
			"动漫/图画书",
			"外文原版书",
			"港台图书"
		]
	};

	setClassify(classifyFirst);

	utils.bindEvent(classifyFirst, "click", function(){
		if(utils.val(this) !== lockFlag){
			setClassify(this);
		};
	});

	function setClassify(ele){
		let str = "";
		classify[utils.val(ele)].forEach((item) => {
			str += "<option value='" + item + "'>" + item + "</option>";
		});
		utils.html(classifySecond, str);
		lockFlag = utils.val(ele);
	};
})();