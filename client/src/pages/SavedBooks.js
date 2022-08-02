import React, { useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_BOOK } from "../utils/mutations";
import { QUERY_USER } from "../utils/queries";
import Auth from "../utils/auth";
import { removeBookId, getSavedBookIds } from "../utils/localStorage";

const SavedBooks = () => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;
  const profile = Auth.getProfile();
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(QUERY_USER, {
    variables: { userId: profile.data._id },
  });
  const [deleteBook] = useMutation(DELETE_BOOK);

  useEffect(() => {
    if (getSavedBookIds().length !== queryData?.user?.savedBooks?.length)
      refetch({ userId: profile.data._id });
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId, userId, refetch) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook({
        variables: {
          bookId: bookId,
          userId: userId,
        },
      });

      if (!response) {
        throw new Error("something went wrong!");
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return <h2>Log in to see your saved books!</h2>;
  } else if (queryLoading) {
    return <h2>LOADING...</h2>;
  } else if (queryError) {
    return <h2>There was an error loading this page.</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {queryData.user?.savedBooks?.length
            ? `Viewing ${queryData.user?.savedBooks?.length} saved ${
                queryData.user?.savedBooks?.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {queryData.user?.savedBooks?.map((book, index) => {
            return (
              <Card key={index} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() =>
                      handleDeleteBook(book.bookId, profile.data._id, refetch)
                    }
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
