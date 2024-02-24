import { Puzzle } from "../hooks/useDailyPuzzle";
import { getShareableEmojiScore } from "../utils";
import { toast, Bounce } from 'react-toastify';

type Props = {
  isOpen: boolean;
  score: number[];
  puzzle: Puzzle;
}

const GameOverModal = ({ puzzle, score, isOpen }: Props) => {
  const copyScore = () => {
    navigator.clipboard.writeText("Top 5\n" + getShareableEmojiScore(score));

    // Show a toast above the game over modal that is white text on a green background
    // and disapears after 2 seconds
    toast.success('Score copied to clipboard', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center">
      <div className="bg-white p-12 rounded-lg">
        <div className="mb-4">
          <h2 className="mb-4 text-2xl font-bold">Thanks for playing!</h2>
          <p className="mb-2 font-semibold">Top 5 (#{puzzle.num})</p>
          <p className="mb-12 text-3xl">{getShareableEmojiScore(score)}</p>
          <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={copyScore}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}


export default GameOverModal;