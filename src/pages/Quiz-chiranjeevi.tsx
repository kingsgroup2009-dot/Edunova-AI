import { useState, useEffect, useCallback } from "react";

const questions = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: "Delhi",
  },
  {
    question: "React is a?",
    options: ["Library", "Language", "Database", "OS"],
    answer: "Library",
  },
];

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [time, setTime] = useState(10);
  const [finished, setFinished] = useState(false);

  const nextQuestion = useCallback(() => {
    setIndex((prev) => {
      if (prev + 1 < questions.length) {
        setTime(10);
        return prev + 1;
      }
      setFinished(true);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (finished) return;

    if (time === 0) {
      const id = window.setTimeout(() => {
        nextQuestion();
      }, 0);
      return () => window.clearTimeout(id);
    }

    const timer = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, finished, nextQuestion]);

  const handleAnswer = (option: string) => {
    if (option === questions[index].answer) {
      setScore((s) => s + 1);
      setCoins((c) => c + 10);
    }
    nextQuestion();
  };

  const container = {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
  };

  const card = {
    background: "#111",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  };

  if (finished) {
    return (
      <div style={container}>
        <h2>🎉 Finished</h2>
        <p>Score: {score}</p>
        <p>Coins: {coins}</p>

        <button
          onClick={() => {
            const name = prompt("Enter your name") || "Player";

            const oldData = JSON.parse(
              localStorage.getItem("leaderboard") || "[]"
            );

            const newData = [...oldData, { name, coins }] as {
              name: string;
              coins: number;
            }[];
            newData.sort((a, b) => b.coins - a.coins);

            localStorage.setItem("leaderboard", JSON.stringify(newData));

            alert("Saved to leaderboard");

            setIndex(0);
            setScore(0);
            setCoins(0);
            setFinished(false);
            setTime(10);
          }}
        >
          Save Score
        </button>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2>⏳ Time: {time}s</h2>

      <div style={card}>
        <h3>{questions[index].question}</h3>

        {questions[index].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            style={{
              display: "block",
              marginTop: 10,
              padding: 10,
              width: "100%",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;