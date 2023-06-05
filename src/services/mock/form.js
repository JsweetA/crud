import fly from 'axios';

export function submitChannelForm(data) {
  return fly.post('/api/channel-form/submit', { data });
}
