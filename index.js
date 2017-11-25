var ProjectName = 'Neuroevolution_T-rex_neataptic_v1.0';

var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var neat = new Neat(
    9,
    2,
    null,
    {
        mutation: Methods.mutation.ALL,
        mutationRate:0.8,
        elitism:1,
        network: new Architect.Random(
            9,
            7,
            2
        )
    }
);

G_deaded = [];
generationCount = 0;

setTimeout(function ()
{
    createIframe(50);

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
                        G_deaded.push(_index);
                    }
                    return;
                }
                var obstaclesAttr = getObstaclesAttr(_win, _index, ["xPos", "yPos", "size", "typeConfig", "speedOffset"]);
                var inputs = [
                    obstaclesAttr["xPos"],
                    obstaclesAttr["typeConfig"].width,
                    obstaclesAttr["size"],
                    _win.Runner.instance_.tRex.xPos,
                    obstaclesAttr["yPos"],
                    obstaclesAttr["typeConfig"].height,
                    _win.Runner.instance_.tRex.yPos,
                    obstaclesAttr["speedOffset"],
                    _win.Runner.instance_.tRex.jumping ? 1 : 0
                ];
                var res = neat.population[_index].activate(inputs);
                if(res[0] > 0.5){
                    pressJump(_win);
                }
                if(res[1] > 0.5){
                    pressDuck(_win);
                }
            });
            if(isAllEnd()){

                neat.sort();
                var newPopulation = [];

                  // Elitism
                for(var i = 0; i < neat.elitism; i++){
                    newPopulation.push(neat.population[i]);
                }

                for(var i = 0; i < neat.popsize - neat.elitism; i++){
                    newPopulation.push(neat.getOffspring());
                }

                neat.population = newPopulation;

                neat.mutate();

                G_deaded = [];
                eachIframe(function (_win, _index){
                     restart(_win);
                });
                generationCount ++;
                console.log("第" + generationCount + "代");
            }

            setZeroTimeout(arguments.callee);
        });

    }, 3000);
});