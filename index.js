const path = require('path');
const MTProto = require('@mtproto/core');

require('dotenv').config();

const api_id = process.env.API_ID;
const api_hash = process.env.API_HASH;

// 1. Create instance
const mtproto = new MTProto({
    api_id,
    api_hash,

    storageOptions: {
        path: path.resolve(__dirname, './data/1.json'),
    },
});

/* 2. Print the user country code
mtproto.call('help.getNearestDc').then(result => {
    console.log('country:', result.country);
});
*/

// Parse all messages from channel
// https://mtproto-core.js.org/docs/call-the-telegram-methods#parse-all-messages-from-channel
(async () => {
    const resolvedPeer = await mtproto.call('contacts.resolveUsername', {
        username: 'mtproto_core',
    });

    const channel = resolvedPeer.chats.find(
        (chat) => chat.id === resolvedPeer.peer.channel_id
    );

    const inputPeer = {
        _: 'inputPeerChannel',
        channel_id: channel.id,
        access_hash: channel.access_hash,
    };

    const LIMIT_COUNT = 10;
    const allMessages = [];

    const firstHistoryResult = await mtproto.call('messages.getHistory', {
        peer: inputPeer,
        limit: LIMIT_COUNT,
    });

    const historyCount = firstHistoryResult.count;

    for (let offset = 0; offset < historyCount; offset += LIMIT_COUNT) {
        const history = await mtproto.call('messages.getHistory', {
            peer: inputPeer,
            add_offset: offset,
            limit: LIMIT_COUNT,
        });

        allMessages.push(...history.messages);
    }

    console.log('allMessages:', allMessages);
})();