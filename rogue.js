// a var for width and height
var hidth = 50, playerLocation;
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: this.nextMove()
        }; //end this.state 
    }; //end constructor()
       
    placePlayer = () => {
        var randomStartCol, randomStartRow, coordinates, isOpen = false;
        while (!isOpen) {
            randomStartCol = Math.floor(Math.random() * hidth);
            randomStartRow = Math.floor(Math.random() * hidth);
            coordinates = randomStartCol+'x'+randomStartRow;
            if(document.getElementById(coordinates).classList.contains('open')) {//checks if the element has class 'open'
                isOpen = true;
                document.getElementById(coordinates).innerHTML = '☺';
                playerLocation = coordinates;
            } //end if
        } //end while
    }; //end placePlayer
    
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
        if(document.getElementById(newSpot).classList.contains('open')) {
            document.getElementById(playerLocation).innerHTML = "";
            document.getElementById(newSpot).innerHTML = "☺";
            playerLocation = newSpot;
        } //end if
        this.centerScreen();
    }; //end movePlayer()
    
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
                document.getElementById('mapOverlay').style.visibility = 'visible';
                document.getElementById('mapTable').style.visibility = 'visible';
                document.getElementById('grid').style.zIndex = -1;
                break;
            default:
                break;
        } //end switch()
    }; //end controllerPress()
    
    controllerRelease = (e) => {
        var keyPressed = e.keyCode; //get what button was pushed
        switch (keyPressed) {
            case 77: //m
                document.getElementById('mapOverlay').style.visibility = 'hidden';
                document.getElementById('mapTable').style.visibility = 'hidden';
                document.getElementById('grid').style.zIndex = 1;
                break;
            default:
                break;
        } //end switch()
    } //end controllerRelease()

    componentDidMount() {
        this.placePlayer();
        this.centerScreen();
        document.addEventListener('keydown', this.controllerPress.bind(this));
        document.addEventListener('keyup', this.controllerRelease.bind(this));
    }; //end componentDidMount()
    
////////////////////////////////////////////////MAP MAKER///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fullArray = () => {
    var array = [];
    for (var i = 0; i < hidth; i++) {
      array.push(new Array);
      for (var j = 0; j < hidth; j++) {
        array[i].push(1);
      }
    }
    return array;
  };

  nextMove = () => {
    var maxTurn = 700;
    var maxLength = 7;
    var oldArr = this.fullArray();
    var curRow = Math.floor(Math.random() * hidth);
    var curCol = Math.floor(Math.random() * hidth);
    var calcObject = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
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
            break
          }
          else if(curCol === 0 && randTurn[1] === -1){
            break
          }
          else if(curRow === hidth - 1 && randTurn[0] === 1){
            break
          }
          else if(curCol === hidth - 1 && randTurn[1] === 1){
            break
          }else{
            curRow = curRow + randTurn[0];
            curCol = curCol + randTurn[1];
          }
      }
      lastTurn = randTurn;
      maxTurn--;
    }
    return oldArr;
  };
//////////////////////////////////////////////////////////MAP MAKER////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {  
    console.log('render');
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

                <table id="mapTable"> 
                    {this.state.grid.map((obj, row) =>                
                        <tr className="">
                        {obj.map((obj2, col) =>
                            <td className={obj2 ? 'wall' : 'open'} id="map"></td>      
                        )}
                        </tr>        
                    )}
                </table>
            </div>
        ); //end return()
    } //end render()
} //end Game Component

ReactDOM.render(<Game/>, document.getElementById('root'));