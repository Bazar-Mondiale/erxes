import { Alert, confirm } from '@erxes/ui/src';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import PageForm from '../../components/pages/PageForm';
import React from 'react';
import { mutations, queries } from '../../graphql';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import {
  PageDetailQueryResponse,
  PagesAddMutationResponse,
  PagesEditMutationResponse,
  TemplatesAddMutationResponse,
  TemplatesQueryResponse,
  TemplatesRemoveMutationResponse
} from '../../types';

type Props = {
  _id?: string;
} & IRouterProps;

type FinalProps = Props & {
  pageDetailQuery?: PageDetailQueryResponse;
  templatesQuery: TemplatesQueryResponse;
} & PagesAddMutationResponse &
  PagesEditMutationResponse &
  TemplatesAddMutationResponse &
  TemplatesRemoveMutationResponse;

const FormContainer = (props: FinalProps) => {
  const {
    pageDetailQuery,
    history,
    templatesQuery,
    templatesAdd,
    templatesRemove
  } = props;

  if ((pageDetailQuery && pageDetailQuery.loading) || templatesQuery.loading) {
    return null;
  }

  const saveTemplate = (name: string, jsonData: any) => {
    templatesAdd({ variables: { name, jsonData } })
      .then(() => {
        Alert.success('You successfully added template.');

        history.push({
          pathname: '/webbuilder/pages'
        });
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const removeTemplate = (_id: string) => {
    confirm().then(() => {
      templatesRemove({ variables: { _id } })
        .then(() => {
          Alert.success('You successfully removed template.');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  const save = (
    name: string,
    description: string,
    html: string,
    css: string,
    jsonData
  ) => {
    let method: any = props.pagesAdd;

    const variables: any = {
      name,
      description,
      html,
      css,
      jsonData
    };

    if (props._id) {
      method = props.pagesEdit;
      variables._id = props._id;
    }

    method({ variables })
      .then(() => {
        Alert.success(`Success`);

        history.push({
          pathname: '/webbuilder/pages'
        });
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  let page;

  if (pageDetailQuery) {
    page = pageDetailQuery.webbuilderPageDetail;
  }

  const templates = templatesQuery.webbuilderTemplates || [];

  const updatedProps = {
    save,
    page,
    templates,
    saveTemplate,
    removeTemplate
  };

  return <PageForm {...updatedProps} />;
};

const refetchPageQueries = () => [
  { query: gql(queries.pages) },
  { query: gql(queries.pagesTotalCount) }
];

const refetchTemplateQuery = () => [{ query: gql(queries.templates) }];

export default compose(
  graphql<{}, PagesAddMutationResponse>(gql(mutations.add), {
    name: 'pagesAdd',
    options: () => ({
      refetchQueries: refetchPageQueries()
    })
  }),

  graphql<{}, PagesEditMutationResponse>(gql(mutations.edit), {
    name: 'pagesEdit',
    options: () => ({
      refetchQueries: refetchPageQueries()
    })
  }),

  graphql<Props, PageDetailQueryResponse, { _id?: string }>(
    gql(queries.pageDetail),
    {
      name: 'pageDetailQuery',
      skip: ({ _id }) => !_id,
      options: ({ _id }) => ({
        variables: { _id }
      })
    }
  ),
  graphql<{}, TemplatesQueryResponse>(gql(queries.templates), {
    name: 'templatesQuery'
  }),
  graphql<{}, TemplatesAddMutationResponse>(gql(mutations.templatesAdd), {
    name: 'templatesAdd',
    options: () => ({
      refetchQueries: refetchTemplateQuery()
    })
  }),
  graphql<{}, TemplatesRemoveMutationResponse>(gql(mutations.templatesRemove), {
    name: 'templatesRemove',
    options: () => ({
      refetchQueries: refetchTemplateQuery()
    })
  })
)(withRouter(FormContainer));
