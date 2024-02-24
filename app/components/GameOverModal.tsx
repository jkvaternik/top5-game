import { getShareableEmojiScore } from "../utils";
import { toast, Bounce } from 'react-toastify';

type Props = {
  isOpen: boolean;
  score: number[];
}

const GameOverModal = ({ score, isOpen }: Props) => {
  const copyScore = () => {
    navigator.clipboard.writeText(getShareableEmojiScore(score));

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg max-w-sm mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Game Over</h2>
          <p>Thanks for playing!</p>

          <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={copyScore}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}


export default GameOverModal;