import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Game() {
  const { state } = useLocation();
  const players = state?.players || [];

  const [scores, setScores] = useState({});
  const [guesses, setGuesses] = useState({});
  const [history, setHistory] = useState([]);
  const [totalScores, setTotalScores] = useState(() =>
    players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {})
  );

  const handleSubmitRound = async () => {
    const newHistory = [...history];

    const roundScores = {};
    players.forEach((player) => {
      const guessed = Number(guesses[player]) || 0;
      const obtained = Number(scores[player]) || 0;
      const finalScore = obtained >= (guessed+obtained)/2 ? obtained : 0;

      roundScores[player] = finalScore;
      setTotalScores((prev) => ({
        ...prev,
        [player]: prev[player] + finalScore,
      }));

      // Save to Appwrite
      
    });

    newHistory.push(roundScores);
    setHistory(newHistory);
    setScores({});
    setGuesses({});
  };

  return (
    <div className="h-screen p-5 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-center mb-5">Game Score Tracker</h1>

      {/* Game History */}
      <div className="bg-gray-800 p-3 rounded mb-5">
        <h2 className="text-lg font-semibold">Game History</h2>
        {history.map((round, index) => (
          <div key={index} className="p-2 border-b border-gray-700">
            <strong>Round {index + 1}</strong>:{" "}
            {Object.entries(round).map(([player, points]) => (
              <span key={player} className="ml-2">
                {player}: {points} pts
              </span>
            ))}
          </div>
        ))}
        {/* Total Scores Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
          {Object.entries(totalScores)
            .sort((a, b) => b[1] - a[1]) // Sort by total points (descending)
            .map(([player, total], index) => (
              <div key={player} className="relative bg-gray-700 text-white p-4 rounded-lg shadow-md text-center">
                {/* Ranking Badge in the Top Right Corner */}
                <span className="absolute top-2 right-2 bg-blue-500 text-l px-2 py-1 rounded-full">
                  {index + 1}
                </span>
                <strong className="block text-lg">{player}</strong>
                <p className="text-sm">{total} pts</p>
              </div>
            ))}
        </div>
      </div>

      {/* Score Input */}
      <div className="space-y-3">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="w-24">{player}</span>
            {/* Guessed Points */}
            <input
              type="number"
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded w-20"
              placeholder="Guess"
              value={guesses[player] || ""}
              onChange={(e) => setGuesses({ ...guesses, [player]: e.target.value })}
            />
            {/* Obtained Points */}
            <input
              type="number"
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded w-20"
              placeholder="Obtained"
              value={scores[player] || ""}
              onChange={(e) => setScores({ ...scores, [player]: e.target.value })}
            />
          </div>
        ))}
        <button className="w-full bg-blue-500 p-2 rounded mt-3" onClick={handleSubmitRound}>
          Submit Round
        </button>
      </div>
    </div>
  );
}
