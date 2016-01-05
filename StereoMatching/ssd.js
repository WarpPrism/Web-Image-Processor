/**
 * Created by zhoujihao on 2016/1/3.
 */

// SSD algorithm: Sum of squared difference as the matching cost.
function SSD_L(patch_size) {
    // The max possible disparity defined by yourself.
    var d_max = 79;
    var d_min = 0;

    // 从RGBA一维数组中构建适合图像处理的二维数组（亮度值）
    var left = RGBA2Intensity(G.img_dataL);
    var right = RGBA2Intensity(G.img_dataR);
    if (left.length != right.length) {
        G.tip.innerHTML = "Left Img should be the same size as right Img.";
        return;
    }
    var height = left.length;
    var width = left[0].length;

    var output = new Array(height);
    for (var iter = 0; iter < output.length; iter++) {
        output[iter] = new Uint8Array(width);
    }

    var n = parseInt((patch_size - 1) / 2);

    for (var i = n; i < height - n; i++) {
        for (var j = n; j < width - n; j++) {
            var min_sum = 9999;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j - n - d < 0) {
                    break;
                }

                var SUM = 0.0;
                for (var u = i - n; u <= i + n; u++) {
                    for (var v = j - n; v <= j + n; v++) {
                        var temp = Math.pow((left[u][v] - right[u][v - d]), 2);
                        SUM += temp;
                    }
                }

                if (SUM <= min_sum) {
                    min_sum = SUM;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3.0;
        }
    }
    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "SSD_L Complete!";
}


// 以右图为基准，计算视差图。
function SSD_R(patch_size) {
    // The max possible disparity defined by yourself.
    var d_max = 79;
    var d_min = 0;

    // 从RGBA一维数组中构建适合图像处理的二维数组（亮度值）
    var left = RGBA2Intensity(G.img_dataL);
    var right = RGBA2Intensity(G.img_dataR);
    if (left.length != right.length) {
        G.tip.innerHTML = "Left Img should be the same size as right Img.";
        return;
    }
    var height = left.length;
    var width = left[0].length;

    var output = new Array(height);
    for (var iter = 0; iter < output.length; iter++) {
        output[iter] = new Array(width);
    }

    var n = parseInt((patch_size - 1) / 2);

    for (var i = n; i < height - n; i++) {
        for (var j = n; j < width - n; j++) {
            var min_sum = 9999;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j + n + d  >= width) {
                    break;
                }

                var SUM = 0.0;
                for (var u = i - n; u <= i + n; u++) {
                    for (var v = j - n; v <= j + n; v++) {
                        var temp = Math.pow((left[u][v + d] - right[u][v]), 2);
                        SUM += temp;
                    }
                }

                if (SUM < min_sum) {
                    min_sum = SUM;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3;
        }
    }

    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "SSD_R Complete!";
}