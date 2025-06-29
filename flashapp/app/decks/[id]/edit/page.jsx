'use client';
import { useState, useEffect, use } from "react";
import React from 'react'
import { Button } from "@/components/ui/button"


export default function page() {
    const [name, setName] = useState('Sockets Network Programming');
    const [variable, setVariable] = useState(null);

    const flashcards = [
        {
            id: 1,
            name: 'Socket Basics',
            questions: [
                { question: 'What is a socket?', answer: 'A socket is an endpoint for sending or receiving data across a computer network.' },
                { question: 'What are the types of sockets?', answer: 'Stream sockets and datagram sockets.' },
                { question: 'What is a socket?', answer: 'A socket is an endpoint for sending or receiving data across a computer network.' },
                { question: 'What are the types of sockets?', answer: 'Stream sockets and datagram sockets.' },
                { question: 'What is a socket?', answer: 'A socket is an endpoint for sending or receiving data across a computer network.' },
                { question: 'What are the types of sockets?', answer: 'Stream sockets and datagram sockets.' },
            ]
        },
        {
            id: 2,
            name: 'Network Programming',
            questions: [
                { question: 'What is network programming?', answer: 'Network programming is the practice of writing programs that communicate with other programs across a network.' },
                { question: 'Which languages are commonly used for network programming?', answer: 'Languages like Python, Java, and C are commonly used.' }
            ]
        },

    ];
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const id = currentUrl.split('/')[currentUrl.split('/').length - 2];
    const object = flashcards.find((item) => item.id === parseInt(id));
    function loadData() {
        setName(object.name);
        setVariable(object.questions);
    }

    useEffect(() => { loadData() }, [])

    return (
        <>
            <div className='flex gap-4 p-4 w-full'>
                <div className='w-[800px] p-7 bg-gray-900 h-full rounded-lg'>
                    <div className='flex justify-between items-center mt-4'>
                        <h1 className='text-4xl font-bold gri mb-3'>Edit Decks</h1>
                        <Button
                            className="bg-gray-850 rounded-lg text-gray-200 border-1 border-gray-700 hover:bg-gray-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                    <div className="max-w-3xl mx-auto rounded-xl bg-gray-800 p-4 shadow-sm">
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-semibold">Name</span>
                            <input
                                className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    {object.questions.map((item, index) => (
                        <div key={index} className="max-w-3xl mx-auto mt-4 rounded-xl bg-gray-800 p-4 shadow-sm">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <span className="font-semibold">Question</span>
                                <input
                                    className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={item.question}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center mt-2">
                                <span className="font-semibold">Answer</span>
                                <input
                                    className="col-span-2 w-full rounded-lg bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={item.answer}
                                />
                            </div>
                        </div>
                    ))}
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
