export const QUESTION_BANK = {
  grammar: [
    {
      prompt: "Which sentence uses proper subject-verb agreement?",
      answers: [
        "The basket of apples are on the table.",
        "The basket of apples is on the table.",
        "The basket of apples were on the table.",
        "The basket of apples be on the table."
      ],
      correctIndex: 1,
      explanation: "The subject is 'basket,' so the singular verb 'is' is correct."
    },
    {
      prompt: "Choose the sentence with correct punctuation.",
      answers: [
        "Lets eat, Grandma!",
        "Let's eat Grandma!",
        "Let's eat, Grandma!",
        "Lets eat Grandma!"
      ],
      correctIndex: 2,
      explanation: "The comma shows you are talking to Grandma instead of eating her."
    },
    {
      prompt: "Which word is the adjective in this sentence: 'The bright kite flew high'?",
      answers: ["bright", "kite", "flew", "high"],
      correctIndex: 0,
      explanation: "'Bright' describes the noun 'kite,' so it is the adjective."
    },
    {
      prompt: "Which sentence is written in the past tense?",
      answers: [
        "She jumps over the puddle.",
        "She will jump over the puddle.",
        "She jumped over the puddle.",
        "She is jumping over the puddle."
      ],
      correctIndex: 2,
      explanation: "'Jumped' shows an action that already happened."
    },
    {
      prompt: "Pick the correctly written contraction.",
      answers: ["cant", "ca'nt", "can't", "cant'"],
      correctIndex: 2,
      explanation: "The apostrophe replaces the missing letters in 'cannot.'"
    },
    {
      prompt: "Which sentence uses a pronoun correctly?",
      answers: [
        "Me and Jordan finished the puzzle.",
        "Jordan and I finished the puzzle.",
        "Jordan and me finished the puzzle good.",
        "I and Jordan has finished the puzzle."
      ],
      correctIndex: 1,
      explanation: "'Jordan and I' is the correct subject form."
    },
    {
      prompt: "What type of sentence asks a question?",
      answers: ["Declarative", "Imperative", "Interrogative", "Exclamatory"],
      correctIndex: 2,
      explanation: "An interrogative sentence asks something."
    },
    {
      prompt: "Which sentence has the correct capitalization?",
      answers: [
        "My favorite month is october.",
        "My favorite month is October.",
        "my favorite month is October.",
        "My Favorite Month is october."
      ],
      correctIndex: 1,
      explanation: "Months are proper nouns and should be capitalized."
    },
    {
      prompt: "Choose the sentence with the correct homophone.",
      answers: [
        "Their going to the museum.",
        "They're going to the museum.",
        "There going to the museum.",
        "Theyre going to the museum."
      ],
      correctIndex: 1,
      explanation: "'They're' means 'they are,' which fits the sentence."
    },
    {
      prompt: "Which word is the verb in: 'Artists create murals downtown'?",
      answers: ["Artists", "create", "murals", "downtown"],
      correctIndex: 1,
      explanation: "'Create' is the action in the sentence."
    },
    {
      prompt: "Which sentence is a complete sentence?",
      answers: [
        "Because the storm was loud.",
        "Running across the field.",
        "The storm was loud all night.",
        "After the movie ended."
      ],
      correctIndex: 2,
      explanation: "It has a subject and a complete idea."
    },
    {
      prompt: "Which sentence uses commas in a list correctly?",
      answers: [
        "We packed socks snacks, and maps.",
        "We packed socks, snacks and, maps.",
        "We packed socks, snacks, and maps.",
        "We packed, socks snacks and maps."
      ],
      correctIndex: 2,
      explanation: "Items in a list are separated clearly with commas."
    }
  ],
  english: [
    {
      prompt: "What is a synonym for 'huge'?",
      answers: ["tiny", "massive", "sleepy", "swift"],
      correctIndex: 1,
      explanation: "'Massive' means nearly the same thing as 'huge.'"
    },
    {
      prompt: "Which word best completes the sentence: 'She spoke with great ____.'",
      answers: ["confidence", "confidently", "confident", "confide"],
      correctIndex: 0,
      explanation: "The sentence needs a noun, and 'confidence' fits."
    },
    {
      prompt: "What is the main idea of a paragraph?",
      answers: [
        "The title only",
        "The smallest detail",
        "The central point the author wants to explain",
        "The final punctuation mark"
      ],
      correctIndex: 2,
      explanation: "The main idea is the big message or central point."
    },
    {
      prompt: "Which is an antonym for 'ancient'?",
      answers: ["old", "historic", "modern", "aged"],
      correctIndex: 2,
      explanation: "'Modern' is the opposite of 'ancient.'"
    },
    {
      prompt: "Which word is spelled correctly?",
      answers: ["becuase", "because", "beacause", "becouse"],
      correctIndex: 1,
      explanation: "'Because' is the correct spelling."
    },
    {
      prompt: "What does 'compare' mean in reading?",
      answers: [
        "To tell how things are alike",
        "To tell only who is older",
        "To copy every word",
        "To ask a question"
      ],
      correctIndex: 0,
      explanation: "Comparing focuses on similarities."
    }
  ],
  math: [
    {
      prompt: "What is 9 x 6?",
      answers: ["42", "54", "63", "48"],
      correctIndex: 1,
      explanation: "Nine groups of six equals 54."
    },
    {
      prompt: "Solve: 84 - 27",
      answers: ["57", "67", "61", "49"],
      correctIndex: 0,
      explanation: "84 minus 27 equals 57."
    },
    {
      prompt: "Which fraction is equal to one-half?",
      answers: ["2/3", "3/4", "4/8", "5/8"],
      correctIndex: 2,
      explanation: "4/8 simplifies to 1/2."
    },
    {
      prompt: "What is the perimeter of a square with side length 5?",
      answers: ["10", "15", "20", "25"],
      correctIndex: 2,
      explanation: "A square has four equal sides, so 4 x 5 = 20."
    },
    {
      prompt: "What is 3/5 as a decimal?",
      answers: ["0.3", "0.6", "0.8", "1.5"],
      correctIndex: 1,
      explanation: "Three divided by five equals 0.6."
    },
    {
      prompt: "Solve: 7 + 8 x 2",
      answers: ["30", "23", "22", "18"],
      correctIndex: 1,
      explanation: "Multiply first: 8 x 2 = 16, then add 7."
    }
  ],
  history: [
    {
      prompt: "Who was the first President of the United States?",
      answers: ["George Washington", "Abraham Lincoln", "John Adams", "Thomas Jefferson"],
      correctIndex: 0,
      explanation: "George Washington became the first U.S. president in 1789."
    },
    {
      prompt: "Which ancient civilization built pyramids in Egypt?",
      answers: ["Romans", "Greeks", "Egyptians", "Mayans"],
      correctIndex: 2,
      explanation: "Ancient Egyptians built the famous pyramids."
    },
    {
      prompt: "The Renaissance began in which country?",
      answers: ["Italy", "France", "China", "Brazil"],
      correctIndex: 0,
      explanation: "The Renaissance began in Italy before spreading through Europe."
    },
    {
      prompt: "What wall fell in 1989, symbolizing the end of the Cold War era in Europe?",
      answers: ["Great Wall", "Berlin Wall", "Hadrian's Wall", "Wall of Jericho"],
      correctIndex: 1,
      explanation: "The Berlin Wall fell in 1989."
    },
    {
      prompt: "Who wrote the Declaration of Independence?",
      answers: ["Benjamin Franklin", "James Madison", "Thomas Jefferson", "Alexander Hamilton"],
      correctIndex: 2,
      explanation: "Thomas Jefferson was the main author."
    },
    {
      prompt: "Which ship carried the Pilgrims to North America in 1620?",
      answers: ["Mayflower", "Titanic", "Santa Maria", "Endeavour"],
      correctIndex: 0,
      explanation: "The Mayflower carried the Pilgrims in 1620."
    }
  ]
};
