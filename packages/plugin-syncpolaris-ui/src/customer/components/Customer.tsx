import React from 'react';
import { IRouterProps, IQueryParams } from '@erxes/ui/src/types';
import {
  __,
  Wrapper,
  DataWithLoader,
  Pagination,
  Table,
  ModalTrigger,
} from '@erxes/ui/src';

import Sidebar from './Sidebar';
import { menuSyncpolaris } from '../../constants';
import { Title } from '@erxes/ui-settings/src/styles';
import dayjs from 'dayjs';

interface IProps extends IRouterProps {
  syncHistories: any[];
  loading: boolean;
  totalCount: number;
  history: any;
  queryParams: any;

  onSearch: (search: string) => void;
  onFilter: (filterParams: IQueryParams) => void;
  onSelect: (values: string[] | string, key: string) => void;
  isFiltered: boolean;
  clearFilter: () => void;
}

class Customer extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  rowContent = (item) => {
    return <>{item.responseStr}</>;
  };

  render() {
    const { history, syncHistories, totalCount, loading, queryParams } =
      this.props;

    const tablehead = [
      'Date',
      'Email',
      'Fullname',
      'FirstName',
      'LastName',
      'Content',
      'error',
    ];

    const mainContent = (
      <Table whiteSpace="nowrap" bordered={true} hover={true}>
        <thead>
          <tr>
            {tablehead.map((p) => (
              <th key={p}>{p || ''}</th>
            ))}
          </tr>
        </thead>
        <tbody id="orders">
          {(syncHistories || []).map((item) => (
            <ModalTrigger
              title="Customer information"
              trigger={
                <tr key={item._id}>
                  <td>{dayjs(item.createdAt).format('lll')}</td>
                  <td>{item.createdUser?.email}</td>
                  <td>{item.createdUser?.details?.fullName}</td>
                  <td>{item.createdUser?.details?.firstName}</td>
                  <td>{item.createdUser?.details?.lastName}</td>
                  <td>{item.content}</td>
                  <td>{item.error}</td>
                </tr>
              }
              size="xl"
              content={(props) => this.rowContent(item)}
            />
          ))}
        </tbody>
      </Table>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Customer`)}
            queryParams={queryParams}
            submenu={menuSyncpolaris}
          />
        }
        leftSidebar={<Sidebar queryParams={queryParams} history={history} />}
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__(`Customers (${totalCount})`)}</Title>}
            // right={actionBarRight}
            background="colorWhite"
            wideSpacing={true}
          />
        }
        footer={<Pagination count={totalCount || 0} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={totalCount || 0}
            emptyImage="/images/actions/1.svg"
          />
        }
        hasBorder={true}
        transparent={true}
      />
    );
  }
}

export default Customer;
