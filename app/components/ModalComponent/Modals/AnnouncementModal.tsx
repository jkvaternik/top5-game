import { ModalComponent } from "../ModalComponent"
import { Montserrat } from "next/font/google";
import { IncorrectRankItem } from "../../RankList/RankItem/RankItem";

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

export const AnnouncementModal = ({ isOpen, onClose }:
  {
    isOpen: boolean,
    onClose: () => void
  }) => {  
  return (
    <ModalComponent delayMs={0} show={isOpen} onClose={onClose} showChildren={isOpen}>
      <div className="p-10 pt-0 text-dark-maroon text-pretty">
        <h2 className={`text-2xl mb-4 font-bold text-dark-maroon ${montserrat.className}`}>Top 5 Update</h2>
        <p className="text-l mb-2">Updates! We&apos;ve got a few new exciting updates:</p>
        <ul className="list-disc list-outside ml-5 mb-4 ">
          <li className="mb-2"><b>Incorrect Guess Stats:</b> New puzzles will show begin showing stats for incorrect guesses, as well as their spot in the list.</li>
          <div className="mb-4">
            <p className="text-l mb-2 font-semibold">Example</p>
            <IncorrectRankItem guess={"Not Top 5"} index={6} stat="123" isCorrectOrGameOver={false} />
          </div>
          <li className="mb-2"><b>Streaks:</b> Starting today, we&apos;ll keep a streak of games if you&apos;ve guessed all top 5.</li>
          <li className="mb-2"><b>Dark Mode:</b> You can now play your favorite game with your favorite theme! We use your browser&apos;s theme settings to apply dark mode.</li>
          <li className="mb-2"><b>URL Opt Out:</b> Don&apos;t want to share the URL with your board? You can change this setting in the menu!</li>
        </ul>
        <p className="text-l">Thank you for playing Top 5 and enjoy!</p>
      </div>
    </ModalComponent>
  );
}