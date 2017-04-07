class Game extends React.Component {
  constructor() {
      super();
  }

  render(){
    return(
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

  render(){
    return(<div>
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
  constructor() {
      super();
  }

  render(){
    return(
        <div id="board">
          <div id="dungeon">
            <table>
              <tbody></tbody>
            </table>
          </div>
        </div>
    );
  }
}

ReactDOM.render(<Game />,  document.getElementById('game'));