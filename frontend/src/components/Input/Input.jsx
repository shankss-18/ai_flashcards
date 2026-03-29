import "./index.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons"

const Input = () => {
    const navigate = useNavigate();
    const [textInput, setTextInput] = useState(true)
    const [fileInput, setFileInput] = useState(false)
    const [activeCount, setActiveCount] = useState(5)
    const [language, setLanguage] = useState("english")
    const [text, setText] = useState("")
    const [pdfFile, setPdfFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleCount = (e) => {
        setActiveCount(Number(e.target.value))
    }

    const handleLanguage = (e) => {
        setLanguage(e.target.value)
    }

    const handleTextInput = () => {
        setTextInput(true)
        setFileInput(false)
        setPdfFile(null)
    }

    const handleFileInput = () => {
        setTextInput(false)
        setFileInput(true)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPdfFile(file)
        }
    }


    useEffect(() => {
        if (textInput) {
            document.getElementById("textInput").classList.add("active")
            document.getElementById("fileInput").classList.remove("active")
        } else {
            document.getElementById("textInput").classList.remove("active")
            document.getElementById("fileInput").classList.add("active")
        }
    }, [textInput, fileInput]);

    const [data, setData] = useState({
        text: "",
        count: 5,
        language: "english"
    })

    const sendData = async () => {
        setLoading(true)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ai-flashcards-do76.onrender.com"

        try {
            let contentText = text

            // If in file mode, extract text from the PDF first
            if (fileInput) {
                if (!pdfFile) {
                    alert("Please select a PDF file first.")
                    setLoading(false)
                    return
                }

                const formData = new FormData()
                formData.append("file", pdfFile)

                const extractRes = await fetch(`${API_BASE_URL}/extract-text`, {
                    method: "POST",
                    body: formData
                })

                const extractResult = await extractRes.json()

                if (extractResult.error) {
                    alert(extractResult.error)
                    setLoading(false)
                    return
                }

                contentText = extractResult.text
            }

            // Generate cards (same for both text and file mode)
            const res = await fetch(`${API_BASE_URL}/generate-cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: contentText, count: activeCount, language: language })
            })

            const result = await res.json()

            if (result.error) {
                alert(result.error)
                setLoading(false)
                return
            }

            navigate("/output", { state: { data: result.cards } })

        } catch (err) {
            alert("Something went wrong: " + err.message)
        } finally {
            setLoading(false)
        }
    };


    return (
        <div>
            <Navbar />
            <div className="input-container flex flex-col items-center justify-start">
                <div className="content-wrapper text-center">
                    {/* header */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-4 header">
                        <div className="bgcustom h-[30px] w-[100px] rounded-2xl border border-[#34225E] flex items-center justify-center">
                            <p className="text-[#A78BFA] text-xs tag">AI-Powered</p>
                        </div>
                        <h1 className="text-[#D1D5DB] md:text-5xl text-3xl font-semibold bg-gradient-to-r from-[#A587F9] to-[#8851F0] bg-clip-text text-transparent title">Turn any document into a study deck</h1>
                        <p className="text-[#9C9C9F] md:text-md text-xs">Paste text or upload a PDF to generate high-quality flashcards in seconds.</p>
                    </div>

                    {/*input*/}
                    <div className="flex flex-col items-center justify-center gap-6 bodydiv text-center">
                        <div className="w-[100%] rounded-2xl flex justify-center items-center h-[40px] btnHolder gap-2">
                            <button className="text-[#D1D5DB] text-sm inputBtn active cursor-pointer" onClick={handleTextInput} id="textInput">✎ Paste Text</button>
                            <button className="text-[#D1D5DB] text-sm inputBtn cursor-pointer" onClick={handleFileInput} id="fileInput">⎙ Upload PDF</button>
                        </div>

                        {textInput && (
                            <div className="text-box h-[250px] w-[100%]">
                                <textarea className="text-area text-sm" placeholder="Paste your text here..." onChange={(e) => setText(e.target.value)}></textarea>
                            </div>
                        )}

                        {fileInput && (
                            <div className="text-box h-[250px] w-[100%]">
                                <div
                                    onClick={() => document.getElementById("pdfInput").click()}
                                    className="text-area text-sm flex flex-col items-center justify-center gap-3 cursor-pointer"
                                >
                                    <input type="file" id="pdfInput" className="hidden" accept=".pdf" onChange={handleFileChange} />

                                    <FontAwesomeIcon icon={pdfFile ? faCheck : faUpload} className="icon text-[#D1D5DB]" />

                                    <p className="text-[#D1D5DB] text-sm font-medium tt">
                                        {pdfFile ? pdfFile.name : "Drop your PDF here"}
                                    </p>

                                    {pdfFile && (
                                        <button
                                            className="text-[#A78BFA] text-xs underline cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setPdfFile(null)
                                                document.getElementById("pdfInput").value = ""
                                            }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex md:flex-row flex-col items-center md:justify-between justify-center gap-4 w-full ">
                            <div className="text-left md:w-1/2 w-4/5">
                                <p className="text-[#9C9C9f] text-xs mb-2">CARD COUNT</p>
                                <div className="rounded flex justify-between items-center h-[40px] w-full optionHolder gap-2">
                                    {[5, 10, 15, 20].map((num) => (
                                        <button
                                            key={num}
                                            value={num}
                                            onClick={handleCount}
                                            className={`text-[#D1D5DB] text-xs countBtn cursor-pointer ${activeCount === num ? "active" : ""}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-left md:w-1/2 w-4/5">
                                <p className="text-[#9C9C9f] text-xs mb-2">LANGUAGE</p>
                                <select onChange={handleLanguage} className="dropdown rounded flex justify-center items-center h-[40px] w-full optionHolder gap-2 text-[#D1D5DB] text-xs focus:outline-none">
                                    <option value="english">English</option>
                                    <option value="telugu">Telugu</option>
                                    <option value="hindi">Hindi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full">
                        <button className="text-white text-md font-semibold genBtn cursor-pointer" onClick={sendData} disabled={loading}>{loading ? "Generating..." : "✦ Generate Flashcards"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Input;