import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function App() {

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage(){
    if(!prompt.trim() || isLoading) return;

    const user_msg = { role:"user", content: prompt };
    setMessages(prev=>[...prev, user_msg]);

    const currentPrompt = prompt;
    setPrompt("");
    setIsLoading(true);

    try{
      const res = await axios.post("/api/ask", 
        `prompt=${encodeURIComponent(currentPrompt)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      const ai_msg = { role:"assistant", content: res.data.response };
      setMessages(prev=>[...prev, ai_msg]);
    }catch(e){
      console.error('Error sending message:', e);
      // Add error message to chat
      const error_msg = { role:"assistant", content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev=>[...prev, error_msg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "0",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: "100%",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.95)",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Header */}
        <div style={{
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          padding: "20px",
          textAlign: "center",
          color: "white"
        }}>
          <h1 style={{
            margin: "0",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            🧠 Kelly - AI Scientist Poet
          </h1>
          <p style={{
            margin: "5px 0 0 0",
            opacity: "0.9",
            fontSize: "1.1rem"
          }}>
            Your intelligent companion for AI insights and creative exploration
          </p>
        </div>

        {/* Messages Container */}
        <div style={{
          flex: "1",
          padding: "40px 60px",
          overflowY: "auto",
          background: "#f8f9fa"
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#6c757d",
              marginTop: "50px"
            }}>
              <div style={{fontSize: "4rem", marginBottom: "20px"}}>💭</div>
              <h3 style={{margin: "0 0 10px 0", color: "#495057"}}>Welcome to Kelly!</h3>
              <p style={{margin: "0", fontSize: "1.1rem"}}>
                Ask me anything about AI, machine learning, or let's explore ideas together!
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "20px",
                width: "100%"
              }}>
                <div style={{
                  maxWidth: "70%",
                  minWidth: "200px",
                  padding: "20px 25px",
                  borderRadius: "20px",
                  background: m.role === "user" 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.3s ease-in",
                  position: "relative"
                }}>
                  <div style={{
                    fontSize: "0.9rem",
                    opacity: "0.8",
                    marginBottom: "8px",
                    fontWeight: "bold"
                  }}>
                    {m.role === "user" ? "You" : "🧠 Kelly"}
                  </div>
                  <div style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.6",
                    fontSize: "1.1rem"
                  }}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "20px",
              width: "100%"
            }}>
              <div style={{
                padding: "20px 25px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}>
                <div style={{
                  fontSize: "0.9rem",
                  opacity: "0.8",
                  marginBottom: "8px",
                  fontWeight: "bold"
                }}>
                  🧠 Kelly
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <div style={{
                    display: "flex",
                    gap: "4px"
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "white",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "-0.32s"
                    }}></div>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "white",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "-0.16s"
                    }}></div>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "white",
                      animation: "bounce 1.4s infinite ease-in-out both"
                    }}></div>
                  </div>
                  <span style={{fontSize: "1.1rem"}}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "30px 60px",
          background: "white",
          borderTop: "1px solid #e9ecef"
        }}>
          <div style={{
            display: "flex",
            gap: "15px",
            alignItems: "flex-end"
          }}>
            <textarea
              ref={inputRef}
              style={{
                flex: "1",
                padding: "18px 20px",
                border: "2px solid #e9ecef",
                borderRadius: "15px",
                fontSize: "1.1rem",
                resize: "none",
                minHeight: "55px",
                maxHeight: "120px",
                outline: "none",
                transition: "border-color 0.3s ease",
                fontFamily: "inherit"
              }}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Kelly anything about AI, machine learning, or creative ideas..."
              disabled={isLoading}
              onFocus={e => e.target.style.borderColor = "#4facfe"}
              onBlur={e => e.target.style.borderColor = "#e9ecef"}
            />
            <button
              style={{
                padding: "18px 30px",
                background: isLoading ? "#6c757d" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "15px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                minWidth: "90px"
              }}
              onClick={sendMessage}
              disabled={isLoading || !prompt.trim()}
              onMouseEnter={e => {
                if (!isLoading && prompt.trim()) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
          <div style={{
            marginTop: "15px",
            fontSize: "1rem",
            color: "#6c757d",
            textAlign: "center"
          }}>
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </div>
  )
}
