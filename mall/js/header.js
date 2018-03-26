$(()=>{
    /*******判断是否登录*********/
    function isLoad(){
        $.get("data/routes/users/isLogin.php")
            .then(data=>{
                if(data.ok==1){
                    $("[data-login=uLogin]").hide();
                    $(".logout").show();
                    $(".uName").html(data.uname);
                }else{
                    $("[data-login=uLogin]").show();
                    $(".logout").hide();
                }
            })
    }
    $("#header").load("header.html",()=>{
        $(".dropdown").hover(function(){
            $(this).toggleClass("hover")
        });
    //
    $('.link-login').click(()=>{
        var back=location.href;
        location="login.html?back="+back;
    });
    /****发送请求 跳转列表页*****/
        var search=location.search;
        if(search.indexOf("kw")!=-1)
           $(".text").val(decodeURI(location.search.split("=")[1]));
        $("[data-trigger=search]").click(()=>{
            var kw=$(".text").val().trim();
            if(kw!=="")
                location="products.html?kw="+kw;
            else
                location="products.html";
        });

        isLoad();

    /*****注销*******/
        $("#login_out").click(()=>{
            $.ajax({
                type:"get",
                url:"data/routes/users/logout.php",
                success:function(){
                   location.reload(true)}
            })
        });


    /****搜索帮助******/
        var $search=$(".text"),$shelper=$("#shelper");
        $search.keyup(e=>{
            if(e.keyCode!=13){
                if(e.keyCode==40){
                    if(!$shelper.is(":has(.focus)")){
                        $shelper.children().first().addClass("focus")
                    }else{
                        if($shelper.children().last().is(".focus")){
                            $shelper.children(".focus").removeClass("focus");
                            $shelper.children().first().addClass("focus");
                        }else{
                            $shelper.children(".focus").removeClass("focus")
                                .next().addClass("focus");
                        }
                    }
                    //下拉标题
                    $search.val(
                        $shelper.children(".focus").attr("title")
                    )
                }else if(e.keyCode==38){
                    if(!$shelper.is(":has(.focus)")){
                        $shelper.children().last().addClass("focus");
                    }else{
                        if($shelper.children().first().is(".focus")){
                            $shelper.children(".focus").removeClass("focus");
                            $shelper.children().last().addClass("focus");
                        }else{
                            $shelper.children(".focus").removeClass("focus")
                                .prev().addClass("focus");
                        }
                    }
                    $search.val($shelper.children(".focus").attr("title"))
                }else{
                    var $tar=$(e.target);
                    $.get(
                        "data/routes/products/searchHelper.php",
                        "term="+$tar.val()
                    ).then(data=>{
                            var html="";
                            for(var p of data){
                                html+=`<li title="${p.lname}">
						<div class="search-item" title="${p.lname}" data-url="product_details?lid=${p.lid}">${p.lname}</div>
					</li>`
                            }
                            $shelper.show().html(html);
                        });
                }
            }else{
                $("[data-trigger=search]").click(()=>{console.log($(e.target))});
            }
        }).blur(()=>$shelper.hide());

    /*********搜索头部固定************/
        $(window).scroll(()=>{
            var scrollTop=$(window).scrollTop();
            //如果scrollTop>=380,就为id为header-top的div添加class fixed_nav
            if(scrollTop>=600)
                $("#search").addClass("search-fix");
            //否则，就移除id为header-top的div的fixed_nav class
            else
                $("#search").removeClass("search-fix");
        });
    });

    /**************头部购物车********/
    function loadCart(){
        $.ajax({
            type:"get",url:"data/routes/cart/getCart.php"
        }).then(data=>{
            var html="",total=0;
            html+=`
			<div class="smt">
			  <h4 class="fl">最新加入的商品</h4>
			</div>
		`;
            for(var p of data){
                total+=p.price*p.count;
                html+=`
				<div class="smc">
				  <ul class="mcart">
					<li>
					  <div class="p-img">
						<a href="product_details.html?lid=${p.lid}"><img src="${p.sm}" alt=""/></a>
					  </div>
					  <div class="p-name">
						<a href="#">${p.title}</a>
					  </div>
					  <div class="p-detail">
						  <span class="p-price">
							<strong>¥${p.price}</strong>x${p.count}
						  </span>
						<br/>
						<a href="" class="delete">删除</a>
					  </div>
					</li>
				  </ul>
				</div>
			`;
            }
            html+=`
				<div class="smb">
				  <div class="p-total">&nbsp;共¥&nbsp;
					<b></b>
				  </div>
				  <a href="cart.html" title="去购物车">去购物车</a>
				</div>
			`;
            $('.settleup-content').html(html);
            $('.p-total>b').html(total.toFixed(2));
        })
    }
    loadCart();

});