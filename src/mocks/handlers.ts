import { http, HttpResponse, delay } from 'msw';
import { type Node, type Edge } from '@xyflow/react';

const apps = [
    { id: 'app-st-golang', name: 'supertokens-golang' },
    { id: 'app-st-java', name: 'supertokens-java' },
    { id: 'app-st-python', name: 'supertokens-python' },
    { id: 'app-st-ruby', name: 'supertokens-ruby' },
    { id: 'app-st-go', name: 'supertokens-go' },
];

const graphs: Record<string, { nodes: Node[]; edges: Edge[] }> = {
    'app-ecommerce': {
        nodes: [
            {
                id: 'n-1',
                type: 'service',
                position: { x: 100, y: 100 },
                data: { name: 'Frontend LB', status: 'healthy', replicas: 3, version: 'v1.0.2' },
            },
            {
                id: 'n-2',
                type: 'service',
                position: { x: 400, y: 200 },
                data: { name: 'API Gateway', status: 'degraded', replicas: 2, version: 'v2.1.0' },
            },
            {
                id: 'n-3',
                type: 'service',
                position: { x: 700, y: 100 },
                data: { name: 'Product Service', status: 'healthy', replicas: 5, version: 'v1.1.5' },
            },
        ],
        edges: [
            { id: 'e-1-2', source: 'n-1', target: 'n-2', animated: true },
            { id: 'e-2-3', source: 'n-2', target: 'n-3' },
        ],
    },
    'app-analytics': {
        nodes: [
            { id: 'an-1', position: { x: 50, y: 50 }, data: { label: 'Ingestion' }, type: 'input' },
            { id: 'an-2', position: { x: 250, y: 50 }, data: { label: 'Processing' } },
            { id: 'an-3', position: { x: 250, y: 250 }, data: { label: 'Storage' }, type: 'output' },
        ],
        edges: [
            { id: 'e-an-1-2', source: 'an-1', target: 'an-2', animated: true },
            { id: 'e-an-2-3', source: 'an-2', target: 'an-3' },
        ],
    },
    'app-social': {
        nodes: [
            { id: 'soc-1', position: { x: 0, y: 0 }, data: { label: 'Feed API' } },
            { id: 'soc-2', position: { x: 200, y: 100 }, data: { label: 'User Graph' } },
            { id: 'soc-3', position: { x: 0, y: 200 }, data: { label: 'Content Store' } },
        ],
        edges: [
            { id: 'e-soc-1-2', source: 'soc-1', target: 'soc-2' },
            { id: 'e-soc-1-3', source: 'soc-1', target: 'soc-3' },
        ],
    },
    'app-logs': {
        nodes: [
            { id: 'log-1', position: { x: 100, y: 0 }, data: { label: 'Collector' } },
            { id: 'log-2', position: { x: 100, y: 150 }, data: { label: 'Indexer' } },
            { id: 'log-3', position: { x: 100, y: 300 }, data: { label: 'Dashboard' } },
        ],
        edges: [
            { id: 'e-log-1-2', source: 'log-1', target: 'log-2', animated: true },
            { id: 'e-log-2-3', source: 'log-2', target: 'log-3' },
        ],
    },
};

export const handlers = [
    http.get('/api/apps', async () => {
        await delay(300);
        return HttpResponse.json(apps);
    }),

    http.get('/api/apps/:appId/graph', async ({ params }) => {
        await delay(500);
        const appId = params.appId as string;

        if (graphs[appId]) {
            return HttpResponse.json(graphs[appId]);
        }

        // Dynamic generation for Supertokens apps
        if (appId.startsWith('app-st-')) {
            const lang = appId.replace('app-st-', '');
            const langLabel = lang.charAt(0).toUpperCase() + lang.slice(1);

            return HttpResponse.json({
                nodes: [
                    {
                        id: 'core',
                        type: 'service',
                        position: { x: 0, y: 0 },
                        data: { label: `${langLabel} Core`, status: 'healthy', cost: '$0.12/HR', replicas: 3 }
                    },
                    {
                        id: 'auth',
                        type: 'service',
                        position: { x: 300, y: 0 },
                        data: { label: 'Auth Service', status: 'healthy', cost: '$0.05/HR', replicas: 2 }
                    },
                    {
                        id: 'db',
                        type: 'service',
                        position: { x: 150, y: 250 },
                        data: { label: 'User Database', status: 'healthy', cost: '$0.40/HR', replicas: 1 }
                    },
                    {
                        id: 'gw',
                        type: 'service',
                        position: { x: 450, y: 150 },
                        data: { label: 'API Gateway', status: 'degraded', cost: '$0.15/HR', replicas: 4 }
                    }
                ],
                edges: [
                    { id: 'e-core-auth', source: 'core', target: 'auth', animated: true },
                    { id: 'e-core-db', source: 'core', target: 'db' },
                    { id: 'e-auth-db', source: 'auth', target: 'db' },
                    { id: 'e-auth-gw', source: 'auth', target: 'gw', animated: true }
                ]
            });
        }

        return HttpResponse.json({
            nodes: [
                { id: '1', type: 'service', position: { x: 0, y: 0 }, data: { label: 'Service A' } },
                { id: '2', type: 'service', position: { x: 200, y: 0 }, data: { label: 'Service B' } }
            ],
            edges: [{ id: 'e1-2', source: '1', target: '2' }]
        });
    }),
];
