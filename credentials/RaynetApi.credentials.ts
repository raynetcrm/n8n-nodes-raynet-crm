import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Raynet CRM v2 API credentials (Basic auth + instance name).
 */
export class RaynetApi implements ICredentialType {
  name = 'raynetApi';

  displayName = 'Raynet CRM API';

  documentationUrl = 'https://app.raynet.cz/api/doc/index-en.html';

  icon = 'file:../nodes/Raynet/raynetCrm.svg' as const;

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Basic {{btoa($credentials.username + ":" + $credentials.apiKey)}}',
        'X-Instance-Name': '={{$credentials.instanceName}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.server}}/api/v2',
      url: '/securityLevel/',
    },
  };

  properties: INodeProperties[] = [
    {
      displayName: 'Username (e-mail)',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'E-mail username of the user to whom the API key is tied.',
      placeholder: 'user@example.com',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'API key generated through the RAYNET CRM app. This can be done in Settings > API keys.',
    },
    {
      displayName: 'Name of instance',
      name: 'instanceName',
      type: 'string',
      default: '',
      required: true,
      description:
        'Name of the CRM instance. This can be found in the logged in RAYNET CRM app URL. For example, in https://app.raynet.cz/demo/, demo would be the instance name.',
    },
    {
      displayName: 'Server',
      name: 'server',
      type: 'options',
      required: true,
      default: 'https://app.raynet.cz',
      description:
        'The server on which your CRM instance can be found. This can be read as the URL address you get redirected to after logging into RAYNET CRM.',
      options: [
        { name: 'https://app.raynet.cz', value: 'https://app.raynet.cz' },
        { name: 'https://app.raynetcrm.sk', value: 'https://app.raynetcrm.sk' },
        { name: 'https://app.raynetcrm.com', value: 'https://app.raynetcrm.com' },
        { name: 'https://eu.raynetcrm.com', value: 'https://eu.raynetcrm.com' },
      ],
    },
  ];
}
