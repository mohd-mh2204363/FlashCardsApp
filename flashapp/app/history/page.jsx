'use client'
import React from 'react'
import { useState } from 'react'
export default function History() {
    const flashcardHistory = {
        "flashcards": [
            {
                "id": 1,
                "question": "What is the capital of France?",
                "answer": "Paris"
            },
            {
                "id": 2,
                "question": "What is the largest planet in our solar system?",
                "answer": "Jupiter"
            },
            {
                "id": 3,
                "question": "What is the chemical symbol for gold?",
                "answer": "Au"
            }
        ]
    }

    const [show, setShow] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const currentCard = flashcardHistory.flashcards[currentCardIndex];

    const switchCard = (newIndex) => {
        setShow(false);
        setCurrentCardIndex(newIndex);
    };

    return (
        <>
            <div className='flex flex-col items-center'>
                <h1 className="text-2xl font-bold text-white mb-4">Flashcard History</h1>

                <div className="flex items-center justify-center mt-10 space-x-4">
                    <button
                        disabled={currentCardIndex === 0}
                        onClick={() => switchCard(currentCardIndex - 1)}
                        className="text-white text-xl px-4 py-2 bg-gray-700 rounded hover:cursor-pointer disabled:opacity-30"
                    >
                        &lt;
                    </button>
                    <div
                        onClick={() => setShow(!show)}
                        style={{ perspective: '1000px' }}
                        className="w-[937px] h-[572px] cursor-pointer"
                    >
                        <div
                            style={{
                                transition: 'transform 0.7s',
                                transformStyle: 'preserve-3d',
                                transform: show ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                            className="relative w-full h-full"
                        >
                            <div
                                className="absolute w-full h-full bg-gradient-to-bl from-gray-950 to-gray-900 p-6 shadow-lg rounded-4xl flex items-center justify-center"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="flex items-center justify-center text-5xl text-center font-bold text-gray-200">
                                    Question: {currentCard.question}
                                </div>
                            </div>
                            <div
                                className="absolute w-full h-full bg-gradient-to-bl from-gray-950 to-gray-900 p-6 shadow-lg rounded-4xl flex items-center justify-center"
                                style={{
                                    transform: 'rotateY(180deg)',
                                    backfaceVisibility: 'hidden'
                                }}
                            >
                                <div className="flex items-center justify-center text-6xl text-center font-bold text-gray-200">
                                    Answer: {currentCard.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        disabled={currentCardIndex === flashcardHistory.flashcards.length - 1}
                        onClick={() => switchCard(currentCardIndex + 1)}
                        className="text-white text-xl px-4 py-2 bg-gray-700 hover:cursor-pointer rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
                <p className='text-gray-400 pt-3.5'>{currentCardIndex + 1} / {flashcardHistory.flashcards.length}</p>
            </div>
        </>
    );
}
