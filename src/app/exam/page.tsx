"use client";
import { useState } from "react";
import DoughnutChart from "@/components/DoughnutChart";
import Data from "../../../data";

type QuestionMCQ = {
  question: string;
  options: string[];
  answer?: number;
  selectedOption?: number;
  explanation?: string;
  type?: string;
};

type QuestionTF = {
  question: string;
  answer?: boolean;
  options?: string[];
  selectedOption?: boolean;
  explanation?: string;
  type?: string;
};
type Question = QuestionMCQ | QuestionTF;

export default function Exam() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [questions, setQuestions] = useState<Question[]>(Data);

  const toggleResult = () => {
    setIsLoading(true);
    setShowResult(!showResult);
    handleSubmit();

    // Reset loading state after 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  const handleSubmit = () => {
    setIsSubmitted(true);
    // You can access all answers through questions state
    let point = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type === "mcq") {
        if (questions[i].answer === questions[i].selectedOption) {
          point += 10;
        }
      } else if (questions[i].type === "tf") {
        if (questions[i].answer === questions[i].selectedOption) {
          point += 10;
        }
      }
    }
    setScore(point);

    console.log("Submitted answers:", questions);
  };

  //   const QuestionMCQ = ({
  //     question,
  //     options,
  //     answer,
  //     isSubmitted,
  //     setIsSubmitted,
  //   }: {
  //     question: string;
  //     options: string[];
  //     answer: number;
  //     isSubmitted: boolean;
  //     setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  //   }) => {
  //     const [selectedOption, setSelectedOption] = useState<number>(-1);

  //     const getOptionStyle = (index: number) => {
  //       if (!isSubmitted) {
  //         return selectedOption === index
  //           ? "bg-blue-100 border-blue-300"
  //           : "hover:bg-gray-50";
  //       }

  //       if (index === answer) {
  //         return "bg-green-100 border-green-300";
  //       }

  //       if (selectedOption === index && index !== answer) {
  //         return "bg-red-100 border-red-300";
  //       }

  //       return "bg-white";
  //     };

  //     return (
  //       <div className="w-70% px-4 py-3 border-2 rounded-3xl m-2 mt-4">
  //         <div className="mb-2 text-lg font-medium text-gray-800">{question}</div>
  //         <div className="grid grid-cols-2 gap-3 ">
  //           {options.map((option, index) => (
  //             <button
  //               key={index}
  //               onClick={() => !isSubmitted && setSelectedOption(index)}
  //               className={`p-2 text-left border-2 rounded-full transition-all duration-200 text-gray-700 ${getOptionStyle(
  //                 index
  //               )}`}
  //               disabled={isSubmitted}
  //             >
  //               <span className="inline-block w-6 h-6 mr-3 text-sm border-2 rounded-full text-center leading-5">
  //                 {String.fromCharCode(65 + index)}
  //               </span>
  //               {option}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   };

  //   const QuestionTF = ({
  //     question,
  //     answer,
  //     isSubmitted,
  //     setIsSubmitted,
  //   }: {
  //     question: string;
  //     answer: boolean;
  //     isSubmitted: boolean;
  //     setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  //   }) => {
  //     const [selectedOption, setSelectedOption] = useState<boolean | null>(null);

  //     const getOptionStyle = (isTrue: boolean) => {
  //       if (!isSubmitted) {
  //         return selectedOption === isTrue
  //           ? "bg-blue-100 border-blue-300"
  //           : "hover:bg-gray-50";
  //       }

  //       if (isTrue === answer) {
  //         return "bg-green-100 border-green-300";
  //       }

  //       if (selectedOption === isTrue && isTrue !== answer) {
  //         return "bg-red-100 border-red-300";
  //       }

  //       return "bg-white";
  //     };

  //     return (
  //       <div className="w-70% px-4 py-3 border-2 rounded-3xl m-2 mt-4">
  //         <div className="mb-2 text-lg font-medium text-gray-800">{question}</div>
  //         <div className="grid grid-cols-2 gap-3">
  //           {[true, false].map((isTrue, index) => (
  //             <button
  //               key={index}
  //               onClick={() => !isSubmitted && setSelectedOption(isTrue)}
  //               className={`p-2 text-left border-2 rounded-full transition-all duration-200 text-gray-700 ${getOptionStyle(
  //                 isTrue
  //               )}`}
  //               disabled={isSubmitted}
  //             >
  //               <span className="inline-block w-6 h-6 mr-3 text-sm border-2 rounded-full text-center leading-5">
  //                 {String.fromCharCode(65 + index)}
  //               </span>
  //               {isTrue ? "True" : "False"}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   };
  // Updated MCQ Component

  const QuestionMCQ = ({
    question,
    index,
    isSubmitted,
    onSelect,
  }: {
    question: Question;
    index: number;
    isSubmitted: boolean;
    onSelect: (index: number, value: number) => void;
  }) => {
    const getOptionStyle = (optionIndex: number) => {
      if (!isSubmitted) {
        return question.selectedOption === optionIndex
          ? "bg-blue-100 border-blue-300"
          : "hover:bg-gray-50";
      }

      if (optionIndex === question.answer) {
        return "bg-green-100 border-green-300";
      }

      if (
        question.selectedOption === optionIndex &&
        optionIndex !== question.answer
      ) {
        return "bg-red-100 border-red-300";
      }

      return "bg-white";
    };

    return (
      <div className="w-full px-4 py-3 border-2 rounded-3xl my-4">
        <div className="mb-2 text-lg font-medium text-gray-800">
          {question.question}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {question.options?.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => onSelect(index, optionIndex)}
              className={`p-2 text-left border-2 rounded-full transition-all duration-200 text-gray-700 ${getOptionStyle(
                optionIndex
              )}`}
              disabled={isSubmitted}
            >
              <span className="inline-block w-6 h-6 mr-3 text-sm border-2 rounded-full text-center leading-5">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleOptionSelect = <T extends Question>(
    questionIndex: number,
    value: T extends QuestionMCQ ? number : boolean
  ) => {
    // @ts-expect-error because the dumb typescript compiler
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== questionIndex) return q;
        if (q.type === "mcq") {
          return {
            ...q,
            selectedOption: value as number,
          };
        }
        return {
          ...q,
          selectedOption: value as boolean,
        };
      })
    );
  };
  // Updated TF Component
  const QuestionTF = ({
    question,
    index,
    isSubmitted,
    onSelect,
  }: {
    question: Question;
    index: number;
    isSubmitted: boolean;
    onSelect: (index: number, value: boolean) => void;
  }) => {
    const getOptionStyle = (isTrue: boolean) => {
      if (!isSubmitted) {
        return question.selectedOption === isTrue
          ? "bg-blue-100 border-blue-300"
          : "hover:bg-gray-50";
      }

      if (isTrue === question.answer) {
        return "bg-green-100 border-green-300";
      }

      if (question.selectedOption === isTrue && isTrue !== question.answer) {
        return "bg-red-100 border-red-300";
      }

      return "bg-white";
    };

    return (
      <div className="w-full px-4 py-3 border-2 rounded-3xl my-4">
        <div className="mb-2 text-lg font-medium text-gray-800">
          {question.question}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((isTrue, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => onSelect(index, isTrue)}
              className={`p-2 text-left border-2 rounded-full transition-all duration-200 text-gray-700 ${getOptionStyle(
                isTrue
              )}`}
              disabled={isSubmitted}
            >
              <span className="inline-block w-6 h-6 mr-3 text-sm border-2 rounded-full text-center leading-5">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {isTrue ? "True" : "False"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-700 mb-8">AI Powered Exam</h1>
      <div className={`flex justify-center w-3/6 h-5/6 relative bg-white`}>
        <div
          className={`relative w-3/5 z-40 transition-transform duration-500 ease-in-out overflow-hidden border-2 rounded-2xl border-gray-300 ${
            showResult ? "translate-x-0" : "translate-x-[35%]"
          }`}
        >
          {" "}
          <div className="h-14 w-full absolute top-0 backdrop-blur-md bg-white/30 z-50">
            <h1 className="text-2xl font-bold text-gray-800 my-4 text-center">
              Test your skills{" "}
            </h1>
          </div>
          <div
            id="question"
            className={`w-full mt-12 bg-white z-40 h-full    overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 `}
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="px-4 pb-10">
              {questions.map((question, index) => {
                if (question.type === "mcq") {
                  return (
                    <QuestionMCQ
                      key={index}
                      question={question}
                      index={index}
                      isSubmitted={isSubmitted}
                      onSelect={handleOptionSelect}
                    />
                  );
                }
                return (
                  <QuestionTF
                    key={index}
                    question={question}
                    index={index}
                    isSubmitted={isSubmitted}
                    onSelect={handleOptionSelect}
                  />
                );
              })}
            </div>
          </div>
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ">
            <button
              onClick={toggleResult}
              className="flex items-center justify-center border-2 border-gray-300 rounded-full py-2 px-6 transition duration-300 ease-in-out hover:scale-105 backdrop-blur-sm bg-white/30 shadow-lg hover:shadow-xl"
            >
              <div
                className={`text-lg ${
                  isLoading
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-extrabold animate-pulse"
                    : "text-gray-500"
                }`}
              >
                Submit to get test results
              </div>
            </button>
          </div>
        </div>
        <div
          id="result-div"
          className={`flex-1 flex flex-col justify-center items-center mt-3 mb-3 z-0 rounded-e-2xl border-t-2 border-b-2 border-r-2 border-gray-300 transition-transform duration-500 ease-in-out ${
            showResult ? "translate-x-0" : "translate-x-[-60%]"
          }`}
        >
          <div className="text-3xl font-bold text-gray-600 mb-6">
            Your Results
          </div>
          <DoughnutChart showResult={showResult} targetScore={score} />
        </div>
      </div>
    </div>
  );
}
