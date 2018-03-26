function cambiar_login() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";

    setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },400);

    setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
    },200);
}
function cambiar_sign_up() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
    document.querySelector('.cont_form_sign_up').style.display = "block";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout(function(){  document.querySelector('.cont_form_sign_up').style.opacity = "1";
    },100);

    setTimeout(function(){   document.querySelector('.cont_form_login').style.display = "none";
    },400);
}
function ocultar_login_sign_up() {

    document.querySelector('.cont_forms').className = "cont_forms";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
        document.querySelector('.cont_form_login').style.display = "none";
    },500);
}


$(".cont_forms .btn_login").click(()=>{
    var txtName=$("#txtName").val();
    var txtPwd=$("#txtPwd").val();
    var back=decodeURI(location.search.split('=')[1]);
    $.ajax({
        type: "post",
        url: "data/routes/users/login.php",
        data: "uname="+txtName+"&upwd="+txtPwd,
        success:function(data){
            if(data.code==1){
                alert('登录成功');
                if(location.search=="")
                    location.href="index.html";
                else
                    location=back;
            }else{
                alert("登录失败");
            }
        },
        error:function(){
            alert("网络故障，请检查");
        }
});
});
