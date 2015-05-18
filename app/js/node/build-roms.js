var fs = require('fs');

var appPath = __dirname + "/../../";

var dataFolder = appPath + "games/data/";
var pathsJson = appPath + "games/paths.json";
var allPlatformsJson = dataFolder + "allPlatforms.json";
var platformJsonPath = appPath + "games/";
var allMameRoms = new Object;

var paths;
var allPlatforms;
var romsFolders;

var availablePlatforms = new Array;

paths = JSON.parse(fs.readFileSync(pathsJson, 'utf8'));
paths.roms = decodeURIComponent(paths.roms);
allPlatforms = JSON.parse(fs.readFileSync(allPlatformsJson, 'utf8'));
romsFolders = fs.readdirSync(paths.roms);

var availablePlatformsIndx = 0;

romsFolders.forEach(function (romsFolder) { //iterujemy się przez foldery ze ścieżki romów
    var allPlatformIndx = 0
    allPlatforms.forEach(function (platform) { // czy nazwa folderu odpowiada jednej z nazw obsługiwanych platform


        if (platform.id == romsFolder) {
            console.log(romsFolder + ' folder found');



            roms = fs.readdirSync(paths.roms + romsFolder + "/")
            romlist = new Object;
            romlist.games = new Array;
            roms.forEach(function (rom) { // sprwadzamy poszczególne pliki i dodajemy do romlisty jesli jest ok
                // sprawdzamy rozszerzenie pliku
                platform.fileExtensions.split(',').every(function (ext) {

                    if (ext == rom.substr(rom.length - 4).split('.')[1]) {
                        romName = rom.slice(0, -4).replace(/\(.+\)/i, "").replace(/\[.+\]/i, "").trim();

                        if (romsFolder != "MAME") {
                            romlist.games.push({
                                "filename": rom,
                                "filenameNoExt": rom.slice(0, -4),
                                "name": romName
                            })

                        } else { //jeśli to mame to ładujemy liste wszystkich romów żeby dostac tytuły

                            if (!Object.keys(allMameRoms).length) {
                                allMameRoms = JSON.parse((fs.readFileSync(dataFolder + 'allMameRoms.json', 'utf-8')))
                            }
                            console.log(rom.slice(0, -4))
                            console.log(allMameRoms[rom.slice(0, -4)])
                            if (allMameRoms[rom.slice(0, -4)])
                                romlist.games.push({
                                    "filename": rom,
                                    "filenameNoExt": rom.slice(0, -4),
                                    "name": allMameRoms[rom.slice(0, -4)].description,
                                    "year": allMameRoms[rom.slice(0, -4)].year,
                                    "genre": allMameRoms[rom.slice(0, -4)].genre,
                                    "manufacturer": allMameRoms[rom.slice(0, -4)].manufacturer
                                })

                            /* else
                                 romlist.games.push({
                                     "filename": rom,
                                     "filenameNoExt": rom.slice(0, -4),
                                     "name": rom.slice(0, -4)
                                 })*/




                        }
                        return false
                    } else {
                        return true
                    }

                })

            })

            var outputFilename = platformJsonPath + platform.id + '.json';
            if (Object.keys(romlist.games).length > 0) {
                romlist.lastupdate = Date.now();
                romlist.info = new Object();
                romlist.info.id = platform.id;
                romlist.info.name = platform.name;
                //console.log(romlist);


                fs.writeFileSync(outputFilename, JSON.stringify(romlist, null, 4), "utf8");
                //console.log("JSON saved to " + outputFilename);

                availablePlatforms[availablePlatformsIndx] = allPlatforms[allPlatformIndx];
                console.log(availablePlatformsIndx + ' czyli ' + availablePlatforms[availablePlatformsIndx].id)
                availablePlatformsIndx++;
            } else {
                //console.log('nie ma plików w ' + romsFolder)
                if (fs.existsSync(outputFilename)) {
                    fs.unlinkSync(outputFilename)
                        //console.log('usunąłem ' + outputFilename + ' bo nie ma romów')

                } else {
                    //console.log(outputFilename + ' nie istnieje więc nie robię nic')
                }
            }




            //console.log('dostępnych platform: ' + availablePlatformsIndx)
        }
        allPlatformIndx++;
        //console.log('Iteracja przez allplatforms o indeksie: ' + availablePlatformsIndx)
    })

})

if (availablePlatforms.length > 0) {

    fs.writeFileSync(platformJsonPath + 'platforms.json', JSON.stringify(availablePlatforms, null, 4), "utf8");
    console.log("JSON z platformami zapisany");
}