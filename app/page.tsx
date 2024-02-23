"use client"

import { useState } from "react";
import ResultCard from "./components/ResultCard";

export default function Home() {
  const list = ['India', 'China', 'USA', 'Indonesia', 'Pakistan']
  const question = 'largest countries in the world';
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [isGameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (!isGameOver) {
      setGuesses([...guesses, guess]);
      setGuess('');
      if (guesses.length >= 4) {
        setGameOver(true);
      }
    }
  }

  const resultView = guesses.map((guess, index) => {
    if (list.includes(guess)) {
      return (<ResultCard index={index} guess={guess} list={list} className={"text-green-500"}/>)
    } else {
      return (<ResultCard index={index} guess={guess} list={list} className={"text-red-500"}/>)
    }
  }).reverse();

  return (
    <main style={{margin: '5vh auto', width: '80%', height: '100vh'}}>
      <section className="flex flex-row gap-4 items-end">
        <div className="flex flex-col items-center" >
          <h1>top</h1>
          <h1 className="text-5xl">5</h1>
        </div>
        <p>{question}</p>
      </section>
      <section>
        <input 
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg p-2 w-full mt-4"
        value={guess} 
        onChange={(e) => setGuess(e.target.value)} 
        onKeyDown={(e) => e.key == 'Enter' ? handleGuess() : null} 
        />
      </section>
      <br></br>
      <section>
        {resultView}
      </section>
    </main>
  );
}
