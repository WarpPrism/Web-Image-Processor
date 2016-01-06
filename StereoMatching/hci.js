/**
 * Created by zhoujihao on 2016/1/3.
 */

function HCI() {

    // Human-Computer-Interaction

    var btnL = document.getElementById("btnL");
    var btnR = document.getElementById("btnR");
    var fileL = document.getElementById("fileL");
    var fileR = document.getElementById("fileR");

    var ssd_l = document.getElementById("ssd_l");
    var ssd_r = document.getElementById("ssd_r");
    var asw_l = document.getElementById("asw_l");
    var asw_r = document.getElementById("asw_r");
    var ncc_l = document.getElementById("ncc_l");
    var ncc_r = document.getElementById("ncc_r");
    var clear_btn = document.getElementById("clear-btn");
    var save_btn = document.getElementById("save-btn");

    addHandler(btnL, "click", function() {
        fileL.click();
    }, false);

    addHandler(btnR, "click", function() {
        fileR.click();
    }, false);

    fileL.onchange = function() {
        getFilePath(G.imgL, this, null);
        G.imgL.onload = function() {
            imread(G.canvasL, G.cxtL, G.imgL, "L");
        }
    };

    fileR.onchange = function() {
        getFilePath(G.imgR, this, null);
        G.imgR.onload = function() {
            imread(G.canvasR, G.cxtR, G.imgR, "R");
        }
    };

    addHandler(ssd_l, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        SSD_L(5);
    });

    addHandler(ssd_r, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        SSD_R(5);
    });

    addHandler(ncc_l, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        NCC_L(7);
    });

    addHandler(ncc_r, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        NCC_R(7);
    });

    addHandler(asw_l, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        ASW_L(5);
    });

    addHandler(asw_r, "click", function(e) {
        e = e || window.event;
        e.preventDefault();
        ASW_R(5);
    });

    addHandler(clear_btn, "click", function(e) {
        G.result_cxt.clearRect(0, 0, G.result.width, G.result.height);
    });

    addHandler(save_btn, "click", function(e) {

        if (G.img_dataL == null || G.img_dataR == null) {
            G.tip.innerHTML = "Nothing to Save.";
            return;
        }
        var dataURL = G.result.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var filename = "result.png";

        save_btn.download = filename;
        save_btn.href = dataURL;

        /*saveFile(dataURL, filename);*/
    });
}