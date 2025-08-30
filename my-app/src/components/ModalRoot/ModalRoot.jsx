import React from "react";
import { useModal } from "../../providers/ModalProvider";
import ErrorModal from "../modals/ErrorModal";
import WarningModal from "../modals/WarningModal";
import ConfirmNavigate from "../modals/ConfirmNavigate";
import CameraPreviewModal from "../modals/CameraPreviewModal";

const REGISTRY = {
  error: ErrorModal,
  warning: WarningModal,
  confirmNavigate: ConfirmNavigate,
  cameraPreview: CameraPreviewModal,
};

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  if (!modal) return null;
  const Comp = REGISTRY[modal.name];
  if (!Comp) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <Comp {...modal.props} onClose={closeModal} />
      </div>
    </div>
  );
}