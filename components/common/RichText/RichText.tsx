import { Fragment, type ReactNode } from "react";
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types";
import type { Block, Inline } from "@contentful/rich-text-types";

import { Cta } from "@/components/common/Cta";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import type { CtaEntry, ImageEntry } from "@/lib/sections/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EmbeddedEntry = {
  __typename: string;
  sys: { id: string };
  [key: string]: unknown;
};

type Asset = {
  sys: { id: string };
  url?: string | null;
  title?: string | null;
  description?: string | null;
  contentType?: string | null;
  width?: number | null;
  height?: number | null;
};

type RichTextLinks = {
  assets?: {
    block?: Array<Asset | null>;
    hyperlink?: Array<Asset | null>;
  };
  entries?: {
    block?: Array<EmbeddedEntry | null>;
    inline?: Array<EmbeddedEntry | null>;
    hyperlink?: Array<EmbeddedEntry | null>;
  };
};

export type RichTextRendererProps = {
  document?: Document | null;
  links?: RichTextLinks | null;
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Entry map builder                                                  */
/* ------------------------------------------------------------------ */

function buildEntryMap(
  entries: RichTextLinks["entries"]
): Map<string, EmbeddedEntry> {
  const map = new Map<string, EmbeddedEntry>();
  for (const list of [entries?.block, entries?.inline, entries?.hyperlink]) {
    for (const entry of list ?? []) {
      if (entry?.sys?.id) {
        map.set(entry.sys.id, entry);
      }
    }
  }
  return map;
}

function buildAssetMap(
  assets: RichTextLinks["assets"]
): Map<string, Asset> {
  const map = new Map<string, Asset>();
  for (const list of [assets?.block, assets?.hyperlink]) {
    for (const asset of list ?? []) {
      if (asset?.sys?.id) {
        map.set(asset.sys.id, asset);
      }
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Embedded entry renderers                                           */
/* ------------------------------------------------------------------ */

function renderEmbeddedImage(entry: EmbeddedEntry): ReactNode | null {
  if (entry.__typename !== "Image") return null;
  return <ResponsiveImage image={entry as unknown as ImageEntry} />;
}

function renderEmbeddedCta(entry: EmbeddedEntry): ReactNode | null {
  if (entry.__typename !== "Cta") return null;
  return (
    <div className="my-4">
      <Cta cta={entry as unknown as CtaEntry} />
    </div>
  );
}

function renderBlockEmbeddedEntry(
  node: Block | Inline,
  entryMap: Map<string, EmbeddedEntry>
): ReactNode {
  const entryId = node.data?.target?.sys?.id;
  const entry = entryId ? entryMap.get(entryId) : null;
  if (!entry) return null;

  return (
    renderEmbeddedImage(entry) ??
    renderEmbeddedCta(entry) ??
    null
  );
}

function renderInlineEmbeddedEntry(
  node: Block | Inline,
  entryMap: Map<string, EmbeddedEntry>
): ReactNode {
  const entryId = node.data?.target?.sys?.id;
  const entry = entryId ? entryMap.get(entryId) : null;
  if (!entry) return null;

  // Inline CTAs render as inline elements
  if (entry.__typename === "Cta") {
    return <Cta cta={entry as unknown as CtaEntry} />;
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Hyperlink renderers                                                */
/* ------------------------------------------------------------------ */

function renderHyperlink(
  node: Block | Inline,
  children: ReactNode
): ReactNode {
  const url = node.data?.uri || "#";
  return (
    <a
      href={url}
      target={url.startsWith("http") ? "_blank" : undefined}
      rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800"
    >
      {children}
    </a>
  );
}

function renderEntryHyperlink(
  node: Block | Inline,
  children: ReactNode,
  entryMap: Map<string, EmbeddedEntry>
): ReactNode {
  const entryId = node.data?.target?.sys?.id;
  const entry = entryId ? entryMap.get(entryId) : null;

  if (!entry) return <span>{children}</span>;

  const slug = entry.slug as string | undefined;
  if (!slug) return <span>{children}</span>;

  return (
    <a
      href={`/${slug}`}
      className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Embedded asset renderer                                            */
/* ------------------------------------------------------------------ */

function renderEmbeddedAsset(
  node: Block | Inline,
  assetMap: Map<string, Asset>
): ReactNode {
  const assetId = node.data?.target?.sys?.id;
  const asset = assetId ? assetMap.get(assetId) : null;

  if (!asset?.url) return null;

  const isImage = asset.contentType?.startsWith("image/");
  const isVideo = asset.contentType?.startsWith("video/");

  if (isImage) {
    return (
      <figure className="my-6">
        <img
          src={asset.url}
          alt={asset.description ?? asset.title ?? ""}
          width={asset.width ?? undefined}
          height={asset.height ?? undefined}
          className="max-w-full rounded-lg"
        />
        {asset.title && (
          <figcaption className="mt-2 text-center text-sm text-zinc-500">
            {asset.title}
          </figcaption>
        )}
      </figure>
    );
  }

  if (isVideo) {
    return (
      <div className="my-6">
        <video
          src={asset.url}
          controls
          width={asset.width ?? undefined}
          height={asset.height ?? undefined}
          className="max-w-full rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
        {asset.title && (
          <p className="mt-2 text-center text-sm text-zinc-500">
            {asset.title}
          </p>
        )}
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RichTextRenderer({
  document,
  links,
  className,
}: RichTextRendererProps) {
  if (!document) return null;

  const entryMap = buildEntryMap(links?.entries);
  const assetMap = buildAssetMap(links?.assets);

  const options: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono">
          {text}
        </code>
      ),
      [MARKS.SUPERSCRIPT]: (text) => <sup>{text}</sup>,
      [MARKS.SUBSCRIPT]: (text) => <sub>{text}</sub>,
      [MARKS.STRIKETHROUGH]: (text) => <s>{text}</s>,
    },

    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="mb-4 leading-relaxed">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h1 className="mb-4 mt-8 text-4xl font-bold">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2 className="mb-3 mt-6 text-3xl font-bold">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h3 className="mb-3 mt-5 text-2xl font-semibold">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <h4 className="mb-2 mt-4 text-xl font-semibold">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <h5 className="mb-2 mt-4 text-lg font-semibold">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <h6 className="mb-2 mt-4 text-base font-semibold">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li className="leading-relaxed">{children}</li>
      ),
      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-zinc-200" />,
      [BLOCKS.TABLE]: (node, children) => {
        const firstRow = node.content?.[0];
        const hasHeader =
          "content" in firstRow &&
          firstRow.content?.[0]?.nodeType === "table-header-cell";

        if (hasHeader) {
          const [headerChild, ...bodyChildren] = children as React.ReactNode[];
          return (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>{headerChild}</thead>
                <tbody>{bodyChildren}</tbody>
              </table>
            </div>
          );
        }

        return (
          <div className="my-6 overflow-x-auto">
            <table className="min-w-full">
              <tbody>{children}</tbody>
            </table>
          </div>
        );
      },
      [BLOCKS.TABLE_ROW]: (_node, children) => (
        <tr>{children}</tr>
      ),
      [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => (
        <th className="bg-zinc-100 px-4 py-2 text-left text-sm font-semibold">
          {children}
        </th>
      ),
      [BLOCKS.TABLE_CELL]: (_node, children) => (
        <td className="border-t border-zinc-200 px-4 py-2 text-sm">
          {children}
        </td>
      ),
      [INLINES.HYPERLINK]: (node, children) =>
        renderHyperlink(node, children),
      [INLINES.ASSET_HYPERLINK]: (node, children) => {
        const assetId = node.data?.target?.sys?.id;
        const asset = assetId ? assetMap.get(assetId) : null;
        if (!asset?.url) return <span>{children}</span>;
        const url = asset.url.startsWith("//") ? `https:${asset.url}` : asset.url;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dusty-blue underline underline-offset-2 hover:text-midnight"
          >
            {children}
          </a>
        );
      },
      [INLINES.ENTRY_HYPERLINK]: (node, children) =>
        renderEntryHyperlink(node, children, entryMap),
      [INLINES.EMBEDDED_ENTRY]: (node) =>
        renderInlineEmbeddedEntry(node, entryMap),
      [BLOCKS.EMBEDDED_ENTRY]: (node) =>
        renderBlockEmbeddedEntry(node, entryMap),
      [BLOCKS.EMBEDDED_ASSET]: (node) =>
        renderEmbeddedAsset(node, assetMap),
    },

    renderText: (text) => {
      if (!text.includes("\n")) return text;
      const parts = text.split("\n");
      return parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && <br />}
        </Fragment>
      ));
    },
  };

  return (
    <div className={className}>
      {documentToReactComponents(document, options)}
    </div>
  );
}
