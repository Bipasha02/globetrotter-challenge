const express = require('express');
const cors = require('cors');
const app = express();
// const port = process.env.PORT || 5000;
const port = 5001;

app.use(cors(
  {
  origin: 'http://localhost:3000' 
}
));
app.use(express.json());

const destinations = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    funFact: "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
    trivia: "Paris was originally a Roman city called Lutetia."
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming."
    ],
    funFact: "Tokyo was originally a small fishing village called Edo!",
    trivia: "The city has over 160,000 restaurants, more than any other city."
  },
  {
    city: "New York",
    country: "USA",
    clues: [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters."
    ],
    funFact: "The Statue of Liberty was originally a copper color before oxidizing.",
    trivia: "The Empire State Building has its own zip code: 10118."
  }
];

app.get('/api/destination', (req, res) => {
  const randomIndex = Math.floor(Math.random() * destinations.length);
  const destination = destinations[randomIndex];
  const randomClues = destination.clues.sort(() => 0.5 - Math.random()).slice(0, 2);
  const options = [
    destination.city,
    ...destinations
      .filter(d => d.city !== destination.city)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(d => d.city)
  ].sort(() => 0.5 - Math.random());

  res.json({
    clues: randomClues,
    options,
    correctAnswer: destination.city,
    funFact: destination.funFact,
    trivia: destination.trivia
  });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
