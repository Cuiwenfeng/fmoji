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
        url: "http://aliv8.data.moji.com/whapi/json/aliweather/aqiforecast5days",
        data: {
        		"lat": hlat,
        		"lon": hlon,
        		"token":"17dbf48dff33b6228f3199dce7b9a6d6"
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
            var aqi = data.data.aqiForecast;
            if (isEmptyData(aqi)) {
                showTips();
                return;
            }
            var daysAqiForecast = aqi;
            var quality = ['优', '良', '轻度', '中度', '重度', '严重'];
            var arrDate = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            var myDate = new Date();
            var tDate = myDate.getDay();

            //今天的空气质量
            $('.info_aqi span').html('<img src="img/aqi/' + getLevel(daysAqiForecast[1].value) + '.png" alt="aqi">');
            $('.info_aqi strong').html(daysAqiForecast[1].value + '&nbsp;' + quality[getLevel(daysAqiForecast[1].value) - 1]);
            $('.info_aqi .info_warn').attr('class', 'info_warn warn_' + getLevel(daysAqiForecast[1].value) + '');
            $('#q_today').html(quality[getLevel(daysAqiForecast[1].value) - 1]);
            $('#q_today').attr('class', 'warn_' + getLevel(daysAqiForecast[1].value) + '');
            //明天的空气质量
            $('#q_tomorr').html(quality[getLevel(daysAqiForecast[2].value) - 1]);
            $('#q_tomorr').attr('class', 'warn_' + getLevel(daysAqiForecast[2].value) + '');

        },
        error: function (e) {
            showTips();
        }
    });

    function showTips() {
        $('.info_box .info,.days,.weak_wea').remove();
        var tips = '<style>.tips{position:fixed;top0;left:0;width:100%;height:100%;text-align:center;color:#fff;font-size:20px;}</style><div class="tips">暂无数据，请稍后再试！</div>';
        $('body').append(tips);
    }

    //空气质量
    function getLevel(aqiValue) {
        var level;
        if (0 < aqiValue && aqiValue < 50) {
            level = 1;
        } else if (50 < aqiValue && aqiValue < 101) {
            level = 2;
        } else if (100 < aqiValue && aqiValue < 151) {
            level = 3;
        } else if (150 < aqiValue && aqiValue < 201) {
            level = 4;
        } else if (200 < aqiValue && aqiValue < 300) {
            level = 5;
        } else if (aqiValue > 300) {
            level = 6;
        }
        return level;
    }

    $('body').height($(window).height());
});

function isEmptyData(data) {
    return data == null || data == "";
}
