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

    var chartCtx = $("#chart").get(0).getContext("2d");
    var data = {
        labels,
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                data : [65,59,90,81,56,55,40]
            },
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                data : [28,48,40,19,96,27,100]
            }
        ]
    };
    var myChart = new Chart(chartCtx).Bar(data);
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


window.onload = function() {
    HCI();
}();
/**
 * Created by zhoujh on 2016/1/2.
 */

function getRChannel() {
    var output = [];
    if (G.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 0; i < G.img_data.data.length; i+=4) {
        output.push(G.img_data.data[i]);
    }
    return output;
}

function getGChannel() {
    var output = [];
    if (G.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 1; i < G.img_data.data.length; i+=4) {
        output.push(G.img_data.data[i]);
    }
    return output;
}

function getBChannel() {
    var output = [];
    if (G.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 2; i < G.img_data.data.length; i+=4) {
        output.push(G.img_data.data[i]);
    }
    return output;
}

function showRedImg() {
    var red = getRChannel();
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

function showGreenImg() {
    var green = getGChannel();
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

function showBlueImg() {
    var blue = getBChannel();
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
    console.log(G);
}