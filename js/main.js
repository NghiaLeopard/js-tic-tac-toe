import { TURN } from "./constants.js";
import {
    getCellElementList,
    getCellElementAtIdx,
    getCurrentTurnElement,
    getGameStatusElement,
} from "./selectors.js";

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
let isGameEnded = false;
let cellValues = new Array(9).fill("");

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
    if (isClicked) return;

    cell.classList.add(currentTurn);

    handleToggle();
}

function initCellElementList() {
    const cellElementList = getCellElementList();

    cellElementList.forEach((cell, index) =>
        cell.addEventListener("click", () => handleCellElement(cell, index))
    );
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
})();
