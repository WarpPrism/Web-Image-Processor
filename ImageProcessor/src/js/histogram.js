/**
 * Created by zhoujihao on 16-2-2.
 */

function getHistogramData(channel, which) {
    var data;
    var T;
    if (which == "src") {
        T = G;
    } else if (which == "new") {
        T = NewImg;
    }
    switch (channel) {
        case "r":
            data = T.R_channel;
            break;
        case "g":
            data = T.G_channel;
            break;
        case "b":
            data = T.B_channel;
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
}

function drawSrcChart() {
    var red = getHistogramData("r", "src");
    var green = getHistogramData("g", "src");
    var blue = getHistogramData("b", "src");

    $('#histogram').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '原图RGB三通道直方图'
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
}

function drawNewChart() {
    var red = getHistogramData("r", "new");
    var green = getHistogramData("g", "new");
    var blue = getHistogramData("b", "new");

    $('#histogram2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '处理后RGB三通道直方图'
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
}