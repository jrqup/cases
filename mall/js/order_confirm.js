/**加载已勾选的购物车条目**/
$.ajax({
    type:'get',
    url: 'data/controllers/list_checked.php',
    success: function(result){
        if(result.code===200){
        var totalPrice = 0;
        var totalCount=0;
         var html = '';
        $.each(result.data, function(i, l){
        totalPrice += l.price*l.count;
        totalCount += parseInt(l.count);
        html += `
        <ul class="item_detail">
            <li class="p_info">
                <b><img src="${l.pic}"/></b>

                <b class="product_name lf">
                    ${l.title}
                </b>
                <br/>
            <span class="product_color ">
               规格：${l.spec}
            </span>
            </li>
            <li class="p_price">
                <i>促销专属价</i>
                <br/>
                <span class="pro_price">￥<span class="ppp_price">${l.price}</span></span>
            </li>
            <li class="p_count">X<span>${l.count}</span></li>
            <li class="p_tPrice">￥<span>${l.price*l.count}</span></li>
        </ul>
        `;
      });
      $('#product_list').html(html);

        var html=`
            <span class="go_cart"><a href="cart.html" >&lt;&lt;返回购物车</a></span>
            <span class="count_bar_info">已选<b  id="count"> ${totalCount} </b>件商品&nbsp;&nbsp;合计(不含运费):<b class="zj">${totalPrice}</b> <input             type="hidden" name="Payment" value=""/>元</span>
            <span class="go_pay">确认并付款</span>
        `;
      $("#count_bar").html(html);
    }
  }
});
$('#count_bar').on('click','.go_pay',()=>{
    location.href = "payment.html";
});