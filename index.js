var ProjectName = 'Neuroevolution_T-rex_neataptic_v1.0';

var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var startNetwork = new Architect.Perceptron(12, 10, 2);

var neat = new Neat(
    12,
    2,
    function (_network)
    {
        return _network.score;
    },
    {
        popsize: 50,
        mutation: [Methods.mutation.MOD_WEIGHT],
        // selection: Methods.selection.POWER,
        mutationRate: 0.5,
        mutationAmount: Math.round(50*0.5),
        // fitnessPopulation: true,
        network: startNetwork,
        elitism: Math.round(50*0.2)
    }
);

var G_deaded = [];

var HighestScore = 0;

setTimeout(function ()
{
    createIframe(neat.population.length);

    setTimeout(function ()
    {
        eachIframe(function (_win){
            pressJump(_win);
        });

        setZeroTimeout(function (){
            eachIframe(function (_win, _index){

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
                var obstaclesAttr = getObstaclesAttr(_win, 0, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);
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
                var res = neat.population[_index].activate(inputs);
                if(res[0] > 0.5){
                    pressJump(_win);
                }
                if(res[1] > 0.5){
                    pressDuck(_win);
                }
            });
            var thisFun = arguments.callee;
            if(isAllEnd()){

                // neat.sort();
                // var newPopulation = [];

                //   // Elitism
                // for(var i = 0; i < neat.elitism; i++){
                //     newPopulation.push(neat.population[i]);
                // }

                // for(var i = 0; i < neat.popsize - neat.elitism; i++){
                //     newPopulation.push(neat.getOffspring());
                // }

                // neat.population = newPopulation;

                neat.evolve().then(function ()
                {
                    console.log("第" + neat.generation + "代  ----  最高分 " + HighestScore);
                    G_deaded = [];
                    eachIframe(function (_win, _index){
                         restart(_win);
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