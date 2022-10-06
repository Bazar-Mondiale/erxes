import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue(
    'imap:createIntegration',
    async ({ subdomain, data: { doc, integrationId } }) => {
      const models = await generateModels(subdomain);

      await models.Integrations.create({
        erxesApiId: integrationId,
        ...(doc || {})
      });

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'imap:removeIntegration',
    async ({ subdomain, data: { integrationId } }) => {
      const models = await generateModels(subdomain);

      await models.Integrations.remove({ erxesApiId: integrationId });

      return {
        status: 'success'
      };
    }
  );
};

export default function() {
  return client;
}

export const sendInboxMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'inbox',
    ...args
  });
};
