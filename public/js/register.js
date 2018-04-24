~(function(){
	let list = document.getElementById("list");
	let activeSpan = list.getElementsByClassName("active")[0].firstElementChild;
	let userId = document.getElementById("user_id");
	let userPassword = document.getElementById("user_password");
	let userRepassword = document.getElementById("user_repassword");
	let submit = document.getElementById("submit");
	let flag = false;

	userId.addEventListener("keyup", function(){
		if(activeSpan.innerText === "普通账号注册"){
			let reg = /^[a-zA-Z][a-z0-9]{3,15}$/;
			let nextSib = this.nextSibling;
			nextSib.innerHTML = "帐号以字母开头，由小写英文字母和数字组成的4-16位字符";
			if(!reg.test(this.value)){
				nextSib.style.color = "red";
				return;
			};
			nextSib.style.color = "#787878";
			return;
		};
		if(activeSpan.innerText === "手机注册"){
			let reg = /^1[34578]\d{9}$/;
			let nextSib = this.nextSibling;
			nextSib.innerHTML = "请输入手机号";
			if(!reg.test(this.value)){
				nextSib.style.color = "red";
				return;
			};
			nextSib.style.color = "#787878";
			return;
		};
		let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
		let nextSib = this.nextSibling;
		nextSib.innerHTML = "请输入邮箱号";
		if(!reg.test(this.value)){
			nextSib.style.color = "red";
			return;
		};
		nextSib.style.color = "#787878";
	});

	userPassword.addEventListener("keyup", function(){
		let reg = /^[^\u4e00-\u9fa5\s]{6,20}$/;
		let nextSib = this.nextSibling;
		if(this.value !== ""){
			if(!reg.test(this.value)){
				nextSib.style.color = "red";
			}else{
				nextSib.style.color = "#787878";
			};
			
		};
		if(userRepassword.value !== ""){
			let reNextSib = userRepassword.nextSibling;
			if(userRepassword.value !== this.value){
				reNextSib.style.color = "red";
				reNextSib.innerHTML = "两次输入的密码不一致";
				return;
			};
			reNextSib.style.color = "#787878";
			reNextSib.innerHTML = "验证通过";
		};	
	});

	userRepassword.addEventListener("keyup", function(){
		let nextSib = this.nextSibling;
		if(this.value !== ""){
			if(this.value !== userPassword.value){
				nextSib.style.color = "red";
				nextSib.innerHTML = "两次输入的密码不一致";
				return;
			};
			nextSib.style.color = "#787878";
			nextSib.innerHTML = "验证通过";
		};
	});

	userId.addEventListener("blur", function(){
		let reg = /^[a-zA-Z][a-z0-9]{3,15}$/;
		if(activeSpan.innerText === "手机注册"){
			reg = /^1[34578]\d{9}$/;
		};
		if(activeSpan.innerText === "邮箱注册"){
			reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
		};
		if(reg.test(this.value)){
			let xhr = new XMLHttpRequest();
			xhr.open("get", "/user/register?username=" + userId.value, true);
			xhr.onreadystatechange = function(){
				if(/^2\d{2}$/.test(xhr.status)){
					if(xhr.readyState === 4){
						let val = xhr.responseText;
						val = JSON.parse(val);
						setUserTip(val);
					};
				};
			};
			xhr.send(null);
		};
	});

	submit.addEventListener("click", function(e){
		if(!flag || !/^[a-zA-Z][a-z0-9]{3,15}$/.test(userId.value) || !/^[^\u4e00-\u9fa5\s]{6,20}$/.test(userPassword.value) || !userPassword.value === userRepassword.value){
			e.preventDefault();
		};
	});

	function setUserTip(val){
		let userTip = userId.nextSibling;
		userTip.innerHTML = val.msg;
		if(val.status === 1){
			userTip.style.color = "#787878";
			flag = true;
			return;
		};
		userTip.style.color = "red";
		flag = false;
	};
})();