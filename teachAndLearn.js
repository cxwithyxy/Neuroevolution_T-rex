var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var playerIframe, AIIframe;
var controlAble = true;

var AINetwork = new Architect.Perceptron(12, 10, 1);

var keydownEventHL = {
    "38": function ()
    {
        pressJump(playerIframe);

        var obstaclesAttr = getObstaclesAttr(playerIframe, 0, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);
        var inputs = [
            obstaclesAttr["xPos"],
            obstaclesAttr["typeConfig"].width ? obstaclesAttr["typeConfig"].width : 0,
            obstaclesAttr["size"],
            playerIframe.Runner.instance_.tRex.xPos,
            playerIframe.Runner.instance_.tRex.config.WIDTH,
            obstaclesAttr["yPos"],
            obstaclesAttr["typeConfig"].height ? obstaclesAttr["typeConfig"].height : 0,
            playerIframe.Runner.instance_.tRex.yPos,
            playerIframe.Runner.instance_.tRex.config.HEIGHT,
            obstaclesAttr["speedOffset"],
            playerIframe.Runner.instance_.tRex.jumping ? 1 : 0,
            Math.ceil(playerIframe.Runner.instance_.distanceRan)
        ];
        console.log(inputs);

    },
    "82": function ()
    {
        if(playerIframe.Runner.instance_.crashed){
            restart(playerIframe);
        }
    }
}

function keydownHL(e)
{
    // console.log(e.keyCode);
    if(typeof keydownEventHL[e.keyCode] != typeof UDF){
        keydownEventHL[e.keyCode]();
    }
}

function onStartGame()
{
    if(playerIframe.Runner.instance_.crashed){
        restart(playerIframe);
    }else{
        pressJump(playerIframe);
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