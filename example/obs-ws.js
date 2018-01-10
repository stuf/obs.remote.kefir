const s = require('../lib/socket');

const ws = s.createSocket_('ws://10.0.1.2:4444');

const msg = s.listenTo_('message', ws);

msg.log('message');
