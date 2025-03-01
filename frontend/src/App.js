import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [gameData, setGameData] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState(null);
  const [username, setUsername] = useState('');

  const fetchDestination = async () => {
    const res = await axios.get('http://localhost:5000/api/destination');
    setGameData(res.data);
    setFeedback(null);
  };

  useEffect(() => {
    fetchDestination();
  }, []);

  const handleGuess = (guess) => {
    if (guess === gameData.correctAnswer) {
      setFeedback('correct');
      setScore({ ...score, correct: score.correct + 1 });
    } else {
      setFeedback('incorrect');
      setScore({ ...score, incorrect: score.incorrect + 1 });
    }
  };

  const handleNext = () => {
    fetchDestination();
  };

  const handleChallengeFriend = () => {
    const inviteLink = `http://localhost:3000?invitedBy=${username}&score=${score.correct}`;
    const message = `Hey! ${username} scored ${score.correct} in Globetrotter! Beat their score: ${inviteLink}`;
    window.open(`whatsapp://send?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!username) {
    return (
      <div className="App">
        <h1>Globetrotter Challenge</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => setUsername(username.trim())}>Start Playing</button>
      </div>
    );
  }

  if (!gameData) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Globetrotter Challenge</h1>
      <p>Score: {score.correct} Correct | {score.incorrect} Incorrect</p>
      <div>
        <h2>Clues:</h2>
        <ul>
          {gameData.clues.map((clue, idx) => (
            <li key={idx}>{clue}</li>
          ))}
        </ul>
        <h3>Guess the City:</h3>
        {gameData.options.map((option) => (
          <button key={option} onClick={() => handleGuess(option)}>
            {option}
          </button>
        ))}
      </div>

      {feedback === 'correct' && (
        <>
          <Confetti />
          <p>🎉 Correct! Fun Fact: {gameData.funFact}</p>
        </>
      )}
      {feedback === 'incorrect' && (
        <p>😢 Wrong! The answer was {gameData.correctAnswer}. Fun Fact: {gameData.funFact}</p>
      )}

      {feedback && <button onClick={handleNext}>Next</button>}
      <button onClick={handleChallengeFriend}>Challenge a Friend</button>
    </div>
  );
}

export default App;