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
	isLoad();
	/********滚动轮播**********/
	var $ulImgs=$(".slider_main .picban"),
		$ulInds=$(".slider_main .num_btn"),
		LIWIDTH=790,INTERVAL=500,WAIT=3000,
		moved=0,timer=null,canMove=true;
	$.get("data/routes/products/getCarousel.php")
		.then(data=>{
			var html="";
			for(var c of data){
				html+=`
				<li>
					<a href="${c.href}"><img src="${c.img}"></a>
				</li>
			`;
			}
			html+=`
			<li>
				<a href="${data[0].href}"><img src="${data[0].img}"></a>
			</li> `;
			$ulImgs.html(html)
				.css("width",(data.length+1)*LIWIDTH);
			$ulInds.html("<li></li>".repeat(data.length))
				.children().first().addClass("active");
			function autoMove(){
				if(canMove){
					if(moved==data.length){//先判断是否最后一张
						moved=0;//将moved归0
						$ulImgs.css("left",0);//将ul的left瞬间归0
					}
					timer=setTimeout(()=>{//先等待WATI秒
						move(1,autoMove);
					},WAIT);
				}
			}
			autoMove();
			$(".slider_main").hover(
				()=>{//关闭轮播的开关变量
					canMove=false;
					clearTimeout(timer);//停止等待
					timer=null;
				},
				()=>{//打开轮播开关，启动自动轮播
					canMove=true;
					autoMove();
				}
			);
			$ulInds.on("click","li",e=>{
				moved=$(e.target).index();
				$ulImgs.stop(true).animate({
					left:-LIWIDTH*moved
				},INTERVAL);
				$ulInds.children(":eq("+moved+")")
					.addClass("active")
					.siblings().removeClass("active");
			});
			function move(dir,callback){
				moved+=dir;//按照方向增减moved
				//如果moved没有到头
				if(moved<data.length){
					//让ulInds中moved位置的li设置hover
					$ulInds.children(":eq("+moved+")")
						.addClass("active")
						.siblings().removeClass("active");
				}else{
					//让ulInds中第一个li设置为hover
					$ulInds.children(":eq(0)")
						.addClass("active")
						.siblings().removeClass("active");
				}
				$ulImgs.stop(true).animate({
					left:-LIWIDTH*moved
				},INTERVAL,callback);
			}
			$(".right").click(()=>{
				if(moved==data.length){
					moved=0;
					$ulImgs.css("left",0);
				}
				move(1);
			});
			$(".left").click(()=>{
				if(moved==0){
					moved=data.length;
					$ulImgs.css("left",-LIWIDTH*moved);
				}
				move(-1);
			})
		});
	/**促销 公告tab页**/
	$('.mod_tab_head>a').hover(function(){
		var i=$(this).index();
		var content=$(this).attr("href");
		$(content).addClass("on")
			.siblings().removeClass("on");
		$('.mod_active').css("transform",`translate(${50*i}px)`);
	});
	/**倒计时**/
	var now=new Date();
	var target=parseInt(now.getTime()+5000000);
	function task(){
		var now=new Date();
		var s=parseInt((target-now)/1000);
		if(s>0){
			var h=parseInt(s%(3600*24)/3600);
			var m=parseInt(s%3600/60);
			var s=s%60;
			$('.hour').html(h);
			$('.mint').html(m);
			$('.miao').html(s);
		}else{
			clearInterval(timer);
			timer=null;
		}
	}
	task();
	var timer=setInterval(task,1000);

/**tab标签页***/
	var tab=$(".tab_head>a");
	tab.hover(function(){
		var i=$(this).index();
			var content=$(this).attr("href");
			$(content).addClass("active")
				.siblings().removeClass("active");
			$('.tab_active').css("transform",`translate(${78*i}px)`);
	});

/**无缝滚动**/
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

 /***
  *imgList:图片
  * list:  图片下的小圆点
  * len:   图片的数量
  * 淡入淡出轮播**/
 function fadeIn_Out(imgList,list,len){
	function moveImg(imgList,index) {
		for(var i=0;i<imgList.length;i++){
			if(imgList[i].className=='active'){//清除li的透明度样式
				imgList[i].className='';
			}
		}
		imgList[index].className='active';
	}
	function moveIndex(list,num){//移动小圆圈
		for(var i=0;i<list.length;i++){
			if(list[i].className=='on'){//清除li的背景样式
				list[i].className='';
			}
		}
		list[num].className='on';
	}
	var timer=null,canMove=true,index=0;
	for(var i=0;i<list.length;i++){//鼠标覆盖上哪个小圆圈，图片就移动到哪个小圆圈，并停止
		list[i].index=i;
		list[i].onmouseover= function(){
			var clickIndex=parseInt(this.index);
			index=clickIndex;

			moveImg(imgList,index);
			moveIndex(list,index);
			clearInterval(timer);
			timer=null;
		};
		list[i].onmouseout= function () {//移开后继续轮播
			play();
		};
	}
	 /**移入停止  移出开始**/
	 imgList.hover(
		 ()=>{//关闭轮播的开关变量
			 canMove=false;
			 clearInterval(timer);
			 timer=null;
		 },
		 ()=>{//打开轮播开关，启动自动轮播
			 canMove=true;
			 play();
		 }
	 );
	var nextMove=function(){
		index+=1;
		if(index>=len){
			index=0
		}
		moveImg(imgList,index);
		moveIndex(list,index);
	};
	var play=function(){
		timer=setInterval(function(){
			nextMove();
		},2000);
	};
	play();
   }

	/**会买专辑轮播**/
	$(()=>{
		var imgList=$('.carousel_page>li');
		var len=imgList.length;
		var list=$('.carousel_ind>li');
		fadeIn_Out(imgList,list,len);
	});

	/**秒杀边上的小轮播**/
	$(()=>{
		var imgList=$('.lb_list>li');
		var len=imgList.length;
		var list=$('.item_list>li');
		fadeIn_Out(imgList,list,len);
	});

	/**觅me的轮播**/
	$(()=>{
		var imgList=$('.mime_list>li');
		var len=imgList.length;
		var list=$('.mime_ind>li');
		fadeIn_Out(imgList,list,len);
	});

	/**爱生活模块内容动态加载**/
	$.ajax({
		type:"get",
		url:"data/routes/products/index_product.php",
		success:function(data){
			var html=`
				<div class="pt_bd_col1">
					<div class="pt_bd_inner">
						<div class="pt_cover">
							<a href=""><img src="${data.recommendedItemOne[0].cover_pic}" alt=""/></a>
						</div>
						<div class="pt_four">
							<span class="pt_splitX"></span>
							<span class="pt_splitY"></span>
							<a href="">
								<p class="pt_tit">潮流男装</p>
								<p class="pt_promo">劲爆来袭</p>
								<img src="${data.recommendedItemOne[0].four_pic1}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">新年新衣</p>
								<p class="pt_promo">劲爆来袭</p>
								<img src="${data.recommendedItemOne[0].four_pic2}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">童装元旦节</p>
								<p class="pt_promo">不止5折</p>
								<img src="${data.recommendedItemOne[0].four_pic3}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">欲望清单</p>
								<p class="pt_promo">5折好物</p>
								<img src="${data.recommendedItemOne[0].four_pic4}" alt="" class="pt_img"/>
							</a>
						</div>
						<div class="pt_more">
							<a href=""><img src="${data.recommendedItemOne[0].more_pic1}" alt=""/></a>
							<a href=""><img src="${data.recommendedItemOne[0].more_pic2}" alt=""/></a>
							<a href=""><img src="${data.recommendedItemOne[0].more_pic3}" alt=""/></a>
						</div>
						<div class="pt_hide"></div>
					</div>
				</div>
			`;
			$('.chn_col1>.pt_bd').html(html);

			var html=`
				<div class="pt_bd_col1">
					<div class="pt_bd_inner">
						<div class="pt_cover">
							<a href=""><img src="${data.recommendedItemTwo[0].cover_pic}" alt=""/></a>
						</div>
						<div class="pt_four">
							<span class="pt_splitX"></span>
							<span class="pt_splitY"></span>
							<a href="">
								<p class="pt_tit">潮流男装</p>
								<p class="pt_promo">劲爆来袭</p>
								<img src="${data.recommendedItemTwo[0].four_pic1}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">新年新衣</p>
								<p class="pt_promo">劲爆来袭</p>
								<img src="${data.recommendedItemTwo[0].four_pic2}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">童装元旦节</p>
								<p class="pt_promo">不止5折</p>
								<img src="${data.recommendedItemTwo[0].four_pic3}" alt="" class="pt_img"/>
							</a>
							<a href="">
								<p class="pt_tit">欲望清单</p>
								<p class="pt_promo">5折好物</p>
								<img src="${data.recommendedItemTwo[0].four_pic4}" alt="" class="pt_img"/>
							</a>
						</div>
						<div class="pt_more">
							<a href=""><img src="${data.recommendedItemTwo[0].more_pic1}" alt=""/></a>
							<a href=""><img src="${data.recommendedItemTwo[0].more_pic2}" alt=""/></a>
							<a href=""><img src="${data.recommendedItemTwo[0].more_pic3}" alt=""/></a>
						</div>
					</div>
				</div>
			`;
			$('.chn_col2>.pt_bd').html(html);
		}
	});

	/**楼层滚动**/
	var $divLift=$('.lift');
	var $floors=$('.floor');
	$(window).scroll(()=>{
		var scrollTop=$(window).scrollTop();
		/*********确定电梯按钮列表是否显示*********/
		//任意元素距body顶部的总距离
		var offsetTop=$(".bd_f1").offset().top;
		if(offsetTop<scrollTop+innerHeight/3)
			$divLift.show();
		else
			$divLift.hide();
		/**********具体显示哪个电梯按钮************/
		for(var f of $floors){
			var $f=$(f);
			var offsetTop=$f.offset().top;
			if(offsetTop<scrollTop+innerHeight){
				//找到该楼层对应的li
				var i=$floors.index($f);

				var $li=$divLift.find(".lift_item:eq("+(i)+")");
				$li.addClass("active").siblings().removeClass("active");
			}
		}
	});
	$divLift.on("click",".lift_item",function(){
		var $li=$(this);
		if(!$li.is(":last-child")){
			var i=$li.index();//找到当前li对应的楼层
			var offsetTop=$floors.eq(i).offset().top;
			$("html,body").stop(true).animate({
				scrollTop:
					$("#search").is(".search-fix")? offsetTop-80:offsetTop-80-80
			},500);
		}else
			$("html,body").stop(true).animate({
				scrollTop:0
			},500);
	})
});