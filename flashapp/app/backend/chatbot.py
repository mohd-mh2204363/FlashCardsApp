import openai

import os
openai.api_key = os.getenv("OPENAI_API_KEY")


def chat(prompt, model="gpt-4"):
    response = openai.chat.completions.create(
        model=model,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

def generate_flashcards_from_text(text):
    prompt = f"""
                You are a helpful assistant that creates flashcards for studying.

                Based on the following text, generate a list of clear, concise flashcards in the format:
                Q: [question]
                A: [answer]

                Text:
                \"\"\"
                {text}
                \"\"\"
                Only return the questions and answers, nothing else.
            """
    print(prompt)
    return chat(prompt)


# testing
if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        print("Flashcards:\n")
        print(generate_flashcards_from_text(user_input))
