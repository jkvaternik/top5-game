import { useState } from "react";

`use state`

export default function Home() {
  const question = 'What is the capital of France?';
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState(['Paris', 'London', 'New York', 'Berlin', 'Madrid']);

  return (
    <main>
      <section>
        <div>
          <h1>top</h1>
          <h1>5</h1>
        </div>
        <div>{question}</div>
      </section>
      <input type="text" onChange={(e) => setGuess(e.target.value)} />
      <section>
        {guesses.map((guess, index) => (<div key={index}>{guess}</div>))}
      </section>
    </main>
  );
}
