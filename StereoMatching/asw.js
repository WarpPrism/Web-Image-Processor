/**
 * Created by zhoujihao on 2016/1/3.
 */

function RGB2LAB(R, G, B) {
    // 算法参考：
    // http://www.cnblogs.com/hrlnw/p/4126017.html
    var var_R = parseFloat( R / 255.0 );        //R from 0 to 255
    var var_G = parseFloat( G / 255.0 );        //G from 0 to 255
    var var_B = parseFloat( B / 255.0 );        //B from 0 to 255

    // gamma RGB
    if ( var_R > 0.04045 ) {
        var_R = Math.pow(( ( var_R + 0.055 ) / 1.055 ) , 2.4);
    } else {
        var_R = var_R / 12.92;
    }
    if ( var_G > 0.04045 ) {
        var_G = Math.pow(( ( var_G + 0.055 ) / 1.055 ) , 2.4);
    } else {
        var_G = var_G / 12.92;
    }
    if ( var_B > 0.04045 ) {
        var_B = Math.pow(( ( var_B + 0.055 ) / 1.055 ) , 2.4);
    } else {
        var_B = var_B / 12.92;
    }

    var_R = var_R * 100;
    var_G = var_G * 100;
    var_B = var_B * 100;

    //Observer. = 2°, Illuminant = D65
    var x = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
    var y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
    var z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

    // XYZ -> LAB
    var ref_X =  95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var var_X = x / ref_X;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
    var var_Y = y / ref_Y;          //ref_Y = 100.000
    var var_Z = z / ref_Z;          //ref_Z = 108.883

    if ( var_X > 0.008856 ) {
        var_X = Math.pow(var_X , ( 1/3 ));
    } else {
        var_X = ( 7.787 * var_X ) + ( 4 / 29 );
    }
    if ( var_Y > 0.008856 ) {
        var_Y = Math.pow(var_Y , ( 1/3 ));
    } else {
        var_Y = ( 7.787 * var_Y ) + ( 4 / 29 );
    }
    if ( var_Z > 0.008856 ) {
        var_Z = Math.pow(var_Z , ( 1/3 ));
    } else {
        var_Z = ( 7.787 * var_Z ) + ( 4 / 29 );
    }

    // 保留小数点后三位
    var CIE_L = (( 116 * var_Y ) - 16);
    var CIE_a = (500 * ( var_X - var_Y ));
    var CIE_b = (200 * ( var_Y - var_Z ));

    return [CIE_L, CIE_a, CIE_b];

    /*return [parseInt(CIE_L), parseInt(CIE_a), parseInt(CIE_b)];*/
}

function getLabDistance(target, center) {
    // 把RGB模型转换为 CIELab 色彩模型 并计算 两个像素点在这种模型下的距离.

    var Rt = target[0];
    var Gt = target[1];
    var Bt = target[2];

    var Rc = center[0];
    var Gc = center[1];
    var Bc = center[2];

    /*var lab_T = RGB2LAB(Rt, Gt, Bt);
    var lab_C = RGB2LAB(Rc, Gc, Bc);
    var Lt = lab_T[0];
    var at = lab_T[1];
    var bt = lab_T[2];

    var Lc = lab_C[0];
    var ac = lab_C[1];
    var bc = lab_C[2];
    var distance = Math.sqrt( Math.pow((Lt - Lc), 2) + Math.pow((at - ac), 2) + Math.pow((bt - bc), 2) );*/

    var distance = Math.sqrt( Math.pow((Rt - Rc), 2) + Math.pow((Gt - Gc), 2) + Math.pow((Bt - Bc), 2) );

    return distance;
}

function ASW_L(patch_size) {
    // The max possible disparity defined by yourself.
    var d_max = 79;
    var d_min = 0;

    // 从 canvas 一维的 ImageData 中构建三维的RGB data
    var left = RGBATo3dimRGB(G.img_dataL);
    var right = RGBATo3dimRGB(G.img_dataR);
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
            var min_cost = 99999;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j - n - d < 0) {
                    break;
                }

                var cost;
                var sum1 = 0.0, sum2 = 0.0;
                for (var h = i - n; h <= i + n; h++) {
                    for (var w = j - n; w <= j + n; w++) {
                        // 忽略中心点？
                        var delta_g = Math.sqrt(Math.pow((h - i), 2) + Math.pow((w - j), 2));
                        var delta_c_L = getLabDistance(left[h][w], left[i][j]);
                        var delta_c_R = getLabDistance(right[h][w - d], right[i][j - d]);

                        var wL = Math.exp((-delta_g) / 7 - (delta_c_L) / 7); // γp = 7 γc = 7
                        var wR = Math.exp((-delta_g) / 7 - (delta_c_R) / 7); // γp = 7 γc = 7
                        var e = Math.abs(left[h][w][0] - right[h][w - d][0])
                                + Math.abs(left[h][w][1] - right[h][w - d][1])
                                + Math.abs(left[h][w][2] - right[h][w - d][2]);

                        sum1 += wL * wR * e;
                        sum2 += wL * wR;
                    }
                }

                cost = parseFloat(sum1 / sum2);
                if (cost < min_cost) {
                    min_cost = cost;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3;
        }
    }

    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "ASW_L Complete!";

}

function ASW_R(patch_size) {
    // The max possible disparity defined by yourself.
    var d_max = 79;
    var d_min = 0;

    // 从 canvas 一维的 ImageData 中构建三维的RGB data
    var left = RGBATo3dimRGB(G.img_dataL);
    var right = RGBATo3dimRGB(G.img_dataR);
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
            var min_cost = 99999;
            var final_disparity = d_min;

            for (var d = d_min; d <= d_max; d++) {
                if (j + n + d >= width) {
                    break;
                }

                var cost;
                var sum1 = 0.0, sum2 = 0.0;
                for (var h = i - n; h <= i + n; h++) {
                    for (var w = j - n; w <= j + n; w++) {
                        // 忽略中心点？
                        var delta_g = Math.sqrt(Math.pow((h - i), 2) + Math.pow((w - j), 2));
                        var delta_c_L = getLabDistance(left[h][w + d], left[i][j + d]);
                        var delta_c_R = getLabDistance(right[h][w], right[i][j]);

                        var wL = Math.exp((-delta_g) / 7 - (delta_c_L) / 7); // γp = 7 γc = 7
                        var wR = Math.exp((-delta_g) / 7 - (delta_c_R) / 7); // γp = 7 γc = 7
                        var e = Math.abs(left[h][w + d][0] - right[h][w][0])
                            + Math.abs(left[h][w + d][1] - right[h][w][1])
                            + Math.abs(left[h][w + d][2] - right[h][w][2]);

                        sum1 += wL * wR * e;
                        sum2 += wL * wR;
                    }
                }

                cost = parseFloat(sum1 / sum2);
                if (cost < min_cost) {
                    min_cost = cost;
                    final_disparity = d;
                }
            }

            output[i][j] = final_disparity * 3;
        }
    }

    showGrayImgFrom2dimArray(output);
    G.tip.innerHTML = "SSD_R Complete!";

}