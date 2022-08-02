import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      savedBooks {
        authors
        bookId
        image
        link
        title
        description
      }
    }
  }
`;
