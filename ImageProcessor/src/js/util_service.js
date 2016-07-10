/**
 * Created by zhoujihao on 16-7-2.
 */

function Util() {
    var obj = {};

    obj.getChannel = function(img_data, C) {
        var output = [];
        var i;
        switch(C.toUpperCase()) {
            case "R":
                i = 0;
                break;
            case "G":
                i = 1;
                break;
            case "B":
                i = 2;
                break;
            default:
                console.log("Err: Channel Error!");
                return null;
        }
        for (; i < img_data.data.length; i += 4) {
            output.push(img_data.data[i]);
        }
        return output;
    };

    obj.getHistogramData = function(imgData, channel) {
        var data;
        switch (channel) {
            case "R":
                data = obj.getChannel(imgData, "R");
                break;
            case "G":
                data = obj.getChannel(imgData, "G");
                break;
            case "B":
                data = obj.getChannel(imgData, "B");
                break;
            default:
                break;
        }
        var N = new Array(256);
        var i, pixel;
        for (i = 0; i < N.length; i++) {
            N[i] = 0;
        }
        for (i = 0; i < data.length; i++) {
            pixel = data[i];
            N[pixel]++;
        }
        // Compute Normalized Histogram Data.
        for (i = 0; i < 256; i++) {
            N[i] = N[i] / data.length;
            N[i] = N[i] == 1 ? 0 : N[i];
        }
        return N;
    };

    obj.drawHistogram = function(imgData) {
        var red = obj.getHistogramData(imgData, "R");
        var green = obj.getHistogramData(imgData, "G");
        var blue = obj.getHistogramData(imgData, "B");

        $('#histogram').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'RGB三通道直方图'
            },
            subtitle: {
                text: '某灰度值占整幅图像的比例'
            },
            xAxis: {
                categories: [],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '所占比例'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">灰度值：{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.5f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'red',
                data: red,
                color: "#FF0000"
            }, {
                name: 'green',
                data: green,
                color: "#00FF00"
            }, {
                name: 'blue',
                data: blue,
                color: "#0000FF"
            }]
        });
    };

    obj.throttle = function(fn, delay) {
        if (fn.timer) {
            clearTimeout(fn.timer);
        }
        fn.timer = setTimeout(function() {
            fn.call();
        }, delay);
    };

    return obj;
}