(function ()
{
    var neataptic = require("./libs/neataptic.js");

    var Neat    = neataptic.Neat;
    var Methods = neataptic.methods;
    var Config  = neataptic.Config;
    var Architect = neataptic.architect;

    var trainingData = [
        /**
         *       |目标状态|当前状态|           |  操作  |
         *       |跳,站,蹲|跳,站,蹲|           跳,站,蹲
         */
        { input: [1, 0, 0, 1, 0, 0], output: [0, 0, 0] },
        { input: [1, 0, 0, 0, 1, 0], output: [1, 0, 0] },
        { input: [1, 0, 0, 0, 0, 1], output: [1, 1, 0] },
        { input: [0, 1, 0, 1, 0, 0], output: [0, 0, 0] },
        { input: [0, 1, 0, 0, 1, 0], output: [0, 0, 0] },
        { input: [0, 1, 0, 0, 0, 1], output: [0, 0, 1] },
        { input: [0, 0, 1, 1, 0, 0], output: [0, 0, 1] },
        { input: [0, 0, 1, 0, 1, 0], output: [0, 0, 1] },
        { input: [0, 0, 1, 0, 0, 1], output: [0, 0, 0] },
    ];

    /**
     * controllerAINetwork 通过AI进行跳站蹲操作
     */
    var controllerAINetwork = new Architect.Perceptron(6, 10, 3);

    var trainedRes = controllerAINetwork.train(trainingData, {
        log: 1001,
        error: 0.01,
        iterations: 1000,
        rate: 0.3
    });

    // console.log(trainedRes);


    module.exports = controllerAINetwork;
})()

