export const GET_TAGS = `
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
