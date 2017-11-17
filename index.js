var Neuvol = new Neuroevolution({
    population:50,
    network:[2, [2], 1],
    nbChild:30
});;

var G = Neuvol.nextGeneration();
iframeList = [];

function eachIframe(_do){
    if(!iframeList){
        iframeList = document.getElementsByTagName('iframe');
    }
    for(var i = 0; i < iframeList.length; i++){
        _do(iframeList[i].contentWindow, i);
    }
}

function pressJump(_win)
{
    _win.Runner.instance_.onKeyDown(
        {
            keyCode: 38,
            target: 1
        }
    );
}

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

function isAllEnd(){
    var alive = false;
    eachIframe(function (_win){
        if(!_win.Runner.instance_.crashed){
            alive = true;
        }
    });
    return !alive;
}



setTimeout(function (){
    var body = document.getElementsByTagName('body')[0];
    for(var i = 0; i < G.length; i++){
        var ifff = document.createElement('iframe');
        ifff.src="game.html";
        ifff.frameborder="0";
        iframeList.push(ifff);
        body.appendChild(ifff);
    }
    setTimeout(
        function ()
        {
            eachIframe(function (_win){
                pressJump(_win);
            });

            setTimeout(function ()
            {
                setInterval(
                    function ()
                    {
                        eachIframe(function (_win, _index){
                            var hitObj_1_x = 0;
                            var hitObj_1_y = 0;
                            var hitObj_1_size = 0;
                            var hitObj_1_speed = 0;
                            if(_win.Runner.instance_.horizon.obstacles.length > 0){
                                hitObj_1_x = _win.Runner.instance_.horizon.obstacles[0].xPos;
                                hitObj_1_y = _win.Runner.instance_.horizon.obstacles[0].yPos;
                                hitObj_1_size = _win.Runner.instance_.horizon.obstacles[0].size;
                                hitObj_1_speed = _win.Runner.instance_.horizon.obstacles[0].speedOffset;
                            }
                            var hitObj_2_x = 0;
                            var hitObj_2_y = 0;
                            var hitObj_2_size = 0;
                            var hitObj_2_speed = 0;
                            if(_win.Runner.instance_.horizon.obstacles.length > 1){
                                hitObj_2_x = _win.Runner.instance_.horizon.obstacles[1].xPos;
                                hitObj_2_y = _win.Runner.instance_.horizon.obstacles[1].yPos;
                                hitObj_2_size = _win.Runner.instance_.horizon.obstacles[1].size;
                                hitObj_2_speed = _win.Runner.instance_.horizon.obstacles[1].speedOffset;
                            }
                            
                            var inputs = [
                                hitObj_1_x,
                                hitObj_1_y,
                                hitObj_1_size,
                                hitObj_1_speed,
                                hitObj_2_x,
                                hitObj_2_y,
                                hitObj_2_size,
                                hitObj_2_speed,
                                _win.Runner.instance_.tRex.xPos,
                                _win.Runner.instance_.tRex.yPos
                            ];
                            var res = G[_index].compute(inputs);
                            if(res > 0.5){
                                pressJump(_win);
                            }

                            if(_win.Runner.instance_.crashed){
                                Neuvol.networkScore(G[_index], Math.ceil(_win.Runner.instance_.distanceRan));
                            }
                        });

                        if(isAllEnd()){
                            G = Neuvol.nextGeneration();
                            eachIframe(function (_win, _index){
                                 restart(_win);
                            })
                        }
                    },
                    1000/120
                );
            },1000)
            
        },
        10000
    )
},500);