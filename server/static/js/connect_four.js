/* Connect Four HTML5 with canvas
   AI using Monte Carlo tree search
   https://en.wikipedia.org/wiki/Monte_Carlo_tree_search
*/

var Display = (function() {
    /* Draw UI */
    var canvas, context;
    var isRendered = false;
    var pieceColors = {
        0: '#FFFFFF',
        1: '#3ec2e6',
        2: '#f6a356',
        hover: '#4ecd7d'
    };
    var boardColor = "#1A535C";
    var discRadius = 25;

    function _drawMask() {
        // TODO: squeeze and larger slots
        // http://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas
        // -->  http://stackoverflow.com/a/11770000/917957
        context.save();
        context.fillStyle = boardColor;
        context.beginPath();
        var x, y;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                context.arc(_columnPosition(x), _rowPosition(y), discRadius, 0, 2 * Math.PI);
                context.rect(75 * x + 150, 75 * y, -100, 100);
            }
        }
        context.fill();
        context.restore();
    }

    function drawPiece(x, y, player, animation) {
        animation = typeof animation !== 'undefined';
        x = _columnPosition(x);
        y = animation ? y + 50 : _rowPosition(y);
        context.save();
        context.fillStyle = pieceColors[player];
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(x, y, discRadius, 0, 2 * Math.PI, false);
        context.fill();
        context.restore();
    }

    function render(canvasBoard) {
        canvas = canvasBoard;
        context = canvas.getContext('2d');
        clear();
        _drawMask();
        isRendered = true;
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        isRendered = false;
    }

    function _columnPosition(x) {
        return 75 * x + 100;
    }

    function _rowPosition(y) {
        return 75 * y + 50;
    }

    function animate(column, player, to_row, cur_pos, map, callback) {
        if (to_row * 75 >= cur_pos) {
            clear();
            draw(map);
            drawPiece(column, cur_pos, player, true);
            _drawMask();
            window.requestAnimationFrame(function () {
                animate(column, player, to_row, cur_pos + discRadius, map, callback);
            });
        } else {
            callback();
        }
    }

    function draw(map) {
        var x, y;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                drawPiece(x, y, map[y][x]);
            }
        }
    }

    function onColumn(coord, x) {
        x = _columnPosition(x);
        return (coord[0] - x) * (coord[0] - x) <= discRadius * discRadius;
    }

    function renderMessage(message) {
        context.save();
        context.font = '14pt sans-serif';
        context.fillStyle = "#fff";
        context.fillText(message, 200, 20);
        context.restore();
    }

    return {
        isRendered: isRendered,
        render: render,
        clear: clear,
        draw: draw,
        drawPiece: drawPiece,
        onColumn: onColumn,
        animate: animate,
        renderMessage: renderMessage
    };
})();


var Game = (function(board) {
  /* Game controls. Start, get player, determine winner */
  var canvas, ai;
  var map = [];
  var hoverSpot;
  var initialized = false;
  var gameEnded = false;
  var turn = 1;
  var aiTimeLimit = 1; // seconds
  // For conlcusions
  var countGames = 0;
  var countComputerWins = 0;

  function _initMap() {
    // Initialize 7x6 map
    var i, j;
    for (i = 0; i < 6; i++) {
      map[i] = [];
      for (j = 0; j < 7; j++) {
        map[i][j] = 0;
      }
    }
  }

  function _init() {
    if (board.isRendered && initialized) {
      return;
    }
    _initMap();
    canvas = document.getElementById('connect-four');
    board.render(canvas);
    canvas.addEventListener('click', function(e) {
      playerClick(e);
    });
    canvas.addEventListener('mousemove', function(e) {
      playerHover(e);
    });
    canvas.addEventListener('mouseout', function() {
      if (hoverSpot !== undefined) {
        board.drawPiece(hoverSpot[0], hoverSpot[1], 0);
      }
    });
    // TODO: add setting for who goes first
    initialized = true;
  }

  function _fourInRow(slice, currentDisc) {
    return slice.every(function(element) {
        return element === currentDisc;
    });
  }

  function _checkWinner(altMap) {
    altMap = _orDefault(altMap, map);
    var i, j, k, seq, fourRowSlice;
    for (i = 0; i < 6; i++) {
      for (j = 0; j < 7; j++) {
        currentDisc = altMap[i][j];
        if (currentDisc === 0) {
          continue;
        }
        // horizontal
        if (j + 3 < 7) {
          seq = altMap[i].slice(j, j + 4);
          if (_fourInRow(seq, currentDisc)) {
            return {status: true, winnerId: currentDisc};
          }
        }
        if (i + 3 >= 6) {
          continue;
        }
        // vertical
        fourRowSlice = altMap.slice(i, i + 4);
        seq = fourRowSlice.map(function(value, index) { return value[j]; });
        if (_fourInRow(seq, currentDisc)) {
          return {status: true, winnerId: currentDisc};
        }
        // diagonals
        if (j + 3 < 7) {
          seq = fourRowSlice.map(function(value, index) { return value[j + index]; });
          if (_fourInRow(seq, currentDisc)) {
            return {status: true, winnerId: currentDisc};
          }
        }
        // top-right diagonal
        if (j - 3 >= 0) {
          seq = fourRowSlice.map(function(value, index) { return value[j - index]; });
          if (_fourInRow(seq, currentDisc)) {
            return {status: true, winnerId: currentDisc};
          }
        }
      }
    }
    // check if draw
    if ((turn === 42) && (!gameEnded)) {
      return {status: true, winnerId: 0};
    }
    return {status: false};
  }

  function _updateStatTexts(className, updatedValue) {
      var classes = document.getElementsByClassName(className);
      for (var i = 0; i < classes.length; i++) {
          classes[i].innerHTML = updatedValue;
      }
  }

  function _endGame(winner) {
    //this.paused = true;
    gameEnded = true;
    //this.rejectClick = false;
    var msg = '';
    if (winner === 0) {
      msg += "It's a draw";
    } else {
      msg += 'Player ' + winner + ' Wins';
    }
    msg += " - Click to Reset";
    // Conclusions
    countGames++;
    if (winner === 2) {
        countComputerWins++;
    }
    var pluralChar = countGames === 1 ? '' : 's';
    Array.prototype.map.call(document.getElementsByClassName('games-plural'), function(pluralSpan) {
      pluralSpan.innerHTML = pluralChar;
    });
    var percentWins = Math.floor((countComputerWins / countGames) * 100);
    var activeConclusionParagraph = document.getElementsByClassName('active-conclusion')[0];
    activeConclusionParagraph.className = activeConclusionParagraph.className.replace(/\bactive-conclusion\b/, '');
    if (percentWins < 50) {
        document.getElementById('conc-monte-losing').className += ' active-conclusion';
      _updateStatTexts('num-wins', countGames - countComputerWins);
      _updateStatTexts('percent-wins', 100 - percentWins);
    }
    else if (percentWins > 50) {
      document.getElementById('conc-monte-winning').className += ' active-conclusion';
      _updateStatTexts('num-wins', countComputerWins);
      _updateStatTexts('percent-wins', percentWins);
    } else {
      document.getElementById('conc-tie-games').className += ' active-conclusion';
    }
    _updateStatTexts('num-games', countGames);
    board.renderMessage(msg);
  }

  function startGame(opponentPlayer) {
    if (!initialized) {
      _init();
    }
    ai = opponentPlayer;
    ai.assignMethods(_checkWinner, legalMoves, getNextState);
    board.draw(map);
  }

  function _actionCallback() {
    if (gameEnded) {
      return;
    }
    // Pass COPY of map
    var mapCopy = map.map(function(arr) {
        return arr.slice();
    });
    var play = ai.getPlay(mapCopy, aiTimeLimit);
    action(play, function() {
      return;
    });
  }

  function _isHumanTurn(playTurn) {
    playTurn = _orDefault(playTurn, turn);
    return playTurn % 2 !== 0;
  }

  function legalMoves(movesMap) {
    movesMap = typeof movesMap === 'undefined' ? map : movesMap;
    var moves = [];
    var i;
    for (i = 0; i < 7; i++) {
      if (movesMap[0][i] === 0) {
        moves.push(i);
      }
    }
    return moves;
  }

  function playerClick(e) {
    if (gameEnded) {
        ai.clearCanvas();
        _initMap();
        board.render(canvas);
        turn = 1;
        gameEnded = false;
        return false;
    }
    if (!_isHumanTurn()) {
        return false;
    }
    var coord = _getCoord(e);
    var j, valid;
    for (j = 0; j < 7; j++) {
      if (board.onColumn(coord, j)) {
        // paused = false;
        valid = action(j, _actionCallback);
        if (valid === 1) { // give user retry if action is invalid
            rejectClick = true;
        }
        board.draw(map);
        break; //because there will be no 2 points that are clicked at a time
      }
    }
    return true;
  }

  function _orDefault(option, defaultOption) {
    return typeof option === 'undefined' ? defaultOption : option;
  }

  function _getTurnCount(altMap) {
    altMap = _orDefault(altMap, map);
    var sumTurn = 1;
    for (var i = 0; i < 6; i++) {
      sumTurn += altMap[i].reduce(function(a, b) { return a + ((b !== 0) ? 1 : 0); }, 0);
    }
    return sumTurn;
  }

  function getNextState(play, currState) {
    currState = _orDefault(currState, map);
    var row = getActionRow(play, currState);
    var currTurn = _getTurnCount(currState);
    currState[row][play] = _isHumanTurn(currTurn) ? 1 : 2;
    return currState;
  }

  function getActionRow(column, altMap) {
    altMap = _orDefault(altMap, map);
    var row = 5, i;
    for (i = 0; i < 5; i++) {
      if (altMap[i + 1][column] !== 0) {
        row = i;
        break;
      }
    }
    return row;
  }

  function action(column, callback) {
    if (map[0][column] !== 0 || column < 0 || column > 6) {
      return false;
    }
    var row = getActionRow(column);
    board.animate(column, playerMove(), row, 0, map, function () {
      hoverSpot = undefined;
      map[row][column] = playerMove();
      board.draw(map);
      var winner = _checkWinner();
      if (winner.status === true) {
        _endGame(winner.winnerId);
        return;
      }
      turn++;
      callback();
    });
    //this.paused = true;
    return true;
  }

  function playerMove() {
    return _isHumanTurn() ? 1 : 2;
  }

  function _getCoord(e) {
    var rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function playerHover(e) {
    if (!_isHumanTurn()) {
      return false;
    }
    var coord = _getCoord(e);
    var j, valid;
    for (j = 0; j < 7; j++) {
      if (board.onColumn(coord, j)) {
        // now color the bottom circle in that row if applicable
        for (var i = 5; i >= 0; i--) {
          if (map[i][j] === 0) {
            if (hoverSpot!== undefined && (hoverSpot[0] !== j || hoverSpot[1] !== i)) {
              board.drawPiece(hoverSpot[0], hoverSpot[1], 0);
            }
            hoverSpot = [j, i];
            board.drawPiece(j, i, 'hover');
            break;
          }
        }
      }
    }
  }

    return {
        start: startGame,
    };

})(Display);


var MonteCarloPlayer = (function() {
  /* AI implementing monte carlo tree search algo */
  var checkWinner, legalMoves, getNextState, canvas, context;
  var maxMoves = 42;
  var plays = {};
  var wins = {};
  var totalGamesSimulated = 0;
  var showGamesSimulated = false;

  function _getCurrentSeconds() {
    return new Date().getTime() / 1000;
  }

  function assignMethods(checkWinnerMethod, legalMovesMethod, getNextStateMethod) {
    // TODO: This feels weird and hacky
    checkWinner = checkWinnerMethod;
    legalMoves = legalMovesMethod;
    getNextState = getNextStateMethod;
  }

  function _formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function getPlay(map, timeLimit) {
    var startTime = _getCurrentSeconds();
    var gamesPlayed = 0;
    var legal = legalMoves(map);
    if (legal.length === 1) {
      return legal[0];
    }
    while (_getCurrentSeconds() - startTime < timeLimit) {
      gamesPlayed++;
      _runSimulation(map);
    }
    totalGamesSimulated += gamesPlayed;
    document.getElementById('simulated-games').innerHTML = _formatNumber(totalGamesSimulated);
    document.getElementById('games-per-year').innerHTML = _formatNumber(Math.floor(totalGamesSimulated / 365));
    if (!showGamesSimulated && gamesPlayed > 0) {
      document.getElementById('conclusion-simulated-games').style.display = 'inherit';
      showGamesSimulated = true;
    }
    var movesStates = [];
    for (var legalIndex in legal) {
      movesStates.push([legal[legalIndex], getNextState(legal[legalIndex], _copyState(map))]);
    }

    var percentages = {};
    var play;
    for (var i = 0; i < movesStates.length; i++) {
      play = [2, movesStates[i][1]];
      if (play in wins) {
        percentages[movesStates[i][0]] = wins[play] / plays[play];
      } else {
        percentages[movesStates[i][0]] = 0;
      }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    maxPlay = Object.keys(percentages).reduce(function(a, b) {
      return percentages[a] > percentages[b] ? a : b;
    });
    displayPercentages(percentages, maxPlay);
    displayGamesSimulated(gamesPlayed, percentages);
    return parseInt(maxPlay);
  }

  function _copyState(state) {
    return state.map(function(arr) {
        return arr.slice();
    });
  }

  function _runSimulation(state) {
    var visitedStates = [];
    var i;
    var player = 2; // Always start as computer ID 2
    var expand = true;
    var winnerId = 0;
    for (i = 0; i < maxMoves; i++) {
      legal = legalMoves(state);
      if (legal.length === 0) {
        break;
      }
      play = legal[Math.floor(Math.random() * legal.length)];
      state = getNextState(play, _copyState(state));

      if (expand && !([player, state] in plays)) {
        expand = false;
        plays[[player, state]] = 0;
        wins[[player, state]] = 0;
      }

      if (visitedStates.indexOf([player, state]) === -1) {
        visitedStates.push([player, state]);

      }

      player = (player == 1) ? 2 : 1;
      winner = checkWinner(state);
      if (winner.status === true) {
        winnerId = winner.winnerId;
        break;
      }
    }

    // Next loop for player, state in visitedStates
    for (i = 0; i < visitedStates.length; i++) {
      player = visitedStates[i][0];
      state = visitedStates[i][1];
      if (!([player, state] in plays)) {
        continue;
      }
      plays[[player, state]] += 1;
      if (player === winnerId) {
        wins[[player, state]] += 1;
      }
    }
  }

  function initCanvas() {
    canvas = document.getElementById('ai-output');
    context = canvas.getContext('2d');
  }

  function displayGamesSimulated(gamesSimulated, percentages) {
    context.font = '12pt sans-serif';
    context.fillStyle = '#000';
    var sumPercentages = 0;
    var percLength = 0;
    for (column in percentages) {
      sumPercentages += percentages[column];
      percLength++;
    }
    var avgPercentage = Math.round(sumPercentages / percLength * 100);
    context.fillText('Games Simulated: ' + _formatNumber(gamesSimulated), 130, 50);
    context.fillText('Avg. Confidence: ' + avgPercentage + '%', 355, 50);
  }

  function displayPercentages(percentages, maxPlay) {
    context.save();
    context.font = '14pt sans-serif';
    var cleanPercent;
    for (var x in percentages) {
      cleanPercent = Math.round(percentages[x] * 100);
      context.fillStyle = (x === maxPlay) ? '#51d223' : '#000';
      context.fillText(cleanPercent + '%', 75 * x + 88, 20);
    }
    context.restore();
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return {
    maxMoves: maxMoves,
    assignMethods: assignMethods,
    getPlay: getPlay,
    initCanvas: initCanvas,
    clearCanvas: clearCanvas
  };

})();

document.addEventListener('DOMContentLoaded', function(event) {
  MonteCarloPlayer.initCanvas();
  Game.start(MonteCarloPlayer);
});
