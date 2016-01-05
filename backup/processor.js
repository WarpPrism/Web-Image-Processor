/**
 * Created by zhoujihao on 15-10-24.
 */

function RGBAToGray(src_matrix) {
    if (src_matrix.type === "CV_RGBA" && src_matrix != null) {
        var row = src_matrix.row;
        var col = src_matrix.col;
        var dst_matrix = new Matrix(row, col);
        var dstdata = dst_matrix.data,
            srcdata = src_matrix.data;
        for (var iter = 0; iter < srcdata.length - 3; iter += 4) {
            var R = srcdata[iter];
            var G = srcdata[iter + 1];
            var B = srcdata[iter + 2];
            var A = srcdata[iter + 3];
            var gray = 0.299 * R + 0.587 * G + 0.114 * B;
            for (var i = 0; i < 3; i++) {
                dstdata[iter + i] = gray;
            }
            dstdata[iter + 3] = A;
        }
    } else {
        return src_matrix;
    }
    return dst_matrix;
}

function To2Level(src_matrix) {
    if (src_matrix != null) {
        var row = src_matrix.row;
        var col = src_matrix.col;
        var dst_matrix = new Matrix(row, col);

        var dstdata = dst_matrix.data;
        var srcdata = src_matrix.data;

        for (var iter = 0; iter < srcdata.length - 3; iter += 4) {
            var R = srcdata[iter];
            var G = srcdata[iter + 1];
            var B = srcdata[iter + 2];
            var A = srcdata[iter + 3];
            var value;
            if (0.299 * R + 0.587 * G + 0.114 * B > 130) {
                value = 255;
            } else {
                value = 0;
            }
            for (var i = 0; i < 3; i++) {
                dstdata[iter + i] = value;
            }
            dstdata[iter + 3] = 255;
        }
    } else {
        return src_matrix;
    }
    return dst_matrix;
}