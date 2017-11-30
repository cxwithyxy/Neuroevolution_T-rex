var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var playerIframe, AIIframe;
var controlAble = true;

var AINetwork = new Architect.Perceptron(11, 10, 1);

var trainingData = [];

var lastInputs = "";

/**
 * 定义按键事件
 */
var keydownEventHL = {
    "38": function ()
    {
        setTimeout(function ()
        {
            setZeroTimeout(function ()
            {
                if(playerIframe.Runner.instance_.playing){
                    var oneTrainingData = getInputOrTrainingData(playerIframe, [0]);
                    if(JSON.stringify(oneTrainingData.input) != lastInputs){
                        trainingData.push(oneTrainingData);
                        lastInputs = JSON.stringify(oneTrainingData.input);
                    }
                    setZeroTimeout(arguments.callee);
                }
            });
        }, 1000);
        pressJump(playerIframe);
        trainingData.push(getInputOrTrainingData(playerIframe, [1]));
    },
    "82": function ()
    {
        if(playerIframe.Runner.instance_.crashed){
            restart(playerIframe);
        }
    }
}

/**
 * 获取训练数据
 */
function getInputOrTrainingData(_win, outputs)
{
    var obstaclesAttr = getObstaclesAttr(_win, 0, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);

    var inputs = [
        obstaclesAttr["xPos"],
        obstaclesAttr["typeConfig"].width ? obstaclesAttr["typeConfig"].width : 0,
        obstaclesAttr["size"],
        _win.Runner.instance_.tRex.xPos,
        _win.Runner.instance_.tRex.config.WIDTH,
        obstaclesAttr["yPos"],
        obstaclesAttr["typeConfig"].height ? obstaclesAttr["typeConfig"].height : 0,
        _win.Runner.instance_.tRex.yPos,
        _win.Runner.instance_.tRex.config.HEIGHT,
        obstaclesAttr["speedOffset"],
        _win.Runner.instance_.tRex.jumping ? 1 : 0
    ];
    if(!outputs){
        return inputs;
    }
    return { input: inputs, output: outputs };
}

function AIRun()
{
    trainAINetwork();
    setTimeout(function ()
    {
        pressJump(AIIframe);
        setZeroTimeout(function ()
        {

            /**
             * 获得神经网络输出的结果
             */
            var res = AINetwork.activate(getInputOrTrainingData(AIIframe));
            
            /**
             * 结果[0]大于0.5时跳
             */
            if(res[0] > 0.5){
                pressJump(AIIframe);
            }

            var thisFun = arguments.callee;

            if(AIIframe.Runner.instance_.playing){
                setZeroTimeout(thisFun);
            }
        });
    }, 1000);
}

function trainAINetwork()
{
    AINetwork.train(trainingData, {
        log: 10,
        error: 0.03,
        iterations: 1000,
        rate: 0.3
    });
}

/**
 * 按键引导函数
 */
function keydownHL(e)
{
    if(typeof keydownEventHL[e.keyCode] != typeof UDF){
        keydownEventHL[e.keyCode]();
    }
}

setTimeout(function ()
{
    console.log("work");
    var iframes = document.getElementsByTagName('iframe');
    playerIframe = iframes[0].contentWindow;
    AIIframe = iframes[1].contentWindow;
    document.addEventListener("keydown", keydownHL);
});