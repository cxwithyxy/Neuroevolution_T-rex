var ProjectName = 'Neuroevolution_T-rex_neataptic_v1.0';

/**
 * 映射neataptic模块中的类
 */

var gameLib = require("./gameLib.js");
var setZeroTimeout = require("./zeroTimeout.js");
var controllerAINetwork = require("./contorllerAI.js");

var neataptic = require("./neataptic.js");

var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

/**
 * 设定小恐龙的数据输入和输出数目
 */
var inputNum = 4;
var outputNum = 3;

/**
 * 初始化基础神经网络
 */
var startNetwork = new Architect.Perceptron(inputNum, inputNum + outputNum, outputNum);

var popsize = 50;

/**
 * 初始化遗传进化神经网络
 */
var neat = new Neat(
    inputNum,
    outputNum,
    function (_network)
    {
        return _network.score;
    },
    {
        popsize: popsize,
        mutation: [Methods.mutation.MOD_WEIGHT],
        // selection: Methods.selection.POWER,
        mutationRate: 0.5,
        mutationAmount: Math.round(popsize*0.5),
        // fitnessPopulation: true,
        network: startNetwork,
        elitism: Math.round(popsize*0.2)
    }
);

/**
 * 初始化小恐龙死亡列表
 */
var G_deaded = [];

/**
 * 初始化整体最高分
 */
var HighestScore = 0;

setTimeout(function ()
{
    /**
     * 创建对应数目的小恐龙游戏iframe
     */
    gameLib.createIframe(neat.population.length);

    setTimeout(function ()
    {
        /**
         * 让游戏启动起来
         */
        gameLib.eachIframe(function (_win){
            gameLib.pressJump(_win);
        });

        setZeroTimeout(function (){
            gameLib.eachIframe(function (_win, _index){

                /**
                 * 当小恐龙游戏结束时进行对神经网络进行打分
                 * 同时记录游戏最高分
                 */
                if(_win.Runner.instance_.crashed){
                    if(G_deaded.indexOf(_index) == -1){
                        neat.population[_index].score = Math.ceil(_win.Runner.instance_.distanceRan);
                        var tempHighestScore = Number(_win.Runner.instance_.distanceMeter.digits.join(""));
                        if(tempHighestScore > HighestScore){
                            HighestScore = tempHighestScore;
                        }
                        G_deaded.push(_index);
                    }
                    return;
                }

                /**
                 * 获取小恐龙游戏的第一个障碍物
                 */
                var obstaclesAttr = gameLib.getObstaclesAttr(_win, 0, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);

                /**
                 * 构建输入给神经网络的数据
                 */
                
                var obstaclesWidth = 0;
                if(obstaclesAttr["typeConfig"].width){
                    obstaclesWidth = obstaclesAttr["typeConfig"].width * obstaclesAttr["size"];
                }

                var obstaclesHeight = 0;
                if(obstaclesAttr["typeConfig"].height){
                    obstaclesHeight = obstaclesAttr["typeConfig"].height;
                }
                
                var inputs = [
                    obstaclesAttr["xPos"] / 450,
                    obstaclesWidth / 450,
                    obstaclesAttr["yPos"] / 160,
                    obstaclesHeight / 160,
                ];

                /**
                 * 获得神经网络输出的结果,小恐龙大脑对当前状态的判断,目标状态应该是如何的
                 */
                var res = neat.population[_index].activate(inputs);
                
                var nowState = [
                    _win.Runner.instance_.tRex.jumping ? 1 : 0,
                    !_win.Runner.instance_.tRex.ducking && !_win.Runner.instance_.tRex.jumping ? 1 : 0,
                    _win.Runner.instance_.tRex.ducking ? 1 : 0,
                ];

                /**
                 * 让controllerAI进行操作,就是小恐龙的手,判断到达目标状态应该进行怎么的操作
                 * @type {[type]}
                 */
                var controllerAIInput = res.concat(nowState);

                var controllerAIOutput = controllerAINetwork.activate(controllerAIInput);

                if(controllerAIInput[2] > 0.5){
                    gameLib.downDuck(_win);
                }
                
                if(
                    controllerAIInput[1] > 0.5 
                    && _win.Runner.instance_.tRex.ducking
                    && !_win.Runner.instance_.tRex.jumping
                ){
                    gameLib.upDuck(_win);
                }

                if(controllerAIInput[0] > 0.5){
                    gameLib.pressJump(_win);
                }


            });

            var thisFun = arguments.callee;

            /**
             * 所有小恐龙游戏结束时(全死了)
             * 进行遗传和进化突变来诞生下一代
             */
            if(gameLib.isAllEnd()){
                neat.evolve().then(function ()
                {
                    console.log("第" + neat.generation + "代  ----  最高分 " + HighestScore);
                    G_deaded = [];
                    gameLib.eachIframe(function (_win, _index){
                         gameLib.restart(_win);
                    });
                    HighestScore = 0;
                    setZeroTimeout(thisFun);
                });
            }else{
                setZeroTimeout(thisFun);
            }

        });

    }, 8000);
});