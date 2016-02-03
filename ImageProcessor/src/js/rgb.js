/**
 * Created by zhoujh on 2016/1/2.
 */

function getRChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 0; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function getGChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 1; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function getBChannel(T) {
    var output = [];
    if (T.img_data === null) {
        console.log("No ImageData");
    }
    for (var i = 2; i < T.img_data.data.length; i+=4) {
        output.push(T.img_data.data[i]);
    }
    return output;
}

function showRedImg(T) {
    var red = getRChannel(T);
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

function showGreenImg(T) {
    var green = getGChannel(T);
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

function showBlueImg(T) {
    var blue = getBChannel(T);
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

