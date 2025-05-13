import React from 'react';

/**
 * Renders content in various formats (markdown, plain text, etc.)
 */

interface FormatRendererProps {
    content: string;
    format: string;
}

// Function to process emphasis within a line of text for markdown
const processEmphasis = (text: string): JSX.Element[] => {
    // Split the text by the markers for bold, italic, and code
    const parts: JSX.Element[] = [];
    let currentText = '';
    let inBold = false;
    let inItalic = false;
    let inCode = false;

    for (let i = 0; i < text.length; i++) {
        // Handle code (backticks)
        if (text[i] === '`' && (!inBold && !inItalic)) {
            if (currentText) {
                parts.push(<span key={`text-${parts.length}`}>{currentText}</span>);
                currentText = '';
            }
            inCode = !inCode;
            if (!inCode) {
                // End of code section
                const codeText = text.substring(text.indexOf('`', i - currentText.length - 1) + 1, i);
                parts.push(<code key={`code-${parts.length}`} className="bg-gray-100 text-red-600 px-1 py-0.5 rounded font-mono text-sm">{codeText}</code>);
                currentText = '';
            }
            continue;
        }

        if (inCode) {
            // Collecting code content
            continue;
        }

        // Handle bold (**text**)
        if (text.substring(i, i + 2) === '**' && !inItalic) {
            if (currentText) {
                parts.push(<span key={`text-${parts.length}`}>{currentText}</span>);
                currentText = '';
            }
            inBold = !inBold;
            i++; // Skip the second asterisk
            continue;
        }

        // Handle italic (*text*)
        if (text[i] === '*' && text[i - 1] !== '*' && text[i + 1] !== '*' && !inBold) {
            if (currentText) {
                parts.push(<span key={`text-${parts.length}`}>{currentText}</span>);
                currentText = '';
            }
            inItalic = !inItalic;
            continue;
        }

        // If we're in bold or italic, collect the text
        if (inBold) {
            currentText += text[i];
            if (i === text.length - 1 || (text.substring(i + 1, i + 3) === '**')) {
                parts.push(<strong key={`bold-${parts.length}`}>{currentText}</strong>);
                currentText = '';
                inBold = false;
                i += 2; // Skip the closing asterisks
            }
        } else if (inItalic) {
            currentText += text[i];
            if (i === text.length - 1 || text[i + 1] === '*') {
                parts.push(<em key={`italic-${parts.length}`}>{currentText}</em>);
                currentText = '';
                inItalic = false;
                i++; // Skip the closing asterisk
            }
        } else {
            currentText += text[i];
        }
    }

    // Add any remaining text
    if (currentText) {
        parts.push(<span key={`text-${parts.length}`}>{currentText}</span>);
    }

    return parts;
};

// Parse and render markdown content
export const renderMarkdown = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    const result: JSX.Element[] = [];
    let inList = false;
    let listItems: JSX.Element[] = [];
    let inOrderedList = false;
    let inCodeBlock = false;
    let codeContent = '';
    let key = 0;

    const processListItems = () => {
        if (listItems.length > 0) {
            if (inOrderedList) {
                result.push(<ol key={key++} className="ml-5 list-decimal space-y-1 my-3">{listItems}</ol>);
            } else {
                result.push(<ul key={key++} className="ml-5 list-disc space-y-1 my-3">{listItems}</ul>);
            }
            listItems = [];
        }
        inList = false;
        inOrderedList = false;
    };

    const processCodeBlock = () => {
        if (codeContent) {
            result.push(
                <pre key={key++} className="bg-gray-100 p-3 rounded-md my-3 overflow-auto">
                    <code>{codeContent}</code>
                </pre>
            );
            codeContent = '';
        }
        inCodeBlock = false;
    };

    lines.forEach((line, index) => {
        // Code blocks
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                processCodeBlock();
            } else {
                inCodeBlock = true;
            }
            return;
        }

        if (inCodeBlock) {
            codeContent += line + '\n';
            return;
        }

        // Horizontal rule
        if (line.match(/^(\*{3,}|-{3,}|_{3,})$/)) {
            if (inList) processListItems();
            result.push(<hr key={key++} className="my-4 border-t border-gray-200" />);
            return;
        }

        // Headers
        if (line.startsWith('# ')) {
            if (inList) processListItems();
            result.push(<h1 key={key++} className="text-2xl font-bold mt-6 mb-3">{processEmphasis(line.substring(2))}</h1>);
            return;
        }
        if (line.startsWith('## ')) {
            if (inList) processListItems();
            result.push(<h2 key={key++} className="text-xl font-bold mt-5 mb-2">{processEmphasis(line.substring(3))}</h2>);
            return;
        }
        if (line.startsWith('### ')) {
            if (inList) processListItems();
            result.push(<h3 key={key++} className="text-lg font-bold mt-4 mb-2">{processEmphasis(line.substring(4))}</h3>);
            return;
        }
        if (line.startsWith('#### ')) {
            if (inList) processListItems();
            result.push(<h4 key={key++} className="text-base font-bold mt-3 mb-2">{processEmphasis(line.substring(5))}</h4>);
            return;
        }
        if (line.startsWith('##### ')) {
            if (inList) processListItems();
            result.push(<h5 key={key++} className="text-sm font-bold mt-3 mb-1">{processEmphasis(line.substring(6))}</h5>);
            return;
        }
        if (line.startsWith('###### ')) {
            if (inList) processListItems();
            result.push(<h6 key={key++} className="text-xs font-bold mt-2 mb-1">{processEmphasis(line.substring(7))}</h6>);
            return;
        }

        // List items
        const unorderedListMatch = line.match(/^(\s*[-*+]\s+)(.+)$/);
        if (unorderedListMatch) {
            if (inOrderedList) {
                processListItems(); // End the ordered list before starting unordered
            }
            inList = true;
            const content = unorderedListMatch[2];
            listItems.push(<li key={`list-${key++}`}>{processEmphasis(content)}</li>);
            return;
        }

        const orderedListMatch = line.match(/^(\s*\d+\.\s+)(.+)$/);
        if (orderedListMatch) {
            if (!inOrderedList && inList) {
                processListItems(); // End the unordered list before starting ordered
            }
            inList = true;
            inOrderedList = true;
            const content = orderedListMatch[2];
            listItems.push(<li key={`list-${key++}`}>{processEmphasis(content)}</li>);
            return;
        }

        // If we were in a list but this line isn't a list item, end the list
        if (inList && line.trim() !== '') {
            processListItems();
        }

        // Empty line
        if (line.trim() === '') {
            return;
        }

        // Regular paragraph
        result.push(<p key={key++} className="my-2">{processEmphasis(line)}</p>);
    });

    // Clean up any remaining lists or code blocks
    if (inList) processListItems();
    if (inCodeBlock) processCodeBlock();

    return result;
};

// Render plain text content
export const renderPlainText = (text: string): JSX.Element[] => {
    return text.split('\n').map((line, i) => (
        line.trim() === '' ? <br key={i} /> : <p key={i} className="my-1">{line}</p>
    ));
};

// Main format renderer component
export const FormatRenderer: React.FC<FormatRendererProps> = ({ content, format }) => {
    let renderedContent: JSX.Element | JSX.Element[];

    switch (format.toLowerCase()) {
        case 'markdown':
        case 'md':
            renderedContent = renderMarkdown(content);
            break;

        case 'plain':
        case 'text':
        case 'txt':
        default:
            renderedContent = renderPlainText(content);
            break;
    }

    return (
        <div className="format-renderer prose prose-sm prose-blue max-w-none">
            {renderedContent}
        </div>
    );
};

export default FormatRenderer; 