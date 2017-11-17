# Neuroevolution_T-rex

用神经网络来训练个能自己玩chrome断线时的那个小恐龙的AI

## 游戏本体（t-rex-runner）

游戏本体叫“t-rex-runner”，源码来自这里[https://github.com/wayou/t-rex-runner](https://github.com/wayou/t-rex-runner)。

下称“小恐龙游戏”。

## 我对游戏的修改

0. 删除了音乐（因为我电脑卡）
0. 移除了当焦点不在浏览器上就暂停游戏的监听（因为我要边写代码边看小恐龙）
0. 游戏的本体代码在 game.js 和 game.html （因为这样我可以通过iframe来控制多个同时运行的游戏）

## 关于人工智能或者神经网络或者机器学习

主要实现这些“智能”的类库来自于 Neuroevolution.js ，这个文件来自于[https://github.com/xviniette/FlappyLearning](https://github.com/xviniette/FlappyLearning)。

至于为什么可以这么“智能”的话我就不知道了，反正我看不懂源码，只知道怎么输入数据给AI和获得AI的数据。
那是看了上面像素鸟的代码才GET到的。

## 关于如何控制小恐龙游戏

看 index.js 你就会明白，我循环创建了几个iframe，一个iframe一个小恐龙游戏。
对每一个iframe进行操作，把小恐龙游戏的数据传递给AI，再把AI判断的结果换成操作并让小恐龙跳起来。