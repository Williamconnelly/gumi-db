export const GET_MEDIA = `
  query GetMedia(
      $page: Int
      $perPage: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          lastPage
          hasNextPage
          perPage
          total
        }
        media {
          id
          idMal
          title {
            romaji
            english
            native
          }
          synonyms
          type
          format
          status
          source
          countryOfOrigin
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          season
          seasonYear
          episodes
          duration
          chapters
          volumes
          description
          averageScore
          meanScore
          popularity
          favourites
          isAdult
          isLicensed
          isLocked
          coverImage {
            extraLarge
            large
            medium
          }
          updatedAt
          genres
          tags {
            id
            isMediaSpoiler
            rank
          }
          relations {
            pageInfo {
              hasNextPage
            }
            edges {
              relationType
              node {
                id
              }
            }
          }
          characters(page: $page) {
            pageInfo {
              hasNextPage
            }
            edges {
              role
              node {
                id
              }
              voiceActors {
                id
              }
            }
          }
          staff(page: $page) {
            pageInfo {
              hasNextPage
            }
            edges {
              role
              node {
                id
              }
            }
          }
          studios {
            edges {
              isMain
              node {
                id
              }
            }
          }
          recommendations(page: $page) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                id
                rating
                mediaRecommendation {
                  id
                }
              }
            }
          }
        }
      }
    }
`;