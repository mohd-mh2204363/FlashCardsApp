'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from 'C:/Users/kingh/Documents/GitHub/FlashCardsApp/flashapp/app/components/Api.js';               // adjust path if needed

import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

export default function HistoryPage() {
    const params = useParams();                  // { deckId: '123' }
    const deckId = params?.deckId;
    const { makeRequest } = useApi();

    const [cards, setCards] = useState([]);            // [{ id, question, answer }, …]
    const [index, setIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);

    // fetch deck once
    useEffect(() => {
        (async () => {
            try {
                const deck = await makeRequest(`decks/${deckId}`);
                setCards(deck.cards);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [deckId, makeRequest]);

    if (cards.length === 0) {
        return <p className="text-center text-gray-400">Loading…</p>;
    }

    const current = cards[index];

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white mb-4">
                Deck #{deckId}
            </h1>

            <div className="flex items-center justify-center mt-10 space-x-4">
                {/* Prev */}
                <button
                    disabled={index === 0}
                    onClick={() => { setShowBack(false); setIndex(index - 1); }}
                    className="text-white text-xl px-4 py-2 bg-gray-700 rounded disabled:opacity-30"
                >
                    &lt;
                </button>

                {/* Flip-card */}
                <div
                    onClick={() => setShowBack(!showBack)}
                    style={{ perspective: '1000px' }}
                    className="w-[937px] h-[572px] cursor-pointer"
                >
                    <div
                        style={{
                            transition: 'transform 0.7s',
                            transformStyle: 'preserve-3d',
                            transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                        className="relative w-full h-full"
                    >
                        {/* front */}
                        <div
                            className="absolute w-full h-full bg-gradient-to-bl from-gray-950 to-gray-900 p-6 shadow-lg rounded-4xl flex items-center justify-center"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <p className="text-5xl text-center font-bold text-gray-200">
                                {current.question}
                            </p>
                        </div>

                        {/* back */}
                        <div
                            className="absolute w-full h-full bg-gradient-to-bl from-gray-950 to-gray-900 p-6 shadow-lg rounded-4xl flex items-center justify-center"
                            style={{
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <p className="text-6xl text-center font-bold text-gray-200">
                                {current.answer}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next */}
                <button
                    disabled={index === cards.length - 1}
                    onClick={() => { setShowBack(false); setIndex(index + 1); }}
                    className="text-white text-xl px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                >
                    &gt;
                </button>
            </div>

            <p className="text-gray-400 pt-3.5">
                {index + 1} / {cards.length}
            </p>
        </div>
    );
}
