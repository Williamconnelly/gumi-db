export const GET_MEDIA_EDGES = `
  query GetMediaEdges(
    $ids: [Int]
    $staffPage: Int
    $characterPage: Int
    $relationsPage: Int
    $recommendationsPage: Int
  ) {
    Page(perPage: 50) {
      media(id_in: $ids) {
        id
        relations(page: $relationsPage) {
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
        characters(page: $characterPage) {
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
        staff(page: $staffPage) {
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
        recommendations(page: $recommendationsPage) {
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