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
        armor: 'none',
        health: 50,
        offense: 10,
        defense: 4,
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
        defense: 4,
        xpReward: 5,
        healthReward: 20
    }, 
    knight: {
        class: 'knight',
        level: 2,
        levelNeeded: 2,
        icon: 'knight.png',
        health:100,
        offense: 15,
        defense: 10,
        xpReward: 10,
        healthReward: 40
    }, 
    king: {
        class: 'king',
        level: 3,
        levelNeeded: 3,
        icon: 'king.png',
        health: 200,
        offense: 25,
        defense: 16,
        xpReward: 50
    },
    health: {
        class: 'health',
        icon: 'health.png',
        healthReward: 10
    }, 
    point: {
        class: 'point',
        icon: 'point.png',
        xpReward: 1
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
var hidth = 80, playerLocation, populatedObject = [], fighting = false;
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: this.nextMove()
        }; //end this.state
    }; //end constructor()
    
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
                    document.getElementById(coordinates).innerHTML = "<img src="+objectsArray[i].icon+"  onmouseover=\"the()\"  />";//onmouseover=\"displayTooltip("+objectsArray[i]+") \" 
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
            ['pawn', 10],
            ['knight', 4],
            ['king', 1],
            ['health', 25],
            ['point', 20],
            ['hammer', 1],
            ['axe', 1],
            ['sword', 1],
            ['shield', 1],
            ['player', 1]
        ];
    
        for (var i=0; i<numberOfObjects.length; i++) {
            for(var j=0; j<numberOfObjects[i][1]; j++) {
                tempObj = JSON.parse(JSON.stringify(object[numberOfObjects[i][0]]));
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
    //////////////////////////////////ACTIONS - movePlayer() is called from controllerPress()/////////////////////////////////////////////////////////////////////////
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
            document.getElementById('weapon').innerHTML = "Weapon: " + object.player.weapon;
            document.getElementById('armor').innerHTML = "Armor: " + object.player.armor;
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
        console.log('endOfMove');
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
                    alert('level ' + tempObj.levelNeeded + ' required for the ' + tempObj.class);
                    changeSettings = false;
                } else { //////////////////////////////////////////////////player has level required
                    if (object.player.offenseMultiplier < tempObj.offenseMultiplier) {
                    object.player.offenseMultiplier = tempObj.offenseMultiplier;
                    object.player.weapon = tempObj.class;
                    } //end if
                    alert(tempObj.class + ' found!');
                } //end if/else
            } if (classes.contains('shield')) {
                object.player.defenseMultiplier = tempObj.defenseMultiplier;
                object.player.armor = 'shield';
                alert('shield found!');
            } //end item
            if(changeSettings) { //this stops the player from moving on a wall or on an enemy/item it cant get yet
                endOfMove();
            } //end if
        } else if (classes.contains('pawn') || classes.contains('knight') || classes.contains('king')) { //when you run into an enemy  |||||||||||||||||||||||||SECOND PART||||||||||||||||||||||||
            changeSettings = false;
            var myTurn = true, interval;
            fighting = true; //used as a test in controllerPress() so you can't move when fighting
            interval = setInterval(function () {
                if(myTurn) { /////////////players turn ------------ new calculation needed
                    populatedObject[index].health -= Math.floor(object.player.offense * (object.player.offenseMultiplier + object.player.level/10) - populatedObject[index].defense);
                    myTurn = false;
                } else { ///////////////computers turn --------------
                    object.player.health -= Math.floor(populatedObject[index].offense * (1+populatedObject[index].level/10) - (object.player.defense * object.player.defenseMultiplier));
                    myTurn = true;
                } ///////////end of hits
                updateHUD();
                    console.log('cpu health = ' +populatedObject[index].health);
                    console.log('player health = ' +object.player.health);
                if(object.player.health <= 0 || populatedObject[index].health <= 0) { //if the fight is over - someone lost - need different things to happen for player win||cpu win
                    clearInterval(interval);
                    fighting = false;
                    if(object.player.health <= 0) { //computer won - player lost
                        //dont do game over, ...just take em down a level or somethin
                        alert('GAME OVER');
                    } else { ////////////////////////////////////////////////////////////////////player won - computer lost
                        //if opponent was king, you win!!
                        //add xpreward
                        endOfMove(); ///will probly add something here, ...this will probly only happen if the player won
                    }
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
        var maxTurn = 1200;
        var maxLength = 8;
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
        function the(e) {
    console.log(e);
}
        return (
            <div>
                <table className="grid" id="grid"> 
                    {this.state.grid.map((obj, row) =>                
                        <tr className="">
                        {obj.map((obj2, col) => 
                            <td className={obj2 ? 'wall'+Math.floor(Math.random()*10)+'' : 'open'} id={col+'x'+row} key={""+ row + col}></td>      
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

                <div className="hudContainer">
                    <div className="hud">PLAYER 1</div>
                    <div className="hud">'M' for Map</div>
                    <div className="hud" id="level">Level: {object.player.level}</div>
                    <div className="hud" id="xp">XP: {object.player.xp}</div>
                    <div className="hud" id="health">Health: {object.player.health}</div>
                    <div className="hud" id="weapon">Weapon: {object.player.weapon}</div>
                    <div className="hud" id="armor">Armor: {object.player.armor}</div>
                </div>
            </div>
        ); //end return()
    } //end render()
} //end Game Component

ReactDOM.render(<Game/>, document.getElementById('root'));