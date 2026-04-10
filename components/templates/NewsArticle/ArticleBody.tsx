import type { Document } from "@contentful/rich-text-types";
import type { RichTextDocument } from "@/lib/sections/types";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

type ArticleBodyProps = {
  body?: RichTextDocument | null;
};

export function ArticleBody({ body }: ArticleBodyProps) {
  if (!body?.json) return null;

  return (
    <div className="article-container bg-white pb-16 pt-8 lg:pb-20">
      <div className="article-body-container">
        <RichTextRenderer
          document={body.json as Document}
          links={body.links}
          className="prose prose-lg max-w-none text-darkest-grey prose-headings:text-darkest-grey"
        />
      </div>
    </div>
  );
}
