import { useState, useRef, useEffect } from "react";

function LuizaPage() {
  const [mensagens, setMensagens] = useState([
    { autor: "luiza", texto: "Olá! Sou a Luiza a IA assistente da Estudamais.tech. Como posso ajudar?" }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const enviarPergunta = async () => {
    if (!input.trim()) return;

    setMensagens((prev) => [...prev, { autor: "você", texto: input }]);
    setInput("");

    try {
      const BASE_URL = import.meta.env.PROD
        ? '/luiza'
        : 'http://localhost:8000';
        
      const resposta = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!resposta.ok) throw new Error("Erro na API");
      const data = await resposta.json();

      setMensagens((prev) => [
        ...prev,
        { autor: "luiza", texto: data.answer || "Tive um problema aqui 😅" },
      ]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        { autor: "luiza", texto: "Algo deu errado. Tente novamente depois." },
      ]);
    }
  };

  const pressionarEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarPergunta();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensagens]);

  return (
    <section className="pt-24 min-h-screen bg-[#1c4145] text-white px-4 md:px-10 pb-10 font-poppins">
      <div className="container max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Chat com a Luiza</h2>

        <div
          ref={chatRef}
          className="bg-background p-4 rounded-lg h-96 overflow-y-auto shadow-inner border border-border mb-4"
        >
          {mensagens.map((msg, idx) => (
            <div key={idx} className={`flex items-start ${msg.autor === "luiza" ? "justify-start" : "justify-end"} mb-4 opacity-100 transition-opacity duration-300 ease-in`} style={{animationDelay: `${idx * 0.1}s`}}>
              {msg.autor === "luiza" && (
                <div className="bg-[#1c4145] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">L</div>
              )}
              <div
                className={`max-w-[75%] rounded-xl shadow-md px-4 py-3 text-sm
                  ${msg.autor === "luiza"
                    ? "bg-[#cbe7e4] text-[#1c4145]"
                    : "bg-[#fbdd41] text-[#1c4145]"}`
                }
              >
                <strong>{msg.autor === "luiza" ? "Luiza" : "Você"}:</strong> {msg.texto}
              </div>
              {msg.autor !== "luiza" && (
                <div className="bg-[#457a8e] text-white rounded-full w-8 h-8 flex items-center justify-center ml-2 flex-shrink-0">V</div>
              )}
            </div>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={pressionarEnter}
          rows={3}
          className="w-full p-3 border rounded bg-popover text-[#1c4145] mb-2 resize-none"
          placeholder="Digite sua pergunta..."
        />

        <button
          onClick={enviarPergunta}
          className="cta-button-gradient text-estudamais-green-dark px-6 py-2.5 rounded-md font-semibold w-fit hover:brightness-110 mx-auto block"
        >
          Enviar
        </button>
      </div>
    </section>
  );
}

export default LuizaPage;
