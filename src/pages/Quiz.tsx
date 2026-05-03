import Layout from "../components/Layout";
import { useId, useMemo, useState, useEffect, useCallback, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Play,
  Crown,
  Zap,
  Star,
  Target,
  Award,
  User,
  Users2,
  Gamepad2,
  Sparkles
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
};

type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  isReady: boolean;
  isOnline: boolean;
  lastAnswer?: string;
  answerTime?: number;
};

type GameRoom = {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  gameStarted: boolean;
  currentQuestion: number;
  timeLeft: number;
  status: "waiting" | "playing" | "finished";
};

const QUESTIONS: Question[] = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
    difficulty: "easy",
    category: "Math"
  },
  {
    question: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Bangalore"],
    answer: "Delhi",
    difficulty: "easy",
    category: "Geography"
  },
  {
    question: "React is a ___?",
    options: ["Library", "Language", "Database", "OS"],
    answer: "Library",
    difficulty: "medium",
    category: "Programming"
  },
  {
    question: "Which hook is used for side effects?",
    options: ["useMemo", "useState", "useEffect", "useRef"],
    answer: "useEffect",
    difficulty: "medium",
    category: "React"
  },
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    answer: "Cascading Style Sheets",
    difficulty: "easy",
    category: "Web Development"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
    difficulty: "easy",
    category: "Science"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: "O(log n)",
    difficulty: "hard",
    category: "Algorithms"
  },
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["<h1>", "<h6>", "<header>", "<head>"],
    answer: "<h1>",
    difficulty: "easy",
    category: "HTML"
  }
];

type GameMode = "menu" | "single" | "multiplayer" | "room-select" | "waiting" | "playing" | "finished";

export default function Quiz() {
  const reactId = useId();
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [finished, setFinished] = useState(false);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("playerName") || "");
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Multiplayer state
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [currentPlayer] = useState<Player | null>(() => {
    const savedName = localStorage.getItem("playerName") || "Player";
    return {
      id: `player_${reactId}`,
      name: savedName,
      avatar: "🎯",
      score: 0,
      streak: 0,
      isReady: false,
      isOnline: true
    };
  });
  const [roomCode, setRoomCode] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const timerRef = useRef<number | null>(null);
  const confettiTimeoutRef = useRef<number | null>(null);

  const moveToNext = useCallback(() => {
    setCurrent((prev) => {
      const next = prev + 1;
      if (next < QUESTIONS.length) {
        setTimeLeft(20);
        setSelectedAnswer(null);
        setIsCorrect(null);
        return next;
      }
      setFinished(true);
      return prev;
    });
  }, []);

  const handleTimeout = useCallback(() => {
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    moveToNext();
  }, [moveToNext]);

  // Timer effect
  useEffect(() => {
    if (gameMode !== "playing" || finished) return;

    timerRef.current = window.setTimeout(() => {
      if (timeLeft <= 1) {
        handleTimeout();
      } else {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameMode, finished, handleTimeout]);

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers

    setSelectedAnswer(option);
    const correct = option === QUESTIONS[current].answer;
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.max(0, timeLeft * 2);
      const streakBonus = streak * 5;
      const points = 10 + timeBonus + streakBonus;

      setScore((prev) => prev + 1);
      setCoins((prev) => prev + points);
      setStreak((prev) => prev + 1);

      // Show confetti for correct answers
      if (streak >= 3) {
        setShowConfetti(true);
        confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setStreak(0);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const createRoom = () => {
    const room: GameRoom = {
      id: `room_${Date.now()}`,
      name: `${playerName}'s Room`,
      players: [currentPlayer!],
      maxPlayers: 4,
      isPrivate: false,
      gameStarted: false,
      currentQuestion: 0,
      timeLeft: 20,
      status: "waiting"
    };
    setCurrentRoom(room);
    setGameMode("waiting");
  };

  const startGame = () => {
    if (currentRoom) {
      setGameMode("playing");
      setCurrent(0);
      setScore(0);
      setCoins(0);
      setStreak(0);
      setTimeLeft(20);
      setFinished(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const startSinglePlayer = () => {
    setGameMode("playing");
    setCurrent(0);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setTimeLeft(20);
    setFinished(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const resetGame = () => {
    setGameMode("menu");
    setCurrent(0);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setTimeLeft(20);
    setFinished(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentRoom(null);
  };

  const saveScore = () => {
    const trimmedName = playerName.trim() || "Player";
    localStorage.setItem("playerName", trimmedName);

    const oldData = JSON.parse(localStorage.getItem("leaderboard") ?? "[]") as {
      name: string;
      coins: number;
      score: number;
      accuracy: number;
      streak: number;
      completedAt: string;
    }[];

    const accuracy = Math.round((score / QUESTIONS.length) * 100);

    const newData = [
      ...oldData,
      {
        name: trimmedName,
        coins,
        score,
        accuracy,
        streak,
        completedAt: new Date().toISOString(),
      },
    ].sort((a, b) => b.coins - a.coins);

    localStorage.setItem("leaderboard", JSON.stringify(newData.slice(0, 20)));
  };

  const accuracy = useMemo(
    () => Math.round((score / Math.max(current, 1)) * 100),
    [score, current]
  );

  const getStreakIcon = (streak: number) => {
    if (streak >= 5) return "🔥";
    if (streak >= 3) return "⚡";
    if (streak >= 1) return "✨";
    return "";
  };

  // Menu Screen
  if (gameMode === "menu") {
    return (
      <Layout>
        <div className="quiz-menu">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="menu-header"
          >
            <div className="menu-icon">
              <Gamepad2 size={48} />
            </div>
            <h1>Quiz Arena</h1>
            <p>Challenge yourself and compete with friends!</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="menu-options"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="menu-btn single-player"
              onClick={() => setGameMode("single")}
            >
              <User size={24} />
              <div>
                <h3>Single Player</h3>
                <p>Test your knowledge solo</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="menu-btn multiplayer"
              onClick={() => setGameMode("room-select")}
            >
              <Users2 size={24} />
              <div>
                <h3>Multiplayer</h3>
                <p>Compete with friends online</p>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Single Player Setup
  if (gameMode === "single") {
    return (
      <Layout>
        <div className="quiz-setup">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="setup-card"
          >
            <h2>Single Player Setup</h2>

            <div className="setup-field">
              <label>Player Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="setup-input"
              />
            </div>

            <div className="setup-field">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                className="setup-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="setup-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="setup-btn primary"
                onClick={startSinglePlayer}
                disabled={!playerName.trim()}
              >
                <Play size={20} />
                Start Quiz
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="setup-btn secondary"
                onClick={() => setGameMode("menu")}
              >
                Back to Menu
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Room Selection
  if (gameMode === "room-select") {
    return (
      <Layout>
        <div className="room-select">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="room-header"
          >
            <h2>Join or Create Room</h2>
            <p>Find friends or create your own game room</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="room-actions"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="create-room-btn"
              onClick={createRoom}
            >
              <Sparkles size={20} />
              Create New Room
            </motion.button>

            <div className="join-room">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="room-code-input"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="join-btn"
                disabled={!roomCode.trim()}
              >
                Join Room
              </motion.button>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="back-btn"
            onClick={() => setGameMode("menu")}
          >
            ← Back to Menu
          </motion.button>
        </div>
      </Layout>
    );
  }

  // Waiting Room
  if (gameMode === "waiting") {
    return (
      <Layout>
        <div className="waiting-room">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="waiting-header"
          >
            <h2>{currentRoom?.name}</h2>
            <p>Waiting for players to join...</p>
          </motion.div>

          <div className="players-list">
            {currentRoom?.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="player-card"
              >
                <div className="player-avatar">{player.avatar}</div>
                <div className="player-info">
                  <h4>{player.name}</h4>
                  <span className="player-status">Ready</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="start-game-btn"
            onClick={startGame}
            disabled={currentRoom?.players.length === 1}
          >
            <Play size={20} />
            Start Game ({currentRoom?.players.length}/{currentRoom?.maxPlayers})
          </motion.button>
        </div>
      </Layout>
    );
  }

  // Game Playing Screen
  if (gameMode === "playing") {
    return (
      <Layout>
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        <div className="quiz-game">
          {/* Game Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-header"
          >
            <div className="game-stats">
              <div className="stat-item">
                <Target size={16} />
                <span>{current + 1}/{QUESTIONS.length}</span>
              </div>
              <div className="stat-item">
                <Trophy size={16} />
                <span>{score}</span>
              </div>
              <div className="stat-item">
                <Zap size={16} />
                <span>{coins}</span>
              </div>
              <div className="stat-item">
                <Star size={16} />
                <span>{streak} {getStreakIcon(streak)}</span>
              </div>
            </div>

            <div className="timer-container">
              <div className="timer-bar">
                <motion.div
                  className="timer-fill"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 20) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <div className="timer-text">
                <Clock size={16} />
                <span>{timeLeft}s</span>
              </div>
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="question-card"
            >
              <div className="question-header">
                <span className={`difficulty-badge ${QUESTIONS[current].difficulty}`}>
                  {QUESTIONS[current].difficulty}
                </span>
                <span className="category-badge">
                  {QUESTIONS[current].category}
                </span>
              </div>

              <h2 className="question-text">{QUESTIONS[current].question}</h2>

              <div className="options-grid">
                {QUESTIONS[current].options.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`option-btn ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "correct"
                          : "incorrect"
                        : ""
                    } ${
                      selectedAnswer && option === QUESTIONS[current].answer
                        ? "correct"
                        : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Multiplayer Players */}
          {currentRoom && (
            <div className="players-sidebar">
              <h3>Players</h3>
              {currentRoom.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div key={player.id} className={`player-score ${index === 0 ? "leader" : ""}`}>
                    <div className="player-rank">#{index + 1}</div>
                    <div className="player-avatar-small">{player.avatar}</div>
                    <div className="player-details">
                      <span className="player-name">{player.name}</span>
                      <span className="player-points">{player.score} pts</span>
                    </div>
                    {index === 0 && <Crown size={16} className="crown-icon" />}
                  </div>
                ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Game Finished Screen
  if (gameMode === "finished") {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") ?? "[]") as {
      name: string;
      coins: number;
      score: number;
      accuracy: number;
      streak: number;
      completedAt: string;
    }[];

    return (
      <Layout>
        <div className="quiz-finished">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="finished-card"
          >
            <div className="finished-header">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="finished-icon"
              >
                {accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : "💪"}
              </motion.div>
              <h2>Quiz Complete!</h2>
              <p>Great job, {playerName}!</p>
            </div>

            <div className="finished-stats">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="stat-card"
              >
                <Trophy className="stat-icon" />
                <div>
                  <h3>{score}/{QUESTIONS.length}</h3>
                  <p>Correct Answers</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="stat-card"
              >
                <Target className="stat-icon" />
                <div>
                  <h3>{accuracy}%</h3>
                  <p>Accuracy</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="stat-card"
              >
                <Zap className="stat-icon" />
                <div>
                  <h3>{coins}</h3>
                  <p>Coins Earned</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="stat-card"
              >
                <Star className="stat-icon" />
                <div>
                  <h3>{streak}</h3>
                  <p>Best Streak</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="finished-actions"
            >
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="name-input"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="save-btn"
                onClick={saveScore}
              >
                <Award size={20} />
                Save to Leaderboard
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Leaderboard Preview */}
          {leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="leaderboard-preview"
            >
              <h3>🏆 Top Players</h3>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={index} className="leaderboard-item">
                    <div className="rank">#{index + 1}</div>
                    <div className="player-info">
                      <span className="name">{entry.name}</span>
                      <span className="score">{entry.coins} coins</span>
                    </div>
                    {index === 0 && <Crown size={16} className="crown" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="play-again-btn"
            onClick={resetGame}
          >
            <Play size={20} />
            Play Again
          </motion.button>
        </div>
      </Layout>
    );
  }

  return null;
}