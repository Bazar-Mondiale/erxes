import { IUserDocument } from '@erxes/api-utils/src/types';
import { models } from './connectionResolver';
import { sendCoreMessage } from './messageBroker';

const MMSTOMINS = 60000;

const MMSTOHRS = MMSTOMINS * 60;

const reportTemplates = [
  {
    serviceType: 'inbox',
    title: 'Inbox chart',
    serviceName: 'inbox',
    description: 'Chat conversation charts',
    charts: [
      'averageFirstResponseTime',
      'averageCloseTime',
      'conversationsCount'
    ],
    img: 'https://sciter.com/wp-content/uploads/2022/08/chart-js.png'
  }
];

const integrationTypes = async () => {
  const integrationTypes = Array.from(
    new Set((await models?.Integrations.find())?.map(i => i.kind))
  );

  return integrationTypes;
};

// XOS messenger
// email
// Call
// CallPro
// FB post
// FB messenger
// SMS
// All

// All time
// Today
// Yesterday
// Last week/month/year
// This week/month/year
// Rolling date range
// Custom date range

const DATERANGE_TYPES = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'today' },
  { label: 'Last Week', value: 'lastweek' },
  { label: 'This Week', value: 'thisweek' }
];

const INTEGRATION_TYPES = [
  { label: 'XOS Messenger', value: 'messenger' },
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'calls' },
  { label: 'Callpro', value: 'callpro' },
  { label: 'SMS', value: 'sms' },
  { label: 'Facebook Messenger', value: 'facebook-messenger' },
  { label: 'Facebook Post', value: 'facebook-post' },
  { label: 'All', value: 'all' }
];

const STATUS_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Closed / Resolved', value: 'closed' },
  { label: 'Open', value: 'open' },
  { label: 'Unassigned', value: 'unassigned' }
];

const calculateAverage = (arr: number[]) => {
  if (!arr || !arr.length) {
    return 0; // Handle division by zero for an empty array
  }

  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  return (sum / arr.length).toFixed();
};

const chartTemplates = [
  {
    templateType: 'averageFirstResponseTime',
    name: 'Average first response time by rep in hours',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table'
    ],
    getChartResult: async (filter: any, subdomain: string) => {
      const matchfilter = {
        'conversationMessages.internal': false,
        'conversationMessages.content': { $ne: '' }
      };

      const { startDate, endDate } = filter;

      const filterQuery = {
        createdAt: { $gte: startDate, $lte: endDate }
      };

      // filter by source
      if (filter.integrationType && filter.integrationType !== 'all') {
        const { integrationType } = filter;

        const integrations: any = await models?.Integrations.find({
          kind: integrationType
        });

        const integrationIds = integrations.map(i => i._id);

        matchfilter['integrationId'] = { $in: integrationIds };
      }

      matchfilter['conversationMessages.userId'] =
        filter && filter.userIds
          ? {
              $exists: true,
              $in: filter.userIds
            }
          : { $exists: true };

      const conversations = await models?.Conversations.aggregate([
        {
          $lookup: {
            from: 'conversation_messages',
            let: { id: '$_id', customerFirstMessagedAt: '$createdAt' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$conversationId', '$$id'] }
                }
              }
            ],
            as: 'conversationMessages'
          }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            conversationMessages: 1,
            integrationId: 1,
            closedAt: 1,
            closedUserId: 1,
            firstRespondedDate: 1,
            firstRespondedUserId: 1
          }
        },
        {
          $match: {
            conversationMessages: { $not: { $size: 0 } } // Filter out documents with empty 'conversationMessages' array
          }
        },
        {
          $unwind: '$conversationMessages'
        },
        {
          $sort: {
            'conversationMessages.createdAt': 1
          }
        },
        {
          $match: matchfilter
        },
        {
          $group: {
            _id: '$_id',
            conversationMessages: { $push: '$conversationMessages' },
            customerMessagedAt: { $first: '$createdAt' },
            integrationId: { $first: '$integrationId' },
            closedAt: { $first: '$closedAt' },
            closedUserId: { $first: '$closedUserId' },
            firstRespondedDate: { $first: '$firstRespondedDate' },
            firstResponedUserId: { $first: '$firstResponedUserId' }
          }
        }
      ]);

      type UserWithFirstRespondTime = {
        [userId: string]: number[];
      };

      const usersWithRespondTime: UserWithFirstRespondTime = {};

      if (conversations) {
        for (const convo of conversations) {
          const {
            conversationMessages,
            firstRespondedDate,
            firstResponedUserId,
            customerMessagedAt
          } = convo;

          if (firstRespondedDate && firstResponedUserId) {
            const respondTime =
              (new Date(firstRespondedDate).getTime() -
                new Date(customerMessagedAt).getTime()) /
              MMSTOHRS;

            if (firstResponedUserId in usersWithRespondTime) {
              usersWithRespondTime[firstResponedUserId] = [
                ...usersWithRespondTime[firstResponedUserId],
                respondTime
              ];
            } else {
              usersWithRespondTime[firstResponedUserId] = [respondTime];
            }

            continue;
          }

          if (conversationMessages.length) {
            const getFirstRespond = conversationMessages[0];
            const { userId } = getFirstRespond;

            const respondTime =
              (new Date(getFirstRespond.createdAt).getTime() -
                new Date(customerMessagedAt).getTime()) /
              MMSTOHRS;

            if (userId in usersWithRespondTime) {
              usersWithRespondTime[userId] = [
                ...usersWithRespondTime[userId],
                respondTime
              ];
            } else {
              usersWithRespondTime[userId] = [respondTime];
            }
          }
        }
      }

      const getTotalRespondedUsers: IUserDocument[] = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: Object.keys(usersWithRespondTime) } }
        },
        isRPC: true,
        defaultValue: []
      });

      const usersMap = {};

      for (const user of getTotalRespondedUsers) {
        usersMap[user._id] = {
          fullName:
            user.details?.fullName ||
            `${user.details?.firstName || ''} ${user.details?.lastName || ''}`,
          avgRespondtime: calculateAverage(usersWithRespondTime[user._id])
        };
      }

      const data = Object.values(usersMap).map((t: any) => t.avgRespondtime);

      const labels = Object.values(usersMap).map((t: any) => t.fullName);

      const title = 'Average first response time in hours';

      const datasets = { title, data, labels };

      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'userIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Select users'
      },
      {
        fieldName: 'integrationType',
        fieldType: 'select',
        multi: true,
        fieldOptions: INTEGRATION_TYPES,
        fieldLabel: 'Select source'
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldOptions: DATERANGE_TYPES,
        fieldLabel: 'Select date range'
      }
    ]
  },

  {
    templateType: 'averageCloseTime',
    name: 'Average chat close time by rep in hours',
    chartTypes: ['bar', 'doughnut', 'radar', 'polarArea', 'table'],
    getChartResult: async (filter: any, subdomain: string) => {
      const matchfilter = {
        status: /closed/gi,
        closedAt: { $exists: true }
      };

      // filter by source
      if (filter.integrationType && filter.integrationType !== 'all') {
        const { integrationType } = filter;

        const integrations: any = await models?.Integrations.find({
          kind: integrationType
        });

        const integrationIds = integrations.map(i => i._id);

        matchfilter['integrationId'] = { $in: integrationIds };
      }
      matchfilter['closedUserId'] =
        filter && filter.userIds
          ? {
              $exists: true,
              $in: filter.userIds
            }
          : { $exists: true };

      const usersWithClosedTime = await models?.Conversations.aggregate([
        {
          $match: matchfilter
        },

        {
          $project: {
            closeTimeDifference: { $subtract: ['$closedAt', '$createdAt'] },
            closedUserId: '$closedUserId'
          }
        },
        {
          $group: {
            _id: '$closedUserId',
            avgCloseTimeDifference: { $avg: '$closeTimeDifference' }
          }
        }
      ]);

      const usersWithClosedTimeMap = {};
      const getUserIds: string[] = [];

      if (usersWithClosedTime) {
        for (const user of usersWithClosedTime) {
          getUserIds.push(user._id);
          usersWithClosedTimeMap[user._id] = (
            user.avgCloseTimeDifference / MMSTOHRS
          ).toFixed();
        }
      }

      const getTotalClosedUsers: IUserDocument[] = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: getUserIds } }
        },
        isRPC: true,
        defaultValue: []
      });

      const usersMap = {};

      for (const user of getTotalClosedUsers) {
        usersMap[user._id] = {
          fullName:
            user.details?.fullName ||
            `${user.details?.firstName || ''} ${user.details?.lastName || ''}`,
          avgCloseTime: usersWithClosedTimeMap[user._id]
        };
      }

      const data = Object.values(usersMap).map((t: any) => t.avgCloseTime);

      const labels = Object.values(usersMap).map((t: any) => t.fullName);

      const title = 'Average conversation close time in hours';

      const datasets = { title, data, labels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'userIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Select users'
      },
      {
        fieldName: 'integrationType',
        fieldType: 'select',
        multi: true,
        fieldOptions: INTEGRATION_TYPES,
        fieldLabel: 'Select source'
      }
    ]
  },
  {
    templateType: 'conversationsCount',
    name: 'Conversations count by rep',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table'
    ],
    getChartResult: async (filter: any, subdomain: string) => {
      const data: number[] = [];
      const labels: string[] = [];

      const matchfilter = {};
      const filterStatus = filter.status;

      const title = `${filterStatus} conversations' count`;

      let filterUserIds: any = [];

      if (filter.departmentIds) {
        const findDepartmentUsers = await sendCoreMessage({
          subdomain,
          action: 'users.find',
          data: {
            query: { departmentIds: { $in: filter.departmentIds } }
          },
          isRPC: true,
          defaultValue: []
        });

        filterUserIds = findDepartmentUsers.map(user => user._id);
      }

      if (filter.branchIds) {
        const findBranchUsers = await sendCoreMessage({
          subdomain,
          action: 'users.find',
          data: {
            query: { branchIds: { $in: filter.branchIds } }
          },
          isRPC: true,
          defaultValue: []
        });

        filterUserIds.push(...findBranchUsers.map(user => user._id));
      }

      // if team members selected, go by team members
      if (filter.userIds) {
        filterUserIds = filter.userIds;
      }

      // filter by status
      if (filterStatus && filterStatus !== 'all') {
        if (filterStatus === 'unassigned') {
          matchfilter['assignedUserId'] = null;
        } else {
          //open or closed
          matchfilter['status'] = filterStatus;
        }
      }

      // filter by source
      if (filter.integrationType && filter.integrationType !== 'all') {
        const { integrationType } = filter;

        const integrations: any = await models?.Integrations.find({
          kind: integrationType
        });

        const integrationIds = integrations.map(i => i._id);

        matchfilter['integrationId'] = { $in: integrationIds };
      }

      let userIdGroup;

      if (filterStatus === 'open' || filterStatus === 'all') {
        matchfilter['assignedUserId'] =
          filter && (filter.userIds || filter.departmentIds || filter.branchIds)
            ? {
                $exists: true,
                $in: filterUserIds
              }
            : { $exists: true, $ne: null };

        userIdGroup = {
          $group: {
            _id: '$assignedUserId',
            conversationsCount: {
              $sum: 1
            }
          }
        };
      }
      if (filterStatus === 'closed') {
        matchfilter['closedUserId'] =
          filter && (filter.userIds || filter.departmentIds || filter.branchIds)
            ? {
                $exists: true,
                $in: filterUserIds
              }
            : { $exists: true };

        userIdGroup = {
          $group: {
            _id: '$closedUserId',
            conversationsCount: { $sum: 1 }
          }
        };
      }

      if (filterStatus === 'unassigned') {
        const totalUnassignedConvosCount =
          (await models?.Conversations.count(matchfilter)) || 0;

        data.push(totalUnassignedConvosCount);
        labels.push('Total unassigned conversations');

        return { title, data, labels };
      }

      const usersWithConvosCount = await models?.Conversations.aggregate([
        {
          $match: matchfilter
        },
        userIdGroup
      ]);

      const getUserIds: string[] = usersWithConvosCount?.map(r => r._id) || [];

      const getTotalUsers: IUserDocument[] = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: getUserIds } }
        },
        isRPC: true,
        defaultValue: []
      });

      const usersMap = {};

      for (const user of getTotalUsers) {
        usersMap[user._id] = {
          fullName:
            user.details?.fullName ||
            `${user.details?.firstName || ''} ${user.details?.lastName || ''}`
        };
      }

      if (usersWithConvosCount) {
        for (const user of usersWithConvosCount) {
          if (!usersMap[user._id]) {
            continue;
          }

          data.push(user.conversationsCount);
          labels.push(usersMap[user._id].fullName);
        }
      }

      const datasets = { title, data, labels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'status',
        fieldType: 'select',
        multi: false,
        fieldOptions: STATUS_TYPES,
        fieldLabel: 'Select conversation status'
      },
      {
        fieldName: 'userIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Select users'
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Select departments'
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Select branches'
      },
      {
        fieldName: 'integrationType',
        fieldType: 'select',
        multi: true,
        fieldOptions: INTEGRATION_TYPES,
        fieldLabel: 'Select source'
      },
      {
        fieldName: 'tags',
        fieldType: 'select',
        multi: true,
        fieldLabel: 'Select tags'
      }
    ]
  }
];

const getChartResult = async ({ subdomain, data }) => {
  const { templateType, filter } = data;

  const template =
    chartTemplates.find(t => t.templateType === templateType) || ({} as any);

  return template.getChartResult(filter, subdomain);
};

export default {
  chartTemplates,
  reportTemplates,
  getChartResult
};
