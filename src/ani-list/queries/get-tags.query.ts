export const GET_TAGS: string = `
  query GetTags {
    MediaTagCollection {
      id
      name
      description
      category
      isAdult
    }
  }
`;
