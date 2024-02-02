import { gql, useQuery, useMutation } from '@apollo/client';
import client from '@erxes/ui/src/apolloClient';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { confirm } from '@erxes/ui/src/utils';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import { IEmailTemplate } from '@erxes/ui-emailtemplates/src/types';
import { Alert } from '@erxes/ui/src/utils';
import React from 'react';
import {
  ICommonFormProps,
  ICommonListProps,
} from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';

export type EmailTemplatesTotalCountQueryResponse = {
  emailTemplatesTotalCount: number;
};

export type EmailTemplatesQueryResponse = {
  fetchMore: (params: {
    variables: { page: number };
    updateQuery: (prev: any, fetchMoreResult: any) => void;
  }) => void;
  emailTemplates: IEmailTemplate[];
  variables: { [key: string]: string | number };
  loading: boolean;
  refetch: () => void;
};

type Props = {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  listQuery: any;
} & ICommonListProps &
  ICommonFormProps;

const EmailListContainer = (props: Props) => {
  const { queryParams } = props;

  const listQuery = useQuery<EmailTemplatesQueryResponse>(
    gql(queries.emailTemplates),
    {
      variables: {
        searchValue: queryParams.searchValue,
        status: queryParams.status,
        ...generatePaginationParams(queryParams),
      },
    },
  );

  const totalCountQuery = useQuery<EmailTemplatesTotalCountQueryResponse>(
    gql(queries.totalCount),
    {
      variables: {
        searchValue: queryParams.searchValue,
      },
    },
  );

  const [emailTemplatesRemove] = useMutation(
    gql(mutations.emailTemplatesRemove),
    {
      refetchQueries: ['emailTemplates', 'emailTemplatesTotalCount'],
    },
  );
  const [emailTemplatesDuplicate] = useMutation(
    gql(mutations.emailTemplatesDuplicate),
    {
      refetchQueries: ['emailTemplates', 'emailTemplatesTotalCount'],
    },
  );

  const remove = (id: string) => {
    confirm().then(() => {
      emailTemplatesRemove({
        variables: { _id: id },
      })
        .then(() => {
          Alert.success('Successfully deleted a template');
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const duplicate = (id: string) => {
    client;
    emailTemplatesDuplicate({
      variables: { _id: id },
    })
      .then(() => {
        Alert.success('Successfully duplicated a template');
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    remove,
    duplicate,
    objects: listQuery?.data?.emailTemplates || [],
    totalCount: totalCountQuery?.data?.emailTemplatesTotalCount || 0,
    loading: listQuery.loading || totalCountQuery.loading,
  };

  return <List {...updatedProps} />;
};

export default EmailListContainer;
