import { BLOCKS, type Document } from "@contentful/rich-text-types";
import type { RichTextDocument } from "@/lib/sections/types";

/**
 * Uses the first rich-text paragraph as the article deck/summary; remainder renders in the body.
 */
export function splitFirstParagraph(body: RichTextDocument): {
  intro: RichTextDocument | null;
  rest: RichTextDocument | null;
} {
  const doc = body.json as Document;
  const content = doc?.content;
  if (!Array.isArray(content) || content.length === 0) {
    return { intro: null, rest: body };
  }

  const [first, ...rest] = content;
  if (first?.nodeType !== BLOCKS.PARAGRAPH) {
    return { intro: null, rest: body };
  }

  const links = body.links;
  const introDoc: Document = {
    nodeType: doc.nodeType,
    data: doc.data,
    content: [first],
  };

  if (rest.length === 0) {
    return { intro: { json: introDoc, links }, rest: null };
  }

  const restDoc: Document = {
    nodeType: doc.nodeType,
    data: doc.data,
    content: rest,
  };

  return {
    intro: { json: introDoc, links },
    rest: { json: restDoc, links },
  };
}
