import { create } from "zustand";

const useGameStore = create((set) => ({
  players: [],
  stake: 0,
  scores: [],
  setGameData: (players, stake) =>
    set({ players, stake, scores: Array(players.length).fill(0) }),
  updateScores: (newScores) => set({ scores: newScores }),
}));