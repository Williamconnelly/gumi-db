export const GET_MEDIA = `
  query GetMedia($page: Int!, $perPage: Int!) {
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
          edges {
            relationType
            node {
              id
            }
          }
        }
        characters {
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
        staff {
          edges {
            role
            node {
              id
            }
          }
        }
      }
    }
  }
`;
