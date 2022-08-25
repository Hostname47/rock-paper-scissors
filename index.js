const choices = [ 'rock', 'paper', 'scissor' ]
const rules = {
  'rock-rock': 0,
  'paper-paper': 0,
  'scissor-scissor': 0,
  'rock-paper': -1,
  'rock-scissor': 1,
  'paper-rock': 1,
  'paper-scissor': -1,
  'scissor-rock': -1,
  'scissor-paper': 1,
}

function setChoiceIconToChoiceBox(box, choice, direction) {
  let icon = document.querySelector(`.${choice}-${direction}`).cloneNode(true)
  icon.classList.add('selected-choice')
  box.innerHTML = ''
  box.append(icon)
}

function evaluate(choice, opponentChoice) {
  return rules[`${choice}-${opponentChoice}`]
}

let choiceLock = true;

document.querySelectorAll('.selection-item').forEach(button => {
  button.addEventListener('click', e => {
    /**
     * Prevent user from choosing multiple time until we evaluate his choice with the opponent
     * choice and wait sometime before starting a new game (look at evaluate where we release the lock)
     */
    if(!choiceLock) return;
    choiceLock = false;

    let choice = button.dataset.type;
    let choiceBox = document.querySelector('#my-choice-box');
    setChoiceIconToChoiceBox(choiceBox, choice, 'right')
    computerEvaluate(choice)
  })
})

function computerEvaluate(choice) {
  // Choose a random choice
  const opponentChoice = choices[Math.floor(Math.random() * choices.length)]
  const choiceBox = document.querySelector('#opponent-choice-box');  
  setChoiceIconToChoiceBox(choiceBox, opponentChoice, 'left')
  /**
   * The result of evaluate function is either :
   *    -1 : opponent won
   *    0 : draw
   *    1 : you won
   */
  const result = evaluate(choice, opponentChoice);

  // Here we need to set a loading and remove it when release the lock to allow the user to start a new game
  
  setTimeout(() => {
    choiceLock = true
  }, 2800)
}