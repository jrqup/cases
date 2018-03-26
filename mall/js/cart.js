$(()=>{
	function loadCart(){
		$.get("data/routes/cart/getCart.php")
			.then(data=>{
			var html="";
			for(var p of data){
				html+=`
					<div class="imfor">
						<div class="check">
							<img src="${
								parseInt(p.is_checked)==1?
								 'img/cart/product_true.png':
								 'img/cart/product_normal.png'
							}" alt="${p.iid}">
						</div>
						<div class="product">
							<a href="product_details.html?lid=${p.lid}">
								<img src="${p.sm}" alt="">
							</a>
							<span class="desc">
								<a href="product_details.html?lid=${p.lid}">${p.title}</a>
							</span>
							<p class="col">
								<span>规格：</span>
								<span class="color-desc">${p.spec}</span>
							</p>
						</div>
						<div class="price">
							<p class="price-desc">促销专享价</p>
							<p>
								<b>¥</b>${p.price}
							</p>
						</div>
						<div class="num">
							<span class="reduce">&nbsp;-&nbsp;</span>
							<input data-iid="${p.iid}" type="text" value="${p.count}">
							<span class="add">&nbsp;+&nbsp;</span>
						</div>
						<div class="total-price">
							<span>¥</span>
							<span>${(p.price*p.count).toFixed(2)}</span>
						</div>
						<div class="del">
							<a href="#" data-iid="${p.iid}">删除</a>
						</div>
					</div>
				`;
			}
			var $content=$("#content-box-body");
			$content.html(html);
			setTimeout(()=>{
				getTotal();
				chkAll()
			},100);
			var $checkTop=$(".check-top>img");
			$checkTop.off("click").click(()=>{
				if($checkTop.attr("src")
					  .endsWith("normal.png")){
					$checkTop.attr(
						"src","img/cart/product_true.png"
					);
					$.post(
						"data/routes/cart/selectAll.php",
						"chkAll=1"
					).then(()=>{
						loadCart();
					});
				}else{
					$checkTop.attr(
						"src","img/cart/product_normal.png"
					);
					$.post(
						"data/routes/cart/selectAll.php",
						"chkAll=0"
					).then(()=>{
						loadCart();
					});
				}
			});

			$content.off("click").on("click",".check>img",e=>{
				var $tar=$(e.target);
				if($tar.attr("src")
					  .endsWith("normal.png")){
					$tar.attr(
						"src","img/cart/product_true.png"
					);
					$.post(
						"data/routes/cart/selectOne.php",
						"chkOne=1&iid="+$tar.attr("alt")
					).then(()=>{
						loadCart();
					});
				}else{
					$checkTop.attr(
						"src","img/cart/product_normal.png"
					);
					$.post("data/routes/cart/selectOne.php",
						"chkOne=0&iid="+$tar.attr("alt")).then(()=>{
						loadCart();
					});
				}
			})
			.on("click",".reduce,.add",e=>{
				var $tar=$(e.target);
				var $input=$tar.siblings("input");
				var n=parseInt($input.val());
				if($tar.is(".add")) n++;
				else n--;
				if(n==0){
					if(confirm("是否继续删除?"))
						$.get("data/routes/cart/updateCart.php",
							"count="+n+"&iid="+$input.data("iid")).then(()=>{
							loadCart();
						})
				}else
					$.get("data/routes/cart/updateCart.php",
						"count="+n+"&iid="+$input.data("iid")).then(()=>{
							loadCart();
					})
			});

			$('.del').on('click','a',(e)=>{
				var id=$(e.target).data('iid');
				if(confirm('是否继续删除?')){
					$.ajax({
						type:'get',
						url:'data/controllers/del.php',
						data:{iid:id},
						success:function(data){
							if(data.code==200){alert('删除成功')}
							else {alert('删除失败')}
							loadCart();
						}
					})
				}else{
					loadCart();
				}
			});

			$('.foot-qk').click((e)=>{
				e.preventDefault();
				$.get("data/routes/cart/clearCart.php").then(()=>{
					$(".content-box-body").empty();
					$(".foot-price").html("0.00");
					loadCart();
				})
			});

			var $counts= $("#shopping-cart .total,#shopping-cart .totalOne");
			var $totals= $("#shopping-cart .totalPrices,#shopping-cart .foot-price");
			function getTotal(){
				var $rows= $(".imfor:has(.check img[src$='true.png'])");
				var $inputs=$rows.find(".num>input");
				var $subs= $rows.find(".total-price>:last-child");
				var count=0;
				var total=0;
				for(var input of $inputs){
					count+=parseInt($(input).val());
				}
				for(var sub of $subs){
					total+=parseFloat($(sub).html());
				}
				$counts.html(count);
				$totals.html(total);
			}
			function chkAll(){
				$checkTop.attr("src",
					$content.find(
						".check>img[src$='normal.png']"
					).length==0?
					"img/cart/product_true.png":
					"img/cart/product_normal.png"
				);
			}
		})
	}
	loadCart();
});