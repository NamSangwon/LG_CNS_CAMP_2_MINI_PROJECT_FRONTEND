import React from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

import "./postContent.css";

export default function PostContent({ post }) {
    // SyntaxHighlighter에 등록할 언어 (필요한 경우 다른 언어도 추가)
    SyntaxHighlighter.registerLanguage('javascript', js);

    return (
        <>
            <div className="post_section"> {/* 여기에 post_section 클래스 적용 */}
                <ReactMarkdown
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const codeString = String(children).replace(/\n$/, "");

                            if (!inline && match) {
                                return (
                                    <div style={{ position: "relative" }}>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(codeString)}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                fontSize: "0.75rem",
                                                padding: "2px 6px",
                                                cursor: "pointer",
                                                backgroundColor: "#f0f0f0", // 복사 버튼 배경색
                                                color: "#333", // 복사 버튼 글꼴 색상
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                zIndex: 1,
                                                boxShadow: "0 1px 1px rgba(27, 31, 35, .04)",
                                            }}
                                        >
                                            Copy
                                        </button>
                                        <SyntaxHighlighter
                                            language={match[1]}
                                            style={github}
                                            PreTag="div" // pre 태그로 렌더링하도록 변경
                                            customStyle={{ 
                                                paddingTop: "2.5rem",
                                                backgroundColor: "transparent", // CSS에서 배경색 처리
                                                margin: 0, // 외부 pre 태그의 margin 사용
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
                                        // 인라인 코드 스타일은 CSS 파일에서 .post_section code 에 정의
                                        // 여기에 직접 스타일을 주는 대신 CSS 클래스를 활용하는 것이 좋습니다.
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        strong: ({ children, ...props }) => (
                            // strong 태그 스타일은 CSS 파일에서 .post_section strong 에 정의
                            <strong {...props}>
                                {children}
                            </strong>
                        ),
                        // 추가적으로 이미지와 같이 보이게 하기 위해 h2 태그의 스타일도 ReactMarkdown 컴포넌트에 추가합니다.
                        h2: ({ children, ...props }) => (
                            <h2 {...props}>
                                {children}
                            </h2>
                        ),
                        ul: ({ children, ...props }) => (
                            <ul {...props}>
                                {children}
                            </ul>
                        ),
                        li: ({ children, ...props }) => (
                            <li {...props}>
                                {children}
                            </li>
                        ),
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </>
    )
}
