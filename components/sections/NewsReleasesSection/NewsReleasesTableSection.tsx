import type { NewsReleasesTableSection } from "@/lib/sections/types";
import { RichTextRenderer } from "@/components/common/RichText/RichText";
import type { Document } from "@contentful/rich-text-types";

type Props = {
  section: NewsReleasesTableSection;
};

export function NewsReleasesTableSectionComponent({ section }: Props) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="article-container">
        <div className="mx-auto max-w-4xl">
          {section.title && (
            <h2 className="mb-8 text-2xl font-bold text-midnight md:text-3xl">
              {section.title}
            </h2>
          )}

          {section.body?.json ? (
            <RichTextRenderer
              document={section.body.json as Document}
              links={section.body.links}
              className="news-releases-table [&>div]:rounded-lg [&>div]:border [&>div]:border-light-grey [&>div]:overflow-hidden [&_table]:w-full [&_th]:!bg-midnight [&_th]:!text-white [&_th]:px-6 [&_th]:py-3 [&_td]:px-6 [&_td]:py-4 [&_td]:text-midnight [&_td]:border-t [&_td]:border-light-grey [&_a]:text-dusty-blue [&_a]:font-medium [&_a]:no-underline [&_a:hover]:text-midnight [&_a:hover]:underline [&_p]:mb-0"
            />
          ) : (
            <p className="py-12 text-center text-dark-grey-70">
              No news releases available at this time.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
