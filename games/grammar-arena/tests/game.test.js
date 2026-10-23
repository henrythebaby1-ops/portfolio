import test from "node:test";
import assert from "node:assert/strict";

import {
  calculatePoints,
  createSession,
  getDeck,
  getWinner,
  isSessionOver,
  submitAnswer,
  advanceSession
} from "../src/game.js";

test("grammar deck returns the requested number of questions", () => {
  const deck = getDeck("grammar", 5, () => 0.2);
  assert.equal(deck.length, 5);
  assert.ok(deck.every((item) => item.prompt));
});

test("mixed deck can pull from multiple subjects", () => {
  const deck = getDeck("mixed", 12, () => 0.4);
  assert.equal(deck.length, 12);
});

test("correct answers earn more points with streak bonuses", () => {
  assert.equal(calculatePoints({ mode: "quest", isCorrect: true, streak: 0 }), 100);
  assert.equal(calculatePoints({ mode: "quest", isCorrect: true, streak: 2 }), 140);
  assert.equal(calculatePoints({ mode: "blitz", isCorrect: true, streak: 1, timeBonus: 12 }), 172);
});

test("submitting answers updates score and correctness", () => {
  const session = createSession({ mode: "quest", category: "grammar", rounds: 3 });
  const firstQuestion = session.deck[0];
  const result = submitAnswer(session, firstQuestion.correctIndex, 1000);

  assert.equal(result.isCorrect, true);
  assert.equal(session.players[0].correct, 1);
  assert.ok(session.players[0].score >= 100);
  assert.ok(session.achievements.some((item) => item.includes("Grammar Guardian")));
});

test("pvp advances by player turn before moving to the next round", () => {
  const session = createSession({ mode: "pvp", category: "grammar", rounds: 2 });

  advanceSession(session);
  assert.equal(session.currentRound, 0);
  assert.equal(session.currentPlayerIndex, 1);

  advanceSession(session);
  assert.equal(session.currentRound, 1);
  assert.equal(session.currentPlayerIndex, 0);
});

test("session reports completion and winner correctly", () => {
  const session = createSession({ mode: "quest", category: "grammar", rounds: 1 });
  const question = session.deck[0];
  submitAnswer(session, question.correctIndex, 0);
  advanceSession(session);

  assert.equal(isSessionOver(session), true);
  assert.equal(getWinner(session).name, "Player");
});
