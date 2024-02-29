import { ModalComponent } from "./ModalComponent"

export const InstructionsModal = ({ isOpen, onClose }: 
  { isOpen: boolean, 
    onClose: () => void 
  }) => {
    return (
      <ModalComponent show={isOpen} onClose={onClose}>
        <div className="p-12 pt-9">
          <h1>How to play Top 5</h1>
          <p>...</p>
        </div>
      </ModalComponent>
    );
}