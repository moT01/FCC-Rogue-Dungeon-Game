var object = {
    player: { 
        class: 'player',
        icon: '☺',
        level: 1,
        xp: 0,
        score: 0,
        weapon: 'fist',
        health: 100,
        offense: 5
    }, 
    pawn: {
        class: 'pawn',
        icon: '♣',
        health: 50,
        offense: 5,
        xpreward: 10
    }, 
    knight: {
        class: 'knight',
        icon: '♠',
        health:150,
        offense: 15,
        xpreward: 25
    }, 
    king: {
        class: 'king',
        icon: '♛',
        health: 400,
        offense: 25,
        xpreward: 50
    },
    health: {
        class: 'health',
        icon: '✜',
        amount: 50
    }, 
    point: {
        class: 'point',
        icon: '$',
        xpreward: 1
    },
    sword: {
        class: 'sword',
        icon: '†',
        damageMultiplier: 2        
    }
};

// a var for width and height
var hidth = 50, playerLocation, totalMapCells = 0, objectsArray = [];
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            object: [],
            player: object.player,
            grid: this.nextMove()
        }; //end this.state 
    }; //end constructor()
       
    //in here somewhere remove class open, add class of thing (.player - .enemy1 - .enemy2 - health )
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
                    document.getElementById(coordinates).className = objectsArray[i].class;
                    document.getElementById(coordinates).innerHTML = objectsArray[i].icon;
                    document.getElementById(coordinates).value = objectsArray[i].index;
                    if(i === objectsArray.length-1) { //this tests if we are at last of array, which is the player(last item to place)
                        playerLocation = coordinates;
                    } //end if
                } //end if
            } //end while
        } //end for
    }; //end placeObjects
    
    createObjectsToPlace = () => {
        var index = 0; //index is for identifying the object to change values later via attacks and picking up items etc.
        var numberOfObjects = [
            ['pawn', 10],
            ['knight', 4],
            ['king', 1],
            ['health', 25],
            ['point', 50],
            ['sword', 1],
            ['player', 1]
        ];
    
        for (var i=0; i<numberOfObjects.length; i++) {
            for(var j=0; j<numberOfObjects[i][1]; j++) {
                var tempObj = object[numberOfObjects[i][0]];
                tempObj.index = index;
                objectsArray.push(tempObj);    
                index++;
            } //end j
        } //end i
        //this.setState({ 
          //  object: objectsArray 
        //}); //end setState 
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
    
    movePlayer = (newSpot) => {
        if(document.getElementById(newSpot).classList.contains('open')) { //maybe add if contains item here as well (health) (coins) also will need to remove name or whatever you come up with
            document.getElementById(playerLocation).innerHTML = "";
            document.getElementById(newSpot).innerHTML = "☺";
            playerLocation = newSpot;
        } //end if else 
        this.centerScreen();
    }; //end movePlayer()

////////////////////////////////////////////////CONTROLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    controllerPress = (e) => { //this is where all the game controls and actions are
        var keyPressed = e.keyCode; //get what button was pushed
        var temp = playerLocation.split('x'), newSpot;
        switch (keyPressed) {
            case 37: case 65: /*left arrow or 'a' pressed*/
                if(temp[0] > 0) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                    temp[0]--;
                    newSpot = temp.join('x');
                    this.movePlayer(newSpot);
                }
                break;
            case 38: case 87: /*up arrow or 'w' pressed*/
                if(temp[1] > 0) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                    temp[1]--;
                    newSpot = temp.join('x');
                    this.movePlayer(newSpot);
                }
                break;
            case 39: case 68: /*right arrow or 'd' pressed*/
                if(temp[0] < hidth-1) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                    temp[0]++;
                    newSpot = temp.join('x');
                    this.movePlayer(newSpot);
                }
                break;
            case 40: case 83: /*down arrow or 's' pressed*/
                if(temp[1] < hidth-1) { //meaning x value of current spot is not at the edge of the board, so left won't able to be used if your at the edge
                    temp[1]++;
                    newSpot = temp.join('x');
                    this.movePlayer(newSpot);
                }
                break;
            case 77: //m
                document.getElementById('mapBackdrop').style.visibility = 'visible';
                document.getElementById('mapTable').style.visibility = 'visible';
                break;
            default:
                break;
        } //end switch()
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

    displayChange = (e) => {
        var id = document.querySelector('#'+e.target.id);
        //id.style.removeProperty('transition');
        id.style.backgroundColor = 'Lime';
        //id.style.Transition = "all 500ms ease-out 500ms";
        //id.style.backgroundColor = '#999';
        //add transition
        //change color to gray
    };
    
    componentDidMount() {
        this.createObjectsToPlace();
        this.placeObjects(objectsArray);
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
        var maxLength = 6;
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
                            <td className={obj2 ? 'wall' : 'open'} id={col+'x'+row} key={""+ row + col}>{ obj2 ? '⧇' : '' }</td>      
                        )}
                        </tr>        
                    )}
                </table>

                <div id="mapBackdrop">
                    <table id="mapTable"> 
                        {this.state.grid.map((obj, row) =>                
                            <tr className="">
                            {obj.map((obj2, col) =>
                                <td className={obj2 ? 'wall' : 'open'} id="map">{ obj2 ? '⧇' : '' }</td>      
                            )}
                            </tr>        
                        )}
                    </table>
                </div>

                <div className="displayContainer">
                    <div className="display">'M': Menu</div>
                    <div className="display" onClick={this.displayChange.bind(this)} id="level">Level: {this.state.player.level}</div>
                    <div className="display" onClick={this.displayChange.bind(this)} id="xp">XP: {this.state.player.xp}</div>
                    <div className="display" onClick={this.displayChange.bind(this)} id="score">Score: {this.state.player.score}</div>
                    <div className="display" onClick={this.displayChange.bind(this)} id="health">Health: {this.state.player.health}</div>
                    <div className="display" onClick={this.displayChange.bind(this)} id="weapon">Weapon: {this.state.player.weapon}</div>
                </div>
            </div>
        ); //end return()
    } //end render()
} //end Game Component

ReactDOM.render(<Game/>, document.getElementById('root'));