/**
 * Created by zhoujh on 2016/1/2.
 */

function getRChannel() {
    var output = [];
    if (G.img_data == null) {
        console.log("No ImageData");
    }
    for (var i = 0; i < G.img_data.data.length; i+=4) {
        output.push(G.img_data.data[i]);
    }
    return output;
}

function getGChannel() {
    var output = [];
    if (G.img_data == null) {
        console.log("No ImageData");
    }
    for (var i = 1; i < G.img_data.data.length; i+=4) {
        output.push(G.img_data.data[i]);
    }
    return output;
}

function getBChannel() {
    var output = [];
    if (G.img_data == null) {
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

