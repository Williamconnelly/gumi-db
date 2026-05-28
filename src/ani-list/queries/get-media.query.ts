export const GET_MEDIA = `
  query GetMedia(
      $mediaPage: Int
      $perPage: Int
      $edgePage: Int
    ) {
      Page(page: $mediaPage, perPage: $perPage) {
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
          characters(page: $edgePage) {
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
          staff(page: $edgePage) {
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
          recommendations(page: $edgePage) {
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