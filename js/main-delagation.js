import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
    getCellElementList,
    getCellElementAtIdx,
    getCurrentTurnElement,
    getGameStatusElement,
    getShowElement,
    getUlList,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// import liên kết giữa các module

// import
// console.log(getCellElementList());
// console.log(getCellElementAtIdx(4));
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function handleStatusElement(newStatusElement) {
    gameStatus = newStatusElement;

    const gameStatusElement = getGameStatusElement();
    if (!gameStatusElement) return;

    gameStatusElement.textContent = newStatusElement;
}

function showReplayElement() {
    const showReplayElement = getShowElement();
    if (!showReplayElement) return;

    if (gameStatus !== GAME_STATUS.PLAYING)
        showReplayElement.classList.add("show");
}

function handleHighLightElement(winPositions) {
    winPositions.forEach((index) =>
        getCellElementAtIdx(index).classList.add("win")
    );
}

function handleToggle() {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function handleCellElement(cell, index) {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) ||
        cell.classList.contains(TURN.CROSS);
    if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

    cell.classList.add(currentTurn);

    cellValues[index] =
        currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    handleToggle();

    const game = checkGameStatus(cellValues);

    switch (game.status) {
        case GAME_STATUS.ENDED: {
            handleStatusElement(game.status);
            showReplayElement();
            break;
        }

        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN: {
            handleStatusElement(game.status);
            showReplayElement();
            handleHighLightElement(game.winPositions);
            break;
        }

        default:
        //playing
    }
}

function handleReplayElement() {
    // reset  temp global vars
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");
    // mình phải reset lại các biến global , khi bắt đầu lại vòng mới nó sẽ không bị trùng

    handleStatusElement(GAME_STATUS.PLAYING);

    // reset Turn
    const currentTurnElement = getCurrentTurnElement();
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(TURN.CROSS);
    // reset Board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }
    // turn off replay
    const replayElement = getShowElement();
    replayElement.classList.remove("show");
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    const ulList = getUlList();

    cellElementList.forEach((cell, index) => {
        cell.dataset.id = index;
    });

    ulList.addEventListener("click", (event) => {
        if (event.target.tagName != "LI") return;
        const index = Number.parseInt(event.target.dataset.id);
        handleCellElement(event.target, index);
    });

    // event Delegation : nhanh hơn chỉ cần trỏ tới ul với tìm index của li đấy , nếu không cần dùng không gắn đỡ nhiều hơn
    // còn trường hợp main kia thì phải xét tất cả sự kiện cho thẻ li rồi lúc nào ấn thì có sẵn , rất lâu
}

function initReplayElement() {
    const replayElement = getShowElement();
    replayElement.addEventListener("click", handleReplayElement);
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    initCellElementList();
    initReplayElement();
})();
