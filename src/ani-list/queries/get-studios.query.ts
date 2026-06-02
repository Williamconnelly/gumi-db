export const GET_STUDIOS = `
  query GetStudios($studioPage: Int, $perPage: Int) {
    Page(page: $studioPage, perPage: $perPage) {
      pageInfo {
        currentPage
        lastPage
        hasNextPage
        perPage
        total
      }
      studios {
        id
        name
        isAnimationStudio
        favourites
      }
    }
  }
`;
