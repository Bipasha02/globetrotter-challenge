import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';

// Add Jest-DOM matchers for better assertions
import '@testing-library/jest-dom';

describe('App Component', () => {
  let mock;

  // Mock axios before each test
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // Clean up after each test
  afterEach(() => {
    mock.reset();
  });

  test('renders username input screen initially', () => {
    render(<App />);
    expect(screen.getByText('Globetrotter Challenge')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Start Playing')).toBeInTheDocument();
  });

  test('renders game UI after entering username and fetching data', async () => {
    // Mock the API response
    const mockData = {
      clues: ['Clue 1', 'Clue 2', 'Clue 3'],
      options: ['Paris', 'London', 'Tokyo', 'New York'],
      correctAnswer: 'Paris',
      funFact: 'Paris is known as the City of Light.',
    };
    mock.onGet('http://localhost:5000/api/destination').reply(200, mockData);

    // Render the app and enter a username
    render(<App />);
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const startButton = screen.getByText('Start Playing');

    fireEvent.change(usernameInput, { target: { value: 'Bipasha' } });
    fireEvent.click(startButton);

    // Wait for the API call and rendering
    await waitFor(() => {
      expect(screen.getByText('Clues:')).toBeInTheDocument();
      expect(screen.getByText('Clue 1')).toBeInTheDocument();
      expect(screen.getByText('Clue 2')).toBeInTheDocument();
      expect(screen.getByText('Clue 3')).toBeInTheDocument();
      expect(screen.getByText('Guess the City:')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
    });
  });

  test('displays feedback when a guess is correct', async () => {
    // Mock the API response
    const mockData = {
      clues: ['Clue 1', 'Clue 2', 'Clue 3'],
      options: ['Paris', 'London', 'Tokyo', 'New York'],
      correctAnswer: 'Paris',
      funFact: 'Paris is known as the City of Light.',
    };
    mock.onGet('http://localhost:5000/api/destination').reply(200, mockData);

    // Render the app and enter a username
    render(<App />);
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const startButton = screen.getByText('Start Playing');

    fireEvent.change(usernameInput, { target: { value: 'Bipasha' } });
    fireEvent.click(startButton);

    // Wait for the game UI to render
    await waitFor(() => {
      expect(screen.getByText('Guess the City:')).toBeInTheDocument();
    });

    // Click the correct answer
    const parisButton = screen.getByText('Paris');
    fireEvent.click(parisButton);

    // Check for correct feedback
    await waitFor(() => {
      expect(screen.getByText('🎉 Correct! Fun Fact: Paris is known as the City of Light.')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  test('displays feedback when a guess is incorrect', async () => {
    // Mock the API response
    const mockData = {
      clues: ['Clue 1', 'Clue 2', 'Clue 3'],
      options: ['Paris', 'London', 'Tokyo', 'New York'],
      correctAnswer: 'Paris',
      funFact: 'Paris is known as the City of Light.',
    };
    mock.onGet('http://localhost:5000/api/destination').reply(200, mockData);

    // Render the app and enter a username
    render(<App />);
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const startButton = screen.getByText('Start Playing');

    fireEvent.change(usernameInput, { target: { value: 'Bipasha' } });
    fireEvent.click(startButton);

    // Wait for the game UI to render
    await waitFor(() => {
      expect(screen.getByText('Guess the City:')).toBeInTheDocument();
    });

    // Click an incorrect answer
    const londonButton = screen.getByText('London');
    fireEvent.click(londonButton);

    // Check for incorrect feedback
    await waitFor(() => {
      expect(screen.getByText('😢 Wrong! The answer was Paris. Fun Fact: Paris is known as the City of Light.')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });
});