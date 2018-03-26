$(()=>{
	$("#userName").blur(()=>{
		var unameReg=/^[a-z0-9]{3,12}$/i;
		var u=$("#userName").val();
		if(u==null||u==""){
			$("#msgUser").html("用户名不能为空")
		}else if(!unameReg.test(u)){
			$("#msgUser").html("用户名格式不正确")
		}else{
			$.ajax({
				type:"post",
				url:"data/routes/users/checkName.php",
				data:"uname="+u,
				dataType:"text"
			}).then(text=>{
				console.log(text);
				if(text=="false"){
					$("#msgUser").html("该用户名已存在")
				}else{
					$("#msgUser").html("")
				}
			});
		}
	});
	$("#upwd").blur(e=>{
		p=$(e.target);
		var upwdReg=/^[a-z0-9]{3,12}$/i;
		if(p==null||p==""){
			$("#msgUpwd").html("密码不能为空")
		}else if(!upwdReg.test(p.val())){
			$("#msgUpwd").html("请输入6~12位的数字、字母")
		}else{
			$("#msgUpwd").html("")
		}
	});
	$("#cpwd").blur(e=>{
		c=$(e.target);
		var pwd1=c.val();
		var pwd2=$("#upwd").val();
		if(pwd1!=pwd2){
			$("#msgCpwd").html("两次密码输入不一致")
		}else{
			$("#msgCpwd").html("")
		}
	});

	$(".cont_form_sign_up .btn").click(()=>{
		var uname=$("#userName").val();
		var upwd=$("#upwd").val();
		$.ajax({
			type:"post",
			url:"data/routes/users/register.php",
			data:{uname:uname,upwd:upwd},
			success:function(data){
				if(data.code==200){
					alert("注册成功,请去登录");
					location.href="login.html";
				}
				}
			})
		})
	});