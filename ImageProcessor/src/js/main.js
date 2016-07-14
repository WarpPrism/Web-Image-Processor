"use strict";
angular.module("myApp", ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    })
    .controller("appController", ["Util", "$mdDialog", "$rootScope", "$scope", "$interval", appController])
    .controller("FileController", ["$scope", "$rootScope", FileController])
    .controller("BasicOpController", ["$mdDialog", "$scope", "$rootScope", BasicOpController])
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

function appController(Util, $mdDialog, $rootScope, $scope, $interval) {
    var r = $rootScope;
    var self = this;
    self.activated = false;

    r.toggleProcess = function() {
        self.activated = !self.activated;
    };

    r.showAlert = function(title, content) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector("#app-body")))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(content)
                .ariaLabel('Alert Dialog Demo')
                .ok('好的')
        );
    };

    // 图片处理效果完成之后的回调函数
    r.callback = function(content) {
        if (r.history.length >= 10) {
            r.history.shift();
            r.operations.shift();
        }
        r.history.push(r.AI.clone());
        r.operations.push(content);
        r.updateImgInfo();
    };

    self.compareDown = function() {
        r.origin.replace(r.img);
    };

    self.compareUp = function() {
        r.AI.replace(r.img);
        var btn = document.getElementById("compare-btn");
        btn.setAttribute("disabled", "disabled");
        btn.style.background = "rgb(200, 200, 200)";
        setTimeout(function() {
            console.log("OK");
            btn.removeAttribute("disabled");
            btn.style.background = "rgb(16, 108, 200)";
        }, 1000);
    };
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

function BasicOpController($mdDialog, $scope, $rootScope) {
    var self = this;
    var r = $rootScope;

    // 图片放缩
    self.resizeImg = function() {
        var confirm = $mdDialog.confirm()
            .title('图片放缩')
            .textContent('请选择放大图片还是缩小图片？')
            .ariaLabel('resize image')
            .ok('放大')
            .cancel('缩小');
        $mdDialog.show(confirm).then(function() {
            if (r.img.clientWidth < r.img.parentNode.clientWidth * 0.7) {
                r.AI.scale(1.3, 1.3).replace(r.img);
                r.callback("放大图像");
            } else {
                r.showAlert("提示", "图片已经放大到最大限度!");
            }
        }, function() {
            if (r.img.clientWidth > r.img.parentNode.clientWidth * 0.1) {
                r.AI.scale(0.7, 0.7).replace(r.img);
                r.callback("缩小图像");
            } else {
                r.showAlert("提示", "图片已经缩小到最小限度!");
            }
        });
    };

    // 顺时针，逆时针旋转
    self.rotateImgC = function() {
        r.AI.rotate(90).replace(r.img);
        r.callback("顺时针旋转90度");
    };
    self.rotateImgA = function() {
        r.AI.rotate(-90).replace(r.img);
        r.callback("逆时针旋转90度");
    };
}

function LvJingController($scope, $rootScope) {
    var self = this;
    var r = $rootScope;

    // 反色
    self.toReverse = function() {
        r.AI.act("toReverse").replace(r.img).complete(function() {
            r.showAlert("提示", "反色操作完成！");
            r.callback("反色");
        });
    };

    // 转为灰度图像
    self.toGray = function() {
        r.AI.act("toGray").replace(r.img).complete(function() {
            r.showAlert("提示", "已转为灰度图像！");
            r.callback("灰度");
        });
    };

    // 二值化
    self.toThresh = function() {
        r.AI.act("toThresh", 128).replace(r.img).complete(function() {
            r.showAlert("提示", "二值化操作完成！");
            r.callback("二值化");
        });
    };

    // 高斯模糊
    self.gaussBlur = function() {
        r.AI.act("gaussBlur", 7).replace(r.img).complete(function() {
            r.showAlert("提示", "高斯模糊完成！");
            r.callback("高斯模糊");
        });
    };

    // 锐化
    self.sharp = function() {
        r.AI.act("sharp", 2).replace(r.img).complete(function() {
            r.showAlert("提示", "锐化操作完成！");
            r.callback("锐化");
        });
    };

    // 马赛克
    self.mosaic = function() {
        r.AI.act("mosaic", 3).replace(r.img).complete(function() {
            r.showAlert("提示", "马赛克操作完成！");
            r.callback("马赛克");
        });
    };

    // 浮雕
    self.embossment = function() {
        r.AI.act("embossment").replace(r.img).complete(function() {
            r.showAlert("提示", "浮雕操作完成！");
            r.callback("浮雕");
        });
    };

    // 腐蚀
    self.corrode = function() {
        r.AI.act("corrode").replace(r.img).complete(function() {
            r.showAlert("提示", "腐蚀操作完成！");
            r.callback("腐蚀");
        });
    };
}

function PSController($rootScope) {
    var self = this;
    var r = $rootScope;

    // 美肤
    self.softenFace = function() {
        r.toggleProcess();
        r.AI.ps("softenFace").replace(r.img).complete(function() {
            r.showAlert("提示", "美肤操作完成！");
            r.callback("美肤");
            r.toggleProcess();
        });
    };

    // 素描
    self.sketch = function() {
        r.toggleProcess();
        r.AI.ps("sketch").replace(r.img).complete(function() {
            r.showAlert("提示", "素描完成！");
            r.callback("素描");
            r.toggleProcess();
        });
    };

    // 自然增强
    self.softEnhancement = function() {
        r.AI.ps("softEnhancement").replace(r.img).complete(function() {
            r.showAlert("提示", "自然增强完成！");
            r.callback("自然增强");
        });
    };

    // 紫调
    self.purpleStyle = function() {
        r.toggleProcess();
        r.AI.ps("purpleStyle").replace(r.img).complete(function() {
            r.showAlert("提示", "紫调操作完成！");
            r.callback("紫调");
            r.toggleProcess();
        });
    };

    // 柔焦
    self.soften = function() {
        r.AI.ps("soften").replace(r.img).complete(function() {
            r.showAlert("提示", "柔焦操作完成！");
            r.callback("柔焦");
        });
    };

    // 仿lomo
    self.lomo = function() {
        r.toggleProcess();
        r.AI.ps("lomo").replace(r.img).complete(function() {
            r.showAlert("提示", "仿lomo操作完成！");
            r.callback("仿lomo");
            r.toggleProcess();
        });
    };

    // 暖秋
    self.warmAutumn = function() {
        r.toggleProcess();
        r.AI.ps("warmAutumn").replace(r.img).complete(function() {
            r.showAlert("提示", "暖秋操作完成！");
            r.callback("暖秋");
            r.toggleProcess();
        });
    };

    // 粗糙
    self.rough = function() {
        r.toggleProcess();
        r.AI.ps("rough").replace(r.img).complete(function() {
            r.showAlert("提示", "粗糙操作完成！");
            r.callback("粗糙");
            r.toggleProcess();
        });
    };

    // 木雕
    self.carveStyle = function() {
        r.toggleProcess();
        r.AI.ps("carveStyle").replace(r.img).complete(function() {
            r.showAlert("提示", "木雕操作完成！");
            r.callback("木雕");
            r.toggleProcess();
        });
    };

    // 复古
    self.vintage = function() {
        r.toggleProcess();
        r.AI.ps("vintage").replace(r.img).complete(function() {
            r.showAlert("提示", "复古操作完成！");
            r.callback("复古");
            r.toggleProcess();
        });
    };
}

function basicInfoCtrl(Util, $scope, $rootScope) {
    var r = $rootScope;
    var self = this;

    self.update = function() {
        Util.throttle(r.updateImgInfo, 1000);
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
                Util.drawHistogram(r.imgData);
            }, 100);
        });
    };
}