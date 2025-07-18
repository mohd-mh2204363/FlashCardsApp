'use client';
import { useState, useEffect } from "react";
import React from 'react'
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation";
import { useApi } from "C:\\Users\\kingh\\Documents\\GitHub\\FlashCardsApp\\flashapp\\app\\components\\Api.js";


export default function page() {
    const { deckId } = useParams();
    const router = useRouter();
    const { makeRequest } = useApi();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loadError, setLoadError] = useState(null);

    const loadDeckData = async () => {
        try {
            setLoading(true);
            const deck = await makeRequest(`decks/${deckId}`);
            setName(deck.name);
            setDescription(deck.description || '');
            setCards(deck.cards || []);
        } catch (error) {
            setLoadError('Failed to load deck data: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadDeckData()
    }, [deckId])

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...cards];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setCards(updatedCards);
    }
    const addNewCard = () => {
        const newCards = [...cards, { question: '', answer: '' }];
        setCards(newCards);
    }
    const removeCard = (index) => {
        const updatedCards = cards.filter((_, i) => i !== index);
        setCards(updatedCards);
    }

    const saveDeck = async () => {
        try {
            setSaving(true);
            const deckData = {
                id: parseInt(deckId),
                name,
                description,
                cards
            };


            const response = await fetch(`http://127.0.0.1:8000/decks/${deckId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deckData),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            router.push(`/decks/${deckId}`);
        } catch (error) {
            setError('Failed to save deck: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>            <div className='text-xl'>Loading deck...</div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-xl text-red-500'>{loadError}</div>
            </div>
        );
    } return (
        <>
            <div className='flex gap-4 p-4 w-full'>
                <div className='w-[800px] p-7 bg-gray-900 h-full rounded-lg'>
                    <div className='flex justify-between items-center mt-4'>
                        <h1 className='text-4xl font-bold gri mb-3'>Edit Decks</h1>
                        <Button
                            className="bg-gray-850 rounded-lg text-gray-200 border-1 border-gray-700 hover:bg-gray-700"
                            onClick={saveDeck}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                    {error && (
                        <div className="max-w-3xl mx-auto mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
                            <p className="text-red-200">{error}</p>
                            <Button
                                className="mt-2 bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-1"
                                onClick={() => setError(null)}
                            >
                                Dismiss
                            </Button>
                        </div>
                    )}
                    <div className="max-w-3xl mx-auto rounded-xl bg-gray-800 p-4 shadow-sm">
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-semibold">Name</span>
                            <input
                                className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center mt-4">
                            <span className="font-semibold">Description</span>
                            <textarea
                                className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    {cards.map((card, index) => (
                        <div key={index} className="max-w-3xl mx-auto mt-4 rounded-xl bg-gray-800 p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">Card {index + 1}</h3>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                                    onClick={() => removeCard(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <span className="font-semibold">Question</span>
                                <textarea
                                    className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                                    value={card.question}
                                    onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center mt-2">
                                <span className="font-semibold">Answer</span>
                                <textarea
                                    className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                                    value={card.answer}
                                    onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="max-w-3xl mx-auto mt-4">
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={addNewCard}
                        >
                            Add New Card
                        </Button>
                    </div>
                </div>
                <div className='bg-gray-900 w-[450px] h-full rounded-lg flex flex-col'>
                    <h1 className='text-4xl font-bold grid p-4 pb-2'>Chat</h1>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 border-t border-gray-800">
                        <div className="flex justify-start">
                            <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg max-w-xs">
                                Hello! How can I help you?
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg max-w-xs">
                                Hi! I have a question about sockets.
                            </div>
                        </div>
                    </div>
                    <form className="p-4 border-t border-gray-800 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Type your message..."
                            disabled
                        />
                        <Button
                            className="bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
                            disabled
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
