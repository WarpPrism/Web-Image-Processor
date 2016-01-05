/**
 * Created by zhoujihao on 2016/1/3.
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

function resizeCanvas(canvas, w, h) {
    canvas.width = w;
    canvas.height = h;
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
            obj.setAttribute("src",e.target.result)
        };
        reader.readAsDataURL(file);
    }
}

var saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};


// Get image data using canvas
// ImageData: width, height, data: Uint8ClampedArray[] (1-dimension array)
function imread(canvas, cxt, img, target) {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    var width = img.width;
    var height = img.height;
    resizeCanvas(canvas, width, height);
    cxt.drawImage(img, 0, 0, width, height);

    if (target == "L") {
        G.img_dataL = cxt.getImageData(0, 0, canvas.width, canvas.height);
    } else if (target == "R") {
        G.img_dataR = cxt.getImageData(0, 0, canvas.width, canvas.height);
    }
    G.tip.innerHTML = "Succeed In Opening The Image."
}


// Some Useful API

// 由RGBA一维数组 获得图片亮度值组成的 二维数组。
function RGBA2Intensity(img_data) {
    if (img_data == null) {
        G.tip.innerHTML = "Image Not Found!";
    }
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
function RGBA2Gray(img_data) {
    if (img_data == null) {
        G.tip.innerHTML = "Image Not Found!";
    }
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

function RGBATo3dimRGB(img_data) {
    if (img_data == null) {
        G.tip.innerHTML = "Image Not Found!";
    }
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
}

function showGrayImgFrom2dimArray(input) {

    var height = input.length;
    var width = input[0].length;
    var img_data = G.result_cxt.createImageData(width, height);
    var data = [];
    var k = 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j  < width; j++) {
            data[k] = data[k + 1] = data[k + 2] = input[i][j];
            data[k + 3] = 255;
            k += 4;
        }
    }

    img_data.data.set(data);

    resizeCanvas(G.result, width, height);
    G.result_cxt.clearRect(0, 0, G.result.width, G.result.height);
    G.result_cxt.putImageData(img_data, 0, 0, 0, 0, width, height);
}
