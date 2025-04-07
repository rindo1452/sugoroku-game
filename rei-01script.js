let money = 10000; // 初期所持金
let diceResult = 0;
let isGameStarted = false;
let currentStationIndex = 0;

const stations = [
  { name: "スタート", event: "" },
  { name: "駅2", event: "コンビニで買い物。500円失う。" },
  { name: "駅3", event: "公園で癒される。イベントなし。" },
  { name: "駅4", event: "バイト代GET！1000円もらう。" },
  { name: "駅5", event: "電車賃を払う。400円失う。" },
  { name: "駅6", event: "先輩にご飯おごってもらった！800円もらう。" },
  { name: "駅7", event: "うっかりスマホを落とす。1500円失う。" },
  { name: "駅8", event: "お年玉GET！2000円もらう。" },
  { name: "駅9", event: "カフェでのんびり。700円失う。" },
  { name: "ゴール", event: "" }
];

const board = document.getElementById("board");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");
const rollDiceButton = document.getElementById("roll-dice");
const resetButton = document.getElementById("reset-button");
const increaseMoneyButton = document.getElementById("increase-money");
const decreaseMoneyButton = document.getElementById("decrease-money");
const diceResultDiv = document.getElementById("dice-result");
const moneyDiv = document.getElementById("money");
const resetConfirmation = document.getElementById("reset-confirmation");
const confirmResetButton = document.getElementById("confirm-reset");
const cancelResetButton = document.getElementById("cancel-reset");
const confirmButton = document.getElementById("confirm-button");
const boardDiv = document.getElementById("board");

// ゲーム開始
startButton.addEventListener("click", () => {
  const initialMoney = parseInt(document.getElementById("money-start").value);
  money = isNaN(initialMoney) ? 10000 : initialMoney;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  isGameStarted = true;
  updateMoneyDisplay();
  generateBoard();
});

// サイコロを振る
rollDiceButton.addEventListener("click", () => {
  if (!isGameStarted) return;

  const dice = document.createElement('div');
  dice.classList.add('dice-roll');
  dice.textContent = '🎲';
  diceResultDiv.innerHTML = '';
  diceResultDiv.appendChild(dice);

  setTimeout(() => {
    dice.remove();
    diceResult = Math.floor(Math.random() * 6) + 1;
    diceResultDiv.textContent = `サイコロの結果: ${diceResult}`;


    
    currentStationIndex += diceResult;

    // ゴールを超えたら強制的にゴールに止める
    if (currentStationIndex >= stations.length - 1) {
      currentStationIndex = stations.length - 1;
      updateMoneyDisplay();
      updateBoard();
      triggerEvent(); // ゴールイベント発動
      return;
    }

    updateMoneyDisplay();
    updateBoard();
    triggerEvent();
  }, 1000);
});

// 駅ボード生成
function generateBoard() {
  boardDiv.innerHTML = '';
  stations.forEach((station, index) => {
    const stationDiv = document.createElement('div');
    stationDiv.classList.add('station');

    let nameText = station.name;
    let eventText = station.event;

    if (index === 0) {
      nameText = "🏁 スタート";
      eventText = "";
    } else if (index === stations.length - 1) {
      nameText = "🎉 ゴール";
      eventText = "";
    }

    stationDiv.innerHTML = `
      <div class="station-name">${nameText}</div>
      <div class="station-event">${eventText}</div>
    `;

    if (index === currentStationIndex) {
      stationDiv.classList.add('active');
    }

    boardDiv.appendChild(stationDiv);
  });
}

// ボード更新
function updateBoard() {
  const stationElements = document.querySelectorAll('.station');
  stationElements.forEach((station, index) => {
    if (index === currentStationIndex) {
      station.classList.add('active');
    } else {
      station.classList.remove('active');
    }
  });
}

// 所持金表示
function updateMoneyDisplay() {
  moneyDiv.textContent = `所持金: ${money}円`;
}

// イベント表示
function updateEventDisplay(position) {
  const eventText = stations[position]?.event || "イベントなし";
  document.getElementById("event-display").textContent = eventText;
}

// イベント発動
function triggerEvent() {
  const currentStation = stations[currentStationIndex];

  updateEventDisplay(currentStationIndex);

  if (currentStationIndex === 0 || currentStationIndex === stations.length - 1) {
    if (currentStationIndex === stations.length - 1) {
      alert("🎉 ゴールに到着しました！ゲームクリア！");
      document.getElementById("goal-message").textContent = "ゴールしました！おめでとう！";
      rollDiceButton.disabled = true;
    }
    return;
  }

  // 所持金の増減処理
  if (currentStation.event.includes("失う")) {
    const match = currentStation.event.match(/(\d+)円失う/);
    if (match) money -= parseInt(match[1]);
  } else if (currentStation.event.includes("もらう")) {
    const match = currentStation.event.match(/(\d+)円もらう/);
    if (match) money += parseInt(match[1]);
  }

  updateMoneyDisplay();
}

// お金を増やす
increaseMoneyButton.addEventListener("click", () => {
  money += 1000;
  updateMoneyDisplay();
});

// お金を減らす
decreaseMoneyButton.addEventListener("click", () => {
  money -= 1000;
  updateMoneyDisplay();
});

// リセット確認画面
resetButton.addEventListener("click", () => {
  resetConfirmation.style.display = "block";
});

// リセットキャンセル
cancelResetButton.addEventListener("click", () => {
  resetConfirmation.style.display = "none";
});

// ✅ リセット確定
confirmResetButton.addEventListener("click", () => {
  money = 10000;
  currentStationIndex = 0;
  updateMoneyDisplay();
  updateBoard();
  rollDiceButton.disabled = false;
  document.getElementById("goal-message").textContent = "";
  resetConfirmation.style.display = "none";
  generateBoard();
});