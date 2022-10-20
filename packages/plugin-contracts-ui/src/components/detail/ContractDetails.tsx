import * as path from 'path';

import EmptyState from '@erxes/ui/src/components/EmptyState';
import { IContract } from '../../types';
import { IUser } from '@erxes/ui/src/auth/types';
import LeftSidebar from './LeftSidebar';
import React from 'react';
import RightSidebar from './RightSidebar';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import { isEnabled } from '@erxes/ui/src/utils/core';

const ActivityInputs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityInputs" */ '@erxes/ui-log/src/activityLogs/components/ActivityInputs'
    )
);

const ActivityLogs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityLogs" */ '@erxes/ui-log/src/activityLogs/containers/ActivityLogs'
    )
);

type Props = {
  contract: IContract;
  currentUser: IUser;
};

class ContractDetails extends React.Component<Props> {
  renderContent(content) {
    if (isEnabled('logs')) {
      return content;
    }

    return (
      <EmptyState
        image="/images/actions/5.svg"
        text={__('No results found')}
        size="full"
      />
    );
  }

  render() {
    const { contract } = this.props;

    const title = contract.name || 'Unknown';

    const breadcrumb = [
      { title: __('Contracts'), link: '/contracts' },
      { title }
    ];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={contract._id}
          contentType="contract"
          showEmail={false}
        />
        <ActivityLogs
          target={contract.name || ''}
          contentId={contract._id}
          contentType="contracts:contract"
          extraTabs={[]}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        rightSidebar={<RightSidebar contract={contract} />}
        content={this.renderContent(content)}
        transparent={true}
      />
    );
  }
}

export default ContractDetails;
