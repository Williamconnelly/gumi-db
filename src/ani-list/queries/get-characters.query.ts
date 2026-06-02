export const GET_CHARACTERS: string = `
  query GetCharacters($ids: [Int], $characterPage: Int) {
    Page(page: $characterPage, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      characters(id_in: $ids) {
        id
        name {
          first
          middle
          last
          full
          native
          alternative
          alternativeSpoiler
        }
        image {
          large
          medium
        }
        description
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        bloodType
        favourites
      }
    }
  }
`;
