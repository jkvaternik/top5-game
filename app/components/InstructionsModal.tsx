import { ModalComponent } from "./ModalComponent"

export const InstructionsModal = ({ isOpen, onClose }: 
  { isOpen: boolean, 
    onClose: () => void 
  }) => {
    return (
      <ModalComponent show={isOpen} onClose={onClose}>
        <div className="p-12 pt-9">
          <h1>How to play</h1>
          <p>Guess the Top 5!</p>
        </div>
      </ModalComponent>
    );
}