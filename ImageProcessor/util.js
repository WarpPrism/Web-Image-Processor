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
            obj.setAttribute("src",e.target.result)
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