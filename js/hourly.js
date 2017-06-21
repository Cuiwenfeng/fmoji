$(function () {
	function GetQueryString(name)
		{
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null){return  unescape(r[2]); }
	     return null;
		}
		var hlat = GetQueryString('lat');
		var hlon = GetQueryString('lon');
    $.ajax({
        type: "POST",
        url: "http://aliv8.data.moji.com/whapi/json/aliweather/forecast24hours",
        data: {
        		"lat": hlat,
        		"lon": hlon,
        		"token":"1b89050d9f64191d494c806f78e8ea36"
        },
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "APPCODE 33c80c6c98c84caba20a6842e6baaaf0");
        },
        dataType: 'JSON',
        success: function (data) {
            if (isEmptyData(data)) {
                showTips();
                return;
            }
            //console.log(data);
            var h_aqi = data.data.hourly;
            var h_city = data.data.city;
            $('#city').html(h_city.pname);
            
            if (isEmptyData(h_aqi)) {
                showTips();
                return;
            }
            var hourly = h_aqi;
            realTime(hourly);
            setInterval(function () {
                realTime(hourly);
            }, 60 * 60 * 1000);  //每隔1小时执行一次
        },
        error: function (e) {
            showTips();
        }
    });

    //实时温度
    function realTime(hourly) {
        var myDate = new Date();
        var tHour = myDate.getHours();
        var index = (tHour + 24 - hourly[0].hour)%24;
        $('#tempNow').html(hourly[index].temp);
        $('#info_wea').html(hourly[index].condition);
    }

    function showTips() {
        $('.info_box .info,.days,.weak_wea').remove();
        var tips = '<style>.tips{position:fixed;top0;left:0;width:100%;height:100%;text-align:center;color:#fff;font-size:20px;}</style><div class="tips">暂无数据，请稍后再试！</div>';
        $('body').append(tips);
    }

    $('body').height($(window).height());
});
function isEmptyData(data) {
    return data == null || data == "";
}
