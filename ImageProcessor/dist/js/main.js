/**
 * Created by zhoujh on 2016/1/2.
 */

function HCI() {

    var file = document.getElementById("file");
    var openBtn = document.getElementById("openBtn");

    addHandler(openBtn, "click", function() {
        file.click();
    }, false);

    file.onchange = function() {
        getFilePath(G.img, this, null);
        G.img.onload = function() {
            imread(G.img);
        };
    };

    $("#rBtn").click(function() {
        showRedImg(G);
        getNewImgData();
        drawNewChart();
    });
    $("#gBtn").click(function() {
        showGreenImg(G);
        getNewImgData();
        drawNewChart();
    });
    $("#bBtn").click(function() {
        showBlueImg(G);
        getNewImgData();
        drawNewChart();
    });
}
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
/**
 * Created by zhoujh on 2016/1/2.
 */


var G = {
    name: "Global Space"
};
G.canvas = document.getElementById("canvas");
G.cxt = G.canvas.getContext("2d");
G.img = new Image();
G.img_data = null;
G.img_width = 0;
G.img_height = 0;
G.img_data_length = 0;
G.img_type = null;
G.R_channel = null;
G.G_channel = null;
G.B_channel = null;

var NewImg = {
    img_data: null,
    img_width: 0,
    img_height: 0,
    img_data_length: 0,
    R_channel: null,
    G_channel: null,
    B_channel: null
};

$(function() {
    G.img.src = "./example.jpg";
    G.img.onload = function() {
        imread(G.img);
    };
    HCI();
}());
/**
 * Created by zhoujh on 2016/1/2.
 */

function getRChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 0; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function getGChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 1; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function getBChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 2; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function showRedImg(T) {
    var red = getRChannel(T);
    var image_data = G.cxt.createImageData(G.img_width, G.img_height);
    var data = [];
    for (var i = 0, j = 0; i < G.img_data_length; i+=4, j++) {
        data[i] = red[j]; // R
        data[i + 1] = 0; // G
        data[i + 2] = 0; // B
        data[i + 3] = 255; // A
    }
    image_data.data.set(data);
    G.cxt.clearRect(0, 0, G.canvas.width, G.canvas.height);

    G.cxt.putImageData(image_data, 0, 0, 0, 0, G.img_width, G.img_height);
}

function showGreenImg(T) {
    var green = getGChannel(T);
    var image_data = G.cxt.createImageData(G.img_width, G.img_height);
    var data = [];
    for (var i = 0, j = 0; i < G.img_data_length; i+=4, j++) {
        data[i] = 0; // R
        data[i + 1] = green[j]; // G
        data[i + 2] = 0; // B
        data[i + 3] = 255; // A
    }
    image_data.data.set(data);
    G.cxt.clearRect(0, 0, G.canvas.width, G.canvas.height);

    G.cxt.putImageData(image_data, 0, 0, 0, 0, G.img_width, G.img_height);
}

function showBlueImg(T) {
    var blue = getBChannel(T);
    var image_data = G.cxt.createImageData(G.img_width, G.img_height);
    var data = [];
    for (var i = 0, j = 0; i < G.img_data_length; i+=4, j++) {
        data[i] = 0; // R
        data[i + 1] = 0; // G
        data[i + 2] = blue[j]; // B
        data[i + 3] = 255; // A
    }
    image_data.data.set(data);
    G.cxt.clearRect(0, 0, G.canvas.width, G.canvas.height);

    G.cxt.putImageData(image_data, 0, 0, 0, 0, G.img_width, G.img_height);
}


    /**
 * Created by zhoujh on 2016/1/2.
 */

function addHandler(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
    } else {
        element['on' + type] = handler;
    }
}

function resizeCanvas(w, h) {
    G.canvas.width = w;
    G.canvas.height = h;
}

function getFilePath(obj,fileQuery,transImg) {
    if(window.navigator.userAgent.indexOf("MSIE")>=1){
        obj.select();
        var path=document.selection.createRange().text;
        obj.removeAttribute("src");
        obj.setAttribute("src",transImg);
        obj.style.filter=
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+path+"', sizingMethod='scale');";
    }
    else{
        var file =fileQuery.files[0];
        var reader = new FileReader();
        reader.onload = function(e){
            obj.setAttribute("src",e.target.result);
        };
        reader.readAsDataURL(file);
    }
}


// Get image data using canvas
// ImageData: width, height, data: Uint8ClampedArray[] (1-dimension array)
function imread(img) {
    G.cxt.clearRect(0, 0, G.canvas.width, G.canvas.height);
    var width = img.width;
    var height = img.height;
    resizeCanvas(width, height);
    G.cxt.drawImage(img, 0, 0, width, height);
    G.img_data = G.cxt.getImageData(0, 0, G.canvas.width, G.canvas.height);

    G.img_width = G.img_data.width;
    G.img_height = G.img_data.height;
    G.img_data_length = G.img_width * G.img_height * 4;
    G.R_channel = getRChannel(G);
    G.G_channel = getGChannel(G);
    G.B_channel = getBChannel(G);

    G.img_type = "彩色图像";
    for (var i = 0; i < 100; i++) {
        if (G.R_channel[i] === G.B_channel[i] && G.B_channel[i] === G.G_channel[i]) {
            G.img_type = "灰度图像";
        }
    }

    drawSrcChart();
    makeTable();
}

function makeTable() {
    way.set("myTableData", {
        "image_type": G.img_type,
        "total_pixel": G.img_data_length,
        "width": G.img_width + "px",
        "height": G.img_height + "px"
    });
}

function getNewImgData() {
    NewImg.img_data = G.cxt.getImageData(0, 0, G.canvas.width, G.canvas.height);

    NewImg.img_width = NewImg.img_data.width;
    NewImg.img_height = NewImg.img_data.height;
    NewImg.img_data_length = NewImg.img_width * NewImg.img_height * 4;
    NewImg.R_channel = getRChannel(NewImg);
    NewImg.G_channel = getGChannel(NewImg);
    NewImg.B_channel = getBChannel(NewImg);
}
