"use strict";
angular.module("myApp", ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    })
    .controller("appController", ["$mdDialog", "$rootScope", "$scope", appController])
    .controller("FileController", ["$scope", "$rootScope", FileController])
    .controller("LvJingController", ["$scope", "$rootScope", LvJingController])
    .controller("PSController", ["$rootScope", PSController])
    .controller("basicInfoCtrl", ["Util", "$scope", "$rootScope", basicInfoCtrl])
    .service("Util", [Util])
    .run(function($rootScope) {
        window.URL = window.URL || window.webkitURL;
        // 开启多线程
        $AI.useWorker("libs/alloyimage.1.2b.js");

        var r = $rootScope;
        r.img = document.getElementById("IMG");
        window.onload = function() {
            r.AI = AlloyImage(r.img);
            r.origin= r.AI.clone();
            r.updateImgInfo();
        };
        r.history = [];
        r.operations = [];
    });

function appController($mdDialog, $rootScope, $scope) {
    var r = $rootScope;

    r.showAlert = function(title, content) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector("#app-body")))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(content)
                .ariaLabel('Alert Dialog Demo')
                .ok('好的')
                .targetEvent()
        );
    };

    // 图片处理效果完成之后的回调函数
    r.updateHistory = function(content) {
        if (r.history.length >= 10) {
            r.history.shift();
            r.operations.shift();
        }
        r.history.push(r.AI.clone());
        r.operations.push(content);

        r.updateImgInfo();
    }
}

function FileController($scope, $rootScope) {
    var self = this;
    var img = $rootScope.img;

    // 触发隐藏input的click事件
    self.openImg = function() {
        var file = document.getElementById("file");
        if (file) {
            file.click();
        }
    };

    // 打开文件操作
    document.getElementById("file").onchange = function() {
        var files = this.files;
        if (!files.length) {
            $rootScope.showAlert("提示", "没有选择文件～");
            return;
        }
        $rootScope.history.splice(0, 10);
        $rootScope.operations.splice(0, 10);
        for (var i = 0; i < files.length; i++) {
            $rootScope.img.src = window.URL.createObjectURL(files[i]);
            $rootScope.img.onload = function() {
                $rootScope.AI = $AI(this);
                $rootScope.origin = $rootScope.AI.clone();
                $rootScope.updateImgInfo();
                window.URL.revokeObjectURL(this.src);
            }
        }
    };

    self.downloadImg = function() {
        $rootScope.showAlert("提示", "右键点击图片选择保存");
    };
    
    
    // 恢复原图
    self.recoverIMG = function() {
        $rootScope.origin.replace(img);
        $rootScope.AI = $rootScope.origin.clone();
        $rootScope.history.splice(0, 10);
        $rootScope.operations.splice(0, 10);
        $rootScope.updateImgInfo();
    };

    // 撤销
    self.Undo = function() {
        if ($rootScope.history.length <= 0) {
            $rootScope.showAlert('提示', '无法撤销了！');
            return;
        }
        if ($rootScope.history.length == 1) {
            $rootScope.history.pop();
            $rootScope.operations.pop();
            $rootScope.origin.replace($rootScope.img);
            $rootScope.AI = $rootScope.origin.clone();
        } else {
            $rootScope.history.pop();
            $rootScope.operations.pop();
            $rootScope.history.slice(-1)[0].replace($rootScope.img);
        }
        $rootScope.updateImgInfo();
    };
}

function LvJingController($scope, $rootScope) {
    var self = this;

    // 反色
    self.toReverse = function() {
        $rootScope.AI.act("toReverse").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "反色操作完成！");
            $rootScope.updateHistory("反色");
        });
    };

    // 转为灰度图像
    self.toGray = function() {
        $rootScope.AI.act("toGray").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "已转为灰度图像！");
            $rootScope.updateHistory("灰度");
        });
    };

    // 二值化
    self.toThresh = function() {
        $rootScope.AI.act("toThresh", 128).replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "二值化操作完成！");
            $rootScope.updateHistory("二值化");
        });
    };

    // 高斯模糊
    self.gaussBlur = function() {
        $rootScope.AI.act("gaussBlur", 7).replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "高斯模糊完成！");
            $rootScope.updateHistory("高斯模糊");
        });
    };

    // 锐化
    self.sharp = function() {
        $rootScope.AI.act("sharp", 2).replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "锐化操作完成！");
            $rootScope.updateHistory("锐化");
        });
    };

    // 马赛克
    self.mosaic = function() {
        $rootScope.AI.act("mosaic", 3).replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "马赛克操作完成！");
            $rootScope.updateHistory("马赛克");
        });
    };

    // 浮雕
    self.embossment = function() {
        $rootScope.AI.act("embossment").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "浮雕操作完成！");
            $rootScope.updateHistory("浮雕");
        });
    };

    // 腐蚀
    self.corrode = function() {
        $rootScope.AI.act("corrode").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "腐蚀操作完成！");
            $rootScope.updateHistory("腐蚀");
        });
    };
}

function PSController($rootScope) {
    var self = this;

    // 美肤
    self.softenFace = function() {
        $rootScope.AI.ps("softenFace").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "美肤操作完成！");
            $rootScope.updateHistory("美肤");
        });
    };

    // 素描
    self.sketch = function() {
        $rootScope.AI.ps("sketch").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "素描完成！");
            $rootScope.updateHistory("素描");
        });
    };

    // 自然增强
    self.softEnhancement = function() {
        $rootScope.AI.ps("softEnhancement").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "自然增强完成！");
            $rootScope.updateHistory("自然增强");
        });
    };

    // 紫调
    self.purpleStyle = function() {
        $rootScope.AI.ps("purpleStyle").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "紫调操作完成！");
            $rootScope.updateHistory("紫调");
        });
    };

    // 柔焦
    self.soften = function() {
        $rootScope.AI.ps("soften").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "柔焦操作完成！");
            $rootScope.updateHistory("柔焦");
        });
    };

    // 仿lomo
    self.lomo = function() {
        $rootScope.AI.ps("lomo").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "仿lomo操作完成！");
            $rootScope.updateHistory("仿lomo");
        });
    };

    // 暖秋
    self.warmAutumn = function() {
        $rootScope.AI.ps("warmAutumn").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "暖秋操作完成！");
            $rootScope.updateHistory("暖秋");
        });
    };

    // 粗糙
    self.rough = function() {
        $rootScope.AI.ps("rough").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "粗糙操作完成！");
            $rootScope.updateHistory("粗糙");
        });
    };

    // 复古
    self.vintage = function() {
        $rootScope.AI.ps("vintage").replace($rootScope.img).complete(function() {
            $rootScope.showAlert("提示", "复古操作完成！");
            $rootScope.updateHistory("复古");
        });
    };
}

function basicInfoCtrl(Util, $scope, $rootScope) {
    var r = $rootScope;
    var self = this;

    self.update = function() {
        r.updateImgInfo();
    };

    r.updateImgInfo = function() {
        r.AI.ctx(function() {
            self.ctx = this;
            var ctx = self.ctx;
            var canvas = ctx.canvas;

            r.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            self.img_width = r.imgData.width;
            self.img_height = r.imgData.height;
            self.img_data_length = self.img_width * self.img_height * 4;

            self.img_type = "彩色图像";
            var x = 0;
            var r_channel = Util.getChannel(r.imgData, "R");
            var g_channel = Util.getChannel(r.imgData, "G");
            var b_channel = Util.getChannel(r.imgData, "B");
            for (var i = 0; i < 50; i++) {
                var seed = Math.floor(Math.random() * r_channel.length);
                if (r_channel[seed] == g_channel[seed] && r_channel[seed] == b_channel[seed]) {
                    x++;
                }
            }
            if (x > 25) {
                self.img_type = "灰度图像";
            }

            setTimeout(function() {
                Util.drawHistogram(r.imgData)
            }, 500);
        });
    };
}