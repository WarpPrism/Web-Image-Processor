/**
 * Created by zhoujh on 2016/1/3.
 */

var init = function() {
    G = {
        name: "Global Space"
    };
    G.canvasL = document.getElementById("canvasL");
    G.cxtL = G.canvasL.getContext("2d");
    G.canvasR = document.getElementById("canvasR");
    G.cxtR = G.canvasR.getContext("2d");

    G.result = document.getElementById("result");
    G.result_cxt = G.result.getContext("2d");

    G.imgL = new Image();
    G.imgR = new Image();
    G.img_dataL = null;
    G.img_dataR = null;
    G.tip = document.getElementById("tip");

    resizeCanvas(G.canvasL, 400, 300);
    resizeCanvas(G.canvasR, 400, 300);
    resizeCanvas(G.result, 400, 300);

    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("chrome") != -1 && ua.indexOf("edge") == -1) {
        G.tip.innerHTML = "UserAgent is Chrome!";
    } else {
        alert("请使用Chrome浏览器打开, 以防浏览器崩溃");
    }

    if (ua.indexOf("firefox") != -1) {
        G.tip.innerHTML = "UserAgent is Firefox!";
    }

    G.imgL.src = "./example/view1.png";
    G.imgR.src = "./example/view5.png";
    G.imgL.onload = function() {
        imread(G.canvasL, G.cxtL, G.imgL, "L");
    };
    G.imgR.onload = function() {
        imread(G.canvasR, G.cxtR, G.imgR, "R");
    };
};

$(function() {
    init();
    HCI();
}());
