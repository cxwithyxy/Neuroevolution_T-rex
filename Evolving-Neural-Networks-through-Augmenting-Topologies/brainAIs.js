(function ()
{
    var brainAIs = {};
    var neataptic = require("./libs/neataptic.js");

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

    brainAIs.getBrain = function (_index)
    {
        return neat.population[_index];
    }

    brainAIs.activateBrain = function (_index, _inputs)
    {
        return brainAIs.getBrain(_index).activate(_inputs);
    }

    brainAIs.length = function ()
    {
        return neat.population.length;
    }
    brainAIs.setBrainScore = function (_index, _score)
    {
        brainAIs.getBrain(_index).score = _score;
    }

    brainAIs.evolve = function ()
    {
        return neat.evolve();
    }

    brainAIs.generation = function ()
    {
        return neat.generation;
    }

    module.exports = brainAIs;
})()