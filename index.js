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
const parties = {
  me: 1,
  opponent: 1
}
const score = {
  me: 0,
  opponent: 0
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
  
  // We increment game parties if one player win
  if(result !== 0) {
    tickParty(result);
  }

  /**
   * We release the lock once we evaluate the opponent choice and show everything in the UI
   * then the user can pick other choice to maintain consistency
   */
  choiceLock = true
}

function tickParty(result) {
  if(result === 1) {
    let box = document.querySelector('.game-parties-container .my-parties')
    box.querySelector(`.party:nth-child(${parties.me})`).classList.add('win')
    parties.me++;
  } else {
    let box = document.querySelector('.game-parties-container .opponent-parties')
    box.querySelector(`.party:nth-child(${parties.opponent})`).classList.add('win')
    parties.opponent++;
  }

  if(parties.me === 4 || parties.opponent === 4) {
    if(parties.me === 4) {
      document.querySelector('.players-score-box .your-score').textContent = ++score.me
    } else if(parties.opponent === 4) {
      document.querySelector('.players-score-box .opponent-score').textContent = ++score.opponent
    }

    const resultText = document.querySelector('.game-result-text')
    // Remove last color of result text (we'll set its color in switch statement below)
    resultText.classList.remove(Array.from(resultText.classList)[resultText.classList.length-1])

    if(result === 1) {
      resultText.textContent = 'You win'
      resultText.classList.add('green')
    } else {
      resultText.textContent = 'opponent win'
      resultText.classList.add('red')
    }    

    // Display menu to allow user to click on 'play again' button
    document.querySelector('.game-menu').classList.remove('none')
    // Hide selection buttons because one player win
    document.querySelector('.selection-box').classList.add('none')
  }
}

document.querySelector('.play-button').addEventListener('click', e => {
  e.currentTarget.querySelector('.label').textContent = 'Play again'
  // Rest parties to default values
  parties.me = 1
  parties.opponent = 1
  
  // Remove all previous win parties UI
  document.querySelectorAll(`.game-parties-container .party`).forEach(party => party.classList.remove('win'))

  // Reset the result text and remove the old color and add the default one (gray)
  const resultText = document.querySelector('.game-result-text')
  resultText.textContent = '--'
  resultText.classList.remove(Array.from(resultText.classList)[resultText.classList.length-1])
  resultText.classList.add('gray')

  // remove old choices icons and replace choice box with glimmers and loading texts
  const myChoice = document.querySelector('#my-choice-box')
  const opponentChoice = document.querySelector('#opponent-choice-box')

  myChoice.innerHTML = 
    `<div class="full-center glimmer">
      <span class="loading-text">take your pick</span>
    </div>`;
  opponentChoice.innerHTML = 
    `<div class="full-center glimmer">
      <span class="loading-text">your opponent..</span>
    </div>`;

  document.querySelector('.game-menu').classList.add('none')
  document.querySelector('.selection-box').classList.remove('none')
});
