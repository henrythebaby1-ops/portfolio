import { QUESTION_BANK } from "./data.js";

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function getDeck(category, rounds, random = Math.random) {
  const selectedPool =
    category === "mixed"
      ? [
          ...QUESTION_BANK.grammar,
          ...QUESTION_BANK.english,
          ...QUESTION_BANK.math,
          ...QUESTION_BANK.history
        ]
      : QUESTION_BANK[category];

  return shuffle(selectedPool, random).slice(0, rounds);
}

export function createSession({ mode, category, rounds }) {
  const players = mode === "pvp" ? ["Player 1", "Player 2"] : ["Player"];

  return {
    mode,
    category,
    rounds,
    currentRound: 0,
    currentPlayerIndex: 0,
    streak: 0,
    answered: false,
    deck: getDeck(category, rounds),
    players: players.map((name) => ({
      name,
      score: 0,
      correct: 0
    })),
    achievements: []
  };
}

export function calculatePoints({ mode, isCorrect, streak, timeBonus = 0 }) {
  if (!isCorrect) {
    return 0;
  }

  const base = mode === "blitz" ? 140 : 100;
  const streakBonus = Math.min(streak, 4) * 20;
  return base + streakBonus + timeBonus;
}

export function submitAnswer(session, answerIndex, elapsedMs = 0) {
  const question = session.deck[session.currentRound];
  const player = session.players[session.currentPlayerIndex];
  const isCorrect = answerIndex === question.correctIndex;
  const timeBonus =
    session.mode === "blitz" ? Math.max(0, 60 - Math.floor(elapsedMs / 250)) : 0;

  session.answered = true;
  session.streak = isCorrect ? session.streak + 1 : 0;

  const points = calculatePoints({
    mode: session.mode,
    isCorrect,
    streak: session.streak - 1,
    timeBonus
  });

  player.score += points;
  if (isCorrect) {
    player.correct += 1;
  }

  unlockAchievements(session, isCorrect);

  return {
    isCorrect,
    points,
    explanation: question.explanation,
    correctIndex: question.correctIndex
  };
}

export function advanceSession(session) {
  if (session.mode === "pvp") {
    if (session.currentPlayerIndex === session.players.length - 1) {
      session.currentPlayerIndex = 0;
      session.currentRound += 1;
    } else {
      session.currentPlayerIndex += 1;
    }
  } else {
    session.currentRound += 1;
  }

  session.answered = false;
}

export function isSessionOver(session) {
  return session.currentRound >= session.rounds;
}

export function getWinner(session) {
  return [...session.players].sort((left, right) => right.score - left.score)[0];
}

function unlockAchievements(session, isCorrect) {
  const activePlayer = session.players[session.currentPlayerIndex];
  const achievements = new Set(session.achievements);

  if (isCorrect && session.category === "grammar") {
    achievements.add("Grammar Guardian: answer a grammar question correctly.");
  }

  if (session.streak >= 3) {
    achievements.add("Hot Streak: get 3 correct answers in a row.");
  }

  if (activePlayer.score >= 500) {
    achievements.add("Score Climber: reach 500 points.");
  }

  if (session.mode === "pvp" && isCorrect) {
    achievements.add("Duel Ready: score in a PvP round.");
  }

  session.achievements = [...achievements];
}
