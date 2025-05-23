import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage("javascript", js);

export default function ChatMessageItem({ role, content }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: role === "user" ? "flex-end" : "flex-start",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          backgroundColor: role === "user" ? "#efefef" : "",
          padding: "10px 15px",
          borderRadius: "10px",
          margin: "20px",
          wordBreak: "break-word",
          lineHeight: "1.6",
        }}
      >
        <ReactMarkdown
          components={{
            h1: (props) => (
              <h1
                style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}
                {...props}
              />
            ),
            strong: (props) => (
              <strong style={{ fontWeight: "bold" }} {...props} />
            ),
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                      margin: "12px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        color: "#555",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <span>{match[1]}</span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(codeString)
                        }
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 6px",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        복사
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={match[1]}
                      style={atomOneLight}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        backgroundColor: "#fff",
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                    color: "#cf0e0e",
                    margin: "2px 0",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>

        {/* <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>
          {new Date(timestamp).toLocaleTimeString()}
        </div> */}
      </div>
    </div>
  );
}
