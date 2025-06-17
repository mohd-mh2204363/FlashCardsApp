'use client';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
export default function FlashcardGenerator() {
  const [activeTab, setActiveTab] = useState('text');
  const [count, setCount] = useState(10);
  const [prompt, setPrompt] = useState('');

  const charLimit = 5000;



  const quickPrompts = [
    "Make flashcards for the word 'loquacious' with its meaning and example sentences.",
    "Generate flashcards for the definition of 'photosynthesis' along with its steps.",
    "Create flashcards with the term 'metaphor' and an example sentence in English literature",
    "Create flashcards that lists the causes and effects of climate change."
  ];

  return (
    <div className="mx-auto mt-10 w-full bg-gray-950 p-6 shadow-lg">
      <div className="mb-3 flex gap-2">
        {['Text', 'Upload', 'Link', 'YouTube'].map((label) => {
          const isActive = activeTab === label.toLowerCase();
          return (
            <button
              key={label}
              onClick={() => setActiveTab(label.toLowerCase())}
              className={`rounded-md border px-4 py-2 text-sm transition
              ${isActive
                  ? 'rounded-md border-2 border-gray-700 bg-gray-800 p-3 text-white text-left text-sm hover:bg-gray-800'
                  : 'rounded-md border-2 border-gray-800 bg-gray-950 p-3 text-white text-left text-sm hover:bg-gray-800'}`}
            >
              {label}
            </button>
          );
        })}

      </div>

      <div className="mb-3 flex gap-4">
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(+e.target.value)}
          className="h-10 w-24 rounded-md border border-gray-700 px-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="relative mb-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={charLimit}
          placeholder="Input or paste text to generate flashcards."
          className="min-h-[160px] w-full resize-y rounded-md border border-gray-700 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        {/* <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={charLimit}
            placeholder="Input or paste text to generate flashcards."
            className="min-h-[160px] w-full resize-y rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
          /> */}
        <span className="absolute bottom-2 right-3 text-xs text-gray-500">
          {prompt.length}/{charLimit}
        </span>
      </div>

      <button
        className="mb-6 w-full rounded-md bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-blue-700"
      >
        Generate Flashcards
      </button>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => setPrompt(p)}
            className="rounded-md border-2 border-gray-800 bg-gray-950 p-3 text-white text-left text-sm hover:bg-gray-800"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
