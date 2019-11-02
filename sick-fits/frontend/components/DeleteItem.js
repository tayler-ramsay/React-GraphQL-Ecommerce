import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export default class DeleteItem extends Component {
  update = (cache, payload) => {
    //manually update client cache
    //read cache for what was deleted with Apollo
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    //filter the deleted item out
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // put the remaining items back using Apollo
    cache.writeQuery({ query: ALL_ITEMS_QUERY });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this item?")) {
                deleteItem();
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}
