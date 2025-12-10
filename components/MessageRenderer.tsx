import React from 'react';

interface MessageRendererProps {
  content: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by newlines to process line-by-line for block elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (keyPrefix: string) => {
    if (inTable && tableHeader.length > 0) {
      elements.push(
        <div key={`${keyPrefix}-table`} className="my-4 overflow-x-auto rounded-lg border border-border bg-surfaceHighlight p-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-xs uppercase text-gray-400">
              <tr>
                {tableHeader.map((th, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold tracking-wider">{th.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 whitespace-pre-wrap">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  const processInline = (text: string): React.ReactNode[] => {
    // Simple bold parser: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table Detection
    if (trimmed.startsWith('|')) {
       const cells = trimmed.split('|').filter(c => c.trim() !== ''); // minimal logic
       if (!inTable) {
           // Assume first row is header
           inTable = true;
           tableHeader = cells;
       } else {
           // If it's a separator row (---), skip
           if (trimmed.match(/\|[\s-]+\|/)) {
               continue;
           }
           tableRows.push(cells);
       }
       continue;
    } else {
       if (inTable) flushTable(`line-${i}`);
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`} className="mt-6 mb-3 text-lg font-bold text-primary tracking-tight">{line.replace('### ', '')}</h3>);
      continue;
    }

    // Callouts
    if (line.startsWith('> ')) {
      elements.push(
        <div key={`callout-${i}`} className="my-4 border-l-4 border-wealth bg-wealth/10 p-4 rounded-r-md">
          <p className="text-wealth font-medium italic">{processInline(line.replace('> ', ''))}</p>
        </div>
      );
      continue;
    }

    // List items
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={`li-${i}`} className="ml-4 flex items-start gap-2 my-1">
            <span className="text-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <div className="text-gray-300 leading-relaxed">{processInline(trimmed.substring(2))}</div>
        </div>
      );
      continue;
    }

    // Empty lines
    if (trimmed === '') {
        elements.push(<div key={`br-${i}`} className="h-2" />);
        continue;
    }

    // Regular paragraph
    elements.push(<p key={`p-${i}`} className="mb-2 leading-relaxed text-gray-300">{processInline(line)}</p>);
  }
  
  // Flush any remaining table at the end
  if (inTable) flushTable('end');

  return <div className="space-y-1 font-sans">{elements}</div>;
};

export default MessageRenderer;
