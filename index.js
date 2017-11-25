var ProjectName = 'Neuroevolution_T-rex_v1.0.1';
/**
 * 神经网络初始化
 */
var Neuvol = new Neuroevolution({
    population:50,
    network:[12, [10], 2],
    mutationRate: 0.5,
    nbChild:2,
    // randomBehaviour: 0.8
});;

/**
 * 创建第一代神经元
 */
var G = null;

if(localStorage.getItem(ProjectName)){
    var savingData = JSON.parse(localStorage.getItem(ProjectName));
    G = Neuvol.nextGeneration(savingData);
    console.log('loaded');
}else{
    G = Neuvol.nextGeneration();
}

var generationCount= 1;

/**
 * 初始化死亡列表
 */
var G_deaded = [];

var HighestScore = 0;


setTimeout(function (){
    
    createIframe(G.length);
    
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
                                Neuvol.networkScore(G[_index], Math.ceil(_win.Runner.instance_.distanceRan));
                                G_deaded.push(_index);
                                var tempHighestScore = Number(_win.Runner.instance_.distanceMeter.digits.join(""));
                                if(tempHighestScore > HighestScore){
                                    HighestScore = tempHighestScore;
                                }
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
                         * 构建输入数据
                         * 这个就是AI能看到的数据
                         * 这些数据会很大程度上影响到AI的决策
                         */
                        var inputs = [
                            obstaclesAttr["xPos"],
                            obstaclesAttr["typeConfig"].width,
                            obstaclesAttr["size"],
                            _win.Runner.instance_.tRex.xPos,
                            _win.Runner.instance_.tRex.config.WIDTH,
                            obstaclesAttr["yPos"],
                            obstaclesAttr["typeConfig"].height,
                            _win.Runner.instance_.tRex.yPos,
                            _win.Runner.instance_.tRex.config.HEIGHT,
                            obstaclesAttr["speedOffset"],
                            _win.Runner.instance_.tRex.jumping ? 1 : 0,
                            Math.ceil(_win.Runner.instance_.distanceRan)
                        ];

                        var res = G[_index].compute(inputs);
                        if(res[0] > 0.5){
                            pressJump(_win);
                        }
                        if(res[1] > 0.5){
                            pressDuck(_win);
                        }


                    });

                    /**
                     * 判断是不是游戏已经都结束了
                     * 要是都死光了,那就开启新的一代重新开始游戏
                     * 当然新的一代会继承上一代的东西,因此一代比一代聪明
                     */
                    if(isAllEnd()){
                        console.log("第" + generationCount + "代  ----  最高分 " + HighestScore);
                        G = Neuvol.nextGeneration();

                        var savingData = [];
                        for(var i = 0; i < G.length; i++){
                            savingData.push(G[i].getSave());
                        }
                        localStorage.setItem(ProjectName, JSON.stringify(savingData));

                        G_deaded = [];
                        eachIframe(function (_win, _index){
                             restart(_win);
                        });
                        generationCount ++;
                    }

                    setZeroTimeout(arguments.callee);
                });

            },500)
            
        },
        10000
    )
},500);