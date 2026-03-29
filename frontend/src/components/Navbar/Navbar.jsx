import "./index.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="navbar-container flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-4">
                <p className="logo text-white text-md font-semibold">Flashcard AI</p>

                <div className="bg-[#14141C] border border-[#25252D] btn rounded-md flex flex-row justify-center items-center gap-2">
                    <div className="green-dot"></div>
                    <p className="text-[#A1A1A4] text-[8px]">LLAMA-2.8-0B</p>
                </div>
                
            </div>
            <div className="">
                <button className="cursor-pointer bg-[#14141C] border border-[#25252D] btnn rounded-md" onClick={() => navigate("/")}>
                    <p className="text-[#ffffff] text-[10px]" >New Deck</p>
                </button>
            </div>
        </div>
    );
};

export default Navbar;