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