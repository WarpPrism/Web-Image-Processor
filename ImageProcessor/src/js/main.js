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