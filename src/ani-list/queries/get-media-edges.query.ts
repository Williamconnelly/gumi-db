export const GET_MEDIA_EDGES = `
  query GetMediaEdges($ids: [Int], $page: Int) {
    Page(perPage: 50) {
      media(id_in: $ids) {
        id
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
