var ProjectName = 'Neuroevolution_T-rex';
/**
 * 神经网络初始化
 */

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var population= 1;

/**
 * 创建第一代神经元
 */
var G = [];

for(var i = 0; i < population; i++){
    G.push(new Architect.Perceptron(2, 6, 1));
    // G.push(new Architect.Liquid(16, 160, 1, 240, 16*5));
}

/**
 * 初始化死亡列表
 */
var G_deaded = [];

iframeList = [];

/**
 * 操控每一个iframe
 */
function eachIframe(_do)
{
    for(var i = 0; i < iframeList.length; i++){
    _do(iframeList[i].contentWindow, i);
    }
}

/**
 * 让对应iframe的小恐龙跳起来
 */
function pressJump(_win)
{
    _win.Runner.instance_.onKeyDown(
        {
            keyCode: 38,
            target: 1
        }
    );
}

/**
 * 重启某个iframe的小恐龙游戏
 */
function restart(_win)
{
    _win.Runner.instance_.onKeyUp(
        {
            type: "mouseup",
            target: _win.Runner.instance_.canvas,
            button: 1
        }
    );
}

/**
 * 判断是不是所有iframe的小恐龙游戏都结束了
 */
function isAllEnd(){
    var alive = false;
    eachIframe(function (_win){
        if(!_win.Runner.instance_.crashed){
            alive = true;
        }
    });
    return !alive;
}

/**
 * 获取障碍物的一些属性,要是没有这个障碍物的话,所有属性都返回0
 */
function getObstaclesAttr(_win, _index, _attrs)
{
    var lenOfAttrs = _attrs.length;
    var attrObj = {};
    for(var i = 0; i < lenOfAttrs; i++){
        var theRes = 0;
        if(typeof _win.Runner.instance_.horizon.obstacles[_index] != typeof UDFUDFUDF){
            var theObstacle = _win.Runner.instance_.horizon.obstacles[_index];
            theRes = theObstacle[_attrs[i]];
        }
        attrObj[_attrs[i]] = theRes;
    }
    return attrObj;
}

setTimeout(function (){
    var body = document.getElementsByTagName('body')[0];
    for(var i = 0; i < G.length; i++){
        var ifff = document.createElement('iframe');
        ifff.src="game.html";
        ifff.setAttribute("frameborder","0");
        iframeList.push(ifff);
        body.appendChild(ifff);
    }
    setTimeout(
        function ()
        {

            /**
             * 摁一下跳键,让游戏启动
             */
            eachIframe(function (_win){
                pressJump(_win);
            });

            setTimeout(function ()
            {

                /**
                 * 这个setZeroTimeout
                 * 就是以最快速度给AI做一次决策
                 */
                setZeroTimeout(function (){
                    eachIframe(function (_win, _index){

                        /**
                         * 判断是不是死了
                         */
                        if(_win.Runner.instance_.crashed){

                            /**
                             * 要是死了的话
                             * 就死的那一次让那个神经元拿一次得分好了,注意,是死的时候才给它分
                             */
                            if(G_deaded.indexOf(_index) == -1){
                                G[_index].propagate(0.3, 
                                    [
                                        Math.ceil(_win.Runner.instance_.distanceRan)
                                    ]
                                );
                                G_deaded.push(_index);
                            }
                            return;
                        }

                        if(!_win.Runner.instance_.tRex.yPos || !_win.Runner.instance_.tRex.xPos){
                            return;
                        }

                        /**
                         * 拿障碍物的几个属性
                         */
                        var obstaclesAttr = getObstaclesAttr(_win, 0, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);

                        /**
                         * 假如障碍物在后面的话,那没必要管了
                         */
                        if(obstaclesAttr["xPos"] <= _win.Runner.instance_.tRex.xPos){
                            return;
                        }

                        /**
                         * 假如小恐龙还在空中的话,那就不用想着要不要跳的事情了
                         */
                        if(_win.Runner.instance_.tRex.jumping){
                            return;
                        }

                        /**
                         * 构建输入数据
                         * 这个就是AI能看到的数据
                         * 这些数据会很大程度上影响到AI的决策
                         */
                        var inputs = [
                            (obstaclesAttr["xPos"] + obstaclesAttr["typeConfig"].width * obstaclesAttr["size"]) / _win.Runner.instance_.tRex.xPos,
                            ((obstaclesAttr["yPos"] + obstaclesAttr["typeConfig"].height) / _win.Runner.instance_.tRex.yPos) < 1 ? 0 : 1
                        ];

                        // if(G_deaded.length == 49 && inputs[1] < 1){
                        //     console.log("bird");
                        // }

                        /**
                         * 拿到AI自己分析后的结果数据,就是AI的决策结果
                         * 至于为什么是大于0.5才跳,那是我看那个神经网络版像素鸟抄过来的,反正我不懂
                         */
                        var res = G[_index].activate(inputs)[0];
                        if(res > 0.5){
                            pressJump(_win);
                        }

                    });

                    /**
                     * 判断是不是游戏已经都结束了
                     * 要是都死光了,那就开启新的一代重新开始游戏
                     * 当然新的一代会继承上一代的东西,因此一代比一代聪明
                     */
                    if(isAllEnd()){
                        G_deaded = [];
                        eachIframe(function (_win, _index){
                             restart(_win);
                        })
                    }

                    setZeroTimeout(arguments.callee);
                });

            },1000)
            
        },
        10000
    )
},500);