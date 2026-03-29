import "./index.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
{/**status: "",
        isViewed: false */}

const Output = () => {
    const location = useLocation()
    const data = location.state?.data
    const navigate = useNavigate()

    const newArr = data.map((card, i) => {
        return {
            ...card,
            isViewed: false,
            status: ""
        }
    })

    const [arr, setArr] = useState(newArr)

    useEffect(() => {
        setArr(prev => prev.map((card, i) =>
            i === 0
                ? { ...card, isViewed: true }
                : card
        ))
    }, [])

    const [activeIndex, setActiveIndex] = useState(0)
    const activeCard = arr[activeIndex]
    const [isFlipped, setIsFlipped] = useState(false)

    const [known, setKnown] = useState(0)
    const [review, setReview] = useState(0)
    const [seen, setSeen] = useState(0)

    const setStatus = (status) => {
        const newArr = [...arr]
        newArr[activeIndex].status = status
        setArr(newArr)
    }

    const goToCard = (id) => {
        setArr(prev => prev.map((card, i) =>
            i === id && card.isViewed === false
                ? { ...card, isViewed: true }
                : card
        ))
        setActiveIndex(id)
        setIsFlipped(false)
    }

    useEffect(() => {
        setSeen(arr.filter(card => card.isViewed === true).length)
        setKnown(arr.filter(card => card.status === "known").length)
        setReview(arr.filter(card => card.status === "review").length)
    }, [arr])

    return (
        <div>
            <Navbar />
            <div className="output-container flex flex-col items-center justify-center text-center">
                <div className="output-wrapper">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-start gap-4 w-full header">
                        <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-2 md:gap-4 w-full">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <div className="text-white rounded headTag text-xs flex justify-center items-center">
                                    <p><span className="pt">{review}</span> marked for review</p>
                                </div>
                                <div className="text-white rounded headTag text-xs flex justify-center items-center">
                                    <p><span className="gt">{known}</span> Known ✔️</p>
                                </div>
                                <div className="text-white rounded headTag text-xs flex justify-center items-center">
                                    <p>Accuracy: <span className="pt">{Math.round(known / arr.length * 100)}%</span></p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#A1A1AA] text-xs">Deck: Advanced Computer Science II</p>
                            </div>
                        </div>
                        <div className="statusBarWrapper">
                            <div className="statusBar rounded-md" style={{ width: `${seen / arr.length * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Body section */}
                    <div className="flex md:flex-row flex-col items-start justify-between gap-6 md:gap-10">
                        <div className="flex justify-center items-center w-full">
                            <div className="flex flex-col items-center justify-center gap-8">
                                <div className="card flex items-center justify-center" onClick={() => setIsFlipped(!isFlipped)}>
                                    <p id="question" className="text-white font-semibold text-2xl">{isFlipped ? activeCard.answer : activeCard.question}</p>
                                </div>
                                <div className="flex justify-between items-center gap-6 w-full">
                                    <button className="sbtn1 text-sm font-semibold" onClick={() => setStatus("known")}>Mark as known</button>
                                    <button className="sbtn2 text-sm font-semibold" onClick={() => setStatus("review")}>Review again</button>
                                </div>
                            </div>
                        </div>
                        <div className="deckList">
                            <div className="sd1 flex flex-col items-start justify-center gap-1">
                                <h2 className="text-white font-semibold text-sm">DECK LIST</h2>
                                <p className="text-[#A1A1AA] text-[10px]">{arr.length} cards generated</p>
                            </div>
                            <div className="h-[1px] line w-full"></div>
                            <div className="sd2">
                                {arr.map((item, id) => (
                                    <div className={`cardName flex items-center justify-start gap-2 ${activeIndex === id ? "activeCard" : ""} ${item.isViewed == false ? "text-[#A1A1AA]" : "text-white"}`} onClick={() => goToCard(id)} key={id}>
                                        <div className={`statusDot ${item.status === "review" ? "reviewDot" : ""} ${item.status === "known" ? "knownDot" : ""}`}></div>
                                        <p>{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Output;