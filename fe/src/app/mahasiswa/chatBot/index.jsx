import React, { useState, useEffect } from "react";
import Layout from "@/components/other/layout";
import InputPesan from "@/components/ui/InputPesan";
import { getDataFromToken } from "@/utils/getDataToken";
import { CircleUserRound } from "lucide-react";
import simpanPesan from "@/apis/mhs/bot/simpanPesan";
import getPesan from "@/apis/mhs/bot/tampilkanPesan";

export default function ChatBot() {
  const userID = getDataFromToken()?.userId;
  const nama = getDataFromToken()?.name;
  const [messages, setMessages] = useState([
    { role: "bot", content: "Halo, ada yang bisa saya bantu?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [partialMessage, setPartialMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getPesan(userID);
        const fetchedMessages = response.messages.map((message) => ({
          role: message.isUserMessage ? "user" : "bot",
          content: message.text,
        }));
        setMessages((prevMessages) => {
          const initialMessage = [{ role: "bot", content: "Halo, ada yang bisa saya bantu?" }];
          return [...initialMessage, ...fetchedMessages];
        });
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    if (userID) {
      fetchMessages();
    }
  }, [userID]);


  const handleSendMessage = async (message) => {
    const role = "user";

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);
    setIsTyping(true);

    try {
      await sendMessageAndStreamResponse(userID, message, role);
    } catch (error) {
      console.error("Error sending message: ", error);
      setIsTyping(false);
    }
  };

  const sendMessageAndStreamResponse = async (idMahasiswa, text, role) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    const raw = JSON.stringify({ idMahasiswa, text, role });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chatBot`,
        requestOptions
      );
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let previousValue = "";
      let receivedValue = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        receivedValue += value;

        if (previousValue !== receivedValue) {
          previousValue = receivedValue;

          setPartialMessage(receivedValue);

          setMessages((prev) => {
            const updatedMessages = [...prev];
            const lastMessageIndex = updatedMessages.length - 1;

            if (updatedMessages[lastMessageIndex]?.role === "bot") {
              updatedMessages[lastMessageIndex].content = receivedValue;
            } else {
              updatedMessages.push({ role: "bot", content: receivedValue });
            }

            return updatedMessages;
          });

          await simpanPesan(idMahasiswa, receivedValue, "bot");
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Error receiving streaming data: ", error);
      setIsTyping(false);
    }
  };

  return (
    <Layout>
      <div className="h-[400px]">
        <section className="overflow-y-scroll h-[450px] rounded-lg section-scroll-hide">
          {messages.map((message, index) => (
            <div key={index} className="mb-4 gap-3 items-start flex text-left">
              <div className="bg-green-400 rounded-full">
                <CircleUserRound />
              </div>
              <section>
                <p className="font-semibold">
                  {message.role === "user" ? nama : "SIDATABOT"}
                </p>
                <div className="inline-block py-2 rounded-lg text-neutral-700">
                  {message.content}
                </div>
              </section>
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 gap-3 items-start flex text-left">
              <div className="bg-green-400 rounded-full">
                <CircleUserRound />
              </div>
              <section>
                <p className="font-semibold">SIDATABOT</p>
                <div className="inline-block py-2 rounded-lg text-neutral-700">
                  ...
                </div>
              </section>
            </div>
          )}
        </section>
        <section className="mt-4">
          <InputPesan onSendMessage={handleSendMessage} />
        </section>
      </div>
    </Layout>
  );
}
