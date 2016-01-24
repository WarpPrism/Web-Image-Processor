/**
 * Created by zhoujihao on 15-10-27.
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

var saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};


function HCI() {
    var file = document.getElementById("file");
    var openBtn = document.getElementById("openBtn");
    var info = document.getElementById("info");

    addHandler(openBtn, "click", function() {
        file.click();
    }, false);

    file.onchange = function() {
        getPath(img, this, null);
        img.onload = function() {
            imgMatrix = imread(img);
        };
    };

    var toGrayBtn = document.getElementById("toGrayBtn");
    addHandler(toGrayBtn, "click", function() {
        if (img.src == "") {
            info.innerHTML = "Please open a picture.";
            return;
        }
        var dstMatrix = RGBAToGray(imgMatrix);
        var dstData = matrixToImageData(dstMatrix);
        icxt.clearRect(0, 0, icanvas.width, icanvas.height);
        icxt.putImageData(dstData, 0, 0, 0, 0, dstMatrix.col, dstMatrix.row);
        info.innerHTML = "Succeed in changing to gray image!";
    }, false);

    var toBinaryBtn = document.getElementById("toBinaryBtn");
    addHandler(toBinaryBtn, "click", function() {
        if (img.src == "") {
            info.innerHTML = "Please open a picture.";
            return;
        }
        var dstMatrix = To2Level(imgMatrix);
        var dstData = matrixToImageData(dstMatrix);
        icxt.clearRect(0, 0, icanvas.width, icanvas.height);
        icxt.putImageData(dstData, 0, 0, 0, 0, dstMatrix.col, dstMatrix.row);
        info.innerHTML = "Succeed in changing to 2-level image!";
    }, false);

    var restoreBtn = document.getElementById("restoreBtn");
    addHandler(restoreBtn, "click", function() {
        if (img.src == "") {
            info.innerHTML = "Please open a picture.";
            return;
        }
        var Data = matrixToImageData(imgMatrix);
        icxt.clearRect(0, 0, icanvas.width, icanvas.height);
        icxt.putImageData(Data, 0, 0, 0, 0, imgMatrix.col, imgMatrix.row);
        info.innerHTML = "Restore Succeed!";
    }, false);

    var saveBtn = document.getElementById("saveBtn");
    addHandler(saveBtn, "click", function() {
        if (img.src == "") {
            info.innerHTML = "Nothing to save!";
            return;
        }
        var image_download = icanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // window.location.href = image_download;
        var filename = 'output-' + new Date().toLocaleString() + '.png';
        // alert(filename);
        saveFile(image_download, filename);

    });

    var infoBtn = document.getElementById("infoBtn");
    var projectInfo = document.getElementById("projectInfo");
    addHandler(infoBtn, "mouseover", function() {
        projectInfo.style.visibility = "visible";
    });
    addHandler(infoBtn, "mouseout", function() {
        projectInfo.style.visibility = "hidden";
    });
}
