$(()=>{
	$.ajax({
		type:"get",
		url:"data/routes/products/getProductById.php",
		data:location.search.slice(1)
	}).then(data=>{
		var {product:p,family,imgs}=data;
		var div= document.querySelector("#show-details");
		var title=div.querySelector("h1");
		var subtitle=div.querySelector("h3>a");
		var price=div.querySelector(".price>.stu-price>span");
		var promise=div.querySelector(".price>.promise>b");
		title.innerHTML=p.title;
		subtitle.innerHTML=p.subtitle;
		price.innerHTML="¥"+p.price;
		promise.innerHTML=p.promise;
		var spec=div.querySelector(".spec>div");
		var html="";
		for(var laptop of family){
			html+=`
				<a href="product_details.html?lid=${laptop.lid}" class="${p.lid==laptop.lid?"active":""}">${laptop.spec}</a>`
		}
		spec.innerHTML=html;



		$('.list').on('click','a',function(){
			if(!$(this).is('.active')){
				$(this).addClass('active').parent().siblings().children().removeClass('active');
			}
		});

		var speed=20; //数字越大速度越慢
		var tab=document.getElementById("demo");
		var tab1=document.getElementById("demo1");
		var tab2=document.getElementById("demo2");
		tab2.innerHTML=tab1.innerHTML;
		function Marquee(){
			if(tab2.offsetWidth-tab.scrollLeft<=0)
				tab.scrollLeft-=tab1.offsetWidth;
			else{
				tab.scrollLeft++;
			}
		}
		var MyMar=setInterval(Marquee,speed);
		tab.onmouseover=function() {clearInterval(MyMar)};
		tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};
/********** 添加商品数量  加入购物车 ***********/
		var n=$('.in').val()*1;
		$('.number-reduce').click(()=>{
			if(n>1) $('.in').val(n-=1);
		});
		$('.number-add').click(()=>{
			$('.in').val(n+=1);
		});

		$('.shops').click(()=>{
			$.ajax({
				type:"get",
				url:"data/routes/users/isLogin.php"
			}).then(data=>{
				if(data.ok==1){
					var input=$('.in');
					var count=parseInt(input.val());
					var lid=location.search.split("=")[1];
					$.ajax({
						type:"get",
						url:"data/routes/cart/addToCart.php",
						data:"lid="+lid+"&count="+count,
					}).then(()=>{
						alert("加入购物车成功!");
					})
				}else{
					var url=location.href;
					url=encodeURIComponent(url);
					location="login.html?back="+url;
				}
			})
		});
/**********************放大镜*************************/
			var mImg=document.getElementById("mImg");
			mImg.src=p.md;
			var lgDiv=
				document.getElementById("largeDiv");
			lgDiv.style.backgroundImage=
				"url("+imgs[0].lg+")";
			var html="";
			for(var pic of imgs){
				html+=`
					<li class="i1"><img src="${pic.sm}" data-md="${pic.md}" data-lg="${pic.lg}"></li>
				`
			}
			var icon_list= document.getElementById("icon_list");
			icon_list.innerHTML=html;
			var aBackward=document.querySelector("#preview>h1>a:nth-child(1)");
			var aForward=aBackward.nextElementSibling;
			if(imgs.length<=5)
				aForward.className="forward disabled";
			var moved=0, LIWIDTH=62;
			aForward.onclick=e=>{
				if(!e.target.className.endsWith("disabled")){
					moved++;
					icon_list.style.left=-moved*LIWIDTH+20+"px";
					//有左移的li，就可以后退
					if(moved>0) aBackward.className="backward";
					//如果已经将右侧多余的li移动完了，就禁止前进
					if(moved==imgs.length-5)
						e.target.className="forward disabled";
				}
			};
			aBackward.onclick=e=>{
				if(!e.target.className.endsWith("disabled")){
					moved--;
					icon_list.style.left=-moved*LIWIDTH+20+"px";
					//只要右侧多余的li没有被移动完,就可继续前进
					if(moved<imgs.length-5)
						aForward.className="forward";
					//如果没有左移的li，则不能后退
					if(moved==0)
						e.target.className="backward disabled";
				}
			};

			icon_list.onmouseover=e=>{
				if(e.target.nodeName=="IMG"){
					var md=e.target.dataset.md,
						  lg=e.target.dataset.lg;
					mImg.src=md;
					lgDiv.style.backgroundImage= "url("+lg+")";}
			};
			var superMask= document.getElementById("superMask");
			var mask=document.getElementById("mask");
			superMask.onmouseover=e=>{
				mask.style.display=
					lgDiv.style.display="block";
			};
			superMask.onmouseout=e=>{
				mask.style.display=
					lgDiv.style.display="none";
			};
			var MSIZE=175;
			superMask.onmousemove=e=>{
				var x=e.offsetX,y=e.offsetY;
				var top=y-MSIZE/2,left=x-MSIZE/2;
				if(top<0) top=0;
				else if(top>175) top=175;
				if(left<0) left=0;
				else if(left>175) left=175;
				mask.style.cssText=
					"display:block;top:"+top+"px;left:"+left+"px";
				lgDiv.style.backgroundPosition=
					-16/7*left+"px "+(-16/7*top)+"px";
			}
	});
	/************视频暂停 播放**************/
	$('div.lib-video').click(()=>{
		var video=document.getElementById('video');
		if(video.paused){
			video.play();
			$('.v-fix').hide();
		}else{
			video.pause();
			$('.v-fix').show();
		}
	});
	/*************商品评价*****************/
	$('.tabBarbox').on('click','a',(e)=>{
		e.preventDefault();
		$tar=$(e.target);
		if(!$tar.is('.selected')){
			$tar.parent().addClass('selected').siblings().removeClass('selected');
		}
		var id=$tar.attr('href');
		$(id).addClass('active').siblings().removeClass('active');
	})
});