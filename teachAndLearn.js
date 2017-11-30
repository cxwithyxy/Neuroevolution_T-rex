var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var playerIframe, AIIframe, clogDom;

var AINetwork = new Architect.Perceptron(1, 6, 1);

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
            setTimeout(function ()
            {
                if(playerIframe.Runner.instance_.playing){
                    if(!playerIframe.Runner.instance_.tRex.jumping){
                        var oneTrainingData = getInputOrTrainingData(playerIframe, [0]);
                        if(!oneTrainingData.input[0]){
                            return;
                        }
                        if(JSON.stringify(oneTrainingData.input) != lastInputs){
                            trainingData.push(oneTrainingData);
                            lastInputs = JSON.stringify(oneTrainingData.input);
                        }
                    }
                    setTimeout(arguments.callee, 800);
                }
            }, 800);
        }, 2200);
        if(playerIframe.Runner.instance_.playing){
            trainingData.push(getInputOrTrainingData(playerIframe, [1]));
        }
        pressJump(playerIframe);
    },
    "40": function ()
    {
        if(!playerIframe.Runner.instance_.tRex.jumping){
            trainingData.push(getInputOrTrainingData(playerIframe, [0]));
        }
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
        obstaclesAttr["xPos"] / 600
    ];
    if(!outputs){
        return inputs;
    }
    return { input: inputs, output: outputs };
}

function AIRun()
{
    if(trainingData.length == 0){
        alert("还没有训练数据，请操作左边小恐龙游戏以产生训练数据");
        return;
    }
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
            }else{
                clogDom.innerHTML = '<li class="list-group-item">' 
                    + "AI操作结束了，你可以刷新页面重头再来"
                    + '</li>';
            }
        });
    }, 1000);
}

function trainAINetwork()
{
    var killDataNum = Math.round(trainingData.length * 1 /10 / 2);
    trainingData.splice(0, killDataNum);
    trainingData.splice(-killDataNum, killDataNum);

    var trainRes = AINetwork.train(trainingData, {
        log: 100,
        error: 0.004,
        iterations: 5000,
        rate: 0.5
    });
    console.log(trainRes);
    return trainRes;
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
    clogDom = document.getElementById("clog");
    var iframes = document.getElementsByTagName('iframe');
    playerIframe = iframes[0].contentWindow;
    AIIframe = iframes[1].contentWindow;
    document.addEventListener("keydown", keydownHL);
});


// var oldClog = console.log;
// console.log = function ()
// {
//     oldClog.apply(console, arguments);
//     var lll = [];
//     for(var i in arguments){
//         if(!isNaN(Number(i))){
//             lll.push(arguments[i])
//         }
//     }
//     clogDom.innerHTML += '<li class="list-group-item">' + JSON.stringify(lll.join(" ")) + '</li>';
// }