import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LuCrown } from "react-icons/lu";

export default function Game() {
  const { state } = useLocation();
  const players = state?.players || [];

  const [scores, setScores] = useState({});
  const [guesses, setGuesses] = useState({});
  const [history, setHistory] = useState([]);
  const [totalScores, setTotalScores] = useState(() =>
    players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {})
  );
  const [topScorer, setTopScorer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (topScorer) {
      const timer = setTimeout(() => setTopScorer(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [topScorer]);

  const handleLockGuesses = () => {
    for (const player of players) {
      const guessed = Number(guesses[player]);

      if (!guessed || guessed < 1) {
        alert(`Invalid guess for player "${player}". Please enter a value of 1 or more.`);
        return;
      }
    }

    setIsLocked(true);
  };

  const handleSubmitRound = () => {
    for (const player of players) {
      const obtained = scores[player];

      if (obtained === undefined || obtained === "") {
        alert(`Missing obtained score for player "${player}". Please enter a value.`);
        return;
      }
    }

    const newHistory = [...history];
    const roundScores = {};

    players.forEach((player) => {
      const guessed = Number(guesses[player]) || 0;
      const obtained = Number(scores[player]) || 0;
      const finalScore = (obtained >= guessed && obtained <= 2 * guessed) ? (guessed + obtained) / 2.0 : -guessed;

      roundScores[player] = finalScore;
      setTotalScores((prev) => ({
        ...prev,
        [player]: prev[player] + finalScore,
      }));
    });

    newHistory.push(roundScores);
    setHistory(newHistory);
    setScores({});
    setGuesses({});
    setIsLocked(false);

    const updatedScores = { ...totalScores };
    players.forEach((player) => {
      updatedScores[player] += roundScores[player];
    });
    const topScorerData = Object.entries(updatedScores).sort((a, b) => b[1] - a[1])[0];
    setTopScorer({ name: topScorerData[0], score: topScorerData[1] });
  };

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-white relative overflow-hidden">
      <h1 className="text-2xl font-bold text-center mb-5">Game Score Tracker</h1>

      {topScorer && (
        <div className="absolute bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transform -translate-x-1/2 md:translate-x-0 md:top-5 md:right-5 top-1/2 left-1/2">
          🎉 Top Scorer: {topScorer.name} with {topScorer.score} points!
        </div>
      )}

      {/* Game History */}
      <div className="bg-gray-800 p-2 rounded mb-5">
        <h2 className="text-lg font-semibold">Game History</h2>
        {history.map((round, index) => (
          <div key={index} className="p-2 border-b border-gray-700">
            <strong>{index + 1}</strong>:
            {Object.entries(round).map(([player, points]) => (
              <span key={player} className="ml-2">
                {player}: {points} pts
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Ranking Table */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        {Object.entries(totalScores)
          .sort((a, b) => b[1] - a[1])
          .map(([player, total], index) => (
            <div
              key={player}
              className="relative bg-gray-700 text-white p-4 rounded-lg shadow-md text-center"
            >
              <span className="absolute top-2 right-2 bg-blue-500 text-l px-2 py-1 rounded-full">
                {index === 0 ? <LuCrown className="w-6 h-6" /> : index + 1}
              </span>
              <strong className="block text-lg">{player}</strong>
              <p className="text-sm">{total} pts</p>
            </div>
          ))}
      </div>

      {/* Input Section */}
      <div className="space-y-3 mt-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="w-24">{player}</span>
            <input
              type="number"
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded w-20"
              placeholder="Guess"
              value={guesses[player] || ""}
              onChange={(e) => setGuesses({ ...guesses, [player]: e.target.value })}
              min="1"
              disabled={isLocked}
            />
            <input
              type="number"
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded w-20"
              placeholder="Obtained"
              value={scores[player] || ""}
              onChange={(e) => setScores({ ...scores, [player]: e.target.value })}
              disabled={!isLocked}
            />
          </div>
        ))}

        {/* Lock / Submit Button */}
        {isLocked ? (
          <button className="w-full bg-green-500 p-2 rounded mt-3" onClick={handleSubmitRound}>
            Submit Round
          </button>
        ) : (
          <button className="w-full bg-yellow-500 p-2 rounded mt-3" onClick={handleLockGuesses}>
            Lock Guesses
          </button>
        )}
      </div>
    </div>
  );
}
