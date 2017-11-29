# Neuroevolution_T-rex

用神经网络来训练个能自己玩chrome断线时的那个小恐龙的AI

示例: [https://cxwithyxy.github.io/Neuroevolution_T-rex/](https://cxwithyxy.github.io/Neuroevolution_T-rex/)

## 游戏本体（t-rex-runner）

游戏本体叫“t-rex-runner”，源码来自这里[https://github.com/wayou/t-rex-runner](https://github.com/wayou/t-rex-runner)。

下称“小恐龙游戏”。

## 我对游戏的修改

0. 删除了音乐（因为我电脑卡）
0. 移除了当焦点不在浏览器上就暂停游戏的监听（因为我要边写代码边看小恐龙）
0. 游戏的本体代码在 game.js 和 game.html （因为这样我可以通过iframe来控制多个同时运行的游戏）

## 关于人工智能或者神经网络或者机器学习

主要实现这些“智能”的类库来自于 neataptic.js ，这个文件来自于[https://github.com/wagenaartje/neataptic](https://github.com/wagenaartje/neataptic)。

## 关于如何控制小恐龙游戏

看 index.js 你就会明白，我循环创建了几个iframe，一个iframe一个小恐龙游戏。
对每一个iframe进行操作，把小恐龙游戏的数据传递给AI，再把AI判断的结果换成操作并让小恐龙跳起来。

## 关于这个项目要怎么开始跑

0. 为了让iframe能避开安全沙箱（跨域什么的），从而实现index.js对iframe里面的上下文进行操作，因此你要开启web服务器，我用的是nodejs的一个叫“http-server”，因此你会看到我的目录下有个启动脚本“startServer.bat”吗，双击启动就行了（如果你是window的电脑的话），然后访问127.0.0.1:8080。
0. 页面运行的时候会创建50个iframe来跑小恐龙，由于我的电脑比较卡，因此setTimeout了8秒才启动小恐龙游戏，所以你看到50个小恐龙一动不动的时候不要慌张。当然你电脑强的话可以把50改成500。
0. 当所有小恐龙游戏结束的时候才会重新开始，所以死剩最后一个小恐龙的时候不要慌，而且重新开始之后AI并不会删除之前的训练数据（反正我不知道训练数据在哪里，你自己找找看），因此每次死完之后的重生，AI就更加聪明一筹。

## 我的研究历史

1. 一开始是看到别人通过迷之代码实现的[像素鸟](https://github.com/xviniette/FlappyLearning)，很好奇，就基于那个作者写好的一个js类库 Neuroevolution.js ，实现了小恐龙的AI，因此你可以在 Neuroevolution分支 看到我这一开始的代码。
2. 后来分析了像素鸟AI的实现代码，主要是 Neuroevolution.js ，因此做了个思维图[mind.png](./mind.png)。
3. 尝试使用别的神经网络类库来实现小恐龙，synaptic.js ，但是失败了。因此你可以在 synaptic分支 看到我这些代码。
4. 这时发现之前认为的迷之代码是遗传算法和神经网络来构成，在找了一段时间之后发现了 neataptic.js ，用这个库实现了小恐龙AI。可以在 neataptic分支 看到这些代码。
5. 研究一段时间发现 neataptic.js 比 Neuroevolution.js 的功能丰富多了，因此用 neataptic分支 把 master分支 覆盖了。

## 分支的说明

1. master分支：目前我认为最靠谱的代码，因此 master分支 等于 neataptic分支。
2. neataptic分支：基于 neataptic.js 实现的小恐龙游戏AI。
3. Neuroevolution分支：基于 Neuroevolution.js 实现的小恐龙游戏AI。
4. synaptic分支：基于 synaptic.js，但没有实现小恐龙游戏AI。
