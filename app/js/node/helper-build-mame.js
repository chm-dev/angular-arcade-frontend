/* 
skrpyt zamieniający jsona powstałego z hyperspinowego xmla z hyperlist na obiekt 
powstaje obiekt z listą gier. kluczem kazdej gry jest nazwa pliku (bez rozszerzenia) 

*/


var fs = require('fs');
var appPath = __dirname + "/../../";
var mameorg = JSON.parse(fs.readFileSync(appPath + "games/data/mame.json", 'utf8'));
var newmame = new Object;

var indx = 0;
mameorg.menu.game.forEach(function (game) {


    newmame[game._name] = game;

    if (indx == 1)
        console.log(game);
    indx++;
})
fs.writeFileSync(appPath + "games/data/newMame.json", JSON.stringify(newmame, null, 4), "utf8");