import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [gameData, setGameData] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(20);
  // const [timeractive , settimeractive] = useState(false);

  const fetchDestination = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5001/api/destination');
      setGameData(res.data);
      setFeedback(null);
      // setTimeLeft(20);
      // settimeractive(true);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setFeedback('Error fetching destination. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // setTimeout(() => {
  //   fetchDestination();
  // }, 250);

  // useEffect(() => {
  //   // fetchDestination();
  //   if(timeLeft >0){
  //     const timer = setTimeout(() => {setTimeLeft(timeLeft-1);
  //     console.log(timeLeft);
  //     }, 1000);
  //   }
  //   // if(timeLeft===0){
  //   //   settimeractive(false);
  //   //   setTimeout(fetchDestination, 2000);
  //   // }


  // }, [timeLeft]);

  useEffect(() => {
    fetchDestination();
  }, []);

  

  const handleGuess = (guess) => {
    if (feedback) return;
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
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const fallbackUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank') || window.open(fallbackUrl, '_blank');
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
        <button
          onClick={() => setUsername(username.trim())}
          disabled={!username.trim()}
        >
          Start Playing
        </button>
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
          <button
            key={option}
            onClick={() => handleGuess(option)}
            disabled={feedback || isLoading}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback === 'correct' && (
        <>
          <Confetti />
          <p className="feedback-correct">🎉 Correct! Fun Fact: {gameData.funFact}</p>
        </>
      )}
      {feedback === 'incorrect' && (
        <p className="feedback-incorrect">😢 Wrong! The answer was {gameData.correctAnswer}. Fun Fact: {gameData.funFact}</p>
      )}
      {feedback === 'error' && <p className="feedback-error">{feedback}</p>}

      {feedback && feedback !== 'error' && (
        <button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Next'}
        </button>
      )}
      <button onClick={handleChallengeFriend}>Challenge a Friend</button>
    </div>
  );
}

export default App;
