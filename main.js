class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      health: 100,
      weaporn: 1,
      level: 1,
      xp: 50,
      dungeon: 1,
      position: { row: 0, col: 0 },
      reset: false
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(object) {
    this.setState(object);
  }

  render() {
    return (
      <div id="app">
        <Сharacteristics
          health={this.state.health}
          weaporn={this.state.weaporn}
          level={this.state.level}
          xp={this.state.xp}
          dungeon={this.state.dungeon}
        />
        <div id="board-wrapper">
          <Board
            health={this.state.health}
            weaporn={this.state.weaporn}
            level={this.state.level}
            xp={this.state.xp}
            heroPosition={this.state.position}
            dungeon={this.state.dungeon}
            reset={this.state.reset}
            updateState={this.updateState}
          />
          <Darkness heroPosition={this.state.position} />
        </div>
      </div>
    );
  }
}

class Сharacteristics extends React.Component {
  constructor() {
    super();

    this.getWeapornName = this.getWeapornName.bind(this);
  }

  getWeapornName(weaporn) {
    var name;
    switch (weaporn) {
      case 1:
        name = "stick";
        break;
      case 2:
        name = "bit";
        break;
      case 3:
        name = "knife";
        break;
      case 4:
        name = "spear";
        break;
      case 5:
        name = "handgun";
        break;
      case 6:
        name = "machine gun";
        break;
      case 7:
        name = "grenade launcher";
        break;
      case 8:
        name = "bomb";
        break;
      default:
        name = "stick";
    }
    return name;
  }

  render() {
    return (
      <div>
        <ul id="characteristics">
          <li>
            <span className="key">Health</span>
            {" "}
            :
            {" "}
            <span className="value">{this.props.health}</span>
          </li>
          <li>
            <span className="key">Weapon</span>
            {" "}
            :
            {" "}
            <span className="value">
              {this.getWeapornName(this.props.weaporn)}
            </span>
          </li>
          <li>
            <span className="key">Attack</span>
            {" "}
            :
            {" "}
            <span className="value">
              {(this.props.level + 5) * this.props.weaporn}
            </span>
          </li>
          <li>
            <span className="key">Level</span>
            {" "}
            :
            {" "}
            <span className="value">{this.props.level}</span>
          </li>
          <li>
            <span className="key">Nextlevel</span>
            {" "}
            :
            {" "}
            <span className="value">{this.props.xp + " XP"}</span>
          </li>
          <li>
            <span className="key">Dungeon</span>
            {" "}
            :
            {" "}
            <span className="value">{this.props.dungeon}</span>
          </li>
        </ul>
        <div className="clear" />
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dungeon: this.createDungeon(80, 80, 40), // width, heigth, number of rooms
      top: 0
    };

    this.setTop = this.setTop.bind(this);
  }

  setTop(top) {
    this.setState({ top: top });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dungeon != nextProps.dungeon || this.props.reset) {
      var newDungeon = this.createDungeon(80, 80, 40); // width, heigth, number of rooms
      this.setState({ dungeon: newDungeon });
    }
  }

  createDungeon(width, height, roomsNum) {
    // 0-wall, 1-dungeon
    var board = [];

    // helpers
    function checkGerm(germ) {
      if (
        germ.begin.row - 2 < 0 ||
        germ.begin.col - 2 < 0 ||
        germ.end.row + 2 >= height ||
        germ.end.col + 2 >= width
      ) {
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
          if (room.begin.row - 2 < 0) return false;
          for (var y = room.begin.row - 2; y <= room.begin.row - 1; y++) {
            for (var x = room.begin.col - 1; x <= room.end.col + 1; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 1: // left
          if (room.begin.col - 2 < 0) return false;
          for (var y = room.begin.row - 1; y <= room.end.row + 1; y++) {
            for (var x = room.begin.col - 2; x <= room.begin.col - 1; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 2: // right
          if (room.end.col + 2 >= width) return false;
          for (var y = room.begin.row - 1; y <= room.end.row + 1; y++) {
            for (var x = room.end.col + 1; x <= room.end.col + 2; x++) {
              if (board[y][x]) {
                return false;
              }
            }
          }
          return true;
        case 3: // down
          if (room.end.row + 2 >= height) return false;
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
      if (
        start.row - 2 < 0 ||
        start.row + 2 >= height ||
        start.col - 2 < 0 ||
        start.col + 2 >= width
      ) {
        return 0;
      }
      switch (direction) {
        case 0:
          return (
            board[start.row - 2][start.col] &&
            !board[start.row - 1][start.col] &&
            (!board[start.row - 1][start.col - 1] ||
              !board[start.row - 1][start.col + 1])
          );
        case 1:
          return (
            board[start.row][start.col - 2] &&
            !board[start.row][start.col - 1] &&
            (!board[start.row - 1][start.col - 1] ||
              !board[start.row + 1][start.col - 1])
          );
        case 2:
          return (
            board[start.row][start.col + 2] &&
            !board[start.row][start.col + 1] &&
            (!board[start.row - 1][start.col + 1] ||
              !board[start.row + 1][start.col + 1])
          );
        case 3:
          return (
            board[start.row + 2][start.col] &&
            !board[start.row + 1][start.col] &&
            (!board[start.row + 1][start.col - 1] ||
              !board[start.row + 1][start.col + 1])
          );
      }
    }

    function getRoomIndex(rooms, row, col) {
      for (var i = 0; i < rooms.length; i++) {
        if (
          rooms[i].begin.row <= row &&
          row <= rooms[i].end.row &&
          rooms[i].begin.col <= col &&
          col <= rooms[i].end.col
        ) {
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
          begin: {
            row: row - 1,
            col: col - 1
          },
          end: {
            row: row + 1,
            col: col + 1
          },
          completed: false,
          available: false
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
            start.col =
              Math.floor(
                Math.random() *
                  (rooms[available].end.col - rooms[available].begin.col)
              ) + rooms[available].begin.col;
            break;
          case 1:
            start.row =
              Math.floor(
                Math.random() *
                  (rooms[available].end.row - rooms[available].begin.row)
              ) + rooms[available].begin.row;
            start.col = rooms[available].begin.col;
            break;
          case 2:
            start.row =
              Math.floor(
                Math.random() *
                  (rooms[available].end.row - rooms[available].begin.row)
              ) + rooms[available].begin.row;
            start.col = rooms[available].end.col;
            break;
          case 3:
            start.row = rooms[available].end.row;
            start.col =
              Math.floor(
                Math.random() *
                  (rooms[available].end.col - rooms[available].begin.col)
              ) + rooms[available].begin.col;
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
    var styleObject = {
      top: this.state.top * 12 + "px",
      left: 0
    };

    return (
      // dungeon - dungeon level
      (
        <div id="board" style={styleObject}>
          <Dungeon
            dungeon={this.props.dungeon}
            data={this.state.dungeon}
            reset={this.props.reset}
          />
          <Objects
            health={this.props.health}
            weaporn={this.props.weaporn}
            level={this.props.level}
            xp={this.props.xp}
            board={this.state.dungeon}
            dungeon={this.props.dungeon}
            reset={this.props.reset}
            updateState={this.props.updateState}
            setBoardTop={this.setTop}
          />
        </div>
      )
    );
  }
}

class Dungeon extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only if dungeon level changes
    return this.props.dungeon != nextProps.dungeon || nextProps.reset;
  }

  render() {
    var trs = [];
    for (var i = 0; i < this.props.data.length; i++) {
      trs.push(<Tr key={i} index={i} data={this.props.data[i]} />);
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
      tds.push(<td key={i} className={this.props.data[i] ? "room" : "wall"} />);
    }

    return <tr>{tds}</tr>;
  }
}

class Objects extends React.Component {
  // all objects and game action
  constructor(props) {
    super(props);

    this.state = {
      objects: this.placeObjects(
        this.createObjects(this.props.dungeon),
        this.props.board
      )
    };

    this.placeObjects = this.placeObjects.bind(this);
    this.checkNext = this.checkNext.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentWillMount() {
    this.props.setBoardTop(-this.state.objects[1].position.row + 15);
    this.props.updateState({ position: this.state.objects[1].position });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dungeon != nextProps.dungeon || nextProps.reset) {
      var newObjects = this.placeObjects(
        this.createObjects(nextProps.dungeon),
        nextProps.board
      );
      this.setState({ objects: newObjects });
      this.props.setBoardTop(-newObjects[1].position.row + 15);
      this.props.updateState({ position: newObjects[1].position });
    }
  }

  createObjects(dungeon) {
    // dungeon level
    var settings = {};
    var objects = [];

    switch (dungeon) {
      case 1:
        settings.enemies = 20;
        settings.healthBonuses = 25;
        settings.weaporn = [2, 2, 2, 3, 3, 3, 4, 4];
        settings.enemyLevelMax = 10;
        settings.bossLevel = 1; //15
        break;
      case 2:
        settings.enemies = 20;
        settings.healthBonuses = 25;
        settings.weaporn = [3, 3, 4, 4, 5, 5, 5];
        settings.enemyLevelMax = 13;
        settings.bossLevel = 1; //20
        break;
      case 3:
        settings.enemies = 25;
        settings.healthBonuses = 25;
        settings.weaporn = [5, 5, 6, 6, 6, 7, 7, 7];
        settings.enemyLevelMax = 15;
        settings.bossLevel = 1; //25
        break;
      case 4:
        settings.enemies = 25;
        settings.healthBonuses = 25;
        settings.weaporn = [7, 7, 7, 8, 8, 8];
        settings.enemyLevelMax = 18;
        settings.bossLevel = 1; //30
        break;
      case 5:
        settings.enemies = 30;
        settings.healthBonuses = 25;
        settings.weaporn = [8, 8, 8];
        settings.enemyLevelMax = 20;
        settings.bossLevel = 1; //35
        break;
    }

    function createEnemy() {
      var enemy = {};
      enemy.type = "enemy";
      enemy.level = Math.floor(Math.random() * settings.enemyLevelMax) + 1;
      enemy.health = enemy.level * (Math.floor(Math.random() * 11) + 10) + 30;
      enemy.xp = enemy.level * 2;
      return enemy;
    }

    function createBoss() {
      var boss = {};
      boss.type = "boss";
      boss.level = settings.bossLevel;
      boss.health = boss.level * 100;
      boss.xp = 50;
      return boss;
    }

    function createHero() {
      var hero = {};
      hero.type = "hero";
      return hero;
    }

    function createWeaporn(attack) {
      var weaporn = {};
      weaporn.type = "weaporn";
      weaporn.attack = attack;
      return weaporn;
    }

    function createHealthBonus() {
      var bonus = {};
      bonus.type = "health";
      bonus.heal = Math.floor(Math.random() * 101) + 50;
      return bonus;
    }

    objects.push(createBoss()); // always 0
    objects.push(createHero()); // hero - always 1
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

  placeObjects(objects, board) {
    function isOccupied(row, col) {
      for (var i = 0; i < objects.length; i++) {
        if (
          objects[i].position != undefined &&
          objects[i].position.row == row &&
          objects[i].position.col == col
        ) {
          return true;
        }
      }
      return false;
    }

    function getFreePosition(board) {
      var check = false;
      var row;
      var col;
      while (!check) {
        row = Math.floor(Math.random() * board.length);
        col = Math.floor(Math.random() * board[0].length);
        check = board[row][col] && !isOccupied(row, col);
      }
      return {
        row: row,
        col: col
      };
    }

    for (var i = 0; i < objects.length; i++) {
      var position = getFreePosition(board);
      objects[i].position = position;
    }
    return objects;
  }

  checkNext(pos) {
    // -2 - wall, -1 - empty space, >=0 - index of object (bonus or enemy)
    if (!this.props.board[pos.row][pos.col]) {
      return -2;
    }
    var objects = this.state.objects;
    for (var i = 0; i < objects.length; i++) {
      if (
        objects[i].position.row == pos.row &&
        objects[i].position.col == pos.col
      ) {
        return i;
      }
    }
    return -1;
  }

  deleteObject(index) {
    var objects = this.state.objects;
    objects.splice(index, 1);
    this.setState({ objects: objects });
  }

  resetGame() {
    console.log("reset");
    this.props.updateState({
      health: 100,
      weaporn: 1,
      level: 1,
      xp: 50,
      dungeon: 1
      //"reset" : true
    });
    console.log("reset true");
    this.props.updateState({ reset: false });
    console.log("reset false");
    //this.props.updateState({"reset" : false});
  }

  handleNext(index) {
    // return go next
    if (index == -2) {
      return false; // wall
    } else if (index == -1) {
      return true; // empty space, just go
    } else if (index >= 0 && index != 1) {
      var type = index == 0 ? "enemy" : this.state.objects[index].type;
      switch (type) {
        case "enemy":
          var heroHealth =
            this.props.health - (this.state.objects[index].level + 5);
          var enemyHealth =
            this.state.objects[index].health -
            (this.props.level + 5) * this.props.weaporn;
          var xp = this.props.xp;
          var level = this.props.level;
          var dungeon = this.props.dungeon;
          if (heroHealth <= 0) {
            alert("You are died!");
            this.resetGame();
            return false;
          }
          if (enemyHealth <= 0) {
            // enemy is killed
            if (index == 0) {
              // boss
              if (heroHealth <= 0) {
                alert("You died as a Hero!");
                this.resetGame();
                return true;
              }
              dungeon++;
            }
            xp -= this.state.objects[index].xp;
            if (xp <= 0) {
              level++;
              xp = level * 10 + 50;
            }
            this.deleteObject(index);
            if (dungeon > 5) {
              this.resetGame();
            } else {
              this.props.updateState({
                health: heroHealth,
                xp: xp,
                level: level,
                dungeon: dungeon
              });
            }
            return true;
          } else {
            this.props.updateState({ health: heroHealth });
            var objects = this.state.objects;
            objects[index].health = enemyHealth;
            this.setState({ objects: objects });
            return false;
          }
        case "health":
          var health = this.props.health;
          health += this.state.objects[index].heal;
          this.props.updateState({
            health: health
          });
          this.deleteObject(index);
          return true;
        case "weaporn":
          if (this.props.weaporn < this.state.objects[index].attack) {
            this.props.updateState({
              weaporn: this.state.objects[index].attack
            });
          }
          this.deleteObject(index);
          return true;
      }
    } else {
      return true;
    }
  }

  // win

  render() {
    var objects = [];
    objects.push(
      <SingleObject // boss
        key={0}
        index={0}
        row={this.state.objects[0].position.row}
        col={this.state.objects[0].position.col}
        type={this.state.objects[0].type}
      />
    );
    for (var i = 2; i < this.state.objects.length; i++) {
      // weaporn, health, enemies
      objects.push(
        <SingleObject
          key={i}
          index={i}
          row={this.state.objects[i].position.row}
          col={this.state.objects[i].position.col}
          type={this.state.objects[i].type}
        />
      );
    }

    return (
      <div id="objects">
        {objects}
        <Hero
          health={this.props.health}
          weaporn={this.props.weaporn}
          level={this.props.level}
          xp={this.props.xp}
          dungeon={this.props.dungeon}
          row={this.state.objects[1].position.row}
          col={this.state.objects[1].position.col}
          reset={this.props.reset}
          checkNext={this.checkNext}
          handleNext={this.handleNext}
          setBoardTop={this.props.setBoardTop}
          updateState={this.props.updateState}
        />
      </div>
    );
  }
}

class SingleObject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var styleObject = {
      top: this.props.row * 12 + "px",
      left: this.props.col * 12 + "px"
    };
    return (
      <div
        id={"object-" + this.props.index}
        className={"object " + this.props.type}
        style={styleObject}
      />
    );
  }
}

class Hero extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: {
        row: this.props.row,
        col: this.props.col
      },
      newPosition: undefined
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnMount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dungeon != nextProps.dungeon || nextProps.reset) {
      var position = { row: nextProps.row, col: nextProps.col };
      this.setState({ newPosition: position });
    }
  }

  handleKeyDown(event) {
    function equalPositions(a, b) {
      // simple comparation of position objects
      for (var p in a) {
        if (a[p] !== b[p]) {
          return false;
        }
      }
      return true;
    }

    var position = JSON.parse(JSON.stringify(this.state.position)); // deep copy
    switch (event.key) {
      case "ArrowUp":
        position.row--;
        break;
      case "ArrowDown":
        position.row++;
        break;
      case "ArrowLeft":
        position.col--;
        break;
      case "ArrowRight":
        position.col++;
        break;
      default:
        return;
    }

    if (!equalPositions(position, this.state.position)) {
      var index = this.props.checkNext(position);
      if (this.props.handleNext(index) || this.props.reset) {
        if (this.state.position.row != position.row) {
          // up or down
          this.props.setBoardTop(-position.row + 15);
        }
        if (this.state.newPosition != undefined) {
          // dungeon changed, we must set new generated position
          position = this.state.newPosition;
          this.setState({ newPosition: undefined });
        }
        this.props.updateState({ position: position });
        this.setState({
          position: position
        });
      }
    }
  }

  render() {
    var position = {
      top: this.state.position.row * 12,
      left: this.state.position.col * 12
    };
    return <div id="hero" style={position} />;
  }
}

class Darkness extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var actionAreaPosition = {
      top: 10 * 12,
      left: (this.props.heroPosition.col - 5) * 12
    };

    var styleLeft = {
      width: this.props.heroPosition.col >= 5
        ? (this.props.heroPosition.col - 5) * 12
        : 0
    };

    var styleRight = {
      width: this.props.heroPosition.col <= 74
        ? (74 - this.props.heroPosition.col) * 12
        : 0
    };

    return (
      <div id="darkness">
        <div id="action-area" style={actionAreaPosition} />
        <div id="dark-up" className="dark" />
        <div id="dark-left" className="dark" style={styleLeft} />
        <div id="dark-right" className="dark" style={styleRight} />
        <div id="dark-down" className="dark" />
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("game"));