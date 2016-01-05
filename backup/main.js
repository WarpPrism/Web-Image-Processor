/**
 * Created by zhoujihao on 15-10-24.
 */
// Global Variables
var icanvas;
var icxt;
var img = new Image();
var imgMatrix;

function iResizeCanvas(_width, _height) {
    icanvas.width = _width;
    icanvas.height = _height;
}

// Self-defined matrix object
function Matrix(_row, _col, _data, _buffer) {
    this.row = _row || 0;
    this.col = _col || 0;
    this.channel = 4;
    this.buffer = _buffer || new ArrayBuffer(this.row * this.col * 4);
    this.data = new Uint8ClampedArray(this.buffer);
    _data && this.data.set(_data);
    this.bytes = 1;
    this.type = "CV_RGBA";
}

function imread(_img) {
    icxt.clearRect(0, 0, icanvas.width, icanvas.height);
    var width = _img.width;
    var height = _img.height;
    while (width > icanvas.parentNode.clientWidth - 50) {
        width = Math.floor(width / 1.5);
        height = Math.floor(height / 1.5);
    }
    iResizeCanvas(width, height);
    icxt.drawImage(_img, 0, 0, width, height);
    var imageData = icxt.getImageData(0, 0, width, height);
    /*console.log(width * height * 4, imageData);*/
    var tempMatrix = new Matrix(height, width, imageData.data);
    imageData = null;
    return tempMatrix;
}

function matrixToImageData(_matrix) {
    var width = _matrix.col;
    var height = _matrix.row;
    var imageData = icxt.createImageData(width, height);
    imageData.data.set(_matrix.data);
    return imageData;
}

var getPath = function(obj,fileQuery,transImg){
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
};



window.onload = function() {
    icanvas = document.getElementById("canvas");
    icxt = icanvas.getContext("2d");

    iResizeCanvas(600, 400);
    icxt.strokeStyle = "#777";
    icxt.font = "40px Arial";
    icxt.textAlign = "center";
/*
    icxt.strokeText('Welcome!', icanvas.width / 2, icanvas.height / 2);
*/
    setTimeout(function() {
        icxt.strokeText('Welcome!', icanvas.width / 2, icanvas.height / 2);
    }, 1000);
    setTimeout(function() {
        icxt.clearRect(0, 0, icanvas.width, icanvas.height);
        icxt.strokeText('Please open a picture.', icanvas.width / 2, icanvas.height / 2);
    }, 2500);
    HCI();
};


