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
      "dungeon": this.createDungeon(80, 80, 40) // 80, 80, 40
    }
  }

  createDungeon(width, height, roomsNum) { // 0-wall, 1-dungeon
    var board = [];

    // helpers
    function checkGerm(germ) {
      if (germ.begin.row - 2 < 0 || germ.begin.col - 2 < 0 || germ.end.row + 2 >= height || germ.end.col + 2 >= width) {
        return false;
      }
      for (var y = germ.begin.row - 2; y <= germ.end.row + 2; y++) {
        for (var x = germ.begin.col - 2; x <= germ.end.col + 2; x++) {
          if (board[y][x]) {
            return false;
          }
        }
      }
      return true;
    }

    function checkRoom(room, direction) {
      switch (direction) {
        case 0: // up
          if (room.begin.row - 2 < 0)
            return false;
          for (var y = room.begin.row - 2; y <= room.begin.row - 1; y++) {
            for (var x = room.begin.col - 1; x <= room.end.col + 1; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 1: // left
          if (room.begin.col - 2 < 0)
            return false;
          for (var y = room.begin.row - 1; y <= room.end.row + 1; y++) {
            for (var x = room.begin.col - 2; x <= room.begin.col - 1; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 2: // right
          if (room.end.col + 2 >= width)
            return false;
          for (var y = room.begin.row - 1; y <= room.end.row + 1; y++) {
            for (var x = room.end.col + 1; x <= room.end.col + 2; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 3: // down
          if (room.end.row + 2 >= height)
            return false;
          for (var y = room.end.row + 1; y <= room.end.row + 2; y++) {
            for (var x = room.begin.col - 1; x <= room.end.col + 1; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
      }
    }

    function getNextDirection(current) {
      if (current == 3) {
        return 0;
      } else {
        return ++current;
      }
    }

    function getDirectionAvalable(room) {
      var direction = Math.floor(Math.random() * 4); // 0 - up, 1 - left, 2 - right, 3 - down
      for (var i = 0; i < 4; i++) {
        if (checkRoom(room, direction)) {
          return direction;
        } else {
          direction = getNextDirection(direction);
        }
      }
      return null; // no available directions
    }

    function areRoomsCompleted(rooms) {
      for (var i = 0; i < rooms.length; i++) {
        if (!rooms[i].completed) {
          return false;
        }
      }
      return true;
    }

    function checkWall(start, direction) {
      if (start.row - 2 < 0 || start.row + 2 >= height || start.col - 2 < 0 || start.col + 2 >= width) {
        return 0;
      }
      switch (direction) {
        case 0:
          return board[start.row - 2][start.col] && !board[start.row - 1][start.col] && (!board[start.row - 1][start.col - 1] || !board[start.row - 1][start.col + 1]);
        case 1:
          return board[start.row][start.col - 2] && !board[start.row][start.col - 1] && (!board[start.row - 1][start.col - 1] || !board[start.row + 1][start.col - 1]);
        case 2:
          return board[start.row][start.col + 2] && !board[start.row][start.col + 1] && (!board[start.row - 1][start.col + 1] || !board[start.row + 1][start.col + 1]);
        case 3:
          return board[start.row + 2][start.col] && !board[start.row + 1][start.col] && (!board[start.row + 1][start.col - 1] || !board[start.row + 1][start.col + 1]);
      }
    }

    function getRoomIndex(rooms, row, col) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].begin.row <= row && row <= rooms[i].end.row && rooms[i].begin.col <= col && col <= rooms[i].end.col) {
          return i;
        }
      }
      return -1;
    }

    function deleteUnavailable(rooms) {
      var result = [];
      for (var i = 0; i < rooms.length; i++) {
        if (!rooms[i].available) {
          for (var y = rooms[i].begin.row; y <= rooms[i].end.row; y++) {
            for (var x = rooms[i].begin.col; x <= rooms[i].end.col; x++) {
              board[y][x] = 0;
            }
          }
        } else {
          result.push(rooms[i]);
        }
      }
      return result;
    }

    // create walls
    for (var i = 0; i < height; i++) {
      var row = [];
      for (var j = 0; j < width; j++) {
        row.push(0);
      }
      board.push(row);
    }

    // initiate rooms (germs)
    var rooms = [];
    for (var num = 0; num < roomsNum; num++) {
      var check = false;
      while (check != true) {
        var row = Math.floor(Math.random() * (height - 1));
        var col = Math.floor(Math.random() * (width - 1));
        var germ = {
          "begin": {
            "row": row - 1,
            "col": col - 1
          },
          "end": {
            "row": row + 1,
            "col": col + 1
          },
          "completed": false,
          "available": false
        };
        check = checkGerm(germ);
      }
      rooms.push(germ);
      for (var i = germ.begin.row; i <= germ.end.row; i++) {
        for (var j = germ.begin.col; j <= germ.end.col; j++) {
          board[i][j] = 1;
        }
      }
    }

    // dig rooms
    while (!areRoomsCompleted(rooms)) {
      for (var i = 0; i < rooms.length; i++) {
        if (!rooms[i].completed) {
          var direction = getDirectionAvalable(rooms[i]);
          if (direction == null) {
            rooms[i].completed = true;
          } else {
            switch (direction) {
              case 0: // up
                rooms[i].begin.row--;
                for (var j = rooms[i].begin.col; j <= rooms[i].end.col; j++) {
                  board[rooms[i].begin.row][j] = 1;
                }
                break;
              case 1:
                rooms[i].begin.col--; // left
                for (var j = rooms[i].begin.row; j <= rooms[i].end.row; j++) {
                  board[j][rooms[i].begin.col] = 1;
                }
                break;
              case 2: // right
                rooms[i].end.col++;
                for (var j = rooms[i].begin.row; j <= rooms[i].end.row; j++) {
                  board[j][rooms[i].end.col] = 1;
                }
                break;
              case 3: // down
                rooms[i].end.row++;
                for (var j = rooms[i].begin.col; j <= rooms[i].end.col; j++) {
                  board[rooms[i].end.row][j] = 1;
                }
                break;
            }
          }
        }
      }
    }

    // dig corridors
    var available = Math.floor(Math.random() * (rooms.length - 1));
    for (var counter = 0; counter < Math.floor(rooms.length * 2); counter++) {
      rooms[available].available = true;
      var direction;
      var start = {};
      var index;
      do {
        direction = Math.floor(Math.random() * 4); // 0 - up, 1 - left, 2 - right, 3 - down
        switch (direction) {
          case 0:
            start.row = rooms[available].begin.row;
            start.col = Math.floor(Math.random() * (rooms[available].end.col - rooms[available].begin.col)) + rooms[available].begin.col;
            break;
          case 1:
            start.row = Math.floor(Math.random() * (rooms[available].end.row - rooms[available].begin.row)) + rooms[available].begin.row;
            start.col = rooms[available].begin.col;
            break;
          case 2:
            start.row = Math.floor(Math.random() * (rooms[available].end.row - rooms[available].begin.row)) + rooms[available].begin.row;
            start.col = rooms[available].end.col;
            break;
          case 3:
            start.row = rooms[available].end.row;
            start.col = Math.floor(Math.random() * (rooms[available].end.col - rooms[available].begin.col)) + rooms[available].begin.col;
            break;
        }
      } while (!checkWall(start, direction));

      switch (direction) {
        case 0:
          board[start.row - 1][start.col] = 1;
          index = getRoomIndex(rooms, start.row - 2, start.col);
          break;
        case 1:
          board[start.row][start.col - 1] = 1;
          index = getRoomIndex(rooms, start.row, start.col - 2);
          break;
        case 2:
          board[start.row][start.col + 1] = 1;
          index = getRoomIndex(rooms, start.row, start.col + 2);
          break;
        case 3:
          board[start.row + 1][start.col] = 1;
          index = getRoomIndex(rooms, start.row + 2, start.col);
          break;
      }
      available = index > -1 ? index : available;
    }

    rooms = deleteUnavailable(rooms);

    return board;
  }

  render() {

    return (
      <div id="board">
         <Dungeon data={this.state.dungeon}/>
         <Objects board={this.state.dungeon}/>
      </div>
    );
  }
}

class Dungeon extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    var trs = [];
    for (var i = 0; i < this.props.data.length; i++) {
      trs.push(<Tr key={i} index={i} data={this.props.data[i]}/>);
    }

    return (
      <div id="dungeon">
        <table>
          <tbody>{trs}</tbody>
        </table>
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

class Objects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "dungeon": 1,
      "objects": this.placeObjects(this.createObjects(1))
    }

    this.placeObjects = this.placeObjects.bind(this);
  }

  createObjects(dungeon) {
    var settings = {};
    var objects = [];

    switch (dungeon) {
      case 1:
        settings.enemies = 20;
        settings.healthBonuses = 25;
        settings.weaporn = [2, 2, 2, 3, 3, 3, 4, 4];
        settings.enemyLevelMax = 10;
        settings.bossLevel = 15;
        settings.bossStrength = 300;
        break;
    }

    function createEnemy() {
      var enemy = {};
      enemy.type = "enemy";
      enemy.level = Math.floor(Math.random() * settings.enemyLevelMax) + 1;
      enemy.damage = enemy.level == 5 ? 1 : enemy.level + 5;
      enemy.strength = enemy.level * (Math.floor(Math.random() * 11) + 10) + 30;
      enemy.xp = enemy.level * 2;
      return enemy;
    }

    function createBoss() {
      var boss = {};
      boss.type = "boss";
      boss.level = settings.bossLevel;
      boss.damage = boss.level + 5;
      boss.strength = settings.bossStrength;
      boss.xp = 50;
      return boss;
    }

    function createWeaporn(attack) {
      var weaporn = {};
      weaporn.type = "weaporn";
      weaporn.attack = attack;
      switch (attack) {
        case 1:
          weaporn.name = "stick";
          break;
        case 2:
          weaporn.name = "bit";
          break;
        case 3:
          weaporn.name = "knife";
          break;
        case 4:
          weaporn.name = "spear";
          break;
        case 5:
          weaporn.name = "handgun";
          break;
        case 6:
          weaporn.name = "machine gun";
          break;
        case 7:
          weaporn.name = "grenade launcher";
          break;
        case 8:
          weaporn.name = "bomb";
          break;
      }
      return weaporn;
    }

    function createHealthBonus() {
      var bonus = {};
      bonus.type = "health";
      bonus.heal = Math.floor(Math.random() * 101) + 50;
      return bonus;
    }

    objects.push(createBoss());
    for (var i = 0; i < settings.enemies; i++) {
      objects.push(createEnemy());
    }
    for (var i = 0; i < settings.weaporn.length; i++) {
      objects.push(createWeaporn(settings.weaporn[i]));
    }
    for (var i = 0; i < settings.healthBonuses; i++) {
      objects.push(createHealthBonus());
    }

    return objects;
  }

  placeObjects(objects) {

    function isOccupied(row, col) {
      for (var i = 0; i < objects.length; i++) {
        if (objects[i].position != undefined && objects[i].position.row == row && objects[i].position.col == col) {
          return true;
        }
      }
      return false;
    }

    function getFreePosition() {
      var check = false;
      var row;
      var col;
      while (!check) {
        row = Math.floor(Math.random() * this.props.board.length);
        col = Math.floor(Math.random() * this.props.board[0].length);
        check = this.props.board[row][col] && !isOccupied(row, col);
      }
      return {
        "row": row,
        "col": col
      };
    }

    for (var i = 0; i < objects.length; i++) {
      var position = getFreePosition.call(this);
      objects[i].position = position;
    }
    console.log(objects);
    return objects;
  }

  render() {

    return (
      <div id="objects">
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('game'));