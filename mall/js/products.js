function loadProducts(pno){
	var kw = null;
	if(location.search) kw = location.search.split('=')[1];
	$.ajax({
		type: "get",
		url: "data/routes/products/getProductsByKw.php",
		data: {kw:kw,pno:pno},
		success:function(data){
			var html="";
			for(var p of data.data){
				html+=`
				<li class="product">
					<div class="product_item">
						<div class="productImg">
							<a href="product_details.html?lid=${p.lid}" data-lid="getId"><img src="${p.md}" alt=""></a>
						</div>
						<p class="productPrice"><b>￥</b>${p.price}</p>
						<div class="productTitle">
							<a href="product_details.html?lid=${p.lid}" data-lid="getId">${p.lname}</a>
							<a href="product_details.html?lid=${p.lid}" data-lid="getId" class="prop">${p.cpu}</a>
							<a href="product_details.html?lid=${p.lid}" data-lid="getId" class="prop">${p.category}</a>
							<a href="product_details.html?lid=${p.lid}" data-lid="getId" class="prop">${p.memory}</a>
						</div>
						<div class="productShop">
							<a href="">JD官方旗舰店</a>
						</div>
						<div class="productCart">
							<a href="javascript:;" class="reduce">-</a>
							<input type="text" value="1">
							<a href="javascript:;" class="add">+</a>
							<a href="javascript:;" class="addCart"><i></i>加入购物车</a>
						</div>
					</div>
				</li>
			`
			}
			$(".show_list").html(html);

			var html="";
			html=`
				<b>${data.pageNo}</b>
				<em>/</em>
				<i>${data.pageCount}</i>
			`;
			$(".text").html(html);

			//动态分页
			var html ="";
			html += `<a class="${data.pageNo<=1?'disabled':''}" href="${data.pageNo>1?data.pageNo-1:'#'}">上一页</a>`;
			//上上一页
			if(data.pageNo-2>0)
				html+=`<a href="${data.pageNo-2}">${data.pageNo-2}</a>`;
			//上一页
			if(data.pageNo-1>0)
				html+=`<a href="${data.pageNo-1}">${data.pageNo-1}</a>`;
			//当前页
			html+=`<a class="active" href="${data.pageNo}">${data.pageNo}</a>`;
			//下一页
			if(data.pageNo+1<=data.pageCount)
				html+=`<a href="${data.pageNo+1}">${data.pageNo+1}</a>`;
			//下下一页
			if(data.pageNo+2<=data.pageCount)
				html+=`<a href="${data.pageNo+2}">${data.pageNo+2}</a>`;
			html += `<a class="${data.pageNo>=data.pageCount?'disabled':''}" href="${data.pageNo<data.pageCount?data.pageNo+1:'#'}">下一页</a>`;
			$(".page_num").html(html);

			var html='';
			html+=`
				<em>共<b>${data.pageCount}</b>页&nbsp;&nbsp;到第</em>
				<input type="text" value="${data.pageNo}">
				<em>页</em>
				<a href="#">确定</a>
			`;
			$('.page_skip').html(html);
		}
	})
}
loadProducts(1);

$('.page_num').on('click','a',e=>{
	e.preventDefault();
	var pno =$(e.target).attr("href");
	loadProducts(pno)
});

$(".page_skip").on("click","a",()=>{
	var pno=$(".page_skip>input").val();
	loadProducts(pno);
});

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
	$(()=>{
		loadCart();
		loadProducts();
		$(".show_list").click(e=>{
			var $tar=$(e.target);
			if($tar.is(".reduce")||$tar.is(".add")){
				var $input=$tar.siblings("input");
				var n=parseInt($input.val());//获得input的值转为整数n
				if($tar.is(".add")) n++;
				else if(n>1) n--;
				$input.val(n);
			}else if($tar.is(".addCart")){
				$.ajax({
					type:"get",
					url:"data/routes/users/isLogin.php"
				}).then(data=>{
					if(data.ok==0){
						var url=location.href;
						url=encodeURIComponent(url);
						location="login.html?back="+url;
					}else{
						var lid=$tar.parent().parent()
							.find("[data-lid=getId]")
							.attr("href")
							.split("=")[1];
						var count=$tar.siblings("input").val();
						$.ajax({
							type:"get",
							url:"data/routes/cart/addToCart.php",
							data:"lid="+lid+"&count="+count,
							dataType:"text"
						}).then(()=>{
							$tar.siblings("input").val(1);
							alert("添加成功");
							loadCart();
						})
					}
				})
			}
		});
		$('.settleup-content').on('click','a.delete',(e)=>{
			e.preventDefault();
				$.ajax({
					type:"get",
					url:"data/routes/cart/clearCart.php"
				}).then(()=>{
					document.querySelector(
						"#cart>.cart_content"
					).innerHTML="";
					document.getElementById("total")
								.innerHTML="0.00";
				})
		});
		$(".settleup-content>.delete").click=e=>{
			e.preventDefault();
			$.ajax({
				type:"get",
				url:"data/routes/cart/clearCart.php"
			}).then(()=>{
				$('.settleup-content').html();
			})
		}
	});
