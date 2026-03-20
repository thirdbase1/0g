import React from 'react';
import { Card, Table, type Column } from '@pulsestack/ui';

export default function Admin() {
  const users = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Frozen' },
  ];

  const webhooks = [
    { id: 'evt_1', type: 'charge.succeeded', source: 'Stripe', status: 'Processed', time: '10 mins ago' },
    { id: 'evt_2', type: 'user.created', source: 'Auth0', status: 'Processed', time: '1 hour ago' },
    { id: 'evt_3', type: 'charge.failed', source: 'Stripe', status: 'Failed', time: '2 hours ago' },
  ];

  const userCols: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', render: (u) => (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'Active' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>
        {u.status}
      </span>
    )}
  ];

  const hookCols: Column<any>[] = [
    { key: 'id', header: 'Event ID' },
    { key: 'type', header: 'Event Type' },
    { key: 'source', header: 'Source' },
    { key: 'time', header: 'Time' },
    { key: 'status', header: 'Status', render: (h) => (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${h.status === 'Processed' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>
        {h.status}
      </span>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium">Export Logs</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="User Management" className="overflow-hidden">
            <div className="-mx-6 -mb-6 mt-4">
              <Table data={users} columns={userCols} className="border-t border-gray-100" />
            </div>
          </Card>

          <Card title="Recent Webhooks" className="overflow-hidden">
            <div className="-mx-6 -mb-6 mt-4">
              <Table data={webhooks} columns={hookCols} className="border-t border-gray-100" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
