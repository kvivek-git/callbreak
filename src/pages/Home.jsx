import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [players, setPlayers] = useState([""]);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    if (players.some((p) => p.trim() === "")) return;

    try {
      // Initialize scores to zero for each player
      const scores = players.map(() => 0);

      // Navigate to the game page with gameId
      navigate("/game", { state: { players, scores } });
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleRemovePlayer = (index) => {
    if (players.length === 1) return; // Prevent removing the last player
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
      <h1 className="text-3xl font-bold mb-5">Call Break Score Tracker</h1>
      <div className="w-full max-w-md space-y-3">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
              placeholder={`Player ${index + 1} Name`}
              value={player}
              onChange={(e) => {
                const newPlayers = [...players];
                newPlayers[index] = e.target.value;
                setPlayers(newPlayers);
              }}
            />
            <button
              className="bg-red-500 p-2 rounded text-white"
              onClick={() => handleRemovePlayer(index)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="w-full bg-green-500 p-2 rounded"
          onClick={() => setPlayers([...players, ""])}
        >
          Add Player
        </button>
        <button className="w-full bg-blue-500 p-2 rounded" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
