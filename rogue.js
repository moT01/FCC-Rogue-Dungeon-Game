//***special thanks to Ahmad Abdolsaheb - @ahmadabdolsaheb on gitter - for creating the map generating algorithm***//
//To change the rules of the map creation
//==the hidth variable holds the width and height (dimensions) of the map - global variable
//==the maxTurn variable contols how many corners (or turns) the map can have - located in nextMove()
//==the maxLength variable controls how potentially long before another turn - located in nextMove()
var object = {
    player: { 
        class: 'player',
        icon: 'playerForward.png',
        level: 1,
        xp: 0,
        weapon: 'fist',
        armor: 'body suit',
        health: 50,
        offense: 10,
        defense: 5,
        offenseMultiplier: 1,
        defenseMultiplier: 1
    }, 
    pawn: {
        class: 'pawn',
        level: 1,
        levelNeeded: 1,
        icon: 'pawn.png',
        health: 50,
        offense: 10,
        defense: 6,
        xpReward: 6,
        healthReward: 20
    }, 
    knight: {
        class: 'knight',
        level: 2,
        levelNeeded: 2,
        icon: 'knight.png',
        health: 100,
        offense: 14,
        defense: 8,
        xpReward: 12,
        healthReward: 50
    }, 
    king: {
        class: 'king',
        level: 3,
        levelNeeded: 3,
        icon: 'king.png',
        health: 125,
        offense: 20,
        defense: 12,
        xpReward: 50,
        healthReward: 100
    },
    health: {
        class: 'health',
        icon: 'health.png',
        healthReward: 10
    }, 
    point: {
        class: 'point',
        icon: 'point.png',
        xpReward: 2
    },
    hammer: {
        class: 'hammer',
        icon: 'hammer.png',
        offenseMultiplier: 1.5,
        levelNeeded: 1
    },
    axe: {
        class: 'axe',
        icon: 'axe.png',
        offenseMultiplier: 2,
        levelNeeded: 2
    },
    sword: {
        class: 'sword',
        icon: 'sword.png',
        offenseMultiplier: 2.5,
        levelNeeded: 3
    },
    shield: {
        class: 'shield',
        icon: 'shield.png',
        defenseMultiplier: 1.5,
        levelNeeded: 2
    }
};

// hidth = width and height
var hidth = 60, playerLocation, populatedObject = [], fighting = false;
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: this.nextMove()
        }; //end this.state
    }; //end constructor()
    
    startGame = () => {
        document.getElementById('instructionsBackdrop').style.visibility = "hidden";
    }; //end startGame()
    
    toolTip = (e) => {
        if(e.target.tagName === "IMG") {
            var parentIndex = parseInt(e.target.parentElement.attributes.index.value),
            object = populatedObject[parentIndex],
            toolTip = document.getElementById('toolTip');
            console.log(object);
            if(object.class == 'pawn' || object.class == 'knight' || object.class == 'king') {
                toolTip.innerHTML = "<div><b>"+object.class.toUpperCase()+"</b></div><div>Health: "+object.health+"</div><div>Base Damage: "+object.offense+"</div><div>Base Defense: "+object.defense+"</div><div>+"+object.xpReward+" XP</div><div>+"+object.healthReward+" Health</div>";                   
            } else if (object.class == 'health') {
                toolTip.innerHTML = "<div>+"+object.healthReward+" health</div>";
            } else if (object.class == 'point') {
                toolTip.innerHTML = "<div>+"+object.xpReward+" XP</div>";
            } else {
                toolTip.innerHTML = "<div><b>"+object.class.toUpperCase()+"</b></div>"
            }
            toolTip.style.visibility = "visible";       
            toolTip.style.top = e.pageY - 20 +'px';
            toolTip.style.left = e.pageX + 20 +'px';
            toolTip.style.opacity = 0.8;
        }    
    }; //end toolTip()

    hideToolTip = () => {
        document.getElementById('toolTip').style.opacity = 0;
        document.getElementById('toolTip').style.visibility = "hidden";
    }; //end hideToolTip()
    
    ///////////////////Populate Map with Objects - placeObjects() is called from createObjectsToPlace()/////////////////////////////////////////////////
    placeObjects = (objectsArray) => {
        var randomCol, randomRow, coordinates, isOpen;

        for (var i=0; i<objectsArray.length; i++) {
            isOpen = false;
            while (!isOpen) {
                randomCol = Math.floor(Math.random() * hidth);
                randomRow = Math.floor(Math.random() * hidth);
                coordinates = randomCol+'x'+randomRow;
                if(document.getElementById(coordinates).classList.contains('open')) {//checks if the element has class 'open'
                    isOpen = true;
                    document.getElementById(coordinates).className = objectsArray[i].class; //giving it a class is for collision detection
                    document.getElementById(coordinates).innerHTML = "<img src="+objectsArray[i].icon+" />";//onmouseover=\"displayTooltip("+objectsArray[i]+") \" 
                    document.getElementById(coordinates).setAttribute('index', objectsArray[i].index); //setting an index is to access the values of the object in populatedObject
                    if(i === objectsArray.length-1) { //this tests if we are at last of array, which is the player(last item to place)
                        playerLocation = coordinates;
                    } //end if
                } //end if
            } //end while
        } //end for
    }; //end placeObjects
    
    createObjectsToPlace = () => {
        var i=0, index = 0, objectsArray = [], tempObj = {};
        var numberOfObjects = [
            ['pawn', 12],
            ['knight', 6],
            ['king', 1],
            ['health', 15],
            ['point', 15],
            ['hammer', 1],
            ['axe', 1],
            ['sword', 1],
            ['shield', 1],
            ['player', 1]
        ];
    
        for (var i=0; i<numberOfObjects.length; i++) {
            for(var j=0; j<numberOfObjects[i][1]; j++) {
                tempObj = JSON.parse(JSON.stringify(object[numberOfObjects[i][0]]));
                switch(numberOfObjects[i][0]) {
                    case "pawn":
                        tempObj.health = Math.floor(Math.random() * 20 + object.pawn.health);
                        tempObj.offense = Math.floor(Math.random() * 4 + object.pawn.offense);
                        tempObj.defense = Math.floor(Math.random() * 4 + object.pawn.defense);
                        tempObj.healthReward = Math.floor(Math.random() * 10 + object.pawn.healthReward);
                        tempObj.xpReward = Math.floor(Math.random() * 5 + object.pawn.xpReward);
                        break;
                    case "knight":
                        tempObj.health = Math.floor(Math.random() * 40 + object.knight.health);
                        tempObj.offense = Math.floor(Math.random() * 10 + object.knight.offense);
                        tempObj.defense = Math.floor(Math.random() * 5 + object.knight.defense);
                        tempObj.healthReward = Math.floor(Math.random() * 20 + object.knight.healthReward);
                        tempObj.xpReward = Math.floor(Math.random() * 10 + object.knight.xpReward);
                        break;
                    case "king":
                        tempObj.health = Math.floor(Math.random() * 20 + object.king.health);
                        tempObj.offense = Math.floor(Math.random() * 5 + object.king.offense);
                        tempObj.defense = Math.floor(Math.random() * 4 + object.king.defense);
                        tempObj.healthReward = Math.floor(Math.random() * 10 + object.king.healthReward);
                        tempObj.xpReward = Math.floor(Math.random() * 10 + object.king.xpReward);
                        break;
                    case "health":
                        tempObj.healthReward = Math.floor(Math.random() * 5 + object.health.healthReward);
                        break;
                    case "point":
                        tempObj.xpReward = Math.floor(Math.random() * 2 + object.point.xpReward);
                        break;
                    default:
                        break;
                }
                tempObj.index = index;
                objectsArray.push(tempObj);
                index++;
            } //end j
        } //end i
        populatedObject = objectsArray; //global variable that holds all the objects on the map
        this.placeObjects(objectsArray);
    }; //end createObjectsToPlace()

    centerScreen = () => {
        var temp = playerLocation.split('x'),
            tdWidth = document.getElementById('0x0').clientWidth,
            tdHeight = document.getElementById('0x0').clientHeight,
            top = window.innerHeight/2 - (temp[1]*tdHeight),
            left = window.innerWidth/2 - (temp[0]*tdWidth);
        document.getElementById('grid').style.top = top+'px';
        document.getElementById('grid').style.left = left+'px';
    }; //end centerScreen()

///////////////////////////////////////ACTIONS - movePlayer() is called from controllerPress()/////////////////////////////////////////////////////////////////////////
    movePlayer = (nextSpot, directionFacing) => { //nextSpot comes from controllerPress()
        var oldSpot = document.getElementById(playerLocation),
            newSpot = document.getElementById(nextSpot),
            classes = newSpot.classList,
            index = newSpot.getAttribute('index'),
            tempObj = populatedObject[index],
            changeSettings = true;
        
        function updateLevel() {
            var tempObj = 1 + (Math.floor(object.player.xp/50));
            if (object.player.level < tempObj) {
                alert('level ' + tempObj +' reached!');
                object.player.level = tempObj;
            };        
        };
        function updateHUD() {
            document.getElementById('level').innerHTML = "Level: " + object.player.level;
            document.getElementById('xp').innerHTML = "XP: " + object.player.xp;
            document.getElementById('health').innerHTML = "Health: " + object.player.health;
            document.getElementById('weapon').innerHTML = "Weapon: " + object.player.weapon.toUpperCase();
            document.getElementById('armor').innerHTML = "Armor: " + object.player.armor.toUpperCase();
        };
        function updateEnemyHUD() {
            document.getElementById('enemy').innerHTML = '<b>'+populatedObject[index].class.toUpperCase()+'</b>';
            document.getElementById('enemyHealth').innerHTML = "Health: " + populatedObject[index].health;
        };
        function centerScreen() {
            var temp = playerLocation.split('x'),
            tdWidth = document.getElementById('0x0').clientWidth,
            tdHeight = document.getElementById('0x0').clientHeight,
            top = window.innerHeight/2 - (temp[1]*tdHeight),
            left = window.innerWidth/2 - (temp[0]*tdWidth);
            document.getElementById('grid').style.top = top+'px';
            document.getElementById('grid').style.left = left+'px';
        }; 
        function removeSpotAttributes (spot) {
            spot.removeAttribute('index');
            spot.className = 'open';
        }; //end removeSpotAttributes()
        function endOfMove() {
            removeSpotAttributes(oldSpot);
            removeSpotAttributes(newSpot);
            oldSpot.innerHTML = "";            
            newSpot.innerHTML = '<img src="player'+directionFacing+'.png" />';   
            playerLocation = nextSpot;
            updateLevel();
            updateHUD();
            centerScreen();
        }; //end endOfMove()

        //the first part of this series of tests is for when the player runs into collectable items or an open spot - open/health/point/weapons/shield ||||||||| the second part is for running into enemies/fighting
        if(classes.contains('open') || classes.contains('health') || classes.contains('point') || classes.contains('hammer') || classes.contains('axe') || classes.contains('sword') || classes.contains('shield')) {
            if (classes.contains('point')) {
                object.player.xp += tempObj.xpReward;
            } if (classes.contains('health')) {
                object.player.health += tempObj.healthReward;    
            } if (classes.contains('hammer') || classes.contains('axe') || classes.contains('sword')) {
                if (object.player.level < tempObj.levelNeeded) { /////////////////////////////////////////////////player doesn't have level required
                    alert('Level ' + tempObj.levelNeeded + ' required for the ' + tempObj.class +'\nThis item will increase your damage');
                    changeSettings = false;
                } else { //////////////////////////////////////////////////player has level required
                    if (object.player.offenseMultiplier < tempObj.offenseMultiplier) { //weapon is better, ...change multiplier
                    object.player.offenseMultiplier = tempObj.offenseMultiplier;
                    object.player.weapon = tempObj.class;
                    } //end if
                    alert(tempObj.class + ' found!\nThis item will increase your damage');
                } //end if/else
            } if (classes.contains('shield')) {
                if(object.player.level < tempObj.levelNeeded) {
                    alert('Level ' + tempObj.levelNeeded + ' required for the ' + tempObj.class + '\nThis item will increase your defense');
                    changeSettings = false;
                } else {
                    object.player.defenseMultiplier = tempObj.defenseMultiplier;
                    object.player.armor = 'shield';
                    alert('shield found!\nThis item will increase your defense');
                }
            } //end item
            if(changeSettings) { //this stops the player from moving on a wall or on an enemy/item it cant get yet
                endOfMove();
            } //end if
        } else if (classes.contains('pawn') || classes.contains('knight') || classes.contains('king')) { //when you run into an enemy  |||||||||||||||||||||||||SECOND PART||||||||||||||||||||||||
            updateEnemyHUD();
            document.getElementById('hudContainer2').style.transitionDelay = '0ms';
            document.getElementById('hudContainer').style.transitionDelay = '0ms';
            document.getElementById('hudContainer2').style.opacity = 0.8;
            document.getElementById('hudContainer2').style.top = '0px';    
            document.getElementById('hudContainer').style.top = '40px';    
            changeSettings = false;
            var myTurn = true, interval;
            fighting = true; //used as a test in controllerPress() so you can't move when fighting
            interval = setInterval(function () {
                if(myTurn) { /////////////players turn ------------ 
                    var damage = Math.floor(Math.random() * 5 + (object.player.offense * (object.player.offenseMultiplier + object.player.level/10) - populatedObject[index].defense));
                    if (damage<0) { damage = 1; }
                    populatedObject[index].health -= damage;
                    if(populatedObject[index].health < 0) { populatedObject[index].health = 0; }
                    myTurn = false;
                } else { ///////////////computers turn --------------
                    var damage = Math.floor(Math.random() * 5 + (populatedObject[index].offense * (1+populatedObject[index].level/10) - (object.player.defense * object.player.defenseMultiplier)));
                    if(damage < 0) { damage = 1; }
                    object.player.health -= damage;
                    if(object.player.health < 0) { object.player.health = 0; }
                    myTurn = true;
                } ///////////end of hits
                updateHUD();
                updateEnemyHUD();
                if(object.player.health <= 0 || populatedObject[index].health <= 0) { //if the fight is over - someone lost - need different things to happen for player win||cpu win
                    clearInterval(interval);
                    fighting = false;
                    if(object.player.health <= 0) { //computer won - player lost
                        alert('You Lost!');
                        document.location.reload();
                    } else { ////////////////////////////////////////////////////////////////////player won - computer lost
                        object.player.health += populatedObject[index].healthReward;
                        object.player.xp += populatedObject[index].xpReward;
                        endOfMove();
                        if(classes.contains('king')) {
                            alert('You defeated the King, the dungeon is now yours!');
                        } //end if (king)
                    } //end player won
                    document.getElementById('hudContainer2').style.transitionDelay = '1000ms';
                    document.getElementById('hudContainer').style.transitionDelay = '1000ms';
                    document.getElementById('hudContainer2').style.opacity = 0;
                    document.getElementById('hudContainer2').style.top = '-40px';
                    document.getElementById('hudContainer').style.top = '0px';
                } // end if
            }, 1000); //end setInterval()
        } //end if (enemy)
    }; //end movePlayer()

////////////////////////////////////////////////CONTROLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    controllerPress = (e) => { //this is where all the game controls are
        if(!fighting) { /////////////////global variable ---- set in movePlayer()
            //var tempPlayer = object.player;
            var keyPressed = e.keyCode; //get what button was pushed
            var temp = playerLocation.split('x'), newSpot;
            switch (keyPressed) {
                case 37: case 65: /*left arrow or 'a' pressed*/
                    if(temp[0] > 0) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                        temp[0]--;
                        newSpot = temp.join('x');
                        this.movePlayer(newSpot, 'Left');
                    }
                    break;
                case 38: case 87: /*up arrow or 'w' pressed*/
                    if(temp[1] > 0) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                        temp[1]--;
                        newSpot = temp.join('x');
                        this.movePlayer(newSpot, 'Backward');
                    }
                    break;
                case 39: case 68: /*right arrow or 'd' pressed*/
                    if(temp[0] < hidth-1) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                        temp[0]++;
                        newSpot = temp.join('x');
                        this.movePlayer(newSpot, 'Right');
                    }
                    break;
                case 40: case 83: /*down arrow or 's' pressed*/
                    if(temp[1] < hidth-1) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                        temp[1]++;
                        newSpot = temp.join('x');
                        this.movePlayer(newSpot, 'Forward');
                    }
                    break;
                case 77: //m
                    document.getElementById('mapBackdrop').style.visibility = 'visible';
                    document.getElementById('mapTable').style.visibility = 'visible';
                    break;
                default:
                    break;
            } //end switch()
        }//end if (!fighting)
    }; //end controllerPress()
    
    controllerRelease = (e) => {
        var keyPressed = e.keyCode; //get what button was pushed
        switch (keyPressed) {
            case 77: //m
                document.getElementById('mapBackdrop').style.visibility = 'hidden';
                document.getElementById('mapTable').style.visibility = 'hidden';
                break;
            default:
                break;
        } //end switch()
    }; //end controllerRelease()
////////////////////////////////////////////////END CONTROLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    componentWillMount() {
        document.getElementById('loader').style.display = "none";
    };

    componentDidMount() {
        this.createObjectsToPlace();
        this.centerScreen();
        document.addEventListener('keydown', this.controllerPress.bind(this));
        document.addEventListener('keyup', this.controllerRelease.bind(this));
    }; //end componentDidMount()

////////////////////////////////////////////////MAP GENERATOR///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fullArray = () => {
        var array = [];
        for (var i = 0; i < hidth; i++) {
            array.push(new Array);
            for (var j = 0; j < hidth; j++) {
                array[i].push(1);
            }
        }
        return array;
    }; //end fullArray

    nextMove = () => {
        var maxTurn = 800;
        var maxLength = 14;
        var oldArr = this.fullArray();
        var curRow = Math.floor(Math.random() * hidth);
        var curCol = Math.floor(Math.random() * hidth);
        var calcObject = [[-1, 0],
                                    [1, 0],
                                    [0, -1],
                                    [0, 1]];
        var lastTurn = [3, 3];
        while (maxTurn) {
            var randTurn
            do {
                randTurn = calcObject[Math.floor(Math.random() * calcObject.length)];
            } while (randTurn[0] === -1 * lastTurn[0] && randTurn[1] === -1 * lastTurn[1] || randTurn[0] === lastTurn[0] && randTurn[1] === lastTurn[1]);
            var leng = Math.ceil(Math.random() * maxLength);
            for (var i = 0; i < leng; i++) {
                oldArr[curRow][curCol] = 0;
                if(curRow === 0 && randTurn[0] === -1){
                    break;
                } else if(curCol === 0 && randTurn[1] === -1){
                    break;
                } else if(curRow === hidth - 1 && randTurn[0] === 1){
                    break;
                } else if(curCol === hidth - 1 && randTurn[1] === 1){
                    break;
                } else {
                curRow = curRow + randTurn[0];
                curCol = curCol + randTurn[1];
                } //end if/else
            } //end for
            lastTurn = randTurn;
            maxTurn--;
        } //end while(maxTurn)
        return oldArr;
    }; //end nextMove()
//////////////////////////////////////////////////////////END MAP GENERATOR////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        return (
            <div>
                <table className="grid" id="grid"> 
                    {this.state.grid.map((obj, row) =>                
                        <tr className="">
                        {obj.map((obj2, col) => 
                            <td className={obj2 ? 'wall'+Math.floor(Math.random()*10)+'' : 'open'} id={col+'x'+row} key={""+ row + col} onMouseOver={this.toolTip.bind(this)} onMouseOut={this.hideToolTip.bind(this)}></td>      
                        )}
                        </tr>        
                    )}
                </table>

                <div id="mapBackdrop">
                    <table id="mapTable"> 
                        {this.state.grid.map((obj, row) =>
                            <tr className="">
                            {obj.map((obj2, col) =>
                                <td className={obj2 ? 'wall'+Math.floor(Math.random()*10)+''  : 'open'} id="map"></td>      
                            )}
                            </tr>        
                        )}
                    </table>
                </div>

                <div id="hudContainer">
                    <div className="hud" id="player"><b>PLAYER</b></div>
                    <div className="hud"><b>'M' for Map</b></div>
                    <div className="hud" id="level">Level: {object.player.level}</div>
                    <div className="hud" id="xp">XP: {object.player.xp}</div>
                    <div className="hud" id="health">Health: {object.player.health}</div>         
                    <div className="hud" id="offese">Base Damage: {object.player.offense}</div>            
                    <div className="hud" id="defense">Base Defense: {object.player.defense}</div>
                    <div className="hud" id="weapon">Weapon: {object.player.weapon.toUpperCase()}</div>
                    <div className="hud" id="armor">Armor: {object.player.armor.toUpperCase()}</div>   
                </div>
                <div id="hudContainer2">
                    <div className="hud2" id="enemyHealth">Health: 100</div>
                    <div className="hud2" id="enemy">PAWN</div>
                </div>
                
                <div id="instructionsBackdrop">
                    <div className="center">
                        <div className="block"><h1><b>Welcome to my Dungeon Crawler</b></h1></div>
                        <ul className="block left"><h3>
                            <li>Enter your browsers 'Full Screen' mode for the best experience</li>
                            <li>Press 'M' in game to see the map</li>
                            <li>Use the arrows or 'ASWD' controls to move</li>
                            <li>Run into an enemy to fight it or an item to collect it</li>
                            <li>Hover over items with the mouse to see details</li>
                            <li>Higher levels/better items will increase your fighting abilities</li>
                            <li>Defeat the king to claim the dungeon</li>
                            <li>Good Luck!</li></h3>
                        </ul>
                        <div className="continueButton block" onClick={this.startGame.bind(this)}><b>Continue</b></div>
                    </div>
                </div>
                
                <div className="toolTip" id="toolTip"></div>
            </div>
        ); //end return()
    } //end render()
} //end Game Component

ReactDOM.render(<Game/>, document.getElementById('root'));
