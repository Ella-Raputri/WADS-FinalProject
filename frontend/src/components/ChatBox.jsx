import { Card, CardContent } from "@/components/ui/card";

export default function ChatBox({ msg, index, role }) {
  const isSystemMessage = msg.sender === "System";
  const isUserMessage = msg.sender === role;    //kalau true, berarti itu 本人 

  return (
    <div className="max-w-6xl mt-6 mx-auto font-poppins" lang="en">
      <Card className="shadow-none border-none bg-transparent p-4">
        <div className={`relative flex ${isSystemMessage? 'justify-around' : isUserMessage ? "justify-end" : "justify-start"}`}>
          <div className="relative">
            <CardContent
              key={index}
              className={`p-2 px-4 w-fit max-w-4xl rounded-lg break-all hyphens-auto whitespace-pre-wrap ${
                isSystemMessage
                  ? "bg-gray-400 rounded-full text-xs text-white text-center mx-auto place-items-center"
                  : isUserMessage
                  ? "bg-gray-700 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {!isSystemMessage && <h3 className="font-semibold">{msg.subject}</h3>}
              <p className="mt-2">{msg.message}</p>

              {msg.timestamp && (
                <p className={`text-xs mt-2 text-right ${isSystemMessage ? "text-white" : isUserMessage? "text-white": "text-gray-700"}`}>
                  {msg.timestamp}
                </p>
              )}
            </CardContent>

            {/* Message Tail (Only for normal messages) */}
            {!isSystemMessage && (
              <div
                className={`absolute w-4 h-4 border-t-[30px] border-t-transparent ${
                  isUserMessage
                    ? "border-l-[10px] border-l-gray-800 right-0 top-9/12 translate-x-full -translate-y-1/2"
                    : "border-r-[20px] border-r-gray-300 left-0 top-9/12 -translate-x-full -translate-y-1/2"
                }`}
              ></div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
