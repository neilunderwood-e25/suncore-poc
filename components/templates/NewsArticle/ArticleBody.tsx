import type { Document } from "@contentful/rich-text-types";
import type { RichTextDocument } from "@/lib/sections/types";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

type ArticleBodyProps = {
  body?: RichTextDocument | null;
};

export function ArticleBody({ body }: ArticleBodyProps) {
  if (!body?.json) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-16">
      <RichTextRenderer
        document={body.json as Document}
        links={body.links}
        className="prose prose-lg max-w-none"
      />
    </div>
  );
}
