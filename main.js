class Game extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="app">
        <Сharacteristics/>
        <Board/>
      </div>
    );
  }
}

class Сharacteristics extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (<div>
        <ul id="characteristics">
          <li><span className="key">Health</span> : <span className="value">100</span></li>
          <li><span className="key">Weapon</span> : <span className="value">stick</span></li>
          <li><span className="key">Attack</span> : <span className="value">7</span></li>
          <li><span className="key">Level</span> : <span className="value">0</span></li>
          <li><span className="key">Nextlevel</span> : <span className="value">100 XP</span></li>
          <li><span className="key">Dungeon</span> : <span className="value">1</span></li>
        </ul>
        <div className="clear"></div>
     </div>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "board": this.createBoard(80, 200, 15)
    }
  }

  createBoard(width, height, roomsNum) { // 0-wall, 1-dungeon
    var board = [];

    // create walls
    for (var i = 0; i < height; i++) {
      var row = [];
      for (var j = 0; j < width; j++) {
        row.push(0);
      }
      board.push(row);
    }

    function checkRoom(room, bordersOnly) {
      if (room.begin.row - 2 < 0 || room.begin.col - 2 < 0 || room.end.row + 2 >= height || room.end.col + 2 >= width) {
        return false;
      }

      if (bordersOnly) {
        for (var y = room.begin.row - 2; y <= room.end.row - 1; y++) {
          for (var x = room.begin.col - 2; x <= room.end.col + 2; x++) {
            if (board[y][x]) {
              return false;
            }
          }
        }

        for (var y = room.begin.row; y <= room.end.row; y++) {
          for (var x = room.begin.col - 2; x <= room.end.col - 1; x++) {
            if (board[y][x]) {
              return false;
            }
          }
          for (var x = room.begin.col + 1; x <= room.end.col + 2; x++) {
            if (board[y][x]) {
              return false;
            }
          }
        }

        for (var y = room.begin.row + 1; y <= room.end.row + 2; y++) {
          for (var x = room.begin.col - 2; x <= room.end.col + 2; x++) {
            if (board[y][x]) {
              return false;
            }
          }
        }
      } else {
        for (var y = room.begin.row - 2; y <= room.end.row + 2; y++) {
          for (var x = room.begin.col - 2; x <= room.end.col + 2; x++) {
            if (board[y][x]) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function areRoomsCompleted(rooms) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].completed) {
          return false;
        }
      }
      return true;
    }

    // initiate rooms
    var rooms = [];
    for (var num = 0; num < roomsNum; num++) {
      var check = false;
      while (check != true) {
        var row = Math.floor(Math.random() * (height - 1));
        var col = Math.floor(Math.random() * (width - 1));
        var room = {
          "begin": {
            "row": row - 1,
            "col": col - 1
          },
          "end": {
            "row": row + 1,
            "col": col + 1
          },
          "completed": false
        };
        check = checkRoom(room, false);
      }
      rooms.push(room);
      for (var i = room.begin.row; i <= room.end.row; i++) {
        for (var j = room.begin.col; j <= room.end.col; j++) {
          board[i][j] = 1;
        }
      }
    }

    // dig rooms
    //  while (!areRoomsCompleted(rooms)){
    for (var i = 0; i < rooms.length; i++) {
      if (!rooms[i].completed && checkRoom(rooms[i], true)) {
        var direction = Math.floor(Math.random());
        if (direction) { // vertical
          for (var j = room.begin.col; j <= room.end.col; j++) {
            board[room.begin.row - 1][j] = 1;
            board[room.end.row + 1][j] = 1;
          }
        } else { // horizontal
          for (var j = room.begin.row; j <= room.end.row; j++) {
            board[j][room.begin.col - 1] = 1;
            board[j][room.end.col + 1] = 1;
          }
        }
      } else {
        rooms[i].completed = true;
      }
    }
    //  }

    // dig corridors

    return board;
  }

  render() {

    var trs = [];
    for (var i = 0; i < this.state.board.length; i++) {
      trs.push(<Tr key={i} index={i} data={this.state.board[i]}/>);
    }

    return (
      <div id="board">
          <div id="dungeon">
            <table>
              <tbody>{trs}</tbody>
            </table>
          </div>
        </div>
    );
  }
}

class Tr extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var tds = [];
    for (var i = 0; i < this.props.data.length; i++) {
      tds.push(<td key={i} className={this.props.data[i] ? "room" : "wall"}></td>);
    }

    return (
      <tr>{tds}</tr>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('game'));