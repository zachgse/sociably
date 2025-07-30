import { createContext,useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [postObject,setPostObject] = useState(null);

    const toggleModal = ({ type }) => { //refactor wherein it returns
        switch (type) {
            case "post":
            case "photo":
            case "location":
            case "feeling":
            case "comment":
                setIsModalOpen(true);
                setAction(type);
                break;
            case "close":
            default:
                setIsModalOpen(false);
                setAction(null);
                setPostObject(null);
                break;
        }
    };

  return (
    <ModalContext.Provider
        value={{
        isModalOpen,setIsModalOpen,action,postObject,setPostObject,
        toggleModal
        }}
    >
        {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;