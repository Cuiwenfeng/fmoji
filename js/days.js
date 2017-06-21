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
	        url: "http://aliv8.data.moji.com/whapi/json/aliweather/forecast15days",
	        data: {
	        		"lat": hlat,
	        		"lon": hlon,
	        		"token":"7538f7246218bdbf795b329ab09cc524"
	        },
	        beforeSend: function(request) {
	            request.setRequestHeader("Authorization", "APPCODE 33c80c6c98c84caba20a6842e6baaaf0");
	        },
	        dataType: 'JSON',
        success: function (data) {
        	console.log(data);
            if (isEmptyData(data)) {
                showTips();
                return;
            }
            var d_aqi = data.data.forecast;
            if (isEmptyData(d_aqi)) {
                showTips();
                return;
            }
            var daysForecast = d_aqi;
            var arrDate = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            var myDate = new Date();
            var tDate = myDate.getDay();

            //今天最低气温
            $('#tempLow_d').html(daysForecast[1].tempNight);
            //今天最高气温
            $('#tempHigh_d').html(daysForecast[1].tempDay);
            //今天天气
            $('#info_wea').html(daysForecast[1].conditionDay);
            $('#weaToday').html(daysForecast[1].conditionDay);
            //明天最低气温
            $('#tempLow_t').html(daysForecast[2].tempNight);
            //明天最高气温
            $('#tempHigh_t').html(daysForecast[2].tempDay);
            //今天天气
            $('#weaTom').html(daysForecast[2].conditionDay);

            $('.t_w').attr('src', 'img/w' + daysForecast[1].conditionIdDay + '.png');
            $('.tm_w').attr('src', 'img/w' + daysForecast[2].conditionIdDay + '.png');


            /*一周天气*/
            var wLi = '';
            for (var i = 0; i < 6; i++) {
                var j = (tDate + i - 1)%7;
                wLi += '<li data-high="' + daysForecast[i].tempDay + '" data-low="' + daysForecast[i].tempNight + '">' +
                    '<em>' + arrDate[j < 7 ? j : 0] + '</em><dl class="wea">' +
                    '<dd><strong>' + daysForecast[i].conditionDay + '</strong></dd>' +
                    '<dt><img src="img/w' + daysForecast[i].conditionIdDay + '.png" alt=""></dt>' +
                    '</dl><div></div>' +
                    '<dl class="wea"><dt><img src="img/w'+ daysForecast[i].conditionIdNight + '.png" alt=""></dt>' +
                    '<dd><strong>' + daysForecast[i].conditionNight + '</strong></dd>' +
                    '<dl class="wind"><dd>' + daysForecast[i].windDirDay + '</dd><dd>' + daysForecast[i].windLevelDay + '级</dd></dl>' +
                    '</li>';
            }
            $('.weak_wea ul').html(wLi);
            tempMap(); //绘制温度曲线
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


    $('body').height($(window).height());
    //温度曲线图
    function tempMap() {
        var a = 0.7;
        (function () {
            var e = $(".weak_wea ul li");
            if (e.length > 0) {
                var t = {
                    x: [],
                    low: [],
                    high: [],
                    min: 9999,
                    max: -9999
                };
                for (var i = 0; i < e.length; i++) {
                    var a = parseInt(e.eq(i).attr("data-high"));
                    var s = parseInt(e.eq(i).attr("data-low"));
                    t.min = t.min < s ? t.min : s;
                    t.max = t.max > a ? t.max : a;
                    t.x[i] = i;
                    t.low[i] = s;
                    t.high[i] = a
                }
                o(t)
            }
        })();

        function o(e) {
            var t = echarts.init(document.getElementById("weekLine"));
            var i = {
                textStyle: {
                    fontSize: 20 * a * 16 / 10
                },
                color: ["#ffffff"],
                calcubale: false,
                animation: true,
                itemStyle: {
                    normal: {
                        color: "rgb(255, 255, 255)"
                    }
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    color: ["#ffffff"],
                    data: e.x
                }],
                yAxis: [{
                    splitLine: {
                        show: false
                    },
                    scale: false,
                    allowDecimals: false,
                    splitNumber: "4",
                    min: e.min * 1,
                    max: e.max * 1,
                    type: "value",
                    show: false,
                    boundaryGap: false,
                    axisLabel: {
                        formatter: function s(e) {
                            return parseInt(e)
                        },
                        textStyle: {
                            color: "rgb(255, 255, 255)"
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    color: ["#ffffff"]
                }],
                grid: {
                    x: 30,
                    x2: 30,
                    y: 40,
                    y2: 40,
                    borderWidth: 0
                },
                series: [{
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#fff",
                                width: 2
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "top"
                        }
                    },
                    data: e.high
                }, {
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#fff",
                                width: 2
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "bottom"
                        }
                    },
                    data: e.low
                }]
            };
            t.setOption(i)
        }
    }
});

function isEmptyData(data) {
    return data == null || data == "";
}

