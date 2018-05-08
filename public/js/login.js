~(function(){
	var user = document.getElementById("user");
	var password = document.getElementById("password");
	var clearUser = document.getElementById("clear_user");
	var userTip = document.getElementById("user_tip");
	var passwordTip = document.getElementById("password_tip");
	var submit = document.getElementById("submit");

	user.onfocus = function(){
		this.nextElementSibling.style.display = "none";
		this.parentNode.nextElementSibling.style.visibility = "visible";
		this.parentNode.style.borderColor = "#666";
		this.previousElementSibling.style.color = "#ccc";
		userTip.style.color = "#6e6e6e";
	};
	user.onkeyup = function(){
		clearUser.style.display = this.value !== "" ? "block" : "none";
	};
	password.onfocus = function(){
		this.nextElementSibling.style.display = "none";
		this.parentNode.nextElementSibling.style.visibility = "visible";
		this.parentNode.style.borderColor = "#666";
		this.previousElementSibling.style.color = "#ccc";
		passwordTip.style.color = "#6e6e6e";
		passwordTip.innerHTML = "请填写长度为6-20个字符的密码";
	};
	user.onblur = password.onblur = function(){
		this.nextElementSibling.style.display = this.value === "" ? "block" : "none";
		this.parentNode.nextElementSibling.style.visibility = "hidden";
		this.parentNode.style.borderColor = "#e6e6e6";
		this.previousElementSibling.style.color = "#ccc";
		passwordTip.style.color = "#6e6e6e";
	};
	clearUser.onclick = function(){
		user.value = password.value = "";
		this.style.display = "none";
		user.nextElementSibling.style.display = password.nextElementSibling.style.display = "block";
	};
	submit.onmouseover = function(){
		this.style.backgroundColor = "#f01923";
	};
	submit.onmouseout = function(){
		this.style.backgroundColor = "red";
	};
	submit.onclick = function(e){
		if(user.value === ""){
			e.preventDefault();
			userTip.style.visibility = "visible";
			userTip.style.color = user.previousElementSibling.style.color = "red";
			user.parentNode.style.borderColor = "red";
		};
		if(password.value === ""){
			e.preventDefault();
			passwordTip.style.visibility = "visible";
			passwordTip.style.color = password.previousElementSibling.style.color = "red";
			password.parentNode.style.borderColor = "red";
			passwordTip.innerHTML = "请输入您的登录密码";
		};
	}; 
})();