(function ()
{
    var gameLib = {};
    iframeList = [];

    /**
     * 操控每一个iframe
     */
    gameLib.eachIframe = function (_do){
        for(var i = 0; i < iframeList.length; i++){
            _do(iframeList[i].contentWindow, i);
        }
    }

    /**
     * 让对应iframe的小恐龙跳起来
     */
    gameLib.pressJump = function (_win)
    {
        _win.Runner.instance_.onKeyDown(
            {
                keyCode: 38,
                target: 1
            }
        );
    }

    gameLib.downDuck = function (_win)
    {
        _win.Runner.instance_.onKeyDown(
            {
                keyCode: 40,
                target: 1,
                preventDefault: function (){}
            }
        );
    }

    gameLib.upDuck = function (_win)
    {
        _win.Runner.instance_.onKeyUp(
            {
                keyCode: 40,
                target: 1,
                preventDefault: function (){}
            }
        );
    }

    /**
     * 重启某个iframe的小恐龙游戏
     */
    gameLib.restart = function (_win)
    {
        _win.Runner.instance_.onKeyUp(
            {
                type: "mouseup",
                target: _win.Runner.instance_.canvas,
                button: 1
            }
        );
    }

    /**
     * 判断是不是所有iframe的小恐龙游戏都结束了
     */
    gameLib.isAllEnd = function (){
        var alive = false;
        this.eachIframe(function (_win){
            if(!_win.Runner.instance_.crashed){
                alive = true;
            }
        });
        return !alive;
    }

    /**
     * 获取障碍物的一些属性,要是没有这个障碍物的话,所有属性都返回0
     */
    gameLib.getObstaclesAttr = function (_win, _index, _attrs)
    {
        var lenOfAttrs = _attrs.length;
        var attrObj = {};
        for(var i = 0; i < lenOfAttrs; i++){
            var theRes = 0;
            if(typeof _win.Runner.instance_.horizon.obstacles[_index] != typeof UDFUDFUDF){
                var theObstacle = _win.Runner.instance_.horizon.obstacles[_index];
                theRes = theObstacle[_attrs[i]];
            }
            attrObj[_attrs[i]] = theRes;
        }
        return attrObj;
    }

    gameLib.createIframe = function (_num)
    {
        var body = document.getElementsByTagName('body')[0];
        for(var i = 0; i < _num; i++){
            var ifff = document.createElement('iframe');
            ifff.src="game.html";
            ifff.setAttribute("frameborder", "0");
            iframeList.push(ifff);
            body.appendChild(ifff);
        }
    }

    module.exports = gameLib;
})()
