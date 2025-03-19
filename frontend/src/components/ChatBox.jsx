import { Card, CardContent } from "@/components/ui/card";

export default function ChatBox({ msg, index, role }) {
  return (
    <div className="max-w-6xl mt-6 mx-auto font-poppins" lang="en">
      <Card className="shadow-none border-none bg-transparent p-4">
        <div className={`relative flex ${msg.sender === role ? "justify-end" : "justify-start"}`}>
          <div className="relative">
          <CardContent
              key={index}
              className={`p-2 px-4 w-fit max-w-4xl rounded-lg break-all hyphens-auto whitespace-pre-wrap ${
                  msg.sender === role
                  ? "bg-gray-700 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
          >
              <h3 className="font-semibold">{msg.subject}</h3>
              <p className={`mt-2 ${
                msg.sender === role
                ? " text-white "
                : "text-black"
                }`}>{msg.message}</p>

              {msg.timestamp && (
                <p className={`text-xs mt-2 text-right ${
                    msg.sender === role
                    ? " text-white "
                    : "text-black"
                    }`}>{msg.timestamp}</p>
              )}
            </CardContent>

            {/* Tail (Message Bubble Pointer) */}
            <div
                className={`absolute w-4 h-4 border-t-[30px] border-t-transparent ${
                msg.sender === role
                    ? "border-l-[10px] border-l-gray-800 right-0 top-9/12 translate-x-full -translate-y-1/2"
                    : "border-r-[20px] border-r-gray-300 left-0 top-9/12 -translate-x-full -translate-y-1/2"
                }`}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
