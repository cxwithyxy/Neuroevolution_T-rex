var ProjectName = 'Neuroevolution_T-rex_neataptic';

var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var neat = new Neat(
    8,
    2,
    null,
    {
        mutation: [
            Methods.mutation.ADD_NODE,
            Methods.mutation.SUB_NODE,
            Methods.mutation.ADD_CONN,
            Methods.mutation.SUB_CONN,
            Methods.mutation.MOD_WEIGHT,
            Methods.mutation.MOD_BIAS,
            Methods.mutation.MOD_ACTIVATION,
            Methods.mutation.ADD_GATE,
            Methods.mutation.SUB_GATE,
            Methods.mutation.ADD_SELF_CONN,
            Methods.mutation.SUB_SELF_CONN,
            Methods.mutation.ADD_BACK_CONN,
            Methods.mutation.SUB_BACK_CONN
        ],
        elitism:5,
        network: new Architect.Random(
            8,
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
                    obstaclesAttr["speedOffset"]
                ];
                var res = neat.population[_index].activate(inputs);
                if(res[0] > 0.5){
                    pressDuck(_win);
                }
                if(!_win.Runner.instance_.tRex.jumping){
                    if(res[1] > 0.5){
                        pressJump(_win);
                    }
                }
            });
            if(isAllEnd()){

                var newPopulation = [];

                  // Elitism
                for(var i = 0; i < neat.elitism; i++){
                    newPopulation.push(neat.population[i]);
                }

                for(var i = 0; i < neat.popsize - neat.elitism; i++){
                    newPopulation.push(neat.getOffspring());
                }

                neat.population = newPopulation;

                neat.population.sort();
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