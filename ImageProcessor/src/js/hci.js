/**
 * Created by zhoujh on 2016/1/2.
 */

function HCI() {

    var file = document.getElementById("file");
    var openBtn = document.getElementById("openBtn");

    addHandler(openBtn, "click", function() {
        file.click();
    }, false);

    file.onchange = function() {
        getFilePath(G.img, this, null);
        G.img.onload = function() {
            imread(G.img);
        };
    };

    var chartCtx = $("#chart").get(0).getContext("2d");
    var data = {
        labels:[],
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                data : [65,59,90,81,56,55,40]
            },
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                data : [28,48,40,19,96,27,100]
            }
        ]
    };
    var myChart = new Chart(chartCtx).Bar(data);
}