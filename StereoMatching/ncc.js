/**
 * Created by zhoujh on 2016/1/6.
 */


// NCC: Normalized Cross Correlation
function NCC_L(patch_size) {
    var d_max = 79;
    var d_min = 0;

    var left = RGBA2Intensity(G.img_dataL);
    var right = RGBA2Intensity(G.img_dataR);

    var n = parseInt((patch_size - 1) / 2);

    if (left.length != right.length || left[0].length != right[0].length) {
        G.tip.innerHTML = "Left Img should be the same size as right Img.";
        return;
    }

    var height = left.length;
    var width = left[0].length;

    var output = new Array(height);
    var i = 0;
    for (; i < output.length; i++) {
        output[i] = new Uint8Array(width);
    }

    for (i = n; i < height - n; i++) {
        for (var j = n; j < width - n; j++) {
            var max_cost = 0;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j - n - d < 0) {
                    break;
                }

                var sum1 = 0, sum2 = 0, sum3 = 0;
                var cost = 0;
                for (var x = i - n; x <= i + n; x++) {
                    for (var y = j - n; y <= j + n; y++) {
                        sum1 += (left[x][y] * right[x][y - d]);
                        sum2 += Math.pow(left[x][y], 2);
                        sum3 += Math.pow(right[x][y - d], 2);
                    }
                }
                cost = sum1 / Math.sqrt(sum2 * sum3);
                if (cost >= max_cost) {
                    max_cost = cost;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3;
        }
    }

    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "NCC_L Complete!";
}

function NCC_R(patch_size) {
    var d_max = 79;
    var d_min = 0;

    var left = RGBA2Intensity(G.img_dataL);
    var right = RGBA2Intensity(G.img_dataR);

    var n = parseInt((patch_size - 1) / 2);

    if (left.length != right.length || left[0].length != right[0].length) {
        G.tip.innerHTML = "Left Img should be the same size as right Img.";
        return;
    }

    var height = left.length;
    var width = left[0].length;

    var output = new Array(height);
    var i = 0;
    for (; i < output.length; i++) {
        output[i] = new Uint8Array(width);
    }

    for (i = n; i < height - n; i++) {
        for (var j = n; j < width - n; j++) {
            var max_cost = 0;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j + n + d >= width) {
                    break;
                }

                var sum1 = 0, sum2 = 0, sum3 = 0;
                var cost = 0;
                for (var x = i - n; x <= i + n; x++) {
                    for (var y = j - n; y <= j + n; y++) {
                        sum1 += (left[x][y + d] * right[x][y]);
                        sum2 += Math.pow(right[x][y], 2);
                        sum3 += Math.pow(left[x][y + d], 2);
                    }
                }
                cost = sum1 / Math.sqrt(sum2 * sum3);
                if (cost >= max_cost) {
                    max_cost = cost;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3;
        }
    }

    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "NCC_R Complete!";
}