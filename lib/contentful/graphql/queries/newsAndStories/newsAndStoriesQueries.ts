import { NEWS_AND_STORIES_FRAGMENT } from "../../fragments/newsAndStories/newsAndStoriesFragment";

/** Fetch a NewsAndStories section by entry ID (section hydration). */
export const NEWS_AND_STORIES_BY_ID = /* GraphQL */ `
  ${NEWS_AND_STORIES_FRAGMENT}

  query NewsAndStoriesById($id: String!, $locale: String!, $preview: Boolean) {
    newsAndStories(id: $id, locale: $locale, preview: $preview) {
      ...NewsAndStoriesFields
    }
  }
`;
