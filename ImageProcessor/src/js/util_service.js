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

    // JS Throttle Function
    obj.throttle = function(fn, delay) {
        if (fn.timer) {
            clearTimeout(fn.timer);
        }
        fn.timer = setTimeout(function() {
            fn.call();
        }, delay);
    };

    /*-----------------------------------*\
        COMMONAPI
    \*-----------------------------------*/
    obj.addHandler = function(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, handler);
        } else {
            ele['on' + type] = handler;
        }
    };

    // 由RGBA一维数组 获得图片亮度值组成的 二维数组。
    obj.RGBA2Intensity = function(img_data) {
        var output = new Array(img_data.height);
        var data = img_data.data;
    
        for (var iter = 0; iter < output.length; iter++) {
            output[iter] = new Array(img_data.width);
        }
    
        var k = 0;
        for (var i = 0; i < img_data.height; i++) {
            for (var j = 0; j < img_data.width; j++) {
                var intensity;
                // I = 1 / 3 *  (R + G + B)
                intensity = parseInt(1/3 * data[k] + 1/3 * data[k + 1] + 1/3 * data[k + 2]);
                output[i][j] = intensity;
                k += 4;
            }
        }
        return output;
    }

    // Convert 1-dimension array of RGBA to 2-dimension gray array.
    obj.RGBA2Gray = function(img_data) {
        var output = new Array(img_data.height);
        var data = img_data.data;
    
        for (var iter = 0; iter < output.length; iter++) {
            output[iter] = new Array(img_data.width);
        }
    
        var k = 0;
        for (var i = 0; i < img_data.height; i++) {
            for (var j = 0; j < img_data.width; j++) {
                var gray;
                gray = Math.round(0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2]);
                output[i][j] = gray;
                k += 4;
            }
        }
    
        return output;
    }

    obj.RGBATo3dimRGB = function(img_data) {

        // construct 3-dim array
        var output = new Array(img_data.height);
        for (var i = 0; i < output.length; i++) {
            output[i] = new Array(img_data.width);
        }
        for (i = 0; i < output.length; i++) {
            for (var j = 0; j < output[i].length; j++) {
                output[i][j] = new Array(3);
            }
        }
    
        var k = 0;
        var data = img_data.data;
        for (i = 0; i < img_data.height; i++) {
            for (j = 0; j < img_data.width; j++) {
                output[i][j][0] = data[k];      //R
                output[i][j][1] = data[k + 1];  //G
                output[i][j][2] = data[k + 2];  //B
                k+=4;
            }
        }
        return output;
    };

    obj.saveFile = function(data, filename){
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;
    
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };

    return obj;
}
