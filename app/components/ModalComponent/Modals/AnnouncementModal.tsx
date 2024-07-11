import { useEffect, useState } from "react";
import { HeartIcon } from '@heroicons/react/24/solid';
import { ModalComponent } from "../ModalComponent"
import { RankItem } from "../../RankList/RankItem/RankItem";
import { Montserrat } from "next/font/google";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

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
      <div className="p-12 pt-0 text-dark-maroon text-pretty">
        <h2 className={`text-2xl mb-4 font-bold text-dark-maroon ${montserrat.className}`}>Top 5 Update</h2>
        <p className="text-l mb-2">Today we are announcing an exciting update to Top 5, the Top 5 Archive!</p>
        <p className="text-l mb-2">To view the archive, tap the <Cog6ToothIcon className={`h-6 w-6 hover:stroke-[#82A0BC]`} style={{display: 'inline'}}/> icon in the top right corner, click <b>Archive</b>, and select your puzzle.</p>
        <p className="text-l">Thank you for playing Top 5 and enjoy!</p>
      </div>
    </ModalComponent>
  );
}
