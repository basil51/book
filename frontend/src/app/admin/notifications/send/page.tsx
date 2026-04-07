'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Send,
  Users,
  Building2,
  AlertTriangle,

} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationType } from '@my-app/shared';

interface NotificationTemplate {
  id: number;
  name: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface Recipient {
  id: number;
  name: string;
  email: string;
  type: 'USER' | 'BUSINESS';
}

export default function SendNotificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>(NotificationType.REMINDER);
  const [scheduledFor, setScheduledFor] = useState('');
  const [recipientType, setRecipientType] = useState<'USER' | 'BUSINESS'>('USER');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const templatesResponse = await axios.get('/api/notifications/templates');
        // const recipientsResponse = await axios.get('/api/notifications/recipients');
        // setTemplates(templatesResponse.data);
        // setRecipients(recipientsResponse.data);

        // Mock data
        setTemplates([
          {
            id: 1,
            name: 'Appointment Reminder',
            title: 'Your Appointment Tomorrow',
            message: 'This is a reminder for your appointment scheduled for tomorrow.',
            type: NotificationType.REMINDER,
          },
          {
            id: 2,
            name: 'System Maintenance',
            title: 'Scheduled Maintenance',
            message: 'Our system will be under maintenance. Please plan accordingly.',
            type: NotificationType.SYSTEM,
          },
        ]);

        setRecipients([
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            type: 'USER',
          },
          {
            id: 2,
            name: 'Business A',
            email: 'business@example.com',
            type: 'BUSINESS',
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setTitle(template.title);
        setMessage(template.message);
        setType(template.type);
      }
    }
  }, [selectedTemplate, templates]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId ? parseInt(templateId) : null);
  };

  const handleRecipientChange = (recipientId: number) => {
    setSelectedRecipients(prev => {
      if (prev.includes(recipientId)) {
        return prev.filter(id => id !== recipientId);
      } else {
        return [...prev, recipientId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/notifications/send', {
      //   title,
      //   message,
      //   type,
      //   recipients: selectedRecipients,
      //   scheduledFor: scheduledFor || null,
      // });

      console.log('Sending notification:', {
        title,
        message,
        type,
        recipients: selectedRecipients,
        scheduledFor: scheduledFor || null,
      });

      router.push('/manager/notifications');
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(
    recipient => recipient.type === recipientType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
            <p className="text-gray-500">Create and send new notifications</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a template (optional)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTemplate || ''}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">No template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notification Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={type}
                onChange={(e) => setType(e.target.value as NotificationType)}
                required
              >
                <option value={NotificationType.REMINDER}>Reminder</option>
                <option value={NotificationType.ALERT}>Alert</option>
                <option value={NotificationType.SYSTEM}>System</option>
                <option value={NotificationType.MARKETING}>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule (optional)
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Recipients
          </h2>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-lg ${
                  recipientType === 'USER'
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-700'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
                onClick={() => setRecipientType('USER')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </div>
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-lg ${
                  recipientType === 'BUSINESS'
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-700'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
                onClick={() => setRecipientType('BUSINESS')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Businesses</span>
                </div>
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {filteredRecipients.map(recipient => (
                  <label
                    key={recipient.id}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedRecipients.includes(recipient.id)}
                      onChange={() => handleRecipientChange(recipient.id)}
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {recipient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {recipient.email}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedRecipients.length === 0 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Please select at least one recipient</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedRecipients.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? 'Sending...' : 'Send Notification'}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 