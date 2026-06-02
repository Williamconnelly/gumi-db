export const GET_STAFF: string = `
  query GetStaff($ids: [Int], $staffPage: Int) {
    Page(page: $staffPage, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      staff(id_in: $ids) {
        id
        name {
          first
          middle
          last
          full
          native
          alternative
        }
        languageV2
        image {
          large
          medium
        }
        description
        primaryOccupations
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        yearsActive
        homeTown
        bloodType
        isFavouriteBlocked
        favourites
      }
    }
  }
`;
