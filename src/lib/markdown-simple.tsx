/**
 * Lightweight markdown-to-JSX renderer for Wakili AI chat bubbles.
 * Handles: **bold**, *italic*, ### headings, - bullet lists, numbered lists,
 * horizontal rules, inline code. No external deps needed.
 */
import React from "react";

function renderInline(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, `code`
  const parts: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    if (m[0].startsWith("**")) {
      parts.push(<strong key={m.index} className="font-semibold">{m[2]}</strong>);
    } else if (m[0].startsWith("*")) {
      parts.push(<em key={m.index}>{m[3]}</em>);
    } else if (m[0].startsWith("`")) {
      parts.push(<code key={m.index} className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{m[4]}</code>);
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

export function MarkdownMessage({ children, className }: { children: string; className?: string }) {
  if (!children) return null;

  const lines = children.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listBuffer.length === 0) return;
    if (listType === "ul") {
      elements.push(
        <ul key={`ul-${elements.length}`} className="ml-4 list-disc space-y-1 my-1.5">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-snug">{renderInline(item)}</li>
          ))}
        </ul>,
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="ml-4 list-decimal space-y-1 my-1.5">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-snug">{renderInline(item)}</li>
          ))}
        </ol>,
      );
    }
    listBuffer = [];
    listType = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={i} className="my-2 border-border/50" />);
      continue;
    }

    // Headings ### ## #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const cls = level === 1
        ? "font-display text-base font-bold mt-2 mb-1"
        : level === 2
          ? "font-display text-sm font-bold mt-2 mb-0.5"
          : "font-semibold text-sm mt-1.5 mb-0.5";
      elements.push(
        <p key={i} className={cls}>{renderInline(text)}</p>,
      );
      continue;
    }

    // Unordered bullet: "- item" or "* item" or "• item"
    const ulMatch = line.match(/^[\s]*[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listBuffer.push(ulMatch[1]);
      continue;
    }

    // Ordered list: "1. item" or "2. item"
    const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listBuffer.push(olMatch[1]);
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      flushList();
      // only add spacing if there's content before it
      if (elements.length > 0) {
        elements.push(<div key={`sp-${i}`} className="h-1.5" />);
      }
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="leading-relaxed">{renderInline(line)}</p>,
    );
  }

  flushList();

  return (
    <div className={className}>
      {elements}
    </div>
  );
}
