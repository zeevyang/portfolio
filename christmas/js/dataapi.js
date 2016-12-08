function getURLParam(name, url) {
    var search = !!url ? url.substr(url.lastIndexOf('?')) : location.search;
    return ( RegExp(name + '=' + '([^&;]+?)(&|#|;|$)').exec( search )||[,null] )[1];
}

var AppMain = {}


AppMain.dataApi = (function() {
	
	var isDemo = false;

	var API_LOTTERY_CHANCE = window.host + "jsonservlet?period=2016Q4&func=getLotteryChance";
	var API_DO_LOTTERY = window.host + "jsonservlet?period=2016Q4&func=doLotter";
	var API_DO_LOGOUT = "/pkmslogout";
	var SHARE_CONTENT = "保障、保費自由選，享受網購般體驗，抽曼谷來回機票、GoPro HERO 4禮券等好禮，使用序號投保，再享「高級飯店住宿券四選一」抽獎機會，快使用我的分享序號:";
	var COUPON_URL = "http://media.ticketxpress.com.tw/viewvoucher.aspx?voucherguid=";
	var MSG_DATA_ERROR = "資料查詢失敗，請稍後重新嘗試或洽客服人員";
	// 登入狀態 => true 會員 | false 訪客

	var ori_scroll_top;
	
	var checkLoginStatus = function(a_url){
		
		////console.log("CheckLoginStatus : "+loginStatus+"  "+a_url);
		if(!window._loginStatus){
			sendUserToLogin(a_url);
			return false;
		} else{
			return true;
		}
	}

	var sendUserToLogin = function(a_url){
		//導國泰登入頁，再回來
		location.href=a_url;
	}
	
	
	var showDemo  = function(a_mode,a_target){

		switch(a_mode){

			case "doLottery":
				var e = {};
				e.RESULT = 1;
				e.LOTTERY_COUPON_CODE = "XXDSFSFSD-FDSFSDFSD-AAAA-DDD";
				var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
				var target = $(a_target).parent();
				var allbutton = $('.sys_sendLottery');

				switch(e.RESULT) {
					case 0:
						//lose
						target.addClass('active').html("<div class='cake-text'><h4>很可惜!<br>沒有中獎</h4>沒關係，投保還有<br>機會抽中其他大獎哦</div>");

						allbutton.off('click');
						break;
					case 1:
						//win
						var checklink = $('<a href="#">查詢我的兌換序號</a>').attr('data-url', couponURL).click(function(e){
							e.preventDefault();
							window.open($(this).attr("data-url"));
						});

						target.addClass('active').html("<div class='cake-text'><h4>恭喜你!</h4>抽中 85°C<br>100元午茶組");
						target.find('.cake-text').append(checklink);
						//target.attr("data-url",couponURL);

						allbutton.off('click');

						break;
					case 2:
						alert("doLottery 沒抽獎資格");//debug
						break;
					default:
						//alert("doLottery error"); //debug
						break;
				}

			break;

			case "getUserInfo":
				var e = {};
				e.APLY_DATE_NETINSR = "2016/06/02";
				e.LOTTERY_COUPON_CODE = "XXDSFSFSD-FDSFSDFSD-AAAA-DDD";
				e.LOTTERY_RESULT =3;
				e.TICKET_2_PREM1 = "2";
				e.TICKET_2_PREM2 = "7";
				e.TICKET_2_PREM3 = "3";
				e.TICKET_3_OWNER = "5";
				e.TICKET_3_FRIEND = "10";
				e.USER_SHARE_SERIAL_NUMBER = "SSXXQQQTTddt";
				$('#userApplyDate .value').text(e.APLY_DATE_NETINSR);
				$('#couponCode .code .value').text( e.LOTTERY_COUPON_CODE || '');
				$('#userPrem1 .value').text(e.TICKET_2_PREM1);
				$('#userPrem2 .value').text(e.TICKET_2_PREM2);
				$('#userPrem3 .value').text(e.TICKET_2_PREM3);
				$('#userOwner .value').text(e.TICKET_3_OWNER);
				$('#userFriend .value').text(e.TICKET_3_FRIEND);
				$('#userShareSerial .value').text(e.USER_SHARE_SERIAL_NUMBER);
				
				$("#ogDescription").attr("content",SHARE_CONTENT+e.USER_SHARE_SERIAL_NUMBER);

				$("#invite-wrap").remove();
				$("body").append('<div id="invite-wrap" style="display:none;">'+e.USER_SHARE_SERIAL_NUMBER+'</div>')
				$("#userApplyDate").show();	
				
				if($.trim(e.APLY_DATE_NETINSR)==""){
					e.LOTTERY_RESULT = 5;
				}
				e.LOTTERY_RESULT = 2;

				$('#userLotteryWin, #userLotteryQualified, #userLotteryUnqualified, #userLotteryOutofdate, #userLotteryJoin,#userLotteryMissed').hide();
				switch(e.LOTTERY_RESULT){
					case 0: //沒中獎
						$('#userLotteryMissed').show();
						break;
		
					case 1: //中獎
						var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
						////console.log(couponURL);
						$(".sys_getCouponCode").attr("data-url",couponURL);
						$(".sys_getCouponCode").unbind().bind("click",function(e){
							window.open($(this).attr("data-url"));
						});


						$('#userLotteryWin').show();
						break;
		
					case 2: //立即抽
						$('#userLotteryQualified').show();
						break;
		
					case 3: //不符合資格的人
					case -3: //不符合資格的人
						$('#userLotteryUnqualified').show();
						break;

					case 4://不在活動期間內開網站看到的訊息
						$('#userLotteryOutofdate').show();
						break;

					case 5://還沒開通的人
						$("#userApplyDate").hide();					
						$('#userLotteryJoin').show();
						break;
				}
				
				// Open lightbox page
				displayLightbox("#lbUser");
				return;
			break;



			case "checkUserInfo":
				var e = {};
				e.APLY_DATE_NETINSR = "2016/06/02";
				e.LOTTERY_COUPON_CODE = "XXDSFSFSD-FDSFSDFSD-AAAA-DDD";
				e.LOTTERY_RESULT =3;
				e.TICKET_2_PREM1 = "2";
				e.TICKET_2_PREM2 = "7";
				e.TICKET_2_PREM3 = "3";
				e.TICKET_3_OWNER = "5";
				e.TICKET_3_FRIEND = "10";
				e.USER_SHARE_SERIAL_NUMBER = "SSXXQQQTTddt";
				$('#userApplyDate .value').text(e.APLY_DATE_NETINSR);
				$('#couponCode .code .value').text( e.LOTTERY_COUPON_CODE || '');
				$('#userPrem1 .value').text(e.TICKET_2_PREM1);
				$('#userPrem2 .value').text(e.TICKET_2_PREM2);
				$('#userPrem3 .value').text(e.TICKET_2_PREM3);
				$('#userOwner .value').text(e.TICKET_3_OWNER);
				$('#userFriend .value').text(e.TICKET_3_FRIEND);
				$('#userShareSerial .value').text(e.USER_SHARE_SERIAL_NUMBER);
				
				$("#ogDescription").attr("content",SHARE_CONTENT+e.USER_SHARE_SERIAL_NUMBER);

				$("#invite-wrap").remove();
				$("body").append('<div id="invite-wrap" style="display:none;">'+e.USER_SHARE_SERIAL_NUMBER+'</div>')
				
				$("#userApplyDate").show();	
					
				if($.trim(e.APLY_DATE_NETINSR)==""){
					e.LOTTERY_RESULT = 5;
				}
				
				// e.LOTTERY_RESULT = 2;
				$('#userLotteryWin, #userLotteryQualified, #userLotteryUnqualified, #userLotteryOutofdate, #userLotteryJoin').hide();
				switch(e.LOTTERY_RESULT){
					case 0: //沒中獎
						$('#userLotteryMissed').show();
						displayLightbox("#lbUser");
						break;
		
					case 1: //中獎
						var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
						//console.log(couponURL);
						$("#userBtnGetCoupon").attr("data-url",couponURL);
						$("#userBtnGetCoupon").unbind().bind("click",function(e){
							window.open($(this).attr("data-url"));
						});
						$('#userLotteryWin').show();
						displayLightbox("#lbUser");
						break;
		
					case 2: //立即抽
						displayLightbox("#lbLottery");
						break;
		
					case 3: //不符合資格的人
					case -3: //不符合資格的人
						$('#userLotteryUnqualified').show();
						displayLightbox("#lbUser");
						break;

					case 4://不在活動期間內開網站看到的訊息
						$('#userLotteryOutofdate').show();
						displayLightbox("#lbUser");
						break;

					case 5://還沒開通的人
						$("#userApplyDate").hide();					
						$('#userLotteryJoin').show();
						displayLightbox("#lbUser");
					break;
				}
				return;
			break;
		}
	}
	/**
	 * getUserInfo 個人查詢
	 */
	var getUserInfo = function(callbackFn){
		if(isDemo){
			showDemo("getUserInfo",undefined,undefined);
			return false;
		}
		var redirUrl = "/bcauth/B2CWebGroup/pages/online_insurance_event_2016Q4/index.jsp?mode=userinfo";
		checkLoginStatus(redirUrl);

		//console.log("load user info");
		$.ajax({
			dataType: "json",
			url: API_LOTTERY_CHANCE+"&r="+Math.random(),
			success: function(e) {
				
				//console.log("success");
				console.log("checkuserInfo",e);
				
				if(e.RETURN_CODE == "-1"){
					loginStatus = false;
					window._loginStatus = false;
					doLogout();
					alert(MSG_DATA_ERROR);
					/*
					if(!checkLoginStatus(redirUrl)) {
						!!callbackFn && callbackFn();
						return;
					}*/
					
					//console.log("RETURN_CODE=-1");
					return;
				}
					

				$('#userApplyDate .value').text(e.APLY_DATE_NETINSR);
				$('#couponCode .code .value').text( e.LOTTERY_COUPON_CODE || '');
				$('#userPrem1 .value').text(e.TICKET_2_PREM1);
				$('#userPrem2 .value').text(e.TICKET_2_PREM2);
				$('#userPrem3 .value').text(e.TICKET_2_PREM3);
				$('#userOwner .value').text(e.TICKET_3_OWNER);
				$('#userFriend .value').text(e.TICKET_3_FRIEND);
				$('#userShareSerial .value').text(e.USER_SHARE_SERIAL_NUMBER);
				
				$("#ogDescription").attr("content",SHARE_CONTENT+e.USER_SHARE_SERIAL_NUMBER);

				$("#invite-wrap").remove();
				$("body").append('<div id="invite-wrap" style="display:none;">'+e.USER_SHARE_SERIAL_NUMBER+'</div>')
				$("#userApplyDate").show();	
				
				if($.trim(e.APLY_DATE_NETINSR)==""){
					e.LOTTERY_RESULT = 5;
				}

				$('#userLotteryMissed').hide();
				$('#userLotteryWin, #userLotteryQualified, #userLotteryUnqualified, #userLotteryOutofdate, #userLotteryJoin').hide();
				switch(e.LOTTERY_RESULT){
					case 0: //沒中獎
						$('#userLotteryMissed').show();
						break;
		
					case 1: //中獎
						var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
						////console.log(couponURL);
						$(".sys_getCouponCode").attr("data-url",couponURL);
						$(".sys_getCouponCode").unbind().bind("click",function(e){
							window.open($(this).attr("data-url"));
						});


						$('#userLotteryWin').show();
						break;
		
					case 2: //立即抽
						$('#userLotteryQualified').show();
						break;
		
					case 3: //不符合資格的人
					case -3: //不符合資格的人
						$('#userLotteryUnqualified').show();
						break;

					case 4://不在活動期間內開網站看到的訊息
						$('#userLotteryOutofdate').show();
						break;

					case 5://還沒開通的人
						$("#userApplyDate").hide();					
						$('#userLotteryJoin').show();
						break;
				}
				displayLightbox("#lbUser");
			}
		});
	}

	var checkUserInfo = function(){
		//console.log("checkUserInfo");
		//console.log("API_LOTTERY_CHANCE",API_LOTTERY_CHANCE);

		if(isDemo){
			showDemo("checkUserInfo");

			return;
		}

		var redirUrl = "/bcauth/B2CWebGroup/pages/online_insurance_event_2016Q4/index.jsp?mode=lottery";
		checkLoginStatus(redirUrl);

		$.ajax({
			dataType: "json",
			url: API_LOTTERY_CHANCE+"&r="+Math.random(),
			success: function(e) {
		
				////console.log("checkuserInfo",e);
				if(e.RETURN_CODE == "-1"){
					loginStatus = false;
					window._loginStatus = false;
					doLogout();
					alert(MSG_DATA_ERROR);
					/*
					if(!checkLoginStatus(redirUrl)) {
						!!callbackFn && callbackFn();
						return;
					}*/
					
					//console.log("RETURN_CODE=-1");
					return;
				}
				
				$('#userApplyDate .value').text(e.APLY_DATE_NETINSR);
				$('#couponCode .code .value').text( e.LOTTERY_COUPON_CODE || '');
				$('#userPrem1 .value').text(e.TICKET_2_PREM1);
				$('#userPrem2 .value').text(e.TICKET_2_PREM2);
				$('#userPrem3 .value').text(e.TICKET_2_PREM3);
				$('#userOwner .value').text(e.TICKET_3_OWNER);
				$('#userFriend .value').text(e.TICKET_3_FRIEND);
				$('#userShareSerial .value').text(e.USER_SHARE_SERIAL_NUMBER);
				
				$("#ogDescription").attr("content",SHARE_CONTENT+e.USER_SHARE_SERIAL_NUMBER);

				$("#invite-wrap").remove();
				$("body").append('<div id="invite-wrap" style="display:none;">'+e.USER_SHARE_SERIAL_NUMBER+'</div>')
				
				$("#userApplyDate").show();	
					
				if($.trim(e.APLY_DATE_NETINSR)==""){
					e.LOTTERY_RESULT =1;
				}

				
				$('#userLotteryWin, #userLotteryQualified, #userLotteryUnqualified, #userLotteryOutofdate, #userLotteryJoin').hide();
				switch(e.LOTTERY_RESULT){
					case 0: //沒中獎
						$('#userLotteryMissed').show();
						displayLightbox("#lbUser");
						break;
		
					case 1: //中獎
						var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
						//console.log(couponURL);
						$("#userBtnGetCoupon").attr("data-url",couponURL);
						$("#userBtnGetCoupon").unbind().bind("click",function(e){
							window.open($(this).attr("data-url"));
						});
						$('#userLotteryWin').show();
						displayLightbox("#lbUser");
						break;
		
					case 2: //立即抽
						displayLightbox("#lbLottery");
						break;
		
					case 3: //不符合資格的人
					case -3: //不符合資格的人
						$('#userLotteryUnqualified').show();
						displayLightbox("#lbUser");
						break;

					case 4://不在活動期間內開網站看到的訊息
							$('#userLotteryOutofdate').show();
						displayLightbox("#lbUser");
						break;

						case 5://還沒開通的人
							$("#userApplyDate").hide();					
							$('#userLotteryJoin').show();
							displayLightbox("#lbUser");
						break;
				}
				
			}
		});
	}
	
	/**
	 * doLottery 抽獎
	 * @status => 0 未中 | 1 中獎 | 2 沒資格 
	 */
	var doLottery = function(a_target){
		var redirUrl = "/bcauth/B2CWebGroup/pages/online_insurance_event_2016Q4/index.jsp?mode=lottery";
		

		if(isDemo){
			showDemo("doLottery",a_target);

			return;
		}
		checkLoginStatus(redirUrl);

		//console.log('start do Lotter');
		$.ajax({
			type: "POST",
			dataType: "json",
			url: API_DO_LOTTERY+"&r="+Math.random()
		})

		.always(function(e){
		//console.log('Lotter result', e.RESULT);
			var couponURL = COUPON_URL+e.LOTTERY_COUPON_CODE;
			var target = $(a_target).parent();
			var allbutton = $('.sys_sendLottery');

			switch(e.RESULT) {
				case 0:
					//lose
					target.addClass('active').html("<div class='cake-text'><h4>很可惜!<br>沒有中獎</h4>沒關係，投保還有<br>機會抽中其他大獎哦</div>");

					allbutton.off('click');
					break;
				case 1:
					//win
					var checklink = $('<a href="#">查詢我的兌換序號</a>').attr('data-url', couponURL).click(function(e){
						e.preventDefault();
						window.open($(this).attr("data-url"));
					});

					target.addClass('active').html("<div class='cake-text'><h4>恭喜你!</h4>抽中 85°C<br>100元午茶組");
					target.find('.cake-text').append(checklink);
					//target.attr("data-url",couponURL);

					allbutton.off('click');

					break;
				case 2:
					alert("doLottery 沒抽獎資格");//debug
					break;
				default:
					//alert("doLottery error"); //debug
					break;
			}

			
			//console.log('doLottery ajax response=>', e);
		});
	}
/**
	 * doLogout
	 */
	var doLogout = function(){
		
		window._loginStatus = false;
		
		$(".sys_getCouponCode").attr("data-url","");
		$(".sys_getCouponCode").unbind();

		$('#userApplyDate .value').text("");
		$('#couponCode .code .value').text("");
		$('#userPrem1 .value').text("");
		$('#userPrem2 .value').text("");
		$('#userPrem3 .value').text("");
		$('#userOwner .value').text("");
		$('#userFriend .value').text("");
		$('#userShareSerial .value').text("");

		$.ajax({
			url: API_DO_LOGOUT,
			success: function(e) {
				//console.log(e);
			}
		});
		
        destroyLightbox();
	}


	var displayLightbox = function(a_str){
		var target = a_str;
		$.fancybox({

            fitToView:true,
            padding:0,
            // 'autoDimensions': true,
            // 'centerOnScroll': true,
            'href' : target,
            openSpeed:0,
            scrolling:'yes',
            fixedPosition:true,
            // scrollOutside: true,
            closeBtn: true,
            closeSpeed:0,
		    helpers : { 
		        overlay : {
		        	closeClick: false,
		        	locked: true
		        	} // prevents closing when clicking OUTSIDE fancybox
		    },
		    afterShow: function () {
		    	if($('html').hasClass('ios-device')){
			    	ori_scroll_top = $("body").scrollTop();
			        $(".section").css('position','fixed');
			        $("div.fancybox-wrap.fancybox-mobile.fancybox-type-inline.fancybox-opened").css("top",20);
			        $(".section").css('top',-ori_scroll_top);
		        }
		        
		    },
		    afterClose: function () {
		    	if($('html').hasClass('ios-device')){
			        $(".section").css('position','relative');
			        $(".section").css('top','auto');
			        $("body").scrollTop(ori_scroll_top);
		        }
		    }
        });
	}

	var destroyLightbox = function(){
        $.fancybox.close();
	}
	/**
	 * Initialize
	 */
	var init = function() {

		// setLoginStatus(loginStatus);
		
		$(".sys_userinfo").bind("click",function(e){
			getUserInfo();
		});

		$(".sys_doLottery").bind("click",function(e){
			e.preventDefault();
			displayLightbox("#lbLottery");
            return false;
		});


		$(".sys_doAwards").bind("click",function(e){
			e.preventDefault();
			displayLightbox("#lbAwards");
            return false;
		});

		$(".sys_sendLottery").bind("click",function(e){
			e.preventDefault();
			doLottery($(this));
            return false;
		});

		$(".sys_logout").bind("click",function(e){
			e.preventDefault();
			doLogout();
            return false;
		});

		$(".sys_closeLightbox").bind("click",function(e){
			e.preventDefault();
        	destroyLightbox();
            return false;
		});




		var Device = {};
			Device.line 			= /line/.test(Device.ua);
			Device.facebook 		= /fban|fbav/.test(Device.ua) && !/messengerforios/.test(Device.ua); // Facebook in-app 
		// 個人查詢 > 分享 button
		function openShareWin(url, target) {
			var centerLeft = parseInt((window.screen.availWidth - 550) / 2);
			var centerTop = parseInt((window.screen.availHeight - 420) / 2 * .6);

			return window.open(url, target, 'width=550,height=420,left='+centerLeft+',top='+centerTop+',location=yes,resizable=yes,scrollbars=yes,dependent=yes');
		}



		// Facebook
		$(document).on('click', '#userBtnShareFB', function(){
			var u = $('#ogUrl').attr('content');
			var inviteCode = $("#invite-wrap").html();
			//alert(u+"?inviteCode="+inviteCode);

			u = u+"?inviteCode="+inviteCode;

			openShareWin( 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(u), 'Share');
		});
		// Line
		$(document).on('click', '#userBtnShareLINE', function(){
			var t = $('#ogTitle').attr('content'),
				d = $('#ogDescription').attr('content'),
				u = $('#ogUrl').attr('content');
			window.open('http://line.naver.jp/R/msg/text/?' + encodeURIComponent(t + ' \n\r' + d + ' ' + u), '_blank');
		});






		// 導回後依目前 url param 顯示lightbox頁
		var mode = getURLParam('mode');
		switch(mode){
			case 'lottery':
				checkUserInfo();
				break;

			case 'userinfo':
				getUserInfo();
				break;
		}

	}

	return {
		init:init,
		getUserInfo: getUserInfo,
		doLottery: doLottery,
		doLogout: doLogout
	};
})();